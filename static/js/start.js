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
    rosa.dev = true;
    rosa.perfomance = {
        start: __.ce("span","rosa-dev-div-start-time"),
        end:   __.ce("span","rosa-dev-div-end-time"),
        page:  __.ce("span","rosa-dev-div-page"),
        role:  __.ce("span","rosa-dev-div-role"),
        wrap:  __.ce("div","rosa-dev-div"),
        log(where,time) {
            if(where==="start")
                this.startPageTime = time;
            this[where].innerText = time/1000 + "s";
        },
        calcResult() {
            this.result.innerText = (this.end.innerText*1 - this.start.innerText*1)
        }
    }
    rosa.perfomance.role.innerText = __.getMetaContent("role");
    rosa.perfomance.wrap.append(rosa.perfomance.start)
    rosa.perfomance.wrap.append(rosa.perfomance.page)
    rosa.perfomance.wrap.append(rosa.perfomance.end)
    rosa.perfomance.wrap.append(rosa.perfomance.role)
    document.querySelector("html").append(rosa.perfomance.wrap);

    rosa.perfomance.requestTime = __.getMetaContent("time") * 1;
    rosa.perfomance.log("start",Date.now() - rosa.perfomance.requestTime);
} else {
    rosa.perfomance = {log(){},calcResult(){}}
    console.log = ()=>{};
}

__.setUrlLocation();
