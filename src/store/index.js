import { createStore } from "vuex";

export default createStore({
  state: {
    imageData: null,
  },
  getters: {},
  mutations: {
    setUploadedImage(state, image) {
      state.imageData = image;
    },
  },
  actions: {},
  modules: {},
});
