import { observable, computed } from "mobx";
import { createEditorState } from "medium-draft";
import { inject } from "mobx-react";
// import { persist } from "mobx-persist";

@inject("gun")
class UIStore {
  @observable firstName = "Vinay";
  @observable lastName = "Khobragade";

  @observable
  editorState = createEditorState(
    JSON.stringify(this.props.gun.get("blogContent").blogContent)
  );
  @observable edited = "no";

  @computed
  get fullName() {
    return this.firtstName + " " + this.lastName;
  }
}

export default UIStore;
