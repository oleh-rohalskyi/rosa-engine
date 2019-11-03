(async () => {

    let trans_relations = await __.api.get("translations/edit");
    let result = document.querySelector(".translation-result");
    let selectsSearch = document.querySelectorAll(".search-form select");
    let wn = document.querySelector(".search-form select[name='w_id']");
    let pn = document.querySelector(".search-form select[name='p_id']");
    let current = {
        id : 0,
        lang : __.api.lang
    };
    
    var options = {
        mode: 'tree',
        enableSort: false,
        enableTransform: false
    };

    var editor = new JSONEditor(result, options);
    editor.set({});
    let searchRequest = {

    };

    [...selectsSearch].forEach((node)=>{
        searchRequest[node.getAttribute("name")] = node.value;
        node.addEventListener("change",(e)=>{
            let elKey = e.target.getAttribute("name");
            let val = e.target.value;
            switch (elKey) {
                case "p_id":
                case "w_id":
                    searchRequest[elKey] = val*1;
                    break;
                case "table_name":
                    if (val=="pages") {
                        wn.style.display = "none";
                        pn.style.display = "inline-block";
                    } 
                    if (val=="widgets") {
                        wn.style.display = "inline-block";
                        pn.style.display = "none";
                    }
                    searchRequest.table_name = val;
                    break;
                default:
                    searchRequest[elKey] = val;
                    break;
            }
        })
    })

    document
        .querySelector(".search-translation")
        .addEventListener("click",async function(e){
            e.preventDefault();
            let sr = searchRequest;
            switch (sr.table_name) {
                case "pages":
                        sr.id = sr.p_id
                    break;
                case "widgets":
                        sr.id = sr.w_id
                    break;
            }
            console.log(trans_relations,sr);
            let transId = trans_relations.filter((i)=>{
                return i.row_id === sr.id && i.table_name === sr.table_name;
            });
            console.log(transId);
            if (!transId[0]) {
                transId = 0;
            } else {
                transId = transId[0].translation_id;
            }
            let params = {
                id: transId,
                lang: sr.lang
            }
            let data = await __.api.get("translations/id",params)
            if (data.success) {
                current.id = transId;
                current.lang = params.lang;
                if (!data.tr || !data.tr.length) {
                    editor.set({});
                } else
                editor.set(JSON.parse( data.tr ));
            }
            else 
                editor.set(data.error.message);
        })
    
    document
        .querySelector(".save")
        .addEventListener("click", async function(e){
            current.data = editor.get();
            console.log(current.data);
            let result = await __.api.post("translations/id",current);
            console.log(result)
        })

})() 

