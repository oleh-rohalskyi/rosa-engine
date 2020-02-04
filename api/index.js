const DB = require('../src/back-end/db');

const Engine = require("./engine");
const Auth = require("./auth");
const Translations = require("./translations");
const User = require("./user");

class Api extends DB {

    constructor(offline) {
        super();
        this._offline = offline;
        this.engine = Engine;
        this.auth = Auth;
        this.translations = Translations;
        this.user = User;

    }

    async go(req) {
        const route = req.pathname.split("/api/")[1];
        const type = route.split("/")[0];
        const types = req.conf.api[type].filter(i=>i.type === type);
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
                return {success:false,error:{message:"no api for: "+req.pathname}}
            }
        } else {
            return {success:false,error:{message:"no apifor: "+req.pathname}}
        }

    }
}

module.exports = Api;
