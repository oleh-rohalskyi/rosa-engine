 function rolldownList(){
    let uls = document.querySelectorAll("ul.rolldown-list");
    uls = [...uls];
    uls.forEach(element => {
        let lis = element.querySelectorAll("li");
        for (let i = 0; i < lis.length; i++) {
            const e = lis[i];
            let delay = ((i+1) / 6) + 's';
            e.style.webkitAnimationDelay = delay,
            e.style.mozAnimationDelay = delay;
            e.style.animationDelay = delay;
        }
    });
    return uls;
}
let rldownUls = rolldownList();
_(".blur").addClass("active")

new Pageable(".blocks",{
    onInit: function() {
        window.addEventListener("hashchange", (e)=>{
            window.location = location.hash;
        }, false);
    },
    onFinish: function(data) {
        let even = data.index % 2;
        this.pins = [...document.querySelectorAll(".pg-pips a")];
        this.pins.forEach(pin=>{
            if(even) {
                pin.classList.add("black");
            } else {
                pin.classList.remove("black");
            }
        })
    },
    onStart: function(i) {
      
        if (i === "page-4") {
           _(".blur").addClass("active")
        } else {
            _(".blur").removeClass("active")
        }
        rldownUls.forEach((ul)=>{
            ul.classList.remove("rolldown-list");
            setTimeout(()=>{
                ul.classList.add("rolldown-list");
            })
        })
        
    }
});
let s3Images = ["gp","rc","rp","rd","tf","mf"];
_(".photo-blocks .element").for((i,k)=>{
    i[0].classList.add("el_"+s3Images[k]);
})

_(".article-block__slidenr").for((i)=>{
    
})