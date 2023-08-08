<template>
  <div class="image-cropper">
    <el-upload
      ref="element-upload"
      action="#"
      :auto-upload="false"
      list-type="picture-card"
      :file-list="files"
      :on-change="onChange"
    >
      <i class="el-icon-plus" />
    </el-upload>

    <adjust-img
      :file="cropper.file"
      aspectRatio="1/1"
      :aspectRatioDeviation="0.1"
      @confirm="onCropperConfirm"
    />
  </div>
</template>

<script>
import { onBeforeMount, onMounted, onUpdated } from "@vue/runtime-core";
import { reactive, ref, toRefs } from "@vue/reactivity";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
// import { aspectRatioToText, file2Base64, isArrayJSON } from "@/utils/adjustUtils";
import AdjustImg from "@/components/Adjust/index.vue"
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
      files: [],
      cropper: {
        show: false,
        file: null,
        loading: false,
        submitted: false,
      }
    })
    // 选择图片触发
    const onChange = (file, fileList) => {
      if (file.status === "ready") {
        state.cropper.file = file.raw;
        beforeAddFile({
          ...file,
          file: file.raw,
          fileList,
        });
      }
    }
    // 添加图片之前进入裁减环节
    const beforeAddFile = (item) => {
      if (item.file instanceof File) {
        if (state.cropper.show) {
          return;
        }
        state.cropper.file = item.file;
        state.cropper.show = true;
      }
    }

    // 确定裁减
    const onCropperConfirm = (blob) => {
      const elementUpload = document.querySelector('#element-upload');
      // 裁剪了
      if (blob) {
        // 将Blob文件转换成File格式
        let file = new File([blob], state.cropper.file.name, {
          type: blob.type,
        });
        let uploadFiles =
          elementUpload.uploadFiles[elementUpload.uploadFiles.length - 1];
        file.uid = uploadFiles.raw.uid; //uid影响progress等回调的判断
        uploadFiles.raw = file;
      }
      elementUpload.submit();
      state.cropper.submitted = true;
    }
    const onCropperClosed = () => {
      const uploadInner = document.querySelector('#element-upload .upload-inner');
      uploadInner.focus();
    }
    const onCropperOpen = () => {
      const uploadInner = document.querySelector('#element-upload .upload-inner');
      uploadInner.blur();
    }

    // 挂载前
    onBeforeMount(() => { });
    // 挂载后
    onMounted(() => {
    });
    // 更新后
    onUpdated(() => { });


    return {
      ...toRefs(state),
      store,
      router,
      onChange,
      beforeAddFile,
      onCropperConfirm,
      onCropperClosed,
      onCropperOpen
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
