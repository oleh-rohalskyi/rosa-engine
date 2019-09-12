class {
    constructor(el) {
        this.el = el;
        this.contentWrap = this.el.find(".modal-content_js");
        this.closeBtn = this.el.find(".modal-close_js");
        this.success = this.el.find(".modal-success_js");
    }
    close() {
        this.closeBtn.off("click.closebtn");
        this.contentWrap.removeClass(this.wrapClass);
        this.el.removeClass("is-active");
        this.onClose();
    }
    open(content,{onClose=()=>{},onOpen=()=>{},wrapClass=""}) {
        this.onOpen = onOpen;
        this.onClose = onClose;
        this.closeBtn.on('click.closebtn', this.close.bind(this));
        this.el.addClass("is-active");
        this.wrapClass = wrapClass;
        this.contentWrap.addClass(wrapClass);
        this.contentWrap.html = content;
        this.onOpen(this.contentWrap);
    }
};