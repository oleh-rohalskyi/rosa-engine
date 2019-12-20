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