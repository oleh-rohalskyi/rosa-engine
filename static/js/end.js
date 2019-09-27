const isClass = fn => /^\s*class/.test(fn?fn.toString():"");

const print = console.log;

const np = (fun) => {
    return new Promise(fun);
}

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
    lang: __.lang,
    async get(url,data) {
        data.lang = this.lang;
        const result = await fetch(`${this.domain}/api/${url}/?${this.encodeParams(data)}`, {
            method: "GET",
        })
        return result.json();
    }
}

__.for = (object,cb)=> {
    for (const key in object) {
        if (object.hasOwnProperty(key)) {
            const element = object[key];
            cb(element,key);
        }
    }
}

__.params = (action,arr) => {
    let result = {};

    switch (action) {
        case "set":result = getModified(arr);break;
        case "get":result = get();break;
        case "push":result = push(arr);break;
        case "del":result = del(arr);break;
        default: result = get();break;
    }

    function push(arr) {
        const obj = getModified(arr);
        window.location.href = obj.str;
        return obj;
    }

    function del(param) {
        const current = get().obj;
        const newObj = {}
        for (const key in current) {
            if (current.hasOwnProperty(key)) {
                if (key !== param) {
                    newObj[key] = current[key];
                }
            }
        }
        const str = makeString(newObj);
        window.location.href = str
        return {obj:newObj,str:str}
    }
    function get() {
        let obj ={}
        let string = "#";
        let x = window.location.href.split("#")[1];
        if (!x)
            return {obj:{},str:"#"}
        let y = x.split("&");
        y.forEach(item=>{
            let key = item.split("=")[0]
            let value = item.split("=")[1]
            string+=key+"="+value+"&"
            obj[key] = value;
        })
        return {obj,str:string.delLast()};
    }

    function makeString(current) {
        let string = "#";
        for (const key in current) {
            if (current.hasOwnProperty(key)) {
                const element = current[key];
                string+=key+"="+element+"&"
            }
        }
        return string.delLast();
    }

    function getModified(arr) {
        const current = get().obj;
        arr.forEach(item=>{
            current[item[0]] = item[1];
        })
        return {obj:current,str:makeString(current)}
    }
    return result;

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
    rosa.widgets.uses = __.json( __.getMetaContent("widgets") || "false" );
    if (!rosa.widgets.uses) {
        return Promise.resolve([])
    }
    return Promise.resolve(rosa.widgets.uses);

};

app()
.then(async (widgets)=>{
    if (widgets.length) try {
            let request = {
                widgets
            }
            return Promise.resolve( await __.api.get("engine/widgets",request) );
        } catch (e) {
            return Promise.resolve(e);
        } 
    else {
        return Promise.resolve(e);
    }
})
.then((data)=>{
    
    if (!data.success)
        return {then:function(cb){
            cb(data);
        }};

    if (rosa.widgets.uses)
        rosa.w = {};

    rosa.widgets.uses.forEach((uniqFr)=>{

        let widgetData = null;

        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const element = data[key];
                if (element.name === uniqFr) {
                    widgetData = element;
                }
            }
        }
        
        let className = "widget-"+uniqFr;
        let widgetNodes = document.querySelectorAll("."+className);
        let l = widgetNodes.length;
        if (l > 0) {
            
            [...widgetNodes].forEach((node,i)=>{
                
                const id = className+"-"+(i+1);
                if (widgetData) {
                    function renderValues(node,data) {
                        if (!data) return;
                        const elements = node.querySelectorAll("[set]");
                        [...elements].forEach(e=>{
                            let keys = e.getAttribute("set");
                            let key = keys.split(".");
                            if (key[1]) {
                                e.innerText = data[key[0]][key[1]] || "lorem ipsum";
                            }
                        })
                    }
                    renderValues(node,widgetData.translations);
                }

                node.setAttribute("id",id);

                node.classList.add( className+"_"+(i+1) );

                let classEx = rosa.widgets.classes[uniqFr.toUpperCase()];
                
                if( isClass(classEx) ) {
                    const _node = _("#"+id);
                    const controller = new classEx(_node, widgetData);
                    const result = {
                        controller,
                        _node
                    };
                    if (l==1) {
                        rosa.w[uniqFr] = result;
                    }
                    rosa.w[uniqFr+(i+1)] = result;

                }
                    
            });
        } 
    })
}).then(function(data){
    console.log(data.error.errorLinkHtml);
    if (rosa.dev) {
        rosa.dev.pannel.querySelector(".rosa-dev-pannel-page-time").innerText =( (Date.now() - rosa.dev.requestTime) - rosa.dev.startPageTime )/1000 + "s";
        rosa.dev.pannel.querySelector(".rosa-dev-pannel-end-time").innerText = (Date.now() - rosa.dev.requestTime)/1000 + "s";
        console.log(data.error,data.success);
        if (!data.success && data.error) {
            if (data.error.message) {
                document
                    .querySelector(".rosa-error-message-wrap-message")
                    .innerHTML = `<span>${data.error.type}:</span><span> ${data.error.message}</span>`;
            }
            if (data.error.errorLinkHtml) {
                document
                    .querySelector(".rosa-error-message-wrap-file")
                    .innerHTML = data.error.errorLinkHtml;
            }
            if (data.error.errorLinkHtml) {
                document
                    .querySelector(".rosa-error-message-wrap-file")
                    .innerHTML = data.error.errorLinkHtml;
            }
            let pre = __.ce("div","rosa-error-message-some-class");
            if (data.error.stack) {
                pre.remove();
                pre = __.ce("pre","rosa-error-message-wrap-stack");
                pre.innerText = data.error.stack;
            }
            let mw = document.querySelector(".rosa-error-message-wrap");
            mw.appendChild(pre);
            mw.classList.remove("disabled");

        }
        
        window.r = rosa;
    }
});

