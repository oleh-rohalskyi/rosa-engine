
rosa.decorateNode = (node) => {
    node.messages = {};
};

rosa.loader = {
    init() {
        this.scrips = document.querySelector("scripts");
    },
    async script(name, unit) {
        return new Promise((res)=>{
            const script = document.createElement("script");
            script.setAttribute("src", `/static/system/js/${unit || "."}/${name}.js`);
            script.setAttribute("type", "text/javascript");
            this.scrips.appendChild(script);
            script.onload = function() {
                res({name, unit});
            }    
        });  
    }
}

async function app() {

    rosa.loader.init();
    
    const res = await rosa.loader.script("validation");

    const onload = await Promise.all([
        await rosa.loader.script("auth", "fragments"),
        await rosa.loader.script("fast-admin", "admin"),
    ])
    
    rosa.auth.init();
    
    onload.push(res);

    return onload;

};

app().then(console.log);