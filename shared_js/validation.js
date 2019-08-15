
const init = () => {
    rosa.validation = {
        forEach(cb) {
            const self = this;
            for (const key in self) {
                if (self.hasOwnProperty(key) && key !== "forEach") {
                    const element = self[key];
                    cb(element);
                }
            }
        },
        ["is-empty"](value) {
            return value.replace(/\s/g,'') === "";
        },
        ["less-then-6"](value) {
            return value.length < 6;
        },
        ["less-then-4"](value) {
            return value.length < 4;
        }
    }
    
}

if(module) {
    rosa = {};
    init();
    module.exports = rosa.validation;
} else {
    init();
}