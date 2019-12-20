module.exports = {
  get: async (req, worker) => {
    try {
      return await worker.getByColumn("pages");
    } catch (error) {
      return error;
    }
  }
}