import React, { Component } from "react";
import { Router } from "react-router";
import createBrowserHistory from "history/createBrowserHistory";
import MainRoutes from "./routes/MainRoutes";
import { Provider } from "mobx-react";
import { syncHistoryWithStore } from "mobx-react-router";
import Gun from "gun/gun";
import store from "./stores";
import "./styles/styles.css";

const browserHistory = createBrowserHistory();
const history = syncHistoryWithStore(browserHistory, store.routing);

class App extends Component {
  constructor() {
    super();
    this.gun = Gun(window.location.origin + "/gun");
  }
  render() {
    return (
      <Provider store={store} gun={this.gun}>
        <Router history={history} basename={process.env.PUBLIC_URL}>
          <MainRoutes />
        </Router>
      </Provider>
    );
  }
}

export default App;
