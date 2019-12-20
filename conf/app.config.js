//auth config

const auth = require("./auth.json");
let authConf;

switch (auth.current) {
    case "BASIC":
        authConf = {
            sendEmail: true,
            id_type_key: auth.id_type_key,
            reg: {
                [auth.id_type_key]: true,
                pass: true,
                passconfirm: true,
                captcha: true
            },
            sign: {
                [auth.id_type_key]: true,
                pass: true
            }
        };
        break;
    case "HASH":
        authConf = {
            id_type_key: auth.id_type_key,
            reg: {
                pass: true,
                captcha: true,
                hash: true
            },
            sign: {
                hash: true
            }
        };
        break;
    default:
        auth = {
            id_type_key: auth.id_type_key,
            reg: {},
            sign: {}
        }
}

//langs config
const langsConfig = require("./langs.json");
let langs;

module.exports = {
    db: {
        host: "ha368730.mysql.tools",
        user: "ha368730_db",
        password: "AneGNz69",
        database: "ha368730_db"
    },
    auth: authConf,
    langs: langsConfig
}