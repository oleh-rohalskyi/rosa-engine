const DB = require('../../system/DB');
const csvParse = require("csv-parse");

const login = require("./login");
const logout = require("./logout");
const registration = require("./registration");
const captcha = require("./captcha");
const {readFile} = require("fs");

module.exports = class Auth extends DB {
    constructor(){
        super();
        this.login = login;
        this.logout = logout;
        this.registration = registration;
        this.captcha = captcha;
    }
    getConf() {
        return new Promise((res,rej)=>{
            readFile("./api/auth/config.csv", 'utf8', function(err, contents) {
                if (err) rej(err);
                csvParse(contents, {
                    comment: '#',
                    delimiter: '|',
                    trim: true
                  }, function(err, output){
                    output.shift();
                    output = output[0];
                    res({
                        current: output[0],
                        scope: output[1].split(","),
                        active: output[2] === "yes",
                        id_type_key: output[3]
                    });
                  })
            })
        });      
    }
}