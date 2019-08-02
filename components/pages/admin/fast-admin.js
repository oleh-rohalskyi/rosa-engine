const data = JSON.parse( document.querySelector(".json").getAttribute("data-json") );

Vue.config.devtools = true;

Vue.component(
    "fragments",
    {
        template: "#fragments",
        data() {
            return {
                translations: []
            }
        },
        created() {
            console.log("fragments-mounted");
            // const translations = [];
            for (const key in this.fragments) {
                if (this.fragments.hasOwnProperty(key)) {
                    const fragment = this.fragments[key];
                    this.translations.push({data:fragment.translations,key})
                }
            }
            // this.translations = translations;
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
    data() {
        return {
            langs: []
        }
    },
    props: {
        fragment: Object
    },
    computed: {
        fragmentName() {
            return this.fragment.key
        }
    },
    created() {
        console.log("fragment-mounted")
        if (this.fragment.data) {
            const data = this.fragment.data;
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    const values = data[key];
                    console.log(values)
                    this.langs.push({values,key})
                }
            }
        }
    }
})

Vue.component('content-edit',
{
    template: "#content-edit",
    data() {
        return {
            formated: []
        }
    },
    props: {
        content: Object
    },
    computed: {
        
    },
    created() {
        console.log("fragment-mounted")
        if (this.content) {
            const data = this.content;
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    const values = data[key];
                    console.log(values)
                    this.formated.push({values,key})
                }
            }
        }
    }
})
const x = new Vue({
    el: '#app',
    created() {
        console.log(data.fragments);
        this.fragments = data.fragments;
        this.pages = data.pages;
    }
  });

  