import React, { Component } from "react";
import { inject, observer } from "mobx-react";

@inject("store")
@observer
export default class HomeScreen extends Component {
  render() {
    return <div>Hello World</div>;
  }
}
