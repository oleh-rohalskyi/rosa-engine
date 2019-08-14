
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

    const result = await Promise.all( 
        await rosa.data.fragments.map( async (name) => ({
            node: await rosa.loader.script(name,"components/fragments"),
            name
        }) )
    );

    return Promise.resolve(result);
    
};

app().then((fragments)=>{
    fragments.forEach(({name})=>{
        if(rosa.fragment[name]) {
            rosa.fragment[name].init();
        }
    } );
});