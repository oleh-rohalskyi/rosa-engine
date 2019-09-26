module.exports = {
    async get(params,db) {
        try { 
            let widgetsToGet = params?params.widgets:[];
            return await db.q.get.getByColumn("widgets","name",widgetsToGet);
        } catch {

        }
        
    }
}
