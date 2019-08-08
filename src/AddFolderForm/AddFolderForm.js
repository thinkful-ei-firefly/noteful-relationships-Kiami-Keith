import React from "react";

import NotefulForm from "../NotefulForm/NotefulForm";
import ApiContext from "../ApiContext";

class AddFolderForm extends React.Component {
  static contextType = ApiContext;

  buttonClickListener(e) {
    e.preventDefault();
    const folderName = e.target.name.value;
    const folder = { name: folderName };
    fetch("http://localhost:9090/folders", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json"
      }),
      body: JSON.stringify(folder)
    })
      .then(resp => resp.json())
      .then(data => {
        this.context.handleAddFolder(data)
        this.props.history.push('/')
      })
      .catch(err => console.error(err));

  }

  render() {
    console.log(this.context);
    return (
      <NotefulForm onSubmit={e => this.buttonClickListener(e)}>
        <h2>Add Folder</h2>
        <label htmlFor="name">Folder Name:</label>
        <input type="text" name="name" id="folder-name" />
        <button type="submit">Submit</button>
      </NotefulForm>
    );
  }
}

export default AddFolderForm;
