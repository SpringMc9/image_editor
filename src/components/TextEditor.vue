<template>
  <div class="area">
    <canvas id="canvas" v-if="store.state.imageData" class="image"></canvas>
    <p v-else>请上传图片</p>
    <button @click="addText">添加文字</button>
  </div>
</template>

<script>
import { onMounted } from "@vue/runtime-core";
import { reactive, toRefs } from "@vue/reactivity";
import { useStore } from "vuex";
import { fabric } from "fabric";

export default {
  name: "TextEditor",
  components: {},
  setup() {
    const store = useStore();
    const state = reactive({});

    const loadCanvas = () => {
      if (store.state.imageData) {
        const canvas = new fabric.Canvas('canvas');
        const ctx = canvas.getContext('2d');
        const image = new Image();
        image.src = store.state.imageData;
        image.onload = () => {
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
          // 在这里你可以使用绘图上下文API来绘制其他图形或添加艺术文字
        };
      }
    }
    const addText = () => {
      const text = new fabric.IText("在这里添加文字", {
        left: 100,
        top: 100,
        fill: "black",
        fontFamily: "Arial",
        fontSize: 20,
      });
      this.canvas.add(text);
      this.canvas.setActiveObject(text);
      this.canvas.renderAll();
    }

    onMounted(() => {
      loadCanvas()
    });

    return {
      ...toRefs(state),
      store,
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

.image {
  max-width: 100%;
  max-height: 100%;
}
</style>
