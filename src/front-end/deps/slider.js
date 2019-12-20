class Slider  {
    constructor(container,options) {
        this.options = options;
        this.wrap = container;
        if (!options.itemSelector) {
            console.error("no option for item selector");
        }
        this.items = [...container.querySelectorAll(options.itemSelector)];
        this.construct();
        
    }
    construct() {
        this.ww = this.wrap.offsetWidth;
        this.wh = this.options.wrapHeight || "100%";
        this.wrap.style.overflow = "hidden";
        this.wrap.style.position = "relative";
        this.wrap.style.width = this.ww;
        this.wrap.style.height = this.wh;
        this.track = this.wrap.querySelector(".track");
        this.updateTrack();
        this.items.forEach((item,k)=>{
            item.style.width = this.ww + "px";
            item.style.position = "absolute";
            item.style.top = "0px";
            item.style.padding = "10px";
            item.style.left = ( this.ww * k ) + "px";
        })
        this.x = -1;
        this.times = 1;
        this.l = this.items.length;
    }
    updateTrack() {
        this.aw = ( this.items.length * this.ww );
        this.track.style.width = this.aw + "px";
        this.track.style.position = "absolute";
        this.track.style.left = 0;
        this.track.style.top = 0;
        this.track.style.transition = "left 0.3s";
    }
    getCurrentPosition() {
        return this.track.style.left.split("px")[0]*1;
    }
    move() {
        let raf = requestAnimationFrame;
        let start = this.getCurrentPosition();
        let end = (start + (this.x * this.ww));
        raf(()=>{
            this.track.style.left = end + "px";
        })
        this.times = this.times + 1;
        if (this.times === this.l) {
            this.x=this.x*(-1);
            this.times = 1;
        }
    }
}