const DB = require('../../system/db');

const pages = require("./pages");
const widgets = require("./widgets");

module.exports = class Engine extends DB {
    constructor(){
        super();
        this.pages = pages;
        this.widgets = widgets;
    }
}