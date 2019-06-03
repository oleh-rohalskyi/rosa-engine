const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const conf = require('./db.conf');
const crypto = require('crypto');
const validation = require("../static/system/js/validation");
console.log( crypto.createHash('md5').update("AhojROSA12").digest("hex") );

function addslashes(string) {
    return string.replace(/\\/g, '\\\\').
        replace(/\u0008/g, '\\b').
        replace(/\t/g, '\\t').
        replace(/\n/g, '\\n').
        replace(/\f/g, '\\f').
        replace(/\r/g, '\\r').
        replace(/'/g, '\\\'').
        replace(/"/g, '\\"');
}

const LOGIN_ALREADY_EXIST = "LOGIN_ALREADY_EXIST";
const PASS_ALREADY_EXIST = "LOGIN_ALREADY_EXIST";

module.exports = {
    parseResult(result) {
        if (!result) return;
        let parsedResult = [];
        Object.keys(result).forEach(function(key) {
            parsedResult[parsedResult.length] = result[key];
        });
        return parsedResult.length > 0 ? parsedResult[0] : false
    },
    getUser({
        login,
        pass
    }) {
        return new Promise((res,rej)=>{
            const con = mysql.createConnection(conf);
            const password = crypto.createHash('md5').update(pass).digest("hex");
            con.connect((err) => {
                if (err) rej(err);
                const sql = `SELECT users.login, roles.name AS roleName FROM roles LEFT JOIN users ON users.role=roles.id WHERE password="${password}" AND login="${login}"`;
                console.log("Connected!");
                con.query(sql,(err, result) => {
                    if (err) rej(err);
                    res(this.parseResult(result));
                });
            });
        })
    },
    signup({
        login,
        password
    }) {
        return new Promise((res,rej)=>{
            
            const errors = validation.validate({login,pass: password},{
                login: { messages: {"is-empty":"","less-then-4":""} },
                pass:  { messages: {"is-empty":"","less-then-4":""} },
            })

            if (errors.length > 0) {

                rej(errors);

            } else {

                const con = mysql.createConnection(conf);

                con.connect((err) => {

                    if (err) rej(err);

                    console.log("Connected!");

                    const uiquKey = "login";
                    const uniq = uiquKey+":"+login;

                    con.query(
                        `INSERT INTO users SET ?`,
                        { 
                            uniq,
                            password: crypto.createHash('md5').update(password).digest("hex")
                        },
                        (err, result) => {

                            if (err) {
                                rej(err);
                            }
                            console.log(this.parseResult(result))
                            res(this.parseResult(result));
                    });
           
                });
            }
            
        });
    }
};


  