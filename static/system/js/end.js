
rosa.decorateNode = (node) => {
    node.messages = {};
};

rosa.loader = {
    init() {
        this.scrips = document.querySelector("scripts");
        this.csss = document.querySelector("csss");
    },
    async script(name) {
        return new Promise((res)=>{
            const script = document.createElement("script");
            script.setAttribute("src", `/static/system/js/${name}.js`);
            script.setAttribute("type", "text/javascript");
            this.scrips.appendChild(script);
            script.onload = function() {
                res();
            }    
        });  
    }
}

async function app() {
    rosa.loader.init();
    await rosa.loader.script("validation");
    await rosa.loader.script("auth");
    rosa.auth.init();
    return rosa;
};

app().then(console.log);