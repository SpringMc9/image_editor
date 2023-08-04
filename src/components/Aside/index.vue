<template>
  <div class="aside-box-options">
    <img class="logo" src="../../assets/images/wpsLogo.png" />
    <span>Adjust</span>
  </div>
  <div class="aside-box-options">
    <img class="logo" src="../../assets/images/wpsLogo.png" />
    <span>Watermark</span>

  </div>
</template>

<script>
import { onBeforeMount, onMounted, onUpdated } from "@vue/runtime-core";
import { reactive, toRefs } from "@vue/reactivity";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
export default {
  name: 'AsideView',
  props: [""],
  components: {},
  setup() {
    // 变量定义
    const router = useRouter()
    const store = useStore();
    const state = reactive({

    })

    // 挂载前
    onBeforeMount(() => { });
    // 挂载后
    onMounted(() => { });
    // 更新后
    onUpdated(() => { });

    return {
      ...toRefs(state),
      store,
      router,
    }
  }
}
</script>

<style lang="scss" scoped>
.aside-box-options {
  width: 65%;
  height: 18%;
  color: #768184;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
  background-color: #F8FAFB;
  border-radius: 10px;

  .logo {
    width: 55%;
  }
}
.aside-box-options:hover {
      background-color: #ECF3FF; /* 鼠标悬停时的背景色 */
    }
</style>
