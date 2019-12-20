(function() {
    
    const init = () => {

        rosa.validation = {
            auth: {
                registration: (pr,uuidType) => {
                    let errors = [];
                    switch (true) {
                        case !pr["pass"]:   errors.push("EMPTY__PASS")
                        case !pr[uuidType]: errors.push("EMPTY__"+uuidType.toUpperCase())
                        case pr["pass"]!==pr["passconfirm"]: errors.push("DIFF__PASS")
                        case !pr["captcha"]: errors.push("EMPTY__CAPTCHA")
                        return errors.length?errors:null;
                    }
                }
            }
            
        }
        
    }

    if(module) {
        rosa = {shared:{}};
        init();
        module.exports = rosa.validation;
    } else {
        init();
    }

})();