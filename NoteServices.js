const noteService = {
  getAll(db){
    return db('notes').select('*');
  }, 
  getSearch(db, id){
    return db('notes').select('*').where('id', id).first();
  }, 
  create(db, note){
    return db.insert(note).into('notes')
      .returning('*').then(rows => {
        return rows[0];
      });
  },
  delete(db, id){
    return db('bookmarks')
      .where({ id })
      .delete();
  }
}

module.exports= noteService;