<template>
  <div class="home">
    <el-container class="container">
      <el-header class="header">
        <div class="header-left">
          <img class="logo" src="../assets/images/wpsLogo.png" />
          <span>Image Editor</span>
        </div>
      </el-header>
      <el-container class="aside-main">
        <el-aside class="aside">
          <router-link to="/Adjust" class="aside-box-options">
            <img class="logo" src="../assets/images/wpsLogo.png" />
            <span>Adjust</span>
          </router-link>
          <router-link to="/Watermark" class="aside-box-options">
            <img class="logo" src="../assets/images/wpsLogo.png" />
            <span>Watermark</span>
          </router-link>
        </el-aside>
        <el-main class="main">
          <router-view> </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { onBeforeMount, onMounted, onUpdated } from "@vue/runtime-core";
import { reactive, toRefs } from "@vue/reactivity";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
export default {
  name: "HomeView",
  props: [""],
  components: {},
  setup() {
    // 变量定义
    const router = useRouter();
    const store = useStore();
    const state = reactive({});

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
    };
  },
};
</script>

<style lang="scss" scoped>
.home {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
  height: auto;
  position: relative;
  margin: 0;
  padding: 0;

  .container {
    width: 100%;
    height: auto;
    position: relative;
    display: flex;
    flex-direction: column;

    .header {
      height: 50px;
      border: 1px solid blue;
      display: flex;
      flex-wrap: wrap;
      align-content: center;

      .header-left {
        width: 13%;

        .logo {
          width: 26%;
        }

        .span {
        }
      }
    }

    .aside-main {
      width: 100%;
      height: 90vh;
      /* 设置高度为视口高度 */
      display: flex;
      /* 使用 Flex 布局 */
      flex-direction: initial;
      position: relative;

      .aside {
        width: 12%;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow-x: hidden;

        .aside-box-options {
          width: 65%;
          height: 18%;
          color: #768184;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin-top: 15px;
          background-color: #f8fafb;
          border-radius: 10px;

          .logo {
            width: 55%;
          }
        }

        .aside-box-options:hover {
          background-color: #ecf3ff;
          /* 鼠标悬停时的背景色 */
        }
      }

      .main {
        flex: 1;
        /* 使用 Flex 自适应布局，使 Main 部分占据剩余空间 */
        border: 1px solid rgb(231, 21, 175);
        float: right;
      }
    }
  }
}
</style>
