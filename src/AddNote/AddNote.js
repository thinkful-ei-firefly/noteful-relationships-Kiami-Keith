import React from "react";
import NotefulForm from "../NotefulForm/NotefulForm";
import ApiContext from "../ApiContext";

export default class AddNote extends React.Component {
  static contextType = ApiContext;

  renderFolderDropDown = () =>{
    const folders = this.context.folders
    const foldersJsx = folders.map(folder => {
      return <option key={folder.id} value={folder.id}>{folder.name}</option>
    }) 
    return foldersJsx
  }

  handleSubmit(e) {
    e.preventDefault();
    const noteName = e.target.name.value;
    const contentBox = e.target.name.value;
    console.log(noteName)
    console.log(contentBox)
  }

  render() {
   return (
    <NotefulForm onSubmit={e => this.handleSubmit(e)}>
    <h2>New Note Folder</h2>
    <label htmlFor="name-input"> Name:</label>
    <input type="text" name="label" id="name-input" />
    <label htmlFor="content-input"> Content:</label>
    <input type="text" name="content" id="content-input" />
    <label htmlFor="folder-input"> Folder:</label>
    <select>{this.renderFolderDropDown()}</select>
    <button type="submit">Submit</button>
  </NotefulForm>
   )
  }
}