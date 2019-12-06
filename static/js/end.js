const isClass = fn => /^\s*class/.test(fn?fn.toString():"");

let r = {};

const np = (fun) => {
    return new Promise(fun);
}

const cl = console.log;


String.prototype.delLast = function() {
    return this.substring(0, this.length - 1);
}

__.type = function(value)  {
    if (Array.isArray(value)) {
        return "array";
    }
    if (value && typeof value === 'object' && value.constructor === Object) {
        return "object";
    }
    if (typeof value === 'number' && isFinite(value)) {
        return 'number';
    }
    if (typeof value === 'string' || value instanceof String) {
        return 'string'
    }
    if (typeof value === 'function') {
        return 'function'
    }
}

__.type.array = function (value) {
    return this(value) === 'array';
}

__.type.object = function (value) {
    return this(value) === 'object';
}

__.type.number = function (value) {
    return this(value) === 'number';
}

__.type.string = function (value) {
    return this(value) === 'string';
}

__.type.function = function (value) {
    return this(value) === 'function';
}

__.api = {
    encodeParams(obj,paramName) {
        var str = "";
        var altKey = "";
        for (var key in obj) {
            if (str != "") {
                str += "&";
            }
            if ( __.type.array(obj[key]) ) {
                obj[key].forEach((i)=>{
                    str += "&" + (paramName || key)  + "=" + encodeURIComponent(i);
                })
            } else {
                str += key + "=" + encodeURIComponent(obj[key]);
            }
        }
        return str;
    },
    domain: "http://localhost:3001",
    lang: document.documentElement.lang,
    async post(url,data) {
        if (!data) {
            data = {};
        }
       data.lang = data.lang || this.lang;
       const result = await fetch(`${this.domain}/api/${url}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
       })
       return result.json();
   },
     async get(url,data) {
         if (!data) {
             data = {};
         }
        data.lang = data.lang || this.lang;
        const result = await fetch(`${this.domain}/api/${url}?${this.encodeParams(data)}`, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
        return result.json();
    }
}

__.for = (object,cb)=> {
    let breakit = false;
    let stop = () => {
        breakit = true;
    }
    for (const key in object) {
        if(breakit) return;
        if (object.hasOwnProperty(key)) {
            const element = object[key];
            cb(element,key,stop);
        }
    }
}

__.json = any => {
    if (typeof any === "string") {
        return JSON.parse(any);
    } else return JSON.stringify(any);
}

__.list_to_tree = function(arr) {
    var tree = [],
        mappedArr = {},
        arrElem,
        mappedElem;

    // First map the nodes of the array to an object -> create a hash table.
    for(var i = 0, len = arr.length; i < len; i++) {
      arrElem = arr[i];
      mappedArr[arrElem.id] = arrElem;
      mappedArr[arrElem.id]['children'] = [];
    }


    for (var id in mappedArr) {
      if (mappedArr.hasOwnProperty(id)) {
        mappedElem = mappedArr[id];
        // If the element is not at the root level, add it to its parent array of children.
        if (mappedElem.parent) {
          mappedArr[mappedElem['parent']]['children'].push(mappedElem);
        }
        // If the element is at the root level, add it to first level elements array.
        else {
          tree.push(mappedElem);
        }
      }
    }
    return tree;
  }

__.loadScript = (path,name) => {
    return new Promise((res,rej)=>{
        const script = document.createElement("script");
        script.setAttribute("src", `/cdn/${path}/${name}.js`);
        script.setAttribute("type", "text/javascript");

        script.onerror = function() {
            rej(`cant load /cdn/${path}/${name}.js file`);
        } 
        try {
            document.body.appendChild(script);
        } catch (error) {
            rej(`cant load /cdn/${path}/${name}.js file`);
        }
        
        script.onload = function() {
            res(script);
        }    
    });  
}


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
    })
    if (error) return Promise.reject(error);
    return Promise.resolve({success: true});
    
}).then(function(){
    
    if (rosa.dev) {
        rosa.dev.pannel.querySelector(".rosa-dev-pannel-page-time").innerText =( (Date.now() - rosa.dev.requestTime) - rosa.dev.startPageTime )/1000 + "s";
        rosa.dev.pannel.querySelector(".rosa-dev-pannel-end-time").innerText = (Date.now() - rosa.dev.requestTime)/1000 + "s";
    }

    window.r = rosa;

})

