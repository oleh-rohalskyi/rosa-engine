const DB = require('../../src/back-end/db');
const cashResult = require('../../mocks/translation.json');
const fs = require('fs');
module.exports = class Translations extends DB {
    constructor() {
        super();
        this.id =  {
            post: (req) => {
                return new Promise(async(res,rej)=>{
                    if (req.params.id*1===0) {
                        rej("no need to update");
                    }
                    const con = this.cc();
                    let json = this.escape( JSON.stringify(req.params.data) );
                    json = json.substring(1);
                    json = json.substring(0, json.length - 1);
                    
                    let query = `UPDATE translations `;
                        query += `SET ${req.params.lang} = "${json}" `;
                        query += `WHERE id = ${req.params.id}`;
                        
                    con.query( query, ( err, result ) => {
                        if(err) {
                            rej({success:false,error: err.message, data: null, code: err.code});
                        }
                        
                        if(!result || result.length === 0) {
                            rej("no result founded");
                            return;
                        }
                        if (result.affectedRows === 0) {
                            rej("not inserted");
                            return;
                        }

                        
                        res({success:true,affectedRows:result.affectedRows});
                        //con.destroy();

                    });
                })
            },
            get: (req) => {
                return new Promise(async(res,rej)=>{
                    const con = this.cc();
                    let query = `SELECT Tr.${req.params.lang} `;
                        query+= `FROM translations as Tr `;
                        query+= `WHERE Tr.id="${req.params.id}" `;
                    con.connect((err) => {
                        if(err) rej(err);
                        con.query( query, ( err, result ) => {
                            if(err) {
                                rej({success:false,error: err.message, data: null, code: err.code});
                            }
                            
                            if(!result || result.length === 0) {
                                rej("no result founded");
                                return;
                            }
                            
                            res({success:true,tr:result[0][req.params.lang]});
                            //con.destroy();

                        });
                    });
                });
            }
        };
        this.edit = {
            get: (req) => {
                return new Promise(async (res,rej)=>{

                    const con = this.cc();
                    
                    let query = `SELECT TrRe.table_name,TrRe.row_id,TrRe.translation_id `;
                        query+= `FROM translations_relations as TrRe `;
                        
                    con.connect((err) => {
                        if(err) rej(err);
                        con.query( query, ( err, result ) => {
                            if(err) rej(err);
                            if(!result) rej(false);
                            res(result);
                            //con.destroy();
                        });
                    });
                });
            }
        }
        this.full = {
            get:(names,lang,pageIds)=> {
                return new Promise(async(res,rej)=>{
                        const con = this.cc();
                        let ids = [];
                        
                        this.conf.widgets.forEach(widget=>{
                            if (names.indexOf(widget.name)>=0) {
                                ids.push(widget.id);
                            }
                        })
                        let query = `SELECT Tr.${lang},TrRe.table_name,TrRe.row_id `;
                            query+= `FROM translations_relations as TrRe `;
                            query+= `JOIN translations as Tr ON TrRe.translation_id=Tr.id `;
                            let mw = ids.length > 0;
                            let mwq = mw?" AND TrRe.row_id IN (":"";
                            query+= `WHERE (TrRe.table_name="widgets"${mwq}`;
                            
                            if (mw) {
                                for (let index = 0; index < ids.length; index++) {
                                    query+= this.escape(ids[index]) + ",";
                                }
                                query=query.substr(0,query.length-1) + ")";
                            }
                            let mp = pageIds.length > 0;
                            let mpq = mp?" AND TrRe.row_id IN (":"";
                            query += `) or (TrRe.table_name="pages"${mpq}`;
                            if (mp) {
                                for (let index = 0; index < pageIds.length; index++) {
                                    query+= this.escape(pageIds[index]) + ",";
                                }
                                query=query.substr(0,query.length-1) + ")";
                            }
                            query += `)`;
                            console.log("Aaaa",this.conf,cashResult)
                        if (cashResult[query] && !this.conf.mock.update) {
                            res(cashResult[query]);
                        }
                        con.connect((err) => {
                            if (err && err.code === "ENOTFOUND" && err.fatal) {
                                res(false);
                            }
                            if(err) rej(err);
                            console.log(query)
                            con.query( query, ( err, result ) => {
                                if (err && err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR' && !err.fatal) {
                                    res(false);
                                    return;
                                }
                                if(err) rej(err);
                                if(!result) rej("hm...");
                                if (!cashResult[query]&&!this.conf.mock.update) {
                                    cashResult[query] = result;
                                    fs.writeFile("./mocks/translation.json", JSON.stringify(cashResult), function(err) {
                                        if (err) {
                                          rej(err);
                                        }
                                        res(result);
                                      })
                                } else {
                                    res(result);
                                }
                                //con.destroy();
                            });
                        });
        
                });
            }
        }
    }
    
}