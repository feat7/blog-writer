import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { GetSortOrder } from "../../helpers/Sort";

import { Editor, createEditorState } from "medium-draft";
import { convertToRaw } from "draft-js";

// import mediumDraftExporter from "medium-draft/lib/exporter";

let editorData = createEditorState();

@inject("store", "gun")
@observer
export default class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editorState: createEditorState(), // for empty content
      wordCount: 0,
      keyword: "",
      suggestedKeywords: [],
      topTenKeywords: [],
      isLoaded: false,
      filterMode: "cpc"
    };

    this.onChange = editorState => {
      this.setState({
        editorState
      });

      this.props.store.ui.editorState = editorState;

      // this.setState({
      //   editorState: createEditorState(JSON.parse(data))
      // });

      // this.setState({ editorState: createEditorState(JSON.parse(editorData)) });
    };

    this.clearTopTen = this.clearTopTen.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.suggestKeywords = this.suggestKeywords.bind(this);
    this.saveBlog = this.saveBlog.bind(this);
  }

  saveBlog() {
    this.props.gun
      .get("blogContent")
      .put({
        blogContent: JSON.stringify(
          convertToRaw(this.state.editorState.getCurrentContent())
        ),
        wordCount: this.state.editorState
          .getCurrentContent()
          .getPlainText(" ")
          .split(" ").length,
        text: "Some random text"
      })
      .get("blogContent")
      .on((data, key) => {
        console.log(
          createEditorState(JSON.parse(data))
            .getCurrentContent()
            .getPlainText(" ")
        );
      });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
    if (event.target.name === "filterMode") {
      this.state.suggestedKeywords.sort(GetSortOrder(this.state.filterMode));
      var temp = this.state.suggestedKeywords.slice(0, 10);
      this.setState({ topTenKeywords: temp });
      console.log(this.state.topTenKeywords);
    }
  }

  suggestKeywords(event) {
    var url =
      "https://dk1ecw0kik.execute-api.us-east-1.amazonaws.com/prod/query?query=" +
      this.state.keyword +
      "&language=en&country=us&google=http://www.google.com&service=0";
    fetch(url)
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            isLoaded: true,
            suggestedKeywords: result.results.processed_keywords
          });
          console.log(this.state.suggestedKeywords);
          this.state.suggestedKeywords.sort(
            GetSortOrder(this.state.filterMode)
          );
          var temp = this.state.suggestedKeywords.slice(0, 10);
          this.setState({ topTenKeywords: temp });
          console.log(this.state.topTenKeywords);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        error => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  }

  clearTopTen() {
    this.setState({ topTenKeywords: [] });
  }

  componentWillMount() {
    this.props.gun
      .get("blogContent")
      .on((data, key) => (editorData = data.blogContent));

    try {
      JSON.parse(editorData);
      this.setState({
        editorState: createEditorState(JSON.parse(editorData))
      });
      this.props.store.ui.editorState = createEditorState(
        JSON.parse(editorData)
      );
    } catch (e) {
      console.log("Initial db");
    }
  }

  componentDidMount() {
    this.refs.editor.focus();
  }

  render() {
    var keywordsList = this.state.topTenKeywords.map((keyword, index) => (
      <li key={index}>{keyword.keyword}</li>
    ));
    return (
      <div>
        <div className="hero">
          <div className="hero-body">
            <div className="columns">
              <div className="column has-text-centered">
                <div className="container">
                  <div className="columns">
                    <div className="column is-two-thirds">
                      <div className="content">
                        <Editor
                          ref="editor"
                          editorState={this.props.store.ui.editorState}
                          onChange={this.onChange}
                        />
                        <button
                          className="button is-primary is-large is-rounded"
                          onClick={this.saveBlog}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                    <div className="column is-one-third">
                      <div className="column" style={{ borderLeftWidth: 1 }}>
                        <div className="box">
                          Word Count:{" "}
                          {
                            this.state.editorState
                              .getCurrentContent()
                              .getPlainText(" ")
                              .split(" ").length
                          }
                        </div>
                        <div className="box">
                          Find Keywords
                          <div className="field is-grouped">
                            <div className="control">
                              <input
                                name="keyword"
                                type="text"
                                className="input"
                                placeholder="Type a Keyword"
                                aria-label="Recipient's username"
                                aria-describedby="basic-addon2"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div className="control">
                              <button
                                className="button is-primary"
                                type="button"
                                onClick={this.suggestKeywords}
                              >
                                Search
                              </button>
                            </div>
                          </div>
                          Total Suggested Keywords:{" "}
                          {this.state.suggestedKeywords.length}
                          <button
                            className="button is-primary"
                            type="button"
                            onClick={this.clearTopTen}
                          >
                            Clear Results
                          </button>
                          <br />
                          <p>Filter Keywords on the basis of </p>
                          <div className="columns">
                            <div className="column is-one-quarter">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="filterMode"
                                  id="cpc"
                                  value="cpc"
                                  defaultChecked
                                  onChange={this.handleChange}
                                />
                                <label className="form-check-label">CPC</label>
                              </div>
                            </div>
                            <div className="column is-one-quarter">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="filterMode"
                                  id="volume"
                                  value="Volume"
                                  onChange={this.handleChange}
                                />
                                <label className="form-check-label">
                                  Volume
                                </label>
                              </div>
                            </div>
                            <div className="column is-half">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="filterMode"
                                  id="competition"
                                  value="Competition"
                                  onChange={this.handleChange}
                                />
                                <label className="form-check-label">
                                  Competition
                                </label>
                              </div>
                            </div>
                          </div>
                          <br />
                          <ol>{keywordsList}</ol>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
