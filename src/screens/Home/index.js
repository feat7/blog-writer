import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import '../../styles/home.css';
import { GetSortOrder } from '../../helpers/Sort';

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
      wordCount: 0,
      keyword: '',
      suggestedKeywords : [],
      topTenKeywords : [],
      isLoaded: false,
      filterMode: 'cpc',
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

    this.handleChange = this.handleChange.bind(this);
    this.suggestKeywords = this.suggestKeywords.bind(this);
  }

  handleChange(event){
    this.setState({[event.target.name]: event.target.value});
    if(event.target.name === 'filterMode'){
      this.state.suggestedKeywords.sort(GetSortOrder(this.state.filterMode));
      var temp = this.state.suggestedKeywords.slice(0, 10);
      this.setState({topTenKeywords : temp});
      console.log(this.state.topTenKeywords);
    }
  }

  suggestKeywords(event){
    var url = 'https://dk1ecw0kik.execute-api.us-east-1.amazonaws.com/prod/query?query=' + this.state.keyword + '&language=en&country=us&google=http://www.google.com&service=0';
    fetch(url)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            suggestedKeywords: result.results.processed_keywords
          });
          console.log(this.state.suggestedKeywords);
          this.state.suggestedKeywords.sort(GetSortOrder(this.state.filterMode));
          var temp = this.state.suggestedKeywords.slice(0, 10);
          this.setState({topTenKeywords : temp});
          console.log(this.state.topTenKeywords);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  componentDidMount() {
    this.refs.editor.focus();
  }

  render() {
    var keywordsList = this.state.topTenKeywords.map((keyword, index) =>
      <li className="list-group-item" key={index}>
        {keyword.keyword}
      </li>
    );
    return (
      <div>
        <div className="row">
          <div className="col-8">
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
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="sideNavigator">
              <div className="card">
                <div className="card-body">
                  <div className="box">
                    Word Count: {this.state.wordCount}
                  </div>
                  <div className="box">
                    Find Keywords
                    <div className="input-group mb-3">
                      <input name="keyword" type="text" className="form-control" placeholder="Type a Keyword" aria-label="Recipient's username" aria-describedby="basic-addon2" onChange={this.handleChange} />
                      <div className="input-group-append">
                        <button className="btn btn-outline-secondary" type="button" onClick={this.suggestKeywords}>
                          Search
                        </button>
                      </div>
                    </div>
                    Total Suggested Keywords: {this.state.suggestedKeywords.length}
                    <br />
                    <p>Filter Keywords on the basis of </p>
                    <div className="row">
                      <div className="col-4">
                        <div className="form-check">
                          <input className="form-check-input" type="radio" name="filterMode" id="cpc" value="cpc" defaultChecked onChange={this.handleChange} />
                          <label className="form-check-label">
                            CPC
                          </label>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="form-check">
                          <input className="form-check-input" type="radio" name="filterMode" id="volume" value="Volume" onChange={this.handleChange} />
                          <label className="form-check-label">
                            Volume
                          </label>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="form-check">
                          <input className="form-check-input" type="radio" name="filterMode" id="competition" value="Competition" onChange={this.handleChange} />
                          <label className="form-check-label">
                            Competition
                          </label>
                        </div>
                      </div>
                    </div>
                    <br />
                    <ul className="list-group">
                      {keywordsList}
                    </ul>
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
