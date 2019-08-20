
rosa.decorateNode = (node) => {
    node.messages = {};
};

rosa.data = {
    init() {
        this.getwidgetsFromDOM();
        return Promise.resolve();
    },
    widgets: [],
    getwidgetsFromDOM() {
        const strwidgets = document.querySelector("meta[name='widgets']").getAttribute("content");
        this.widgets = JSON.parse(strwidgets);
    }

}
rosa.loader = {
    init() {
        this.scrips = document.querySelector("scripts");
    },
    async script(name, path) {
        return new Promise((res,rej)=>{
            const script = document.createElement("script");
            script.setAttribute("src", `/cdn/${path}/${name}.js`);
            script.setAttribute("type", "text/javascript");

            script.onerror = function() {
                rej(`cant load /cdn/${path}/${name}.js file`);
            } 
            try {
                this.scrips.appendChild(script);
            } catch (error) {
                rej(`cant load /cdn/${path}/${name}.js file`);
            }
            
            script.onload = function() {
                res(script);
            }    
        });  
    }
}

async function app() {
    
    rosa.loader.init();
    await rosa.data.init();


    await rosa.loader.script("db","system/front");
    await rosa.loader.script("validation","shared_js");
    const ready = [];
    await Promise.all( 
        await rosa.data.widgets.map( async (name) => {
            
            if (ready.indexOf(name)<0)
                ready.push(name);
            
            return {
                node: await rosa.loader.script(name,"components/widgets"),
                name
            };

        } )
    );

    return Promise.resolve({ready});
    
};

app().then((result)=>{
    const entities = [];
    function decorate(obj) {
        console.log(obj);
        obj.qS = obj.querySelector;
        obj.qSA = function(selector) {
            return [...obj.querySelectorAll(selector)]
        }
        return obj;
    }
    result.ready.forEach((uniqFr)=>{
        let dublicated = document.querySelectorAll(".widget-"+uniqFr);
        console.log(dublicated,uniqFr);
        if (dublicated.length > 1) {
            [...dublicated].forEach((node)=>{
                console.log(node);
                entities.push( new rosa.widget[uniqFr](decorate(node)) );
            });
        } else if (dublicated.length > 0) {
            entities.push(new rosa.widget[uniqFr]( decorate(dublicated[0]) ) );
        }
    })

    return entities;

}).then(console.log)