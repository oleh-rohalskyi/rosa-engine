async function app() {
    return Promise.resolve( __.json( __.getMetaContent("widgets") || "false" ) );
};

app()
.then((widgets)=>{

    rosa.widgets.w = {};
    rosa.widgets.uses = widgets;
    let error = null;

    __.for(rosa.widgets.uses,(uniqFr,key,stop)=>{
        let className = "widget-"+uniqFr.replace("/","__");
        let widgetNodes = document.querySelectorAll("."+className);
        let l = widgetNodes.length;
        if (l > 0) {

            [...widgetNodes].forEach((node,i)=>{
                
                const id = className+"_"+(i+1);
                let controller = {};
                node.setAttribute("id",id);
                let classEx = rosa.widgets.classes[uniqFr.toUpperCase()];
                
                if( isClass(classEx) ) {

                    const _node = _("#"+id);
                    controller = new classEx(_node,{widgets});
                    controller.node = _node;
                    const result = {
                        controller,
                        _node
                    };
                    
                    rosa.widgets.w[uniqFr+"_"+(i+1)] = result;
                   
                }
                    
            });
        } 
    });

    if (error) return Promise.reject(error);
    
    return Promise.resolve({success: true});
    
}).then(function(){
    
    if (rosa.dev) {
        rosa.dev.pannel.querySelector(".rosa-dev-pannel-page-time").innerText =( (Date.now() - rosa.dev.requestTime) - rosa.dev.startPageTime )/1000 + "s";
        rosa.dev.pannel.querySelector(".rosa-dev-pannel-end-time").innerText = (Date.now() - rosa.dev.requestTime)/1000 + "s";
    }

    window.r = rosa;

})