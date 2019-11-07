class {
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

    }
    onSubmit(pr,e) {
        console.log(pr,e)
        e.preventDefault();
        console.log(pr,this.data[pr])
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
