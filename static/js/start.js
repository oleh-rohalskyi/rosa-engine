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
    setUrlLocation() {
        return;
        if (this.getMetaContent("location")!==decodeURI(location.pathname) && !this.getMetaContent("noredirect")) 
            location.href = this.getMetaContent("location");
    },
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
        start_time: __.ce("span","rosa-dev-div-start-time"),
        end_time:   __.ce("span","rosa-dev-div-end-time"),
        page:  __.ce("span","rosa-dev-div-page"),
        role:  __.ce("span","rosa-dev-div-role"),
        wrap:  __.ce("div","rosa-dev-div"),
        log(where,time) {
            if(where==="start_time")
                this.startPageTime = time;
            this[where].innerText = time/1000 + "s";
        },
        calcResult() {
            this.result.innerText = (this.end.innerText*1 - this.start.innerText*1)
        }
    }
    rosa.dev.role.innerText = __.getMetaContent("role");
    rosa.dev.wrap.append(rosa.dev.start_time)
    rosa.dev.wrap.append(rosa.dev.page)
    rosa.dev.wrap.append(rosa.dev.end_time)
    rosa.dev.wrap.append(rosa.dev.role)
    document.querySelector("html").append(rosa.dev.wrap);

    rosa.dev.requestTime = __.getMetaContent("time") * 1;
    rosa.dev.log("start_time",Date.now() - rosa.dev.requestTime);
} else {
    rosa.dev = {log(){},calcResult(){}}
    console.log = ()=>{};
}

__.setUrlLocation();