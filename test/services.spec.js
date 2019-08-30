const noteService = require('../NoteServices');
const folderService = require('../FolderServices');
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
    return db('folders').truncate();
  });
  before(() => {
    return db.insert(testFolders).into('folders');
  });

  it('Should get 2 folders from the database', () => {
    return folderService.getAll(db).then(res => {
      expect(res).to.be.an('Array');
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

