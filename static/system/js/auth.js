rosa.auth = {
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
        
        [...nodes].forEach((node)=>{
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
        
        this.listener("signin","addEventListener");
        this.listener("signup","addEventListener");
        this.listener("signout","addEventListener");

    },
    listener(mission,fun) {
        if (!this.nodes[mission]) return;
        switch(mission) {
            case "signout":
                this.nodes[mission].action[fun]("click",this.onClick(mission));
            break;
            default:
                this.nodes[mission].request[fun]("click",this.onClick(mission,111));
                this.nodes[mission].login[fun]("input",this.onChange(mission,"login"));
                this.nodes[mission].pass[fun]("input",this.onChange(mission,"pass"));
            break;
        }
    },
    onChange(mission,loginOrPass){
        
        return ({target:{value}}) => {
            this[mission][loginOrPass] = value;
        }

    },
    onClick(mission){

        return (e) => {

            let errors;
            
            errors = rosa.validation.validate(
                {...this[mission]},
                {...this.nodes[mission].messages}
            );
               
            for (const key in this.nodes[mission].messages) {
                this.nodes[mission].messages[key].innerHTML = "";
            }

            if (errors.length > 0) {
                console.log(errors)
                errors.forEach(({message,target})=>{
                    // console.log( this.nodes[mission].messages);
                    console.log( this.nodes[mission].messages[target]);
                    this.nodes[mission].messages[target].innerHTML += message + "</br>";
                });

                return

            }

            fetch(`/rosa-api/auth/${mission}`, {
                body: this.encodeQueryString({ lang: rosa.helper.lang, password: this[mission].pass, login: this[mission].login}),
                method: "POST",
            }).then((result)=>{
                return result.json();
            }).then((result)=>{
                console.log(result)
                if (!result.success)
                    this.nodes.errors.innerHTML += this.errors[result.error.code] + "</br>";
                else {
                    this.nodes.errors.innerHTML = "";
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
