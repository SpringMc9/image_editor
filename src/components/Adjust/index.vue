<template>
  <div class="adjust">
    <div v-if="isShowImg">
      <vue-cropper
        overflow-hidden
        ref="cropper"
        :src="store.state.imageData"
        :containerStyle="containerStyle"
        preview=".preview"
        style="background-image: none"
        :minContainerHeight="300"
        :ready="onReady"
        :cropmove="touch"
        :zoom="touch"
      />
      <div class="flip">
        <el-button-group>
          <el-button @click.prevent="zoom(0.2)">
            <el-icon :color="textColor"><Plus /></el-icon>
          </el-button>
          <el-button @click.prevent="zoom(-0.2)">
            <el-icon :color="textColor"><Minus /></el-icon>
          </el-button>
          <el-button @click.prevent="move(-10, 0)">
            <el-icon :color="textColor"><ArrowLeft /></el-icon>
          </el-button>
          <el-button @click.prevent="move(10, 0)">
            <el-icon :color="textColor"><ArrowRight /></el-icon>
          </el-button>
          <el-button @click.prevent="move(0, -10)">
            <el-icon :color="textColor"><ArrowUp /></el-icon>
          </el-button>
          <el-button @click.prevent="move(0, 10)">
            <el-icon :color="textColor"><ArrowDown /></el-icon>
          </el-button>
          <el-button
            @click.prevent="flipX($event)"
            class="flipX"
          >
            flipX
          </el-button>
          <el-button
            @click.prevent="flipY($event)"
          >
            flipY
          </el-button>
          <el-button type="info" @click.prevent="reset">
            <el-icon :color="textColor"><Crop /></el-icon>
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
    <div v-else class="uploadImg">
      <MainCanvas></MainCanvas>
    </div>
  </div>
</template>

<script>
import "cropperjs/dist/cropper.css";
import VueCropper from "vue-cropperjs";
import { file2Base64, aspectRatioToText, sizeToText, MB } from "@/utils/adjustUtils";
import { onBeforeMount, onMounted, onUpdated } from "@vue/runtime-core";
import { reactive, toRefs, ref } from "@vue/reactivity";
import { watchEffect , nextTick  } from "vue"
import { useStore } from "vuex";
import MainCanvas from '@/components/MainCanvas.vue'

export default {
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    file: File,
    aspectRatio: [Array, String],
    aspectRatioDeviation: Number,
  },
  components: {
    VueCropper,
    MainCanvas
  },
  setup(props, context) {
    const store = useStore();
    const state = reactive({
      fileSelected: false,
      LARGE_RESOLUTION: 2560,
      SIZE_THRESHOLD: MB,
      loading: true,
      aspectRatioMismatched: false,
      submitting: false,
      // src: "",
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
    });
    const cropper = ref(null)

    const aspectRatioText = () => {
      return aspectRatioToText(aspectRatioValue());
    }
    // 是否必须裁减
    const mustCrop = () => {
      return state.aspectRatioMismatched || state.isTouched;
    }
    // 图片的比例值
    const aspectRatioValue = () => {
      if (props.aspectRatio) {
        if (typeof props.aspectRatio === "string") {
          const [width, height] = props.aspectRatio.split("/");
          return width / height;
        }
      }
    }
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
    // 检查图片真实比例是否为1:1,aspectRatioDeviation:0.1(误差不超过0.1)
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
        // 将file文件转换成base64
        fileReader.readAsDataURL(file);
      });
    }
    const onConfirm = () => {
      if (mustCrop()) {
        state.submitting = true;
        cropper.value.getCroppedCanvas({
            // 限制画布大小，限制生成的图片体积
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
            // 如果旋转角度不为直角，则图片一定会出现空白区域，空白区域默认透明，使用 png 格式
            //this.rotateDegree % 90 === 0 ? this.file.type : 'image/png',
            props.file.type,
            // 质量
            state.quality
          );
      } else {
        context.emit("confirm");
      }
    }
    // 改变了图片，需要裁减图片
    const touch = () => {
      state.isTouched = true;
    }
    // 设置裁减的比列为1:1
    const onReady = () => {
      const { width, height, left, top } = cropper.value.getCanvasData();
      //this.canvas = { width, height, left, top }
      if (typeof aspectRatioValue() === "number") {
        cropper.value.setAspectRatio(aspectRatioValue());

        nextTick(() => {
          // 默认裁剪框在图片之内（避免裁剪出白边），也可以放大以完全框住图片（避免遗漏信息）
          const originalRatio = width / height;
          //this.cropBox = this.$refs.cropper.getCropBoxData()
          if (aspectRatioValue() > originalRatio) {
            cropper.value.setCropBoxData({ width, left });
            const {
              width: containerWidth,
              height: containerHeight,
            } = cropper.value.getContainerData();
            const {
              width: cropBoxWidth,
              height: cropBoxHeight,
            } = cropper.value.getCropBoxData(); // 不能提前拿
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
        //this.cropBox = { ...this.canvas }
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
    });
    // 更新后
    onUpdated(() => { });

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
            cropper.value.replace(base64); // replace 后触发 onReady
          });
        } else {
          Object.assign(state, reactive());
        }
      } 
      file(props.file);
    })
  

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
      zoom
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
  .uploadImg {
    width: 100%;
    height: 630px;
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
