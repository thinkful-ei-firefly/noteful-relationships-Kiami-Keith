const noteService = require('../Notes/NoteServices');
const folderService = require('../Folder/FolderServices');
require('dotenv').config();
const knex = require('knex');
const db = knex({
  client: 'pg',
  connection: process.env.TEST_URL
});

let testNotes = [
  {
    name: 'note 1',
    body: 'filler filler filler',
    folder: '1'
  },
  {
    name: 'note 2',
    body: 'filler filler filler',
    folder: '2'
  },
  {
    name: 'note 3',
    body: 'filler filler filler',
    folder: '1'
  },
];

let testFolders = [
  {
    name: 'Folder 1'
  },
  {
    name: 'Folder 2'
  }
];

describe('folder service', () => {
  before(() => {
    return db.raw('DROP TABLE IF EXISTS folders, notes CASCADE');
  });
  before(() => {
    return db.raw('CREATE TABLE folders (id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,name TEXT NOT NULL);')
  });
  before(() => {
    return db.insert(testFolders).into('folders');
  })

  it('Should get 2 folders from the database', () => {
    return folderService.getAll(db).then(res => {
      expect(res).to.be.an('Array');
      expect(res.length).to.equal(2);
    });
  });
  it('Should get folder with id 1', () => {
    return folderService.getSearch(db, 1).then(res => {
      expect(res.id).to.equal(1);
    });
  });
  it('Should create a new folder', () => {
    let newFolder = {
      name: 'Folder 3'
    }
    return folderService.create(db, newFolder).then(res => {
      expect(res.name).to.equal('Folder 3');
    });
  });
  it('Should delete folder 3', () => {
    return folderService.delete(db, 3).then(none => {
      return folderService.getAll(db).then(res => {
        expect(res).to.be.an('Array');
        expect(res.length).to.equal(2);
      });
    });
  });
});

describe('Note tests', () => {
  before(() => {
    return db.raw('DROP TABLE IF EXISTS notes');
  });
  before(() => {
    return db.raw(
    "CREATE TABLE notes (" +
      "id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY," +
      "name text not null," +
      "body text not null);");
  });
  before(() => {
    return db.raw('alter table notes add column folder integer references folders(id) not null;');
  });
  before(() => {
    return db.insert(testNotes).into('notes');
  });

  it('Should get 3 from the database', () => {
    return noteService.getAll(db).then(res => {
      expect(res).to.be.an('Array');
      expect(res.length).to.equal(3);
    });
  });
  it('Should get folder with id 1', () => {
    return folderService.getSearch(db, 1).then(res => {
      expect(res.id).to.equal(1);
    });
  });
  it('Should create a new note', () => {
    let newNote = {
      name: 'Note 4',
      body: 'filler',
      folder: '2'
    }
    return noteService.create(db, newNote).then(res => {
      expect(res.name).to.equal('Note 4');
    });
  });
  it('Should delete Note 4', () => {
    return noteService.delete(db, 4).then(none => {
      return noteService.getAll(db).then(res => {
        expect(res).to.be.an('Array');
        expect(res.length).to.equal(3);
      });
    });
  });
})