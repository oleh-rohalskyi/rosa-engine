class {
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
