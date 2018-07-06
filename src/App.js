import React, { Component } from "react";
import { Router } from "react-router";
import createBrowserHistory from "history/createBrowserHistory";
import MainRoutes from "./routes/MainRoutes";
import { Provider } from "mobx-react";
import { syncHistoryWithStore } from "mobx-react-router";
import store from "./stores";
import "./styles/styles.css";

const browserHistory = createBrowserHistory();
const history = syncHistoryWithStore(browserHistory, store.routing);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          <MainRoutes />
        </Router>
      </Provider>
    );
  }
}

export default App;
