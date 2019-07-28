
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
    async script(name, path = "system/front") {
        return new Promise((res)=>{
            const script = document.createElement("script");
            script.setAttribute("src", `/cdn/${path}/${name}.js`);
            script.setAttribute("type", "text/javascript");
            this.scrips.appendChild(script);
            script.onload = function() {
                res(script);
            }    
        });  
    }
}

async function app() {
    
    rosa.loader.init();
    rosa.data.init();
    // console.log(rosa.data.fragmentsList)
    // console.log(rosa.data.fragmentsList);
    // load fragment script;
    await rosa.loader.script("validation","shared_js");
   
    const result = await Promise.all( 
        rosa.data.fragmentsList.map( ({name}) => rosa.loader.script(name,"components/fragments") ) 
    )
    
    rosa.auth.init();
        
    return Promise.resolve(result);

};

app().then(console.log);