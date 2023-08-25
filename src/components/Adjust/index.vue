<template>
  <div class="adjust">
    <div v-if="isShowImg">
      <vue-cropper
        overflow-hidden
        ref="cropper"
        :src="store.state.imageData"
        :containerStyle="containerStyle"
        :minContainerHeight="300"
        :ready="onReady"
        :cropmove="touch"
        :zoom="touch"
        @cropmove="onCropMove"
      />
      <div class="flip">
        <el-button-group>
          <el-button @click.prevent="zoom(0.2)">
            <el-icon><ZoomIn /></el-icon>
          </el-button>
          <el-button @click.prevent="zoom(-0.2)">
            <el-icon><ZoomOut /></el-icon>
          </el-button>
          <el-button @click.prevent="move(-10, 0)">
            <el-icon><ArrowLeft /></el-icon>
          </el-button>
          <el-button @click.prevent="move(10, 0)">
            <el-icon><ArrowRight /></el-icon>
          </el-button>
          <el-button @click.prevent="move(0, -10)">
            <el-icon><ArrowUp /></el-icon>
          </el-button>
          <el-button @click.prevent="move(0, 10)">
            <el-icon><ArrowDown /></el-icon>
          </el-button>
          <el-button
            @click.prevent="flipX($event)"
            class="flipX"
          >
            <el-icon><Switch /></el-icon>
          </el-button>
          <el-button
            @click.prevent="flipY($event)"
          >
            <el-icon><Sort /></el-icon>
          </el-button>
          <el-button type="info" @click.prevent="reset">
            <el-icon><Crop /></el-icon>
          </el-button>
        </el-button-group>
      </div>
      <div class="btn">
        <el-button 
          style="margin-left: 20px" 
          type="info" 
          @click="reset"
        >
          重 置
        </el-button>
        <el-button 
          type="primary" 
          :loading="submitting" 
          @click="onConfirm"
        >
          确 定
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import "cropperjs/dist/cropper.css";
import VueCropper from "vue-cropperjs";
import { file2Base64, aspectRatioToText, sizeToText, MB } from "@/utils/adjustUtils";
import { onBeforeMount, onMounted, onUpdated, onBeforeUnmount } from "@vue/runtime-core";
import { reactive, toRefs, ref } from "@vue/reactivity";
import { watchEffect , nextTick  } from "vue"
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import MainCanvas from '@/components/MainCanvas.vue'

