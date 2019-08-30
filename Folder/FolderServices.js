const folderService = {
  getAll(db){
    return db('folders').select('*');
  }, 
  getSearch(db, id){
    return db('folders').select('*').where('id', id).first();
  }, 
  create(db, folder){
    return db.insert(folder).into('folders')
      .returning('*').then(rows => {
        return rows[0];
      });
  },
  delete(db, id){
    return db('folders')
      .where({ id })
      .delete();
  }
}

module.exports = folderService;