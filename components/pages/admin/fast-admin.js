const data = JSON.parse( document.querySelector(".json").getAttribute("data-json") );

Vue.config.devtools = true;

Vue.component(
    "widgets",
    {
        template: "#widgets",
        data() {
            return {
                translations: []
            }
        },
        created() {
            console.log("widgets-mounted");
            // const translations = [];
            for (const key in this.widgets) {
                if (this.widgets.hasOwnProperty(key)) {
                    const widget = this.widgets[key];
                    this.translations.push({data:widget.translations,key})
                }
            }
            // this.translations = translations;
        },
        props: {
            widgets: Object
        },
        methods: {
            add() {
                this.widgets["new"] = 1;
            }
        },
    }
)

Vue.component('widget',
{
    template: "#widget",
    data() {
        return {
            langs: []
        }
    },
    props: {
        widget: Object
    },
    computed: {
        widgetName() {
            return this.widget.key
        }
    },
    created() {
        console.log("widget-mounted")
        if (this.widget.data) {
            const data = this.widget.data;
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
        console.log("widget-mounted")
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
        console.log(data.widgets);
        this.widgets = data.widgets;
        this.pages = data.pages;
    }
  });

  