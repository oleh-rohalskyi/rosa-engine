const DB = require('../src/back-end/db');

const querystring = require('querystring');
const csvParse = require("csv-parse");
const { readFile } = require("fs");

const Engine = require("./engine");
const Auth = require("./auth");
const Translations = require("./translations");
const User = require("./user");

class Api extends DB {

    constructor(offline) {

        super();
        this._offline = offline;
        // this.routes = routes;
        this.engine = Engine;
        this.auth = Auth;
        this.translations = Translations;
        this.user = User;

    }

    async go(req) {
        const route = req.pathname.split("/api/")[1];
        const type = route.split("/")[0];
        const types = this.routes.filter(i=>i.type === type);
        if (types.length>0) {
            const method = req.fullRequest.method;
            const c = types.filter(i=>{
                return i.route === route.split(type)[1] && i.method === method.toLowerCase();
            })[0];
            if (c) {
                
                return new Promise( async (res,rej) => {

                    try {

                        try {
                            const controller = this[c.type][c.controller][c.method];
                            let result = await controller(req,this);
                            res(result);

                        } catch (e) {

                            rej(e);
                        }
                        
                    } catch (error) {
                        rej(e);
                    }
                } );
            } else {
                this.conf.log("r","error",["b","no apifor: "+req.pathname]);
                return {success:false,error:{message:"no api for: "+req.pathname}}
            }
        } else {
            this.conf.log("r","error",["b","no api for: "+req.pathname]);
            return {success:false,error:{message:"no apifor: "+req.pathname}}
        }

    }
    static async getConf() {
        return new Promise((res,rej)=>{
            readFile('./api/config.csv', 'utf8', function(err, contents) {
                if (err) rej(err);
                csvParse(contents, {
                    comment: '#',
                    delimiter: '|',
                    trim: true
                  }, function(err, output){
                    output.shift()
                    res(output.map((i)=>{
                        const access = i[4].split(",");
                        return {
                            type: i[0],
                            method: i[1],
                            route: i[2],
                            controller: i[3],
                            access: access[0] ? access : null
                        }
                    }))
                  })
            })
        });      
    }
    async readBody(request) {
        return new Promise((res) => {
            let body = "";
        request.on('data', (chunk) => {
            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6) {
                request.connection.destroy();
            }
            body+=chunk;
            }).on('end', () => {
                body = querystring.parse(body);
                res(body);
            });
        });
    }
}

module.exports = Api;
