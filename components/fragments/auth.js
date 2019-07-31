rosa.fragment.auth = {
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

        const nodes = document.querySelectorAll("[rosa-auth]");
        
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

            const message = node.getAttribute("rosa-auth:message");
            const errors = node.getAttribute("rosa-auth:errors");

            if (!this.nodes[type]) {
                this.nodes[type] = {};
            }

            // console.log(node)

            switch (true) {
                case !!errors:
                    this.errors = JSON.parse(errors);
                    this.nodes.errors = node;
                    break;
                case !!message:
                node.messages = JSON.parse(message);
                    if (!this.nodes[type].messages)
                        this.nodes[type].messages = {};
                    this.nodes[type].messages[unit] = node;
                    break;
                default:
                    this.nodes[type][unit] = node;
                break;
            }
        });
        
        this.listener("signin", "addEventListener");
        this.listener("signup", "addEventListener");
        this.listener("signout","addEventListener");

    },
    listener(type,fun) {
        if (!this.nodes[type]) return;
        switch(type) {
            case "signout":
                this.nodes[type].action[fun]("click",this.onClick(type));
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
               
                if (!result.success) { console.error("error",result)}
                
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
