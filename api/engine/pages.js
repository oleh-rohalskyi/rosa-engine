module.exports = {
  async get(success, error, params) {

    const con = this.dataBase.createConnection(this.conf);
  
    con.connect((err) => {
  
      if (err) {
        error({ success: false, error: err.message, data: null });
        return;
      }
  
      const query = `SELECT * FROM pages`;
  
      con.query(query, (err, result) => {
  
        if (err) {
          error({ success: false, error: err.message, data: null });
          return;
        }
  
        if (result.length <= 0) {
          error({ success: false, error: "NO_COINCIDENCE", data: null });
          return;
        }
  
        success( listToTree(result, {
            idKey: 'id',
            parentKey: 'parent',
            childrenKey: 'childrens'
          }) );
  
      });
  
    });
  
  }
}



function listToTree(data, options) {

  options = options || {};

  var ID_KEY = options.idKey || 'id';
  var PARENT_KEY = options.parentKey || 'parent';
  var CHILDREN_KEY = options.childrenKey || 'children';
  var tree = [];
  var childrenOf = {};
  var item, id, parentId;

  for (var i = 0, length = data.length; i < length; i++) {
    item = data[i];
    id = item[ID_KEY];
    parentId = item[PARENT_KEY] || 0;
    // every item may have children
    childrenOf[id] = childrenOf[id] || [];
    // init its children
    item[CHILDREN_KEY] = childrenOf[id];
    if (parentId != 0) {
      // init its parent's children object
      childrenOf[parentId] = childrenOf[parentId] || [];
      // push it into its parent's children object
      childrenOf[parentId].push(JSON.parse(JSON.stringify(item)));
    } else {
      tree.push(item);
    }
  };

  return tree;

}