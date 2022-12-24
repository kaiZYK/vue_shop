<template>
  <div class="home">
    <!-- 容器部分 -->
    <el-container>
      <!-- 头部 -->
      <el-header>
        <h1>电商后台管理系统</h1>
        <el-button type="info" @click="loginOut()">退出登录</el-button>
      </el-header>
      <el-container>
        <!-- 侧边栏部分 -->
        <el-aside :width="collapse == false ? '200px' : '64px'">
          <!-- 折叠按钮 -->
          <div class="folding" @click="collapse = !collapse">|||</div>
          <!-- 菜单部分 -->
          <el-menu
            background-color="#323745"
            text-color="#fff"
            active-text-color="#359bff"
            unique-opened
            :collapse="collapse"
            :collapse-transition="false"
            router
          >
            <!-- 一级菜单 -->
            <el-submenu
              :index="item1.id + ''"
              v-for="(item1, index1) in menuDataList"
              :key="item1.id"
            >
              <template slot="title">
                <i :class="menuIcon[item1.path]"></i>
                <span class="menuTitle">{{ item1.authName }}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item
                :index="item2.path + ''"
                v-for="(item2, index2) in item1.children"
                :key="item2.id"
                :route="item2.path"
              >
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span> {{ item2.authName }}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 主体内容部分 -->
        <el-main>
          <!-- 路由出口 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      // 菜单数据
      menuDataList: [],
      // 一级菜单的icon
      menuIcon: {
        users: "iconfont icon-users",
        rights: "iconfont icon-tijikongjian",
        goods: "iconfont icon-shangpin",
        orders: "iconfont icon-danju",
        reports: "iconfont icon-baobiao",
      },

      // 折叠布尔值
      collapse: false,
    };
  },
  components: {},
  props: {},
  methods: {
    /* 退出登录功能 */
    loginOut() {
      if (window.sessionStorage.getItem("token") != "") {
        // 提示信息 删除token 跳转路由
        // 删除token
        window.sessionStorage.removeItem("token");
        this.$message.info("退出登录成功");
        // 跳转路由
        this.$router.push("/login");
      } else {
        this.$message.error("退出登录失败");
      }
    },

    // 获取菜单数据
    async getMenuDataList() {
      // 发送登录请求
      let { data: res } = await this.$http.get("/menus");
      if (res.meta.status == 200) {
        // 设置菜单数据
        this.menuDataList = res.data;
        // console.log(this.menuDataList);
      } else {
        this.$message.error("获取菜单列表数据失败");
      }
    },
  },
  computed: {},
  watch: {},
  mounted() {
    // 获取菜单数据
    this.getMenuDataList();
  },
};
</script>

<style scoped lang="less">
/* 容器部分 */
.home,
.el-container {
  width: 100%;
  height: 100%;
  /* 头部 */
  .el-header {
    background-color: #373c41;
    color: #fff;
    line-height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    h1 {
      font-weight: 500;
      color: #dce0e5;
    }
    .el-button {
      height: 40px;
    }
  }

  /* 侧边栏 */
  .el-aside {
    background-color: #323745;
    color: #fff;

    /* 折叠按钮 */
    .folding {
      width: 100%;
      height: 20px;
      text-align: center;
      letter-spacing: 5px;
      line-height: 20px;
      cursor: pointer;
      font-size: 14px;
    }

    .el-menu {
      border: none;
      /* 一级菜单标题 */
      .menuTitle {
        margin-left: 10px;
      }
    }
  }
  /* 主体部分 */
  .el-main {
    background-color: #eaedf1;
  }
}
</style>
