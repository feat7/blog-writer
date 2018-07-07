import React from "react";
import { Route, Switch } from "react-router";
import Home from "../screens/Home";
import { inject } from "mobx-react";
// import DevTools from "mobx-react-devtools";

@inject("store")
export default class MainRoutes extends React.Component {
  render() {
    console.log("Inside MainRoutes");
    return (
      <div>
        <Switch>
          <Route exact path="/" component={Home} />
        </Switch>
      </div>
    );
  }
}
