const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const conf = require('../../conf/app.config.js');
const crypto = require('crypto');

const expiredDays = 30;

module.exports = class DB {
    constructor() {
        this.dataBase = mysql;
        this.crypto = crypto;
        this.security = "asda";
        this.dbConf = conf.db;
        this.jwt = jwt;
        this.escape = mysql.escape;
        this.cc = () => this.dataBase.createConnection(this.dbConf);
        this.getByColumn = (table,column_name,params) => {
                    return new Promise((res,rej)=>{

                        const con = this.cc();

                        con.connect((err)=>{

                            if (err) rej(err);

                            let query = `SELECT * FROM ${table} `;
                            let mod = false;

                            switch (true) {

                                case typeof params === 'string':

                                    query+= `WHERE ${column_name} IN (${this.escape(params)})`

                                    break;

                                case (Array.isArray(params) && !!params.length):

                                    query+= `WHERE ${column_name} IN (`;

                                    for (let index = 0; index < params.length; index++) {
                                        query+= this.escape(params[index]) + ",";
                                    }

                                    query=query.substr(0,query.length-1)+`)`;
                                    mod=true;

                                    break;

                                default:
                                    break;
                                    
                            }

                            const callback = (err,result) => {

                                if (err) {
                                    rej({success:false,errorMessage: err.message, data: null});
                                    return;
                                }
                                
                                if (result.length <= 0) {
                                    rej({success:false,errorMessage: "NO_COINCIDENCE",data: null});
                                    return;
                                }

                                res(result);
                                //con.destroy();
                            }
                            
                            if(mod)
                                con.query(query,params,callback);
                            else 
                                con.query(query,callback);
                            
                                // //con.destroy();
                        })   
                    })
        }
    }
    jwtStringify(payLoad) {
        return this.jwt.sign(JSON.stringify(payLoad), this.secret);
    }
    jwtParse(token) {
        let user = {role: "guest"};
        try {
            user = this.jwt.verify(token,  this.secret);
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
        
            const con = this.cc();
            
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
  