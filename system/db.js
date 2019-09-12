const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const conf = require('./db.conf');
const crypto = require('crypto');
const {secret} = require('./config');

const api = require('./api');



const expiredDays = 30;

const db = {
    api: {},
    crypto,
    secret,
    conf,
    jwt,
    escape: mysql.escape,
    dataBase: mysql,
    jwtStringify({id=0,role="guest",expired=0}) {
        return jwt.sign(JSON.stringify({id,role,expired}), secret);
    },
    jwtParse(token) {
        let user = {role: "guest"};
        try {
            user = jwt.verify(token, secret);
        } catch(e) {
            return user;
        }
        return user;
    },
    isUserExist(login) {
        const con = this.dataBase.createConnection(conf);
    },
    getUser({
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

for (const key in api.calls) {
    if (api.calls.hasOwnProperty(key)) {
        db.api[key] = (opt={})=>new Promise((res,rej)=>{
            api.hook(res,rej,opt);
            api.calls[key].apply(db, [res,rej,opt] );
        })
    }
}

module.exports = db;
  