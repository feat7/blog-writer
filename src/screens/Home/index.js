import React, { Component } from "react";
import { inject, observer } from "mobx-react";

import { Editor, createEditorState } from "medium-draft";
import { convertToRaw, convertFromRaw } from "draft-js";

// import mediumDraftExporter from "medium-draft/lib/exporter";

let editorData = createEditorState(),
  wordCount;

@inject("store", "gun")
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
        editorState
      });

      this.props.gun.get("blogContent").put({
        blogContent: JSON.stringify(
          convertToRaw(this.state.editorState.getCurrentContent())
        ),
        wordCount: this.state.editorState
          .getCurrentContent()
          .getPlainText(" ")
          .split(" ").length,
        text: "Some random text"
      });

      this.props.gun.get("blogContent").on((data, key) =>
        // this.setState({
        //   editorState: createEditorState(JSON.parse(data.blogContent))
        // })
        console.log(
          createEditorState(JSON.parse(data.blogContent))
            .getCurrentContent()
            .getPlainText(" ")
        )
      );

      // this.setState({ editorState: createEditorState(JSON.parse(editorData)) });
    };
  }

  componentWillMount() {
    this.props.gun
      .get("blogContent")
      .on((data, key) => (editorData = data.blogContent));
    this.props.gun
      .get("blogContent")
      .on((data, key) => console.log("-----------", data.text));
  }

  componentDidMount() {
    this.refs.editor.focus();
  }

  render() {
    return (
      <div>
        <div className="hero">
          <div className="hero-body">
            <div className="columns">
              <div className="column is-10 has-text-centered">
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
              <div className="column" style={{ borderLeftWidth: 1 }}>
                <div className="box">
                  Keywords:
                  <br />
                  Word Count: {this.state.wordCount}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
