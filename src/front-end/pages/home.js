function rolldownList(){
    let uls = document.querySelectorAll("ul.rolldown-list");
    uls = [...uls];
    return uls;
}

let rldownUls = rolldownList();
_(".blur").addClass("active")
let header = rosa.widgets.w.header_1.controller.node;

new Pageable(".blocks",{
    onInit: function() {
        window.addEventListener("hashchange", (e)=>{
            window.location = location.hash;
        }, false);
    },
    onFinish: function(data) {
        if (data.index !== 0) {
            header.addClass("no-opacity");
        } else {
            header.removeClass("no-opacity");
        }
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
            },100)
        })
        
    }
});
let s3Images = ["gp","rc","rp","rd","tf","mf"];
_(".photo-blocks .element").for((i,k)=>{
    i[0].classList.add("el_"+s3Images[k]);
})
let sliderNode = document.querySelector(".slider_js");
let s1 = document.querySelector(".slider_js");
let slider1 = new Slider(s1,{
    itemSelector: ".article-block-item"
})

let s2 = document.querySelector(".slider_js_2");
let slider2 = new Slider(s2,{
    itemSelector: ".article-block-item"
})
s2.querySelector(".btn").addEventListener("click",()=>{
    slider2.move(-1);
})
s1.querySelector(".btn").addEventListener("click",()=>{
    slider1.move(-1);
});
let inputs = document.querySelectorAll("#contact-form input, #contact-form textarea");
[...inputs].forEach((i)=>{
    i.addEventListener("click",(e)=>{
        e.target.focus();
    })
})

var platform = new H.service.Platform({
    'apikey': '970ZMUSTwk18fIFWmuPaqiRm35NwOr3YSzAeLywcjqA'
});

// Obtain the default map types from the platform object:
var defaultLayers = platform.createDefaultLayers();

// Instantiate (and display) a map object:
var map = new H.Map(
  document.getElementById('mapContainer'),
  defaultLayers.vector.normal.map,
  {
    zoom: 10,
    center: { lat: 52.5, lng: 13.4 }
  });

  var scene = document.querySelector('.paralax');
  var parallaxInstance = new Parallax(scene);