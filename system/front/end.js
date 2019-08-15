
rosa.decorateNode = (node) => {
    node.messages = {};
};

rosa.data = {
    init() {
        this.getFragmentsFromDOM();
        return Promise.resolve();
    },
    fragments: [],
    getFragmentsFromDOM() {
        const strFragments = document.querySelector("meta[name='fragments']").getAttribute("content");
        this.fragments = JSON.parse(strFragments);
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
        await rosa.data.fragments.map( async (name) => {
            
            if (ready.indexOf(name)<0)
                ready.push(name);
            
            return {
                node: await rosa.loader.script(name,"components/fragments"),
                name
            };

        } )
    );

    return Promise.resolve({ready});
    
};

app().then((result)=>{
    function decorate(obj) {
        obj.get = obj.querySelector;
        obj.getAll = function(selector) {
            return [...obj.querySelectorAll(selector)]
        }
        return obj;
    }
    result.ready.forEach((uniqFr)=>{
        let dublicated = document.querySelectorAll("component."+uniqFr);
        let unique = document.querySelector("component."+uniqFr);
        if (dublicated.length) {
            [...dublicated].forEach((node)=>{
                rosa.fragment[uniqFr].init(decorate(node));
            });
        } else {
            rosa.fragment[uniqFr].init(decorate(unique));
        }
    })

});