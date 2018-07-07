import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { GetSortOrder } from "../../helpers/Sort";
import { GridLoader } from "react-spinners";
import { Editor, createEditorState } from "medium-draft";
import { convertToRaw, EditorState } from "draft-js";
import { getDefaultKeyBinding, KeyBindingUtil } from "draft-js";

// import mediumDraftExporter from "medium-draft/lib/exporter";

let editorData = createEditorState();

const { hasCommandModifier } = KeyBindingUtil;

function myKeyBindingFn(e: SyntheticKeyboardEvent): string {
  if (e.keyCode === 83 /* `S` key */ && hasCommandModifier(e)) {
    return "myeditor-save";
  }
  return getDefaultKeyBinding(e);
}

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
      areKeywordsLoading: true,
      postAnalysisInProgress: true,
      filterMode: "cpc",
      sentiment: "neutral",
      metaDescription: ""
    };

    this.onChange = editorState => {
      this.setState({
        editorState
      });
      this.props.store.ui.editorState = editorState;
    };

    this.clearTopTen = this.clearTopTen.bind(this);
    this.analyzePost = this.analyzePost.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.suggestKeywords = this.suggestKeywords.bind(this);
    this.saveBlog = this.saveBlog.bind(this);
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
  }

  handleKeyCommand(command: string): DraftHandleValue {
    if (command === "myeditor-save") {
      // Perform a request to save your contents, set
      // a new `editorState`, etc.
      this.saveBlog();
      return "handled";
    }
    return "not-handled";
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
        this.props.store.ui.editorState = createEditorState(JSON.parse(data));
        this.setState({
          editorState: this.props.store.ui.editorState
        });
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
    this.setState({ areKeywordsLoading: true });
    var url =
      "https://dk1ecw0kik.execute-api.us-east-1.amazonaws.com/prod/query?query=" +
      this.state.keyword +
      "&language=en&country=us&google=http://www.google.com&service=0";
    fetch(url)
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            areKeywordsLoading: false,
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
            areKeywordsLoading: false,
            error
          });
        }
      );
  }

  analyzePost() {
    this.setState({ postAnalysisInProgress: true });
    var url =
      "http://18.216.67.79:8000/sentiment?text=" +
      this.state.editorState.getCurrentContent().getPlainText();
    fetch(url)
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            postAnalysisInProgress: false,
            sentiment: result.sentiment
          });
          console.log(result);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        error => {
          this.setState({
            postAnalysisInProgress: false,
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
    this.setState({ areKeywordsLoading: false });
    this.setState({ postAnalysisInProgress: false });
    this.refs.editor.focus();
  }

  render() {
    var keywordsList = this.state.topTenKeywords.map((keyword, index) => (
      <span className="tag is-success">{keyword.keyword}</span>
    ));
    return (
      <div>
        <div className="hero">
          <div className="hero-body">
            <div className="columns">
              <div className="column has-text-centered">
                <div className="container">
                  <div className="columns">
                    <div className="column is-three-fifths">
                      <div className="content">
                        <Editor
                          ref="editor"
                          editorState={EditorState.acceptSelection(
                            this.props.store.ui.editorState,
                            this.props.store.ui.editorState.getSelection()
                          )}
                          handleKeyCommand={this.handleKeyCommand}
                          keyBindingFn={myKeyBindingFn}
                          onChange={this.onChange}
                        />
                      </div>
                    </div>
                    <div className="column is-two-fifths">
                      <div className="column" style={{ borderLeftWidth: 1 }}>
                        <div className="box">
                          <h3 className="title">
                            Word Count:{" "}
                            {
                              this.state.editorState
                                .getCurrentContent()
                                .getPlainText(" ")
                                .split(" ").length
                            }
                          </h3>
                          <button
                            className="button is-primary is-rounded"
                            onClick={this.saveBlog}
                          >
                            Save Content
                          </button>
                        </div>
                        <div className="box">
                          <h3 className="title">Sentiment Analysis</h3>
                          <button
                            className="button is-primary is-rounded"
                            type="button"
                            onClick={this.analyzePost}
                          >
                            Perform Sentiment Analysis
                          </button>
                          <p>
                            Sentiment:
                            <span className="icon">
                              {(() => {
                                if (this.state.sentiment === "positive")
                                  return (
                                    <span>
                                      Positive <i className="far fa-smile" />
                                    </span>
                                  );
                                if (this.state.sentiment === "neutral")
                                  return (
                                    <span>
                                      Neutral <i className="far fa-neutral" />
                                    </span>
                                  );
                                else
                                  return (
                                    <span>
                                      Negative <i className="far fa-frawn" />
                                    </span>
                                  );
                              })()}
                            </span>
                          </p>
                          <center>
                            <GridLoader
                              loading={this.state.postAnalysisInProgress}
                            />
                          </center>
                        </div>
                        <div className="box">
                          <h2 className="title">Find Keywords</h2>
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
                          <br />
                          <button
                            className="button is-primary is-rounded"
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
                          <center>
                            <GridLoader
                              loading={this.state.areKeywordsLoading}
                            />
                          </center>
                          <div className="tags">{keywordsList}</div>
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
