const noteService = require('../NoteServices');
const folderService = require('../FolderServices');
require('dotenv').config();
const knex = require('knex');
const db = knex({
  client: 'pg',
  connection: process.env.TEST_URL
});