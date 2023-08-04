<template>
  <div class="home">
    <p>image_editor</p>
    <!-- <el-container>
      <el-header>Header</el-header>
      <el-container>
        <el-aside width="200px">Aside</el-aside>
        <el-main>Main</el-main>
      </el-container>
    </el-container> -->
  </div>
</template>

<script>
import { onBeforeMount, onMounted, onUpdated } from "@vue/runtime-core";
import { reactive, toRefs } from "@vue/reactivity";

import { useStore } from "vuex";
import { useRouter } from "vue-router";
export default {
  name: 'HomeView',
  props: [""],
  components: {},
  setup() {
    // 变量定义
    const router = useRouter()
    const store = useStore();
    const state = reactive({

    })

    // 挂载前
    onBeforeMount(() => {});
    // 挂载后
    onMounted(() => {});
    // 更新后
    onUpdated(() => {});

    return {
      ...toRefs(state),
      store,
      router,
    }
  }
}
</script>

<style lang="scss">
.home {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
