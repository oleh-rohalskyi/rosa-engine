const DB = require('../../src/back-end/db');

const login = require("./login");
const logout = require("./logout");
const registration = require("./registration");
const captcha = require("./captcha");

module.exports = class Auth {
    constructor() {

        // super();

        this.login = login;
        this.logout = logout;
        console.log(registration);
        this.registration = registration;
        this.captcha = captcha;

        this.authConfig = require("../../conf/auth.json");

    }
}