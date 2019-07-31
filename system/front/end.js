
rosa.decorateNode = (node) => {
    node.messages = {};
};

rosa.data = {
    init() {
        this.getFragments();
    },
    fragmentsList: [],
    fragments: {},
    getFragments() {
        if (Object.keys(this.fragments).length > 0 && this.fragmentsList.length > 0)
            return this.fragments.length;
        else {
            const strFragments = document.querySelector("meta[name='fragments']").getAttribute("content");
            this.fragments = JSON.parse(strFragments);
            this.fragmentsList = Object.keys(this.fragments).map((key) => {
                const item = this.fragments[key];
                item.name = key;
                return item;
              });     
        }
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
    rosa.data.init();
    
    await rosa.loader.script("validation","shared_js");
   
    const result = await Promise.all( 
        rosa.data.fragmentsList.map( ({name}) => rosa.loader.script(name,"components/fragments") ) 
    )
    console.log(rosa.data);
    rosa.fragment.auth.init();
        
    return Promise.resolve(result);

};

app().then(console.log);