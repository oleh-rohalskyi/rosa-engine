
  
const csvParse = require("csv-parse");
const { readFile } = require("fs");
let colors = {};

class filesConfig {
    async getLangs() {
        return new Promise((res)=>{
            readFile('./system/langs.csv', 'utf8', function(err, contents) {
                csvParse(contents, {
                    comment: '#',
                    delimiter: '|',
                    trim: true
                  }, function(err, output){
                    output.shift();
                    output = output[0];
                    res({
                        common: output[0],
                        scope: output[1].split(","),
                        route_type: output[2],
                        route_types: output[3].split(",")
                    });
                  });
            })
        })
    }
}

class consoleConfig extends filesConfig {

    constructor() {
        super();
        const consoleArgv = require('yargs').argv;
        const mockConfig = consoleArgv.db_mock.split(",");

        const { r, g, b, w, c, m, y, k } = [
            ['r', 1], ['g', 2], ['b', 4], ['w', 7],
            ['c', 6], ['m', 5], ['y', 3], ['k', 0],
          ].reduce((cols, col) => ({
            ...cols,  [col[0]]: f => `\x1b[3${col[1]}m${f}\x1b[0m`
          }), {});

        colors = { r, g, b, w, c, m, y, k };

        this.env = consoleArgv.env;

        if (!this.env){
            this.log(
                "r",
                "out of config",
                [
                    "c",
                    "please setup your env by '--env=' dev/production"
                ]
            );
            return;
        }

        this.port = consoleArgv.port || false;
        this.role = consoleArgv.role || false;
        this.secret = consoleArgv.secret || false;
        
        this.mock = {
            use: mockConfig[0] === "use" || false,
            update: mockConfig[1] === "update" || false
        }

        this.log(
            "c",
            this.mock.use?"U use mock files":"Use data base",
            [
             "b",
             this.mock.update?"files will be updated":"files will not tached"
            ]
        )
    }

    log(titleColor,title,list) {
        let ll = list.length;
        let text = "⎩" + colors[titleColor](title) + "\n";
        let fDevider = "";

        if (list && list.length) {
            fDevider =" ⎫" + colors[list[0]](list[1]) + "\n";
        }

        text = text + fDevider;

        const nDevider = colors["k"]("") + " ⎮";

        if (list && list.length && list[2]) {
            for (let index = 2; index < list.length; index=index+2) {
                text = text + nDevider + colors[list[index]](list[index+1]) + "\n";
            }
        }
            
        console.log("シ⟅\n"+text);

    }

}

class Config extends consoleConfig {
    constructor() {
        super();
        if (!this.port)
            this.port = 3001;
        if (!this.secret)
            this.secret = "b71995b6c821374c5ced51c9578bc9481683a45";
    }
}

const config = new Config();

module.exports = config;
