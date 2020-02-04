const argv = require('yargs').argv;
const Api = require('./api');
const fs = require('fs').promises;

const gulp = require('gulp');
const concat = require('gulp-concat');
const each = require('gulp-each');
const server = require('./server');
const builder = require("./builder");

process.env.NODE_ENV = (argv.dev || argv.offline) ? "development" : "prodaction";
process.env.OFFLINE = argv.offline ? true : false;

const offline = process.env.OFFLINE;
const env = process.env.NODE_ENV;
const api = new Api(offline);

let pages,widgets,modifiedPages,modifiedWidgets;

async function getMainData(cb) {

    const result = await Promise.all([
            api.engine.pages.get(null,api),
            api.engine.widgets.get(null,api)
        ]);

    pages = result[0];
    widgets = result[1];
    modifiedWidgets = {};

    widgets.forEach((element,k) => {
        
        let path = element.path;
        modifiedWidgets[path] = {
            deps: element.js_deps.split(","),
            id: path.split("/").join("__").substr(2),
            path: path.split(",").filter(i=>!!i)
        };
    });

    cb();

}

async function writeMocks(cb) {

    await Promise.all([
            fs.writeFile("mocks/pages.json",JSON.stringify(pages)),
            fs.writeFile("mocks/widgets.json",JSON.stringify(widgets))
        ]);
    
    cb();

}

async function runServer(cb) {

    server(modifiedPages).then(s=>{
        console.log(server)
    });
    cb();

}

async function modifyPages(cb) {
    
    modifiedPages = await builder.modifyPages(pages);
    let pumpises = [];
    let start = Date.now() / 1000;
   
    for (const key in modifiedPages) {
        const element = modifiedPages[key]
        element.id = key.substr(1).split("/").join("__");

        let {js_deps,widgets,id,path} = element;

        let coreDeps = [
            './src/front-end/balalaika.js',
            './src/front-end/dom.js',
            './src/front-end/helpers.js'
        ]

        js_deps = js_deps.map(i=>"./src/front-end/deps/"+i+".js");

        element.widgets = element.widgets ? element.widgets : [];

        let widgetDeps = element.widgets.map(w=>{
            return "./src/front-end/widgets" + w + ".js"
        }).filter(i=>!!i);

        let requstToModify = [
            ...js_deps,
            ...coreDeps,
            ...widgetDeps,
            "./src/front-end/pages"+path+".js"
        ];

        console.log("start modify:", requstToModify);

        if (widgetDeps.length) {
            pumpises.push(gulp.src(requstToModify)
                .pipe(each(function(content, file, callback) {
                   const widgetScript = file.path.split("/widgets/");
                   let newContent = content;
                   if (widgetScript[1]) {
                    newContent =   `rosa.widgets["${id}"] = (function() {\nreturn ${content}\n})();`;
                   }
                    callback(null, newContent);
                }))
                .pipe(concat(path.split("/").join("__")+'.js'))
                .pipe(gulp.dest('./dist/'))
            );
        }
        
    }
    
    await Promise.all(pumpises);
    console.log( ( Date.now()/1000-start  ).toFixed(4) + "s" );

}

exports.update = gulp.series(getMainData,writeMocks);
exports.dev = gulp.series(getMainData,writeMocks,modifyPages,runServer);

exports.default = getMainData;