const rosa = {};
const module = false;
rosa.widgets = {classes:{}};

const __ = {
    ce(name,className) {
        let el = document.createElement(name);
        el.classList.add(className);
        return el;
    },
    lang: document.documentElement.lang,
    getLoko() {
        return this.getMetaContent("location");
    },
    getMetaContent(name) {
        let node = document.querySelector(`meta[name="${name}"]`);
        return node ? node.getAttribute("content") : null;
    }
}

if (__.getMetaContent("proccess")==="dev") {
    rosa.dev = {};
    rosa.dev = {
        pannel:  document.querySelector(".rosa-dev-pannel")
    }
    rosa.role = __.getMetaContent("role");
    rosa.dev.pannel.querySelector(".rosa-dev-pannel-role").innerText = rosa.role;
    rosa.dev.requestTime = __.getMetaContent("time") * 1;
    rosa.dev.startPageTime = Date.now() - rosa.dev.requestTime;
    rosa.dev.pannel.querySelector(".rosa-dev-pannel-start-time").innerText = rosa.dev.startPageTime/1000 + "s";
} else {
    rosa.dev = {log(){}}
    console.log = ()=>{};
}
