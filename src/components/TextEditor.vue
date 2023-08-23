<template>
  <div class="area">
    <canvas id="canvas" v-if="store.state.imageData" class="image"></canvas>
    <p v-else>请上传图片</p>
  </div>
  <div v-if="showNav" class="navigation">
    <button class="text-btn" @click="addText">
      <span class="btn-text">+ Add text</span>
    </button>
    <v3-color-picker
      v-model:value="color"
      @change="changeColor"
    ></v3-color-picker>
    <select class="selectOption" v-model="font" @change="changeFamily">
      <option
        v-for="option in intlfonts"
        :value="option.value"
        :key="option.value"
      >
        {{ option.label }}
      </option>
    </select>
    <div class="font-text">
      <input
        type="number"
        v-model="size"
        class="font-input"
        @change="changeSize"
      />
    </div>
    <div class="bold" @click="changeBold">
      <span class="bold-text">B</span>
    </div>
    <div class="italic" @click="changeItalic">
      <span class="italic-text">I</span>
    </div>
  </div>
</template>

<script>
import { onMounted, onBeforeUnmount } from "@vue/runtime-core";
import { reactive, toRefs } from "@vue/reactivity";
import { useStore } from "vuex";
import { fabric } from "fabric";
import { intlfonts } from "../type/type";

export default {
  name: "TextEditor",
  components: {},
  setup() {
    const store = useStore();
    const state = reactive({
      imageObject: null,
      showNav: false,
      intlfonts: intlfonts,
      font: intlfonts[0].value,
      color: "rgba(0,0,0,1)",
      bold: "normal",
      italic: "normal",
      size: 40,
    });
    let canvas = null;
    let text = null;

    // 加载画布与图片
    const loadCanvas = () => {
      if (store.state.imageData && !state.imageObject) {
        const image = new Image();
        image.src = store.state.imageData;
        image.onload = () => {
          state.imageObject = new fabric.Image(image, {
            selectable: false,
          });
          canvas.add(state.imageObject);
          updateImageScale();
        };
      }
    };

    // 自适应画布大小
    const updateCanvasSize = () => {
      const divElement = document.querySelector(".area");
      canvas.setWidth(divElement.clientWidth);
      canvas.setHeight(divElement.clientHeight);
      updateImageScale(); 
    };

    // 使图片自适应
    const updateImageScale = () => {
      if (state.imageObject) {
        const canvasWidth = canvas.width;
        const imageWidth = state.imageObject.width;
        const canvasHeight = canvas.height;
        const imageHeight = state.imageObject.height;
        const widthRatio = canvasWidth / imageWidth;
        const heightRatio = canvasHeight / imageHeight;
        const scaleFactor = Math.min(widthRatio, heightRatio);

        state.imageObject.set({
          scaleX: scaleFactor,
          scaleY: scaleFactor,
          left: (canvasWidth - imageWidth * scaleFactor) / 2,
          top: (canvasHeight - imageHeight * scaleFactor) / 2,
        });
        canvas.renderAll();
      }
    };

    // 添加文字
    const addText = () => {
      if (state.imageObject) {
        text = new fabric.IText("请添加文字", {
          left: canvas.width / 2,
          top: canvas.height / 2,
          fill: "rgba(0,0,0,1)",
          fontFamily: state.font,
          fontSize: 40,
          fontWeight: "normal",
          fontStyle: "normal",
          padding: 1,
          borderColor: "#6879eb",
          cornerColor: "#6879eb",
          cornerSize: 10,
          transparentCorners: false,
          borderScaleFactor: 2,
          borderDashArray: [5, 5],
          cornerStyle: "circle",
          cornerDashArray: [10, 2],
        });

        const deleteIcon = new fabric.Text("×", {
          left: text.left + text.width,
          top: text.top,
          fill: "red",
          fontFamily: "Arial",
          fontSize: 50,
          selectable: false,
          opacity: 0,
        });
        deleteIcon.on("mousedown", () => {
          canvas.remove(text);
          canvas.remove(deleteIcon);
        });
        text.on("moving", () => {
          const scalingFactor = text.scaleX;
          deleteIcon.set({
            left: text.left + text.width * scalingFactor,
            top: text.top,
          });
        });
        text.on("scaling", (event) => {
          const scalingFactor = text.scaleX;
          deleteIcon.set({
            left: text.left + text.width * scalingFactor,
            top: text.top,
          });
        });
        text.on("selected", () => {
          deleteIcon.set({ opacity: 1 });
        });
        text.on("deselected", () => {
          deleteIcon.set({ opacity: 0 });
        });
        canvas.add(text);
        canvas.add(deleteIcon);
        canvas.setActiveObject(text);
        canvas.renderAll();
      }
    };

    // 改变文字颜色
    const changeColor = () => {
      if (text) {
        text.set({
          fill: state.color,
        });
        canvas.renderAll();
      }
    };

    // 改变文字大小
    const changeSize = () => {
      if (text) {
        text.set({
          fontSize: state.size,
        });
        canvas.renderAll();
      }
    };

    // 是否加粗和斜体
    const changeBold = () => {
      if (text) {
        if (state.bold === "bold") {
          state.bold = "normal";
        } else {
          state.bold = "bold";
        }
        text.set({
          fontWeight: state.bold,
        });
        canvas.renderAll();
      }
    };
    const changeItalic = () => {
      if (text) {
        if (state.italic === "italic") {
          state.italic = "normal";
        } else {
          state.italic = "italic";
        }
        text.set({
          fontStyle: state.italic,
        });
        canvas.renderAll();
      }
    };

    // 改变文字种类
    const changeFamily = () => {
      if (text) {
        text.set({
          fontFamily: state.font,
        });
        canvas.renderAll();
      }
    };

    // 暂存图片
    const saveCanvasImage = () => {
      if (canvas) {
        const mergedCanvas = document.createElement("canvas");
        mergedCanvas.width = canvas.width;
        mergedCanvas.height = canvas.height;
        const context = mergedCanvas.getContext("2d");
        context.drawImage(canvas.lowerCanvasEl, 0, 0);
        const dataURL = mergedCanvas.toDataURL();
        store.commit('setUploadedImage', dataURL);
        fetch(dataURL)
          .then(response => response.blob())
          .then(blob => {
            const file = new File([blob], store.state.uploadedFile.name, {
              type: store.state.uploadedFile.type, // 设置文件类型
            });
            store.commit('setUploadedFile', file)
          });
      }
    };

    onMounted(() => {
      canvas = new fabric.Canvas("canvas");
      updateCanvasSize();
      loadCanvas();
      state.showNav = !state.showNav;
      window.addEventListener("resize", updateCanvasSize);
    });
    onBeforeUnmount(() => {
      saveCanvasImage()
      window.removeEventListener("resize", updateCanvasSize);
    });


    return {
      ...toRefs(state),
      store,
      addText,
      changeColor,
      changeSize,
      changeBold,
      changeItalic,
      changeFamily,
      saveCanvasImage
    };
  },
};
</script>

<style lang="scss">
.area {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 85%;
  background-color: #fff;
  display: flex;
  justify-content: space-around;
  align-items: center;
  cursor: pointer;

  p {
    display: block;
    text-align: center;
    font-size: 18px;
    font-weight: 600;
    color: #1e1f22;
    line-height: 18px;
    margin-top: 22px;
    position: relative;
  }
}

.navigation {
  width: 100%;
  height: 15%;
  background-color: antiquewhite;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-wrap: nowrap;

  .text-btn {
    display: flex;
    height: 100%;
    flex-grow: 1;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    border-radius: 2px;
    cursor: pointer;
    color: rgb(93, 109, 126);
    background-color: rgb(223, 228, 233);

    .btn-text {
      display: flex;
      font-family: Roboto;
      font-style: normal;
      font-weight: 500;
      font-size: 24px;
    }
  }

  .font-text {
    margin: 0px 4px;
    position: relative;
    display: inline-flex;
    align-items: center;
    cursor: text;
    background: rgb(248, 250, 251);
    border: 1px solid rgb(223, 231, 237);
    border-radius: 2px;
    color: rgb(55, 65, 75);
    padding: 4px 8px;
    height: 24px;
    font-family: Roboto;
    font-style: normal;
    font-weight: normal;
    font-size: 13px;
    line-height: 16px;
    .font-input {
      display: block;
      color: inherit;
      width: 100%;
      min-width: 0px;
      margin: 0px;
      padding: 0px;
      border: 0px;
      background-color: transparent;
      outline: none;
    }
  }

  .selectOption {
    width: 100px;
    height: 33px;
    font-size: 16px;
    border-radius: 7px;
    border: none;
    outline: none;
  }

  .selectOption option:hover {
    background-color: aqua;
  }

  .bold {
    // width: 50px;
    // height: 30px;
    display: flex;
    height: 100%;
    flex-grow: 1;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    border-radius: 2px;
    cursor: pointer;
    color: rgb(93, 109, 126);
    background-color: rgb(223, 228, 233);

    .bold-text {
      display: flex;
      font-style: normal;
      font-weight: 900;
      font-size: 16px;
    }
  }
  .italic {
    display: flex;
    height: 100%;
    flex-grow: 1;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    border-radius: 2px;
    cursor: pointer;
    color: rgb(93, 109, 126);
    background-color: rgb(223, 228, 233);

    .italic-text {
      display: flex;
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      font-style: italic;
    }
  }
}
</style>