const url = require('url');
const DB = require('../system/db');

const querystring = require('querystring');
const csvParse = require("csv-parse");
const { readFile } = require("fs");

const Engine = require("./engine");
const Inserts = require("./inserts");
const Lists = require("./lists");
const Auth = require("./auth");
const Forms = require("./forms");
const Translations = require("./translations");
const User = require("./user");

class Api extends DB {

    constructor(routes) {

        super();
        
        this.routes = routes;
        this.engine = new Engine();
        this.auth = new Auth();
        this.lists = new Lists();
        this.forms = new Forms();
        this.inserts = new Inserts();
        this.translations = new Translations();
        this.user = new User();

    }

    async go(req) {
        const route = "/" + req.pathname.split("/api/")[1];
        console.log(route,this.routes);
        const types = this.routes.filter(i=>i.type === type);

        if (types.length>0) {
            const method = req.fullRequest.method;
            const c = types.filter(i=>{
                return i.route === route && i.method === method.toLowerCase();
            })[0];

            if (c) {
                
                return new Promise( async (res,rej) => {

                    try {

                        try {

                            let params = {};

                            if (method === "GET") {
                                params = url.parse(req.fullRequest.url,true).query;
                            } else {
                                params = this.readBody(req.fullRequest);
                            }

                            const controller = this[c.type][c.controller][c.method].bind(this);

                            await controller(res,rej,params);

                        } catch (e) {
                            console.log(65,e);
                            rej(e);
                        }
                        
                    } catch (error) {
                        rej(e);
                    }
                } );
            } else {
                this.conf.log("r","error",["b","no api"]);
                return {success:false,error:{message:"no api for: "+path}}
            }
        } else {
            this.conf.log("r","error",["b","no api for: "+path]);
            return {success:false,error:{message:"no api"}}
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
