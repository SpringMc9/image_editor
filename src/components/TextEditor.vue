<template>
  <div class="area">
    <canvas id="canvas" v-if="store.state.imageData" class="image"></canvas>
    <p v-else>请上传图片</p>
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

    const loadCanvas = () => {
      if (store.state.imageData && !state.imageObject) {
        const image = new Image();
        image.src = store.state.imageData;
        image.onload = () => {
          state.imageObject = new fabric.Image(image, {
            left: 0,
            top: 0,
            selectable: false,
          });
          state.canvas.add(state.imageObject);
        };
      }
    };
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

    const updateCanvasSize = () => {
      const canvasElement = document.getElementById('canvas');
      const divElement = document.querySelector(".area");
      // canvasElement.width = divElement.clientWidth;
      // canvasElement.height = divElement.clientHeight;
    };

    onMounted(() => {
      const divElement = document.querySelector(".area");
      state.canvas = new fabric.Canvas("canvas", {
        // width: divElement.clientWidth, // 画布宽度
        // height: divElement.clientHeight, // 画布高度度
      });
      window.addEventListener('resize', updateCanvasSize);
      updateCanvasSize()
      loadCanvas();
    });

     onBeforeUnmount(() => {
      window.removeEventListener('resize', updateCanvasSize);
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

  canvas {
        display: block;
      }
}
</style>
