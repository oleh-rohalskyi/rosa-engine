module.exports = async function(success,error,{data,lang}) {
    
    let widgets = data.params;
    const con = this.dataBase.createConnection(this.conf);
   
    con.connect((err) => {
        if (err) return error(err);

        let query = `SELECT * FROM widgets `;
        if (widgets && widgets.length) {
            query+= `WHERE name IN (`
            for (let index = 0; index < widgets.length; index++) {
                query+= this.escape(widgets[index]) + ","
            }
            query=query.substr(0,query.length-1)+`)`;
        }

        const modQuery = (q,w,r) => {
            return widgets && widgets.length ? con.query(q,w,r) : con.query(q,r);
        }

        modQuery(query,widgets,(err, result) => {
            
            if (err) {
                error({success:false,errorMessage: err.message, data: null});
                return;
            }
            
            if (result.length <= 0) {
                error({success:false,errorMessage: "NO_COINCIDENCE",data: null});
                return;
            }

            success( result.map((item)=>{
                
                item.translations = JSON.parse(item.translations || "{}");

                if (data.lang) {

                    if (item.translations[data.lang]) {
                        item.translations = item.translations[data.lang];
                    } else if (item.translations[lang]) {
                        item.translations = item.translations[lang];
                    } else {
                        delete item.translations;
                    }

                }
                
                return item;

            }) );

        });

    });
}