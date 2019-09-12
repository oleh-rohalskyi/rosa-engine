const config = {};

config.development = require('yargs').argv;
config.d = config.development;

config.security = {}
const {langs,api} = require('./');
if (args.db_mock) {
   let db_mock = args.db_mock.split(",");
   config.dev.db_mock = db_mock[0] === "use" || false;
   config.update_db_mock = db_mock[1] === 'update' || false;
}

config.api = api;
config.langs = langs;
config.secret = args.secret || Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
config.role = args.role || false;
config.port = args.port || 3001;
config.env = args.env;

module.exports = config;



module.exports = {
    langs: require('./langs.json'),
    pages: require('./pages.json'),
    widgets: require('./widgets.json'),
    api: require('./api.json')
}