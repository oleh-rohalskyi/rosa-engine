class CustomInput {
    constructor() {
        this.node = document.createElement("div");
        this.node.setAttribute("data-error","");
        this.dirty = false;
        this.value = "";
        this.regExps = [];
        this.errorNodes = {};
    }
    add() {

        let {wrap,html,keys,regExps} = arguments;

        if (regExps && regExps.length) {
            this.regExps = regExps;
        }
        
        if (keys["value"]) {
            this.value = keys["value"];
        }

        for (const key in keys) {

            if (keys.hasOwnProperty(key)) {
                const element = keys[key];
                html = html.replace(`[${key}]`,element || "");
            }

        }

        this.node.setAttribute("id",uniqId);
        this.node.innerHTML = html;
        this.input = this.node.querySelector("input");
        
        this.input.addEventListener("change", (e)=>{
            this.value = e.target.value;
            this.dirty = true;
        });

        wrap.appendChild(this.node);

    }
    createErrors(errors) {
        this.errors = errors;
        for (const key in errors) {
            if (errors.hasOwnProperty(key)) {
                const element = errors[key];
                const div = document.createElement(div);
                div.innerText = element;
                div.classList.add("form-error-message");
                div.classList.add("disabled");
                div.setAttribute("data-error",key);
                div.innerText = element;
                this.errorNodes[key] = div;
                this.node.appendChild(div);
                

            }
        }
    }
    validate(val) {

        for (const key in this.regExps) {

            if (this.regExps.hasOwnProperty(key)) {
                const element = this.regExps[key];
                if (!element.test(val)) {

                } else {
                    this.errorNodes[key].classList.remove("disabled");
                    return;
                }
            }

        }

        for (const key in this.errorNodes) {
            this.errorNodes[key].classList.add("disabled");
        }
        
    }
}