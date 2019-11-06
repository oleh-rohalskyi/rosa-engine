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

