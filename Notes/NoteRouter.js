const path = require('path')
const express = require('express')
const xss = require('xss')
const noteService = require('./Notes/NoteServices')

const noteRouter = express.Router()
const jsonParser = express.json()

const serializeNote = note => ({
  id: note.id,
  name: xss(note.name),
  modified: note.modified,
  folder_id: note.folder_id,
  content: xss(note.content)
})

noteRouter
  .route('/')
  .get((req, res, next) => {
    noteService.getAllnotes(req.app.get('db'))
      .then(notes => {
        res.json(notes.map(serializeNote))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { name, folder_id, content, modified } = req.body
    const newNote = { name, folder_id, content }

    for (const [key, value] of Object.entries(newNote)) {
      if (value == null) {
        return res
          .status(400)
          .json({
            error: {
              message: `Missing '${key}' in request body`
            }
          })
      }
    }
    newNote.modified = modified

    noteService.insertNote(
      req.app.get('db'),
      newNote
    )
      .then(note => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${note.id}`))
          .json(serializeNote(note))
      })
      .catch(next)
  })

noteRouter
  .route('/:note_id')
  .all((req, res, next) => {
    noteService.getById(
      req.app.get('db'),
      req.params.note_id
    )
      .then(note => {
        if (!note) {
          return res.status(404).json({
            error: { message: `Note doesn't exist` }
          })
        }
        res.note = note
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeNote(res.note))
  })
  .delete((req, res, next) => {
    noteService.deleteNote(
      req.app.get('db'),
      req.params.note_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { name, content } = req.body
    const noteToUpdate = { name, content }

    const numberOfValues = Object.values(noteToUpdate).filter(Boolean).length
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'name' or 'content'`
        }
      })
    }
    noteService.updateNote(
      req.app.get('db'),
      req.params.note_id,
      noteToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = noteRouter