<template>
  <div class="home">
    <el-container class="container">
      <el-header class="header">
        <div class="header-left">
          <img class="logo" src="../assets/images/wpsLogo.png" />
          <span>Image Editor</span>
        </div>
        <div class="imageUpload">
          <el-button type="primary" round>打开本地图片</el-button>
          <el-button type="primary" round>保存图片</el-button>
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
          <router-view></router-view>
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
  name: 'HomeView',
  props: [""],
  components: {
  },
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
      // border: 2px solid #bde9f0;
      border-radius: 10px;
      display: flex;
      flex-wrap: wrap;
      align-content: center;
      // background-color: #bde9f0;

      .header-left {
        width: 80%;
        display: flex;
        align-items: center;
        .logo {
          width: 50px;
        }
        .span {
          text-decoration: none;
        }
      }
      .imageUpload{
        flex: 1;
        display: flex;
        align-items: center;
      }
    }

    .aside-main {
      width: 100%;
      height: 90vh;
      display: flex;
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
          border-radius: 10px;
          text-decoration: none;
          background-color:#f3f6f7;

          .logo {
            width: 55%;
          }
        }

        .aside-box-options:hover {
          background-color: #ECF3FF;
        }
      }

      .main {
        flex: 1;
        border: 1px solid rgb(231, 21, 175);
        float: right;
      }
    }
  }
}</style>
