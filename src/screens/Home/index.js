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
      <div>
        <div className="hero">
          <div className="hero-body">
            <div className="container">
              Total words: {this.state.wordCount}
              <div className="content">
                <Editor
                  ref="editor"
                  editorState={this.state.editorState}
                  onChange={this.onChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
