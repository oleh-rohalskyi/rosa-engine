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

    async go(type,path,request) {

        const route = "/" + path;
        const types = this.routes.filter(i=>i.type === type);

        if (types.length>0) {
            
            const c = types.filter(i=>{
                return i.route === route && i.method === request.method.toLowerCase();
            })[0];

            if (c) {
                
                return new Promise( async (res,rej) => {

                    try {

                        try {

                            let params = {};

                            if (request.method === "GET") {
                                params = url.parse(request.url,true).query;
                            } else {
                                params = this.readBody(request);
                            }

                            const controller = this[c.type][c.controller][c.method].bind(this);

                            await controller(res,rej,params);

                        } catch (error) {
                            rej({success:false,error});
                        }
                        
                    } catch (error) {
                        rej({success:false,error})
                    }
                } );
            } else {
                return {success:false,error:"no api"}
            }
        } else {
            return {success:false,error:"no api"}
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
