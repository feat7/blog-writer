import React, { Component } from "react";
import { inject, observer } from "mobx-react";

import { Editor, createEditorState } from "medium-draft";
// import { convertToRaw } from "draft-js";

// import mediumDraftExporter from "medium-draft/lib/exporter";

@inject("store")
@observer
export default class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editorState: createEditorState(), // for empty content
      wordCount: 0
    };

    this.onChange = editorState => {
      this.setState({
        editorState,
        wordCount: this.state.editorState
          .getCurrentContent()
          .getPlainText(" ")
          .split(" ").length
      });
    };
  }

  componentDidMount() {
    this.refs.editor.focus();
  }

  render() {
    return (
<<<<<<< HEAD
      <div className="container">
        <div className="row">
          <div className="col-8">
            <div className="hero">
              <div className="hero-body">
                <div className="container">
                  Total words: {this.state.wordCount}
=======
      <div>
        <div className="hero">
          <div className="hero-body">
            <div className="columns">
              <div className="column is-10 has-text-centered">
                <div className="container">
>>>>>>> ef9f612a4875eaa3b42ef8d4e3fda2537d95779a
                  <div className="content">
                    <Editor
                      ref="editor"
                      editorState={this.state.editorState}
                      onChange={this.onChange}
                    />
                  </div>
                </div>
              </div>
<<<<<<< HEAD
            </div>
          </div>
          <div className="col-4">
            <div className="card">
              <div className="card-body">
                Hello World
=======
              <div className="column" style={{ borderLeftWidth: 1 }}>
                <div className="box">
                  Keywords:
                  <br />
                  Word Count: {this.state.wordCount}
                </div>
>>>>>>> ef9f612a4875eaa3b42ef8d4e3fda2537d95779a
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
