
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
            
            let result = [];
            for (let rule in rules) {
                const key = rule;
                rule = rule.split(":")[1] ? rule.split(":")[1] : rule;
                console.log(key);
                if (this[rule])
                    result.push({
                        result: this[rule](value),
                        message: rules[key],
                        rule,
                        target
                    })
                else
                    result.push({
                        result: false,
                        message: key,
                        rule,
                        target
                    })
            }
            
            return result;
        },
        validate(value,rules) {
            let result = [];
            console.log(value)
            for (const target in value) {
                result = [
                    ...result,
                    ...this.check({
                        rules: rules[target].messages,
                        value: value[target],
                        target
                    })
                ]
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