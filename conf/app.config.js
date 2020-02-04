const auth = require("./auth.json");
const langsConfig = require("./langs.json");
const papaparse = require("papaparse");
var fs = require('fs');

//auth config
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

//Api config
try {
    var apiText = fs.readFileSync(__dirname + '/api.csv', 'utf8');
} catch (e) {
    console.log('Error:', e.stack);
}

let api = papaparse.parse(apiText, {
    delimiter: "|",
    comments: "#",
    header: true,
    skipEmptyLines: true
});

let apiMap = {};

api.data.forEach((item, index) => {
    let typeKey = Object.keys(item).filter((k) => k.trim() === "type")[0]
    let scopeKey = item[typeKey].trim();
    if (!apiMap[scopeKey]) {
        apiMap[scopeKey] = [];
    }
    let itemMap = {};
    for (const key in item) {
        itemMap[key.trim()] = item[key].trim();
    }
    apiMap[scopeKey].push(itemMap)
});

module.exports = {
    db: {
        host: "ha368730.mysql.tools",
        user: "ha368730_db",
        password: "AneGNz69",
        database: "ha368730_db"
    },
    db2: {
        host: process.env.MYSQL_HOST || 'localhost',
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DB
    },
    api: apiMap,
    port: 3001,
    auth: authConf,
    langs: langsConfig
}