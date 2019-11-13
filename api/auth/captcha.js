const SVGcaptcha = require("svg-captcha");
const crypto = require("crypto");

module.exports = {
    get(req) {
        return new Promise(function(res){
            if (req.params.refresh === 'true') {
                req.session.delCaptcha(req.params.id)
            }

            const captcha = SVGcaptcha.create({color: true,noise: 5});
            const id = crypto.randomBytes(8).toString("hex");
            req.session.setCaptcha(id,captcha.text).then((result)=>{
                res({success: true,data:{id,image:captcha.data,user_id_type:req.config.auth.id_type_key}});
            });

        })
    }
}

