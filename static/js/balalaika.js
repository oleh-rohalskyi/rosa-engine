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
		} else {
			this[0].setAttribute("data-route",newVal)
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

_.help = {
	objToPostBody(params) {
		const keys = Object.keys(params)
		return keys.length
			? keys
				.map(key => encodeURIComponent(key)
					+ "=" + encodeURIComponent(params[key]))
				.join("&")
			: ""
	}
}

