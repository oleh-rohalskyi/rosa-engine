const data = JSON.parse( document.querySelector(".json").getAttribute("data-json") );
console.log(data);
Vue.component(
    "fragments",
    {
        template: "#fragments",
        data() {
            return {
                formatedFragments: []
            }
        },
        mounted() {
            console.log("fragments-mounted");
            const formatedFragments = [];
            for (const key in this.fragments) {
                if (this.fragments.hasOwnProperty(key)) {
                    const element = this.fragments[key];
                    formatedFragments.push({key,langs:element})
                }
            }
            this.formatedFragments = formatedFragments;
            console.log(this)
        },
        props: {
            fragments: Object
        },
        methods: {
            add() {
                this.fragments["new"] = 1;
            }
        },
    }
)

Vue.component('fragment',
{
    template: "#fragment",
    props: {
        fragment: Object
    },
    computed: {
        fragmentString() {
            return JSON.stringify( this.fragment )
        }
    },
    mounter() {
        
    }
})
const app = new Vue({
    el: '#app',
    created() {
        console.log(data.fragments);
        this.fragments = data.fragments;
        this.pages = data.pages;
    }
  });

  