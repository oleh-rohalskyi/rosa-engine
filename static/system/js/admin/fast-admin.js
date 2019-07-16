(function(){
    const json = document.querySelector(".json");
    const list = document.querySelector("fragments list");
    const {fragments} = JSON.parse(json.getAttribute("data-json"));
    for (const key in fragments) {
        if (fragments.hasOwnProperty(key)) {
            const element = fragments[key];
            const div = document.createElement("div");

            const innerHtml = (item) => {
                return `<div class="fragment-${item.key}">
                            ${JSON.stringify(item.data)}
                        </div>`
            }
            
            div.innerText = `<div class="fragment">`;

            list.prepend(div);
        }
    }
    
})();