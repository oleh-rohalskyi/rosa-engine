module.exports = {
    async get(success,error,params) {

        let commonLang = this.langs.commonLang;
        let widgetsToGet = params?params.widgets:( ()=>{params={lang:false};return [];} )();
        const con = this.dataBase.createConnection(this.conf);
       
        con.connect((err) => {

            if (err) return error(err);
    
            let query = `SELECT * FROM widgets `;
    
            if (widgetsToGet && widgetsToGet.length) {
                query+= `WHERE name IN (`
                for (let index = 0; index < widgetsToGet.length; index++) {
                    query+= this.escape(widgetsToGet[index]) + ","
                }
                query=query.substr(0,query.length-1)+`)`;
            }
    
            const modQuery = (q,w,r) => {
                return widgetsToGet && widgetsToGet.length ? con.query(q,w,r) : con.query(q,r);
            }
    
            modQuery(query,widgetsToGet,(err, result) => {
                
                if (err) {
                    error({success:false,errorMessage: err.message, data: null});
                    return;
                }
                
                if (result.length <= 0) {
                    error({success:false,errorMessage: "NO_COINCIDENCE",data: null});
                    return;
                }
    
                success( result.map((item)=>{
                    
                    item.data = JSON.parse(item.data || "{}");
    
                    if (params.lang) {
    
                        if (item.data[params.lang]) {
                            item.data = item.data[params.lang];
                        }
    
                    }
                    
                    return item;
    
                }) );
    
            });
    
        });
    }
}