export default {
  props: {
    file: File,
    aspectRatio: [Array, String],
    aspectRatioDeviation: Number,
  },
  components: {
    VueCropper,
    MainCanvas
  },
  setup(props, context) {
    const router = useRouter();
    const store = useStore();
    const state = reactive({
      fileSelected: false,
      LARGE_RESOLUTION: 2560,
      SIZE_THRESHOLD: MB,
      loading: true,
      aspectRatioMismatched: false,
      submitting: false,
      isShowImg: false,
      sizeText: "",
      isLargeResolution: false,
      canvas: {},
      cropBox: {},
      containerStyle: {
        height: "500px",
      },
      rotateDegree: 0,
      maxResolution: 2560,
      quality: 1,
      isTouched: false,
      path: true,
      dynamicWidth: 0, // 用于存储动态计算的宽度
      dynamicHeight: 0, // 用于存储动态计算的高度
    });
    const cropper = ref(null)

    const onCropMove = (eventData) => {
      // 在裁剪移动时，动态计算宽高比
      const cropper = cropper.value;
      const currentWidth = cropper.cropper.getCropBoxData().width;
      const currentHeight = cropper.cropper.getCropBoxData().height;
      state.dynamicWidth = currentWidth;
      state.dynamicHeight = currentHeight;
    }

    // 根据当前 aspectRatioValue 计算得到的宽高比文本描述
    const aspectRatioText = () => {
      return aspectRatioToText(aspectRatioValue());
    }
    
    // 判断是否需要进行裁剪，如果宽高比不匹配或者已进行过裁剪操作，则返回 true
    const mustCrop = () => {
      return state.aspectRatioMismatched || state.isTouched;
    }
    
    // 根据传入的 props.aspectRatio 获取宽高比的值。如果 props.aspectRatio 是字符串类型，则根据 "/" 分割获取宽度和高度，计算并返回宽高比
    const aspectRatioValue = () => {
      if (props.aspectRatio) {
        if (typeof props.aspectRatio === "string") {
          const [width, height] = props.aspectRatio.split("/");
          return width / height;
        }
      }
    }
    // 根据编辑前后的文件大小差异，返回描述文本。根据差值的正负情况，生成不同格式的文本
    const getSizeDiffText = (before, after) => {
      const diff = after - before;
      let textA = `原图体积 ${sizeToText(before)}，编辑后 ${sizeToText(after)}`,
        textB = diff === 0 ? "" : `${((diff / before) * 100).toFixed(2)}%`;
      if (diff > 0) {
        textB = "+" + textB;
      }
      if (textB) {
        textB = `（${textB}）`;
      }
      return textA + textB;
    }
    
    const checkAspectRatio = (file) => {
      return new Promise((resolve) => {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
          const image = new Image();
          image.onload = () => {
            const originalRatio = image.width / image.height;
            resolve(
              originalRatio < aspectRatioValue() * (1 - props.aspectRatioDeviation) ||
              originalRatio > aspectRatioValue() * (1 + props.aspectRatioDeviation)
            );
          };
          image.src = e.target.result;
        };
        fileReader.readAsDataURL(file);
      });
    }
    const onConfirm = () => {
      if (mustCrop()) {
        state.submitting = true;
        if(cropper.value) {
          cropper.value.getCroppedCanvas({
            maxWidth: state.maxResolution,
            maxHeight: state.maxResolution,
          })
          .toBlob(
            (blob) => {
              const sizeDiffText = getSizeDiffText(
                props.file.size,
                blob.size
              );
              context.emit("confirm", blob);
              state.submitting = false;
            },
            props.file.type,
            state.quality
          );
        }else {
          console.log("getCroppedCanvas为空");
        }  
      } else {
        context.emit("confirm");
      }
    }
    
    const touch = () => {
      state.isTouched = true;
    }
    // 设置裁减的比列为1:1
    const onReady = () => {
      const { width, height, left, top } = cropper.value.getCanvasData();
      if (typeof aspectRatioValue() === "number") {
        cropper.value.setAspectRatio(aspectRatioValue());

        nextTick(() => {
          // 默认裁剪框在图片之内（避免裁剪出白边），也可以放大以完全框住图片（避免遗漏信息）
          const originalRatio = width / height;
          if (aspectRatioValue() > originalRatio) {
            cropper.value.setCropBoxData({ width, left });
            const {
              width: containerWidth,
              height: containerHeight,
            } = cropper.value.getContainerData();
            const {
              width: cropBoxWidth,
              height: cropBoxHeight,
            } = cropper.value.getCropBoxData();
            cropper.value.setCropBoxData({
              top: (containerHeight - cropBoxHeight) / 2,
            });
          } else {
            cropper.value.setCropBoxData({ height, top });
            const {
              width: containerWidth,
              height: containerHeight,
            } = cropper.value.getContainerData();
            const {
              width: cropBoxWidth,
              height: cropBoxHeight,
            } = cropper.value.getCropBoxData(); // 不能提前拿
            cropper.value.setCropBoxData({
              left: (containerWidth - cropBoxWidth) / 2,
            });
          }
          state.loading = false;
        });
      } else {
        cropper.value.setCropBoxData({ width, height, left, top });
        state.loading = false;
      }
    }
    // 横向翻转
    const flipX = (event) => {
      touch();
      const dom = event.target;
      let scale = dom.getAttribute("data-scale");
      scale = scale ? -scale : -1;
      cropper.value.scaleX(scale);
      dom.setAttribute("data-scale", scale);
    }
    // 竖向翻转
    const flipY = (event) => {
      touch();
      const dom = event.target;
      let scale = dom.getAttribute("data-scale");
      scale = scale ? -scale : -1;
      cropper.value.scaleY(scale);
      dom.setAttribute("data-scale", scale);
    }
    // 移动
    const move = (offsetX, offsetY) => {
      touch();
      cropper.value.move(offsetX, offsetY);
    }
    // 重置
    const reset = () => {
      Object.assign(state, reactive());
      cropper.value.reset();
      onReady();
    }
    // 放大缩小
    const zoom = (percent) => {
      cropper.value.relativeZoom(percent);
    }

    // 挂载前
    onBeforeMount(() => {
    });
    // 挂载后
    onMounted(() => {
      if (!store.state.imageData) {
        router.push({ path: '/' });
      }
    });
    // 更新后
    onUpdated(() => { });
    onBeforeUnmount(() => {
      state.path = false
    });

   // 图片监听
    watchEffect (()=>{
      if(store.state.imageData) {
        state.isShowImg = true
      }
      const file = (n) => {
        if (n) {
          if (aspectRatioValue()) {
            checkAspectRatio(n).then((aspectRatioMismatched) => {
              state.aspectRatioMismatched = aspectRatioMismatched;
            });
          }
          state.sizeText = sizeToText(n.size);
          file2Base64(n, (base64) => {
            // 获取图片尺寸，如果是大图，则提供最大分辨率的配置
            const image = new Image();
            image.onload = () => {
              const { width, height } = image;
              state.isLargeResolution =
                width >= state.LARGE_RESOLUTION || height >= state.LARGE_RESOLUTION;
            };
            image.src = base64;
            cropper.value.replace(base64); 
          });
        } else {
          Object.assign(state, reactive());
        }
      } 
      file(props.file);
    })

    // 监听主页面的保存按钮
    const mainButton = window.parent.document.getElementById('storeImage');
    if(mainButton) {
      mainButton.addEventListener('click', () => {
        console.log("1");
        onConfirm()
      });
    }
  

    return {
      ...toRefs(state),
      store,
      cropper,
      aspectRatioText,
      mustCrop,
      aspectRatioValue,
      getSizeDiffText,
      checkAspectRatio,
      onConfirm,
      touch,
      onReady,
      flipX,
      flipY,
      move,
      reset,
      zoom,
      onCropMove
    }
  } 
}
</script>

<style lang="css" scoped>
.adjust {
  width: 100%;
  height: auto;
}
.flip {
  padding-left: 35%;
  margin-top: 27px;
}
.btn {
  padding-left: 45%;
  margin-top: 13px;
}

::v-deep .el-button-group {
  display: inline-block;
  vertical-align: middle;
  margin-bottom: 15px;
}
::v-deep .flipX > .el-icon-sort {
  transform: rotate(90deg);
}

::v-deep .cropper-point {
  width: 8px !important;
  height: 8px !important;
  border-radius: 50%;
}

.rotateDegree.el-slider {
  width: 551px;
}
::v-deep .el-slider__runway.show-input {
  margin-right: 130px;
}

::v-deep .el-slider__marks-text:last-child {
  width: 36.406px;
}

::v-deep .el-slider__input {
  width: 105px;
}

.maxResolution.el-input-number {
  width: 105px;
}

.quality.el-slider {
  width: 75px;
}

::v-deep .el-form-item__label-wrap {
  margin-left: unset !important;
}

.el-form-item {
  margin-bottom: unset;
}

::v-deep .cropper-hidden {
  display: none !important;
  max-height: 100% !important;
}
</style>
