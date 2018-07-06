import { observable, computed } from "mobx";
// import { persist } from "mobx-persist";

class UIStore {
  @observable firstName = "Vinay";
  @observable lastName = "Khobragade";

  @computed
  get fullName() {
    return this.firtstName + " " + this.lastName;
  }
}

export default UIStore;
