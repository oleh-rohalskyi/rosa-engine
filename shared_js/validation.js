
const init = () => {
    rosa.validation = {
        ["is-empty"](value) {
            return value.replace(/\s/g,'') === "";
        },
        ["less-then-6"](value) {
            return value.length < 6;
        },
        ["less-then-4"](value) {
            return value.length < 4;
        },
        check({rules,value,target}) {
            
            
        },
        validate(values,rules) {

            let result = [];
            
            for (const target in value) {
                
            }

            return result.filter( ({result}) => result===true );

        },
    }
    
}

if(module) {
    rosa = {};
    init();
    module.exports = rosa.validation;
} else {
    init();
}