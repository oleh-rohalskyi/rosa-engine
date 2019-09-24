const config = {};

config.development = require('yargs').argv;
config.d = config.development;

if (!config.development || !config.d.env) {
    console.error("out of config");
}

config.security = {};
config.user = {};
config.aliases = {};

if (config.d.db_mock) {
    config.mock = {};
    let db_mock = config.d.db_mock.split(",");
    config.d.db_mock = db_mock[0] === "use" || false;
    config.d.update_db_mock = db_mock[1] === 'update' || false;
}

config.langs = require('./langs.json');
config.security.secret = config.d.secret || Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
config.user.role = config.d.role || false;
if (config.d.env && config.d.env.port)
    config.d.port = config.d.env.port;
else {
    config.d.port = 3001
}

delete config.d.role;

module.exports = config;
