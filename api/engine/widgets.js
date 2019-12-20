module.exports = {
    async get(req,worker) {
        try { 
            let widgetsToGet = (req&&req.params)?req.params.widgets:[];
            return await worker.getByColumn("widgets","name",widgetsToGet);
        } catch(error) {
            return error;
        }
    }
}
