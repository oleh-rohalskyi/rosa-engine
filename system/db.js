const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const conf = require('../configuration/db.conf');
const crypto = require('crypto');

let {security,langs} = require('../configuration');

const expiredDays = 30;

module.exports = class DB {
    constructor() {
        this.dataBase = mysql;
        this.crypto = crypto;
        this.security = security;
        this.langs = langs;
        this.conf = conf;
        this.jwt = jwt;
        this.escape = mysql.escape;
        this.q = {
            getById() {
                if (widgetsToGet && widgetsToGet.length) {
                    query+= `WHERE name IN (`
                    for (let index = 0; index < widgetsToGet.length; index++) {
                        query+= this.escape(widgetsToGet[index]) + ","
                    }
                    query=query.substr(0,query.length-1)+`)`;
                }
            }
        }
    }
    jwtStringify(payLoad) {
        return this.jwt.sign(JSON.stringify(payLoad), this.security.secret);
    }
    jwtParse(token) {
        let user = {role: "guest"};
        try {
            user = this.jwt.verify(token,  this.security.secret);
        } catch(e) {
            return user;
        }
        return user;
    }
    credentials({
        login,
        password
    }) {
        return new Promise((res,rej)=>{
        
            const con = this.dataBase.createConnection(conf);
            
            password = this.crypto.createHash('md5').update(password+"").digest("hex");
    
            con.connect((err) => {
    
                const sql = `SELECT users.id, users.login, roles.name AS role FROM roles LEFT JOIN users ON users.role=roles.id WHERE password="${password}" AND login="${login}"`;
                
                con.query(sql,(err, result) => {
    
                    if (err) {
                        rej({success:false,error: err.message, data: null, code: err.code});
                        return;
                    }
                    
                    if (result.length <= 0) {
                        rej({success:false, code: "NO_COINCIDENCE",data: null});
                        return;
                    }
    
                    let user = result[0];
                    user.expired = new Date().getTime() + 86400000 * expiredDays;
                    const token = this.jwtStringify(user);
                    res({success: true, error: null, data: {...user,token}});
    
                });
            });
        })
    }
};
  