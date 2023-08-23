import { createStore } from "vuex";

export default createStore({
  state: {
    imageData: null,
    uploadedFile: null,
  },
  getters: {},
  mutations: {
    setUploadedImage(state, image) {
      state.imageData = image;
    },
    setUploadedFile(state, file) {
      state.uploadedFile = file;
    }
  },
  actions: {},
  modules: {},
});
