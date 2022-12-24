<template>
  <div class="login">
    <!-- 登录表单部分 -->
    <div class="loginForm">
      <!-- 登录头像部分 -->
      <div class="headPortrait">
        <img src="@/assets/img/头像.jpg" />
      </div>

      <!-- 输入框部分 -->
      <el-form :model="loginForm" :rules="loginRules" ref="loginRef">
        <el-form-item prop="username">
          <!-- icon -->
          <i class="iconfont icon-user"></i>
          <el-input
            placeholder="请输入用户名"
            v-model="loginForm.username"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <!-- icon -->
          <i class="iconfont icon-3702mima"></i>
          <el-input
            placeholder="请输入密码"
            v-model="loginForm.password"
            show-password
          ></el-input>
        </el-form-item>

        <!-- 按钮部分 -->
        <div class="btns">
          <el-button type="primary" @click="login()">登录</el-button>
          <el-button type="info" @click="resetLoginForm()">重置</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      // 表单数据
      loginForm: {
        // 用户名
        username: "admin",
        // 密码
        password: "123456",
      },

      // 表单规则
      loginRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  components: {},
  props: {},
  methods: {
    // 登录功能
    login() {
      this.$refs.loginRef.validate(async (valid) => {
        if (valid) {
          // 发送登录请求
          let { data: res } = await this.$http.post("/login", {
            username: this.loginForm.username,
            password: this.loginForm.password,
          });
          if (res.meta.status == 200) {
            // 登录成功之后 提示登录成功 存储token 跳转路由
            // 存储token
            window.sessionStorage.setItem("token", res.data.token);
            this.$message.success("登录成功");
            // 跳转路由
            this.$router.push("/home");
          } else {
            this.$message.error("用户名或密码输入错误");
          }
        }
      });
    },
    // 重置功能
    resetLoginForm() {
      this.$refs.loginRef.resetFields();
    },
  },
  computed: {},
  watch: {},
};
</script>

<style scoped lang="less">
/* 登录表单部分 */
.login {
  width: 100%;
  height: 100%;
  background-color: #2b4b6b;
  position: relative;
  /* 登录表单部分 */
  .loginForm {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 5px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 0px 20px;
    box-sizing: border-box;
    /* 登录头像部分 */
    .headPortrait {
      width: 130px;
      height: 130px;
      border-radius: 50%;
      padding: 10px;
      box-sizing: border-box;
      background-color: #fff;
      overflow: hidden;
      box-shadow: 0px 0px 9px 3px #eee;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }

    /* 输入框部分 */
    /deep/.el-form {
      margin-top: 110px;
      .el-form-item {
        position: relative;
        .iconfont {
          color: #c0c4cc;
          position: absolute;
          top: 0px;
          left: 10px;
          z-index: 2;
        }
        .el-input {
          .el-input__inner {
            padding-left: 30px;
          }
        }
      }
    }

    /* 按钮部分 */
    .btns {
      text-align: right;
    }
  }
}
</style>
