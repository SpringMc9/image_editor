<template>
  <div class="main-box">

  </div>
</template>

<script>
import { onBeforeMount, onMounted, onUpdated } from "@vue/runtime-core";
import { reactive, toRefs } from "@vue/reactivity";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
export default {
  name: 'MainView',
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

</style>
