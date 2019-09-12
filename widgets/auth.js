class {
    constructor(el,data) {
        
        this.el = el;
        this.data = data;

        this.user = {
            registered: false,
            status: "none"
        };

        this.signin = {
            login: "",
            pass: "",
        };

        this.signup = {
            login: "",
            pass: "",
        };

        this.nodes = {};
        this.messages = data.translations.messages;
        this.signUpHtml =this.el.template("modal-signup-content");
        this.signUpHtml.hide();

        this.nodes.btnSignUp = this.el.find(".auth-modal-signup_js");

        this.nodes.btnSignUp.on('click',(function(){
            rosa.w.modal.open(this.signUpHtml.html,{wrapClass:"widget-auth"});
        }).bind(this));
        const nodes = this.el.find("[rosa-auth]");

        if (nodes.length <= 0) return null;
      
        nodes.for( (node) => {
              
            const value = node.attr("rosa-auth").txt;
            
            const type = value.split(":")[0];
            const unit = value.split(":")[1];

            if (!this.nodes[type]) {
                this.nodes[type] = {};
            }

            this.nodes[type][unit] = node;

        });

        this.listener("signin", "on");
        this.listener("signup", "on");

    }
    listener(type,fun) {
        if (!this.nodes[type]) return;
        this.nodes[type].request[fun]("click.namespace",this.onClick(type));
        this.nodes[type].login[fun]("input",this.onChange(type,"login"));
        this.nodes[type].pass[fun]("input",this.onChange(type,"pass"));
    }
    logout() {
        fetch(`/api/auth/logout`, {
            method: "POST",
        }).then((result)=>{
            return result.json();
        }).then((result)=>{
            if(result.success) location.reload();
        })
    }
    onChange(type,loginOrPass){
        return ({target:{value}}) => {
            this[type][loginOrPass] = value;
        }
    }
    onClick(type){
        return (e) => {
            fetch(`/api/${type}`, {
                body: _.help.objToPostBody({ lang: __.lang, password: this[type].pass, login: this[type].login}),
                method: "POST",
            }).then((result)=>{
                return result.json();
            }).then((result)=>{
                if (!result.success) {
                    this.el
                        .find("[rosa-auth-"+type+"-errors]")
                        .text(this.messages[result.code || result.error.code ]);
                } else {

                    rosa.user = {
                        ...result.data
                    }
                    
                    document.cookie = `authentication=${result.data.token};path=/;expires=${result.data.expired}`;
                    location.reload();
                    
                }

            });
        }

    }
   
}
