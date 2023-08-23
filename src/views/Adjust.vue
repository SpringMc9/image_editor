<template>
  <div class="image-cropper">
    <adjust-img
      :file="store.state.uploadedFile"
      aspectRatio="1/1"
      :aspectRatioDeviation="0.1"
      @confirm="onCropperConfirm"
    />
    <div v-if="isShow" class="displayImg">
      <div class="display">
        <div class="cutImg">
          <img :src="imgSrc" class="image" />
        </div>
        <div class="handleBut">
          <el-button type="primary" @click="storeImg">裁剪</el-button>
          <el-button type="primary" @click="closeImg">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onBeforeMount, onMounted, onUpdated } from "@vue/runtime-core";
import { reactive, toRefs } from "@vue/reactivity";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import AdjustImg from "@/components/Adjust/index.vue"
import { file2Base64 } from "@/utils/adjustUtils";

export default {
  name: '',
  props: [""],
  components: {
    AdjustImg
  },
  setup() {
    // 变量定义
    const router = useRouter()
    const store = useStore();
    const state = reactive({
      cropper: {
        show: false,
        file: null,
        loading: false,
        submitted: false,
      },
      isShow: false,
      imgSrc: ''
    })

    // 确定裁减
    const onCropperConfirm = (blob) => {
      console.log(blob);
      // 裁剪了
      if (blob) {
        // 将Blob文件转换成File格式
        let file = new File([blob], store.state.uploadedFile.name, {
          type: blob.type,
        });
        state.cropper.file = file
        file2Base64(file, (base64) => {
          // 获取图片尺寸，如果是大图，则提供最大分辨率的配置
          const image = new Image();
          image.onload = () => {
            const { width, height } = image;
            state.isLargeResolution =
              width >= state.LARGE_RESOLUTION || height >= state.LARGE_RESOLUTION;
          };
          image.src = base64;
          state.imgSrc = base64;
          if(state.imgSrc) {
            state.isShow = true
          }
        });     
      }
    }

    const onCropperClosed = () => {
      const uploadInner = document.querySelector('#element-upload .upload-inner');
      uploadInner.focus();
    }
    const onCropperOpen = () => {
      const uploadInner = document.querySelector('#element-upload .upload-inner');
      uploadInner.blur();
    }

    const storeImg = () => {
      const reader = new FileReader();
      reader.onload = () => {
        store.commit('setUploadedImage', state.imgSrc)
        store.commit('setUploadedFile', state.cropper.file)
      };
      reader.readAsDataURL(state.cropper.file);
      closeImg()
    }

    const closeImg = () => {
      state.isShow = false
    }


    // 挂载前
    onBeforeMount(() => {
      // readFile()
    });
    // 挂载后
    onMounted(() => {
    });
    // 更新后
    onUpdated(() => { });


    return {
      ...toRefs(state),
      store,
      router,
      onCropperConfirm,
      onCropperClosed,
      onCropperOpen,
      storeImg,
      closeImg
    }
  }
}
</script>

<style lang="scss" scoped>
.image-cropper {
  padding: 0;
  .displayImg {
    width: 88%;
    height: 100%;
    position: absolute;
    top: 0%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: rgb(0, 0, 0,0.6);
    z-index: 1;
    .display {
      width: 40%;
      height: 65%;
      background-color: rgb(255, 255, 255, 0.8);
      .cutImg {
        width: 60%;
        height: 57%;
        margin-left: 21%;
        margin-top: 5%;
        .image {
          width: 100%;
        }
      }
      .handleBut {
        width: 50%;
        height: 50%;
        display: flex;
        justify-content: space-between;
        margin-left: 28%;
        margin-top: 16%;
      }
    }
    
  }
}

</style>
