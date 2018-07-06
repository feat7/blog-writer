import React, { Component } from "react";
import { inject, observer } from "mobx-react";

import { Editor, createEditorState } from "medium-draft";

@inject("store")
@observer
export default class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editorState: createEditorState() // for empty content
    };

    this.onChange = editorState => {
      this.setState({ editorState });
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
