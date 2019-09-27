module.exports = {
    async get(req,db) {
        console.log(req.params);
        try { 
            let widgetsToGet = (req&&req.params)?req.params.widgets:[];
            return await db.q.get.getByColumn("widgets","name",widgetsToGet);
        } catch {

        }
    }
}
