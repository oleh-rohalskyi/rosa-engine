window._ = ( function( window, document, fn, nsRegAndEvents, id, s_EventListener, s_MatchesSelector, i, j, k, l, _ ) {
	_ = function( s, context ) {
		return new _.i( s, context );
	};
	
	_.i = function( s, context ) {
		fn.push.apply( this, !s ? fn : s.nodeType || s == window ? [s] : "" + s === s ? /</.test( s ) 
		? ( ( i = document.createElement( context || 'q' ) ).innerHTML = s, i.children ) : (context&&_(context)[0]||document).querySelectorAll(s) : /f/.test(typeof s) ? /c/.test(document.readyState) ? s() : _(document).on('DOMContentLoaded', s) : s );
	};
	
	_.i[ l = 'prototype' ] = ( _.extend = function(obj) {
		k = arguments;
		for( i = 1; i < k.length; i++ ) {
			if ( l = k[ i ] ) {
				for (j in l) {
					obj[j] = l[j];
				}
			}
		}
		
		return obj;
	})( _.fn = _[ l ] = fn, { // _.fn = _.prototype = fn
		on: function( n, f ) {
			// n = [ eventName, nameSpace ]
			n = n.split( nsRegAndEvents );
			this.map( function( item ) {
				// item.b_ is balalaika_id for an element
				// i is eventName + id ("click75")
				// nsRegAndEvents[ i ] is array of events (eg all click events for element#75) ([[namespace, handler], [namespace, handler]])
				( nsRegAndEvents[ i = n[ 0 ] + ( item.b_ = item.b_ || ++id ) ] = nsRegAndEvents[ i ] || [] ).push([f, n[ 1 ]]);
				// item.addEventListener( eventName, f )
				item[ 'add' + s_EventListener ]( n[ 0 ], f );
			});
			return this;
		},
		off: function( n, f ) {
			// n = [ eventName, nameSpace ]
			n = n.split( nsRegAndEvents );
			// l = 'removeEventListener'
			l = 'remove' + s_EventListener;
			this.map( function( item ) {
				// k - array of events
				// item.b_ - balalaika_id for an element
				// n[ 0 ] + item.b_ - eventName + id ("click75")
				k = nsRegAndEvents[ n[ 0 ] + item.b_ ];
				// if array of events exist then i = length of array of events
				if( i = k && k.length ) {
					// while j = one of array of events
					while( j = k[ --i ] ) {
						// if( no f and no namespace || f but no namespace || no f but namespace || f and namespace )
						if( ( !f || f == j[ 0 ] ) && ( !n[ 1 ] || n[ 1 ] == j[ 1 ] ) ) {
							// item.removeEventListener( eventName, handler );
							item[ l ]( n[ 0 ], j[ 0 ] );
							// remove event from array of events
							k.splice( i, 1 );
						}
					}
				} else {
					// if event added before using addEventListener, just remove it using item.removeEventListener( eventName, f )
					!n[ 1 ] && item[ l ]( n[ 0 ], f );
				}	
			});
			return this;
		},
		is: function( s ) {
			i = this[ 0 ];
			return (i.matches
				|| i[ 'webkit' + s_MatchesSelector ]
				|| i[ 'moz' + s_MatchesSelector ]
				|| i[ 'ms' + s_MatchesSelector ]
				|| i[ 'o' + s_MatchesSelector ]).call( i, s );
		}
	});	
	return _;
})( window, document, [], /\.(.+)/, 0, 'EventListener', 'MatchesSelector' )





_.fn.find = function( selector ) {
	return _( this[0].querySelectorAll(selector) );
};

_.fn.template = function( name ) {
	return _( this[0].querySelectorAll('[type="rosa/x-template"][name="'+name+'"]') );
};

_.fn.hide = function( name ) {
	this[0].style.display = "none";
	return this;
};

_.fn.show = function( display ) {
	this[0].style.display = display;
	return this;
};

_.fn.clone = function( name ) {
	return _( this[0].cloneNode(true) );
};

_.fn.data = function( name,opt ) {
	if (!name && !opt) {
		let x = []
		var data = {};
		this.for((item,key)=>{
			[].forEach.call(item[0].attributes, function(attr) {
				if (/^data-/.test(attr.name)) {
					var camelCaseName = attr.name.substr(5).replace(/-(.)/g, function ($0, $1) {
						return $1.toUpperCase();
					});
					
					if (!x[key])
						x[key] = {};
					x[key][camelCaseName] = JSON.parse(attr.value)
				}
			});
		})
		return x.length > 1 ? x : (x[0] || false);
	}
	if (!opt) {
		return this[0].getAttribute("data-"+name);
	}
	const {as=""} = opt;
	if (typeof as === "function" && !Array.isArray(as)) {
		return JSON.parse( this[0].getAttribute("data-"+name) );
	}
};

_.fn.attr = function(name,value) {
	if (value) {
		this[0].setAttribute(name,value);
		return this;
	} else if (name) {
		const txt = this[0].getAttribute(name);
		return { txt, obj:function(){
			return JSON.parse(txt);
		} }
	}
};

_.fn.for = function(cb) {
	this.forEach((node,i)=>{
		cb(_(node),i)
	})
	return this;
}

_.fn.text = function(text) {
	this[0].innerText = text;
	return this;
}

