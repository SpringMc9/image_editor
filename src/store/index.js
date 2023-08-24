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
    },
    setImageWidth(state, width) {
      state.imageWidth = width
    },
    setImageHeight(state, height) {
      state.imageHeight = height
    }
  },
  actions: {},
  modules: {},
});
