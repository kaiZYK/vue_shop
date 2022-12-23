<template>
  <div>
    <!-- 面包屑部分 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片部分 -->
    <el-card>
      <!-- 搜索部分 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <!-- 搜索输入框 -->
          <el-input
            placeholder="请输入内容"
            v-model="userInfo.query"
            clearable
            @clear="getUsersDataList()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUsersDataList()"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <!-- 添加用户按钮 -->
          <el-button type="primary" @click="addUserVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格部分 -->
      <el-table :data="usersDataList" border stripe style="width: 100%">
        <el-table-column type="index" label="序号"> </el-table-column>
        <el-table-column prop="username" label="用户名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <!-- scope.row -->

            <el-switch
              v-model="scope.row.mg_state"
              @change="editUserState(scope.row.id, scope.row.mg_state)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="编辑" width="180px">
          <template slot-scope="scope">
            <!-- scope.row -->

            <!-- 编辑用户 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑用户"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-edit"
                @click="showEditUserVisible(scope.row.id)"
              >
              </el-button>
            </el-tooltip>

            <!-- 删除用户 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="删除用户"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="removeUser(scope.row.id)"
              >
              </el-button>
            </el-tooltip>

            <!-- 分配角色 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-setting"
                @click="showSetRoleVisible(scope.row)"
              >
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页部分 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="userInfo.pagenum"
        :page-sizes="[1, 2, 3, 5, 10]"
        :page-size="userInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addUserVisible"
      width="50%"
      @close="resetAddUserForm()"
    >
      <el-form
        :model="addUserForm"
        :rules="addUserRules"
        ref="addUseRef"
        label-width="80px"
      >
        <el-form-item prop="username" label="用户名：">
          <el-input
            placeholder="请输入用户名"
            v-model="addUserForm.username"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码：">
          <el-input
            placeholder="请输入密码"
            v-model="addUserForm.password"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱：">
          <el-input
            placeholder="请输入邮箱"
            v-model="addUserForm.email"
          ></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="手机号：">
          <el-input
            placeholder="请输入手机号"
            v-model="addUserForm.mobile"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog
      title="编辑用户"
      :visible.sync="editUserVisible"
      width="50%"
      @close="resetEditUserForm()"
    >
      <el-form
        :model="editUserForm"
        :rules="addUserRules"
        ref="editUseRef"
        label-width="80px"
      >
        <el-form-item prop="username" label="用户名：">
          <el-input
            placeholder="请输入用户名"
            v-model="editUserForm.username"
            clearable
            disabled
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱：">
          <el-input
            placeholder="请输入邮箱"
            v-model="editUserForm.email"
          ></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="手机号：">
          <el-input
            placeholder="请输入手机号"
            v-model="editUserForm.mobile"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="setRoleVisible"
      width="50%"
      @close="resetSetRoleForm()"
    >
      <el-form :model="setRoleForm" ref="setRoleRef" label-width="120px">
        <el-form-item label="当前的用户：">
          <el-input v-model="setRoleForm.username" clearable disabled>
          </el-input>
        </el-form-item>
        <el-form-item label="当前的角色：">
          <el-input v-model="userRoleName" clearable disabled> </el-input>
        </el-form-item>
        <el-form-item label="要分配的角色：">
          <el-select v-model="activeRoleID" placeholder="请选择要分配的角色">
            <el-option
              v-for="item in roleDataList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRole()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Users",
  data() {
    // 邮箱自定义验证规则
    var email = (rule, value, callback) => {
      let reg =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error("请输入正确的邮箱"));
      }
    };
    // 手机号自定义验证规则
    var mobile = (rule, value, callback) => {
      let reg =
        /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/;
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error("请输入正确的手机号"));
      }
    };
    return {
      // 用户列表数据
      usersDataList: [],

      // 请求的参数
      userInfo: {
        // 查询的参数
        query: "",
        // 请求的页数
        pagenum: 1,
        // 请求的每一页的条数
        pagesize: 2,
      },

      // 用户的总数
      total: null,

      // 添加用户对话框显示与隐藏
      addUserVisible: false,

      // 添加用户表单数据
      addUserForm: {
        // 用户名
        username: "",
        // 密码
        password: "",
        // 邮箱
        email: "",
        // 手机号
        mobile: "",
      },

      //  添加用户表单规则
      addUserRules: {
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
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: email, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: mobile, trigger: "blur" },
        ],
      },

      // 编辑用户对话框显示与隐藏
      editUserVisible: false,

      // 编辑用户表单数据
      editUserForm: {},

      // 编辑用户当前的id
      editUserID: null,

      // 分配角色对话框显示与隐藏
      setRoleVisible: false,

      // 分配角色表单数据
      setRoleForm: {},

      // 当前用户的角色名称
      userRoleName: "",

      // 分配角色当前的id
      setRoleUserID: null,

      // 角色数据列表
      roleDataList: [],

      // 选中的角色的id
      activeRoleID: "",
    };
  },
  components: {},
  props: {},
  methods: {
    // 获取用户列表数据
    async getUsersDataList() {
      // 发送请求
      let { data: res } = await this.$http.get(
        `/users?query=${this.userInfo.query}&pagenum=${this.userInfo.pagenum}&pagesize=${this.userInfo.pagesize}`
      );
      if (res.meta.status == 200) {
        // 设置用户列表数据
        this.usersDataList = res.data.users;
        // console.log(this.usersDataList);

        // 设置用户的总数
        this.total = res.data.total;
        // console.log(this.total);
      } else {
        this.$message.error("获取用户列表数据失败");
      }
    },

    // 分页页数改变后触发函数
    handleCurrentChange(value) {
      this.userInfo.pagenum = value;
      // 获取用户列表数据
      this.getUsersDataList();
    },

    // 分页每一页的数据条数改变后触发函数
    handleSizeChange(value) {
      this.userInfo.pagesize = value;
      // 获取用户列表数据
      this.getUsersDataList();
    },

    // 添加用户功能
    addUser() {
      this.$refs.addUseRef.validate(async (valid) => {
        if (valid) {
          // 发送添加用户请求
          let { data: res } = await this.$http.post("/users", {
            username: this.addUserForm.username,
            password: this.addUserForm.password,
            email: this.addUserForm.email,
            mobile: this.addUserForm.mobile,
          });
          if (res.meta.status == 201) {
            // 获取用户列表数据
            this.getUsersDataList();
            // 添加用户对话框隐藏
            this.addUserVisible = false;
            this.$message.success("添加用户成功");
          } else {
            this.$message.error("添加用户失败");
          }
        }
      });
    },

    // 关闭添加用户对话框后 重置添加用户表单内容
    resetAddUserForm() {
      this.$refs.addUseRef.resetFields();
    },

    // 显示修改用户对话框
    async showEditUserVisible(id) {
      // 保存编辑用户当前的id
      this.editUserID = id;
      // 发起获取当前用户的请求
      let { data: res } = await this.$http.get(`/users/${id}}`);
      if (res.meta.status == 200) {
        // 设置编辑用户表单数据
        this.editUserForm = res.data;
      } else {
        this.$message.error("获取当前用户数据失败");
      }

      // 编辑用户对话框显示
      this.editUserVisible = true;
    },

    // 编辑用户功能
    editUser() {
      this.$refs.editUseRef.validate(async (valid) => {
        if (valid) {
          // 发送编辑用户请求
          let { data: res } = await this.$http.put(
            `/users/${this.editUserID}}`,
            {
              email: this.editUserForm.email,
              mobile: this.editUserForm.mobile,
            }
          );
          if (res.meta.status == 200) {
            // 获取用户列表数据
            this.getUsersDataList();
            // 编辑用户对话框隐藏
            this.editUserVisible = false;
            this.$message.success("编辑用户成功");
          } else {
            this.$message.error("编辑用户失败");
          }
        }
      });
    },

    // 关闭编辑用户对话框后 重置添加用户表单内容
    resetEditUserForm() {
      this.$refs.editUseRef.resetFields();
    },

    // 删除用户功能
    removeUser(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 发送删除用户请求
          let { data: res } = await this.$http.delete(`/users/${id}}`);
          if (res.meta.status == 200) {
            // 获取用户列表数据
            this.getUsersDataList();
            this.$message.success("删除用户成功");
          } else {
            this.$message.error("删除用户失败");
          }
        })
        .catch(() => {
          this.$message.info("已取消删除用户");
        });
    },

    // 编辑用户状态功能
    async editUserState(id, state) {
      // 发送编辑用户状态请求
      let { data: res } = await this.$http.put(`users/${id}/state/${state}`);
      if (res.meta.status == 200) {
        // 获取用户列表数据
        this.getUsersDataList();
        this.$message.success("编辑用户状态成功");
      } else {
        this.$message.error("编辑用户状态失败");
      }
    },

    // 显示分配角色对话框
    async showSetRoleVisible(row) {
      // 保存分配角色当前的id
      this.setRoleUserID = row.id;

      // 设置当前用户的角色名称
      this.userRoleName = row.role_name;

      // 发起获取当前用户的请求
      let { data: res } = await this.$http.get(`/users/${row.id}}`);
      if (res.meta.status == 200) {
        // 设置分配角色表单数据
        this.setRoleForm = res.data;
        console.log(this.setRoleForm);
      } else {
        this.$message.error("获取当前用户数据失败");
      }

      // 发起获取角色数据列表的请求
      let { data: res__ } = await this.$http.get(`/roles`);
      console.log(res__);
      if (res__.meta.status == 200) {
        // 设置角色数据列表
        this.roleDataList = res__.data;
      } else {
        this.$message.error("获取角色数据列表数据失败");
      }

      // 分配角色对话框显示
      this.setRoleVisible = true;
    },

    // 分配角色功能
    async setRole() {
      // 发送分配角色请求
      let { data: res } = await this.$http.put(
        `/users/${this.setRoleUserID}/role`,
        {
          rid: this.activeRoleID,
        }
      );
      if (res.meta.status == 200) {
        // 获取用户列表数据
        this.getUsersDataList();
        // 分配角色对话框隐藏
        this.setRoleVisible = false;
        this.$message.success("分配角色成功");
      } else {
        this.$message.error("分配角色失败");
      }
    },

    // 关闭分配角色对话框后 重置分配角色表单内容
    resetSetRoleForm() {
      this.$refs.setRoleRef.resetFields();
      // 当前用户的角色名称为空
      this.userRoleName = "";
      // 选中的角色的id为空
      this.activeRoleID = "";
    },
  },
  computed: {},
  watch: {},
  mounted() {
    // 获取用户列表数据
    this.getUsersDataList();
  },
};
</script>

<style scoped lang="less"></style>
