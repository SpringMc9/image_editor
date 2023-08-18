<template>
  <div
    class="drop-area"
    @dragenter.prevent
    @dragover.prevent
    @drop="handleDrop"
    @click="uploadImage"
  >
    <div v-if="!store.state.imageData" class="upload">
      <el-icon size="25"><Plus/></el-icon>
      <p>拖拽图片到此处或上传图片</p>
      <div id="upload_area_btn" class="btn" @click.stop="uploadImage">
        <div class="bmg"></div>
        <span> Open Image </span>
      </div>
    </div>
    <img v-else :src="store.state.imageData" class="image"/>
  </div>
</template>

<script>
import { reactive, toRefs } from "@vue/reactivity";
import { useStore } from "vuex";
import { message } from "ant-design-vue";

export default {
  name: "MainCanvas",
  components: {},
  setup() {
    const store = useStore();
    const state = reactive({
      fileSelected: false,
    });

    const handleDrop = (event) => {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        readFile(file);
      } else {
        message.error("请拖拽一张图片文件到此处")
      }
    };
    const readFile = (file) => {
      const reader = new FileReader();
      reader.onload = () => {
        store.commit('setUploadedImage', reader.result);
      };
      store.commit('setUploadedFile', file)
      reader.readAsDataURL(file);
    };

    const uploadImage = () => {
      if (store.state.imageData) return;
      state.fileSelected = false;
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.style.display = "none";
      fileInput.addEventListener("change", handleFileChange);
      document.body.appendChild(fileInput);
      fileInput.click();
      document.body.removeChild(fileInput);
    };
    const handleFileChange = (event) => {
      const selectedFile = event.target.files[0];
      if (selectedFile) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target.result;
          store.commit('setUploadedImage', content);
        };
        store.commit('setUploadedFile', selectedFile)
        reader.readAsDataURL(selectedFile);
        state.fileSelected = true;
      }
    };

    return {
      ...toRefs(state),
      store,
      handleDrop,
      uploadImage,
    };
  },
};
</script>

<style lang="scss">
.drop-area {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  transition: all 0.1s ease-in-out;
  background-color: #fff;
  border-radius: 6px 6px 6px 6px;
  border: 2px dashed #d2d3d4;
  display: flex;
  justify-content: space-around;
  align-items: center;
  cursor: pointer;

  .upload {
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    -webkit-box-pack: start;
    justify-content: flex-start;
    -webkit-box-align: center;
    align-items: center;
    line-height: 20px;
    font-size: 13px;
    color: #2c7dfa;

    p {
      display: block;
      text-align: center;
      font-size: 16px;
      font-weight: 600;
      color: #1e1f22;
      line-height: 18px;
      margin-top: 22px;
      position: relative;
    }

    .btn {
      margin-top: 23px;
      width: 200px;
      height: 40px;
      border-radius: 4px;
      position: relative;
      cursor: pointer;
      font-size: 14px;
      font-weight: 400;
      color: #fff;
      line-height: 24px;
      overflow: hidden;

      .bmg {
        display: inline-block;
        content: "";
        width: 500%;
        height: 100%;
        background: linear-gradient(
          130deg,
          #2c7dfa,
          #1559f7 20%,
          #2c7dfa 40%,
          #1559f7 60%,
          #2c7dfa 80%,
          #1559f7
        );
        transform: translateX(0);
      }

      span {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        justify-content: space-around;
        -webkit-box-align: center;
        align-items: center;
      }
    }
  }

  .image {
    max-width: 100%;
    max-height: 100%;
  }
}

.drop-area:hover {
  background: #f7faff;
  border-color: #2c7dfa;
}
</style>