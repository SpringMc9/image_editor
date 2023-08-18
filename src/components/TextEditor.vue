<template>
  <div class="area">
    <canvas id="canvas" v-if="store.state.imageData" class="image"></canvas>
    <p v-else>请上传图片</p>
    <!-- <button @click="addText">添加文字</button> -->
  </div>
</template>

<script>
import { onMounted, onBeforeUnmount } from "@vue/runtime-core";
import { reactive, toRefs } from "@vue/reactivity";
import { useStore } from "vuex";
import { fabric } from "fabric";

export default {
  name: "TextEditor",
  components: {},
  setup() {
    const store = useStore();
    const state = reactive({
      canvas: null,
      imageObject: null,
    });

    // 加载画布
    const loadCanvas = () => {
      if (store.state.imageData && !state.imageObject) {
        const image = new Image();
        image.src = store.state.imageData;
        image.onload = () => {
          state.imageObject = new fabric.Image(image, {
            selectable: false,
          });
          state.canvas.add(state.imageObject);
          updateImageScale();
        };
      }
    };

    // 使图片自适应
    const updateImageScale = () => {
      if (state.imageObject) {
        const canvasWidth = state.canvas.width;
        const imageWidth = state.imageObject.width;
        const canvasHeight = state.canvas.height;
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
        state.canvas.renderAll();
      }
    };

    // 添加文字
    const addText = () => {
      if (state.imageObject) {
        const text = new fabric.IText("在这里添加文字", {
          left: 100,
          top: 100,
          fill: "black",
          fontFamily: "Arial",
          fontSize: 20,
          selectable: true, // 设置文字可选中和编辑
        });
        state.canvas.add(text);
        state.canvas.setActiveObject(text);
        state.canvas.renderAll();
      }
    };

    // 自适应画布大小
    const updateCanvasSize = () => {
      const divElement = document.querySelector(".area");
      state.canvas.setWidth(divElement.clientWidth);
      state.canvas.setHeight(divElement.clientHeight);
      updateImageScale();
    };

    onMounted(() => {
      state.canvas = new fabric.Canvas("canvas");
      updateCanvasSize();
      loadCanvas();
      window.addEventListener("resize", updateCanvasSize);
    });
    onBeforeUnmount(() => {
      window.removeEventListener("resize", updateCanvasSize);
    });

    return {
      ...toRefs(state),
      store,
      addText,
    };
  },
};
</script>

<style lang="scss">
.area {
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
}
</style>
