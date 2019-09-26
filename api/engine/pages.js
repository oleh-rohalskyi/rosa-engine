module.exports = {
  async get(params, db) {
    try {
      return await db.q.get.getByColumn("pages");
    } catch (error) {
      
    }
  }
}