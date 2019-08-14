rosa.fragment['auth'] = {
    data: {},
    user: {
        registered: false,
        status: "none"
    },
    signin: {
        login: "",
        pass: "",
    },
    signup: {
        login: "",
        pass: "",
    },
    nodes: {

    },
    init() {

        const messages = document.querySelector("[rosa-auth-messages]").getAttribute("rosa-auth-messages");
       
        this.messages = JSON.parse(messages);
       
        const nodes = document.querySelectorAll("[rosa-auth]");
        console.log(nodes);
        if (nodes.length <= 0) return null;
        
        [...nodes].forEach( (node) => {
            
            rosa.decorateNode(node);
            
            const value = node.getAttribute("rosa-auth");
            
            const type = value.split(":")[0];
            const unit = value.split(":")[1];
            
            node.rosa = {
                auth: {
                    [type]: {}
                }
            }

            const errors = node.getAttribute("rosa-auth:errors");

            if (!this.nodes[type]) {
                this.nodes[type] = {};
            }

            // console.log(node)
            // console.log(type,unit,message)
            switch (true) {
                case !!errors:
                    this.errors = JSON.parse(errors);
                    this.nodes.errors = node;
                    break;
                default:
                    this.nodes[type][unit] = node;
                break;
            }
        });
        console.log(this);
        this.listener("signin", "addEventListener");
        this.listener("signup", "addEventListener");
        this.listener("signout","addEventListener");

    },
    listener(type,fun) {
        if (!this.nodes[type]) return;
        switch(type) {
            case "signout":
                this.nodes[type].action[fun]("click",this.signout(type));
            break;
            default:
                this.nodes[type].request[fun]("click",this.onClick(type));
                this.nodes[type].login[fun]("input",this.onChange(type,"login"));
                this.nodes[type].pass[fun]("input",this.onChange(type,"pass"));
            break;
        }
    },
    onChange(type,loginOrPass){
        
        return ({target:{value}}) => {
            this[type][loginOrPass] = value;
        }

    },
    onClick(type){

        return (e) => {

            fetch(`/rosa-api/auth/${type}`, {
                body: this.encodeQueryString({ lang: rosa.helper.lang, password: this[type].pass, login: this[type].login}),
                method: "POST",
            }).then((result)=>{
                return result.json();
            }).then((result)=>{
                const errorTextNode = this.nodes[type].errors;  
                if (!result.success) {
                    errorTextNode.innerHTML = `<div class="auth-alert">${this.messages[result.error]}</div>`;
                } else {
                    rosa.data.user = {
                        login: result.data.login
                    }

                    let date = new Date(result.data.expired);
                    date = date.toUTCString();
                    
                    document.cookie = `authentication=${result.data.token};path=/;expires=${result.data.expired}`;

                    
                }

            });
        }

    },
    encodeQueryString(params) {
        const keys = Object.keys(params)
        return keys.length
            ? keys
                .map(key => encodeURIComponent(key)
                    + "=" + encodeURIComponent(params[key]))
                .join("&")
            : ""
    }
}