_.fn.toggle = function( className, b ) {
	this.forEach( function( item ) {
		var classList = item.classList;
		if( typeof b !== 'boolean' ) {
			b = !classList.contains( className );
		}
		classList[ b ? 'add' : 'remove' ].apply( classList, className.split( /\s/ ) );
	});
	return this;
};

_.fn.addClass = function( className ) {
	this.forEach( function( item ) {
		var classList = item.classList;
		classList.add.apply( classList, className.split( /\s/ ) );
	});
	return this;
};
_.fn.removeClass = function( className ) {
	this.forEach( function( item ) {
		var classList = item.classList;
		classList.remove.apply( classList, className.split( /\s/ ) );
	});
	return this;
};

_.fn.add = function( node ) {
	this[0].append(node);
	return this;
};

_.fn.inside = function( node ) {
	return _( this[0].querySelectorAll(node) );
};

Object.defineProperty(_.fn,'html',{
	  set: function(newVal) { this[0].innerHTML = newVal; return this[0]},
	  get: function() {return this[0].innerHTML}
})

Object.defineProperty(_.fn,'txt',{
	set: function(newVal) { this[0].innerText = newVal; },
	get: function() {return this[0].innerText || ""}
})

Object.defineProperty(_.fn,'url',{
	set: function(newVal) { 
		if(this[0].hasAttribute("src")) {
			this[0].setAttribute("src",newVal)
		} else
		if(this[0].hasAttribute("href")) {
			this[0].setAttribute("href",newVal)
		} else if (this[0].hasAttribute("data-route")) {
			this[0].setAttribute("data-route",newVal)
		} else {
            this[0].setAttribute("href",newVal)
        }
	},
	get: function() {
		if(this[0].hasAttribute("src")) {
			return this[0].getAttribute("src")
		}
		if(this[0].hasAttribute("data-route")) {
			return this[0].getAttribute("data-route")
		}
		if(this[0].hasAttribute("href")) {
			return this[0].getAttribute("href")
		}
		return "";
	}
})


_.fn.removeClass = function( className ) {
	this.forEach( function( item ) {
		var classList = item.classList;
		classList.remove.apply( classList, className.split( /\s/ ) );
	});
	return this;
};

_.fn.parents = function(selector) {
	var collection = _();
	this.forEach(function(node) {
		var parent;
		while((node = node.parentNode) && (node !== document)) {
			if(selector) {
				if(_(node).is(selector)) {
					parent = node;
				}
			} else {
				parent = node;
			}
			if(parent && !~collection.indexOf(parent)) {
				collection.push(parent);
			}
		}
	});
	
	return collection;
};
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



rosa.widgets["auth"] = (function() {
return class {
    getCaptcha(refresh) {
        
        return new Promise(res=>{
            __.api.get("auth/init",{refresh:refresh||"",id:this.captchaId||0}).then(result=>{
                if (result.success) {
                    console.log(result)
                    this.captchaId = result.data.id;
                    this.user_id_type = result.data.user_id_type;
                    res(result.data);
                }
            })
        })  
    }
    constructor(el,data) {
        
        this.hideParent = true;
        this.data = {
            reg: {},
            sign: {}
        };

        let loading = _("[auth-loading]");
        loading.hide();
        
        let reg = {
            login: false,
            pass: false,
            captcha: false,
            email: false,
            hash: false,
            passconfirm: false
        }

        let pr = "reg";
        let img = el.find("[auth-reg-captcha-img]");
        this.getCaptcha().then((result)=>{
            console.log(result)
            img.html = result.image;
            el.find("[auth-reg-captcha-refresh]").on("click",()=>{
                this.getCaptcha(true).then(result=>{
                    img.html = result.image;
                });
            })

            el.find("button").for((node)=>{
                node.on("click",e=>e.preventDefault());
            })

            

            if (!authConfig.sendEmail) {
                el.find("[auth-resend-email]").hide();
            }
            
            __.for(authConfig.reg,(item,key)=>{
                reg[key] = item;
            })
            
            __.for(reg,this.prepareInputs.bind(this,pr))
    
            el.find("[auth-reg-submit]").on("click",this.onSubmit.bind(this,pr));
    
            let sign = {
                login: false,
                pass: false,
                email: false,
                hash: false
            }
    
            pr = "sign";
            
            __.for(authConfig.sign,(item,key)=>{
                sign[key] = item;
            })
            
            __.for(sign,this.prepareInputs.bind(this,pr))
    
            el.find("[auth-sign-submit]").on("click",this.onSubmit.bind(this,pr));
        })
        

    }
    onSubmit(pr,e) {
        e.preventDefault();
        let req = this.data[pr];
        let errors = rosa.validation.auth.registration(pr,this.user_id_type);
        req.captcha_id = this.captchaId;
        __.api.post("auth/signup",req);
    }
    prepareInputs(pr,i,key) {
        let node = _("[auth-"+pr+"-"+key+"]");
        if(!node.length) {
            console.error("cant find [auth-"+pr+"-"+key+"] element");
            return;
        }
        if (!i) {
            node.hide();
            if(this.hideParent) {
                _(node[0].parentNode).hide();
            }
        } else {
            node.on("input",(e)=>{
                console.log(2);
                this.data[pr][key] = e.target.value;
            })
        }
    }
}

})();
