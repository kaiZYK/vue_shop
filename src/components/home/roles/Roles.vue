<template>
  <div>
    <!-- 面包屑部分 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片部分 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="primary" @click="addRoleVisible = true">
            添加角色
          </el-button>
        </el-col>
      </el-row>
      <!-- 表格部分 -->
      <el-table :data="roleDataList" border stripe style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- scope.row -->
            <!-- 一级分类 -->
            <el-row
              v-for="(item1, index1) in scope.row.children"
              :key="item1.id"
              class="borderBottom"
              type="flex"
              align="middle"
              :class="{ borderTop: index1 == 0 }"
            >
              <el-col :span="5">
                <el-tag closable @close="closeTag(scope.row, item1.id)">
                  {{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <!-- 二级分类 -->
                <el-row
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                  type="flex"
                  align="middle"
                  :class="{ borderTop: index2 != 0 }"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      type="success"
                      @close="closeTag(scope.row, item2.id)"
                    >
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!-- 三级分类 -->
                    <el-row>
                      <el-col :span="24">
                        <el-tag
                          v-for="(item3, index3) in item2.children"
                          :key="item3.id"
                          type="warning"
                          closable
                          @close="closeTag(scope.row, item3.id)"
                        >
                          {{ item3.authName }}</el-tag
                        >
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <!-- scope.row -->

            <!-- 编辑 -->
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="showEditRoleVisible(scope.row.id)"
              >编辑
            </el-button>

            <!-- 删除 -->

            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="removeRole(scope.row.id)"
              >删除
            </el-button>

            <!-- 分配权限 -->
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-setting"
              @click="showAuthorityVisible(scope.row)"
              >分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleVisible"
      width="50%"
      @close="resetAddRoleForm()"
    >
      <el-form
        :model="addRoleForm"
        :rules="addRoleRules"
        ref="addRoleRef"
        label-width="100px"
      >
        <el-form-item prop="roleName" label="角色名称：">
          <el-input
            placeholder="请输入角色名称"
            v-model="addRoleForm.roleName"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="roleDesc" label="角色描述：">
          <el-input
            placeholder="请输入角色描述"
            v-model="addRoleForm.roleDesc"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editRoleVisible"
      width="50%"
      @close="resetEditRoleForm()"
    >
      <el-form
        :model="editRoleForm"
        :rules="addRoleRules"
        ref="editRoleRef"
        label-width="100px"
      >
        <el-form-item prop="roleName" label="角色名称：">
          <el-input
            placeholder="请输入角色名称"
            v-model="editRoleForm.roleName"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="roleDesc" label="角色描述：">
          <el-input
            placeholder="请输入角色描述"
            v-model="editRoleForm.roleDesc"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setAuthorityVisible"
      width="50%"
      @close="clearSetAuthorityArray()"
    >
      <el-tree
        :data="setAuthorityArray"
        :props="props"
        show-checkbox
        default-expand-all
        node-key="id"
        :default-checked-keys="defaultChecked"
        ref="setAuthorityRef"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setAuthorityVisible = false">取 消</el-button>
        <el-button type="primary" @click="setAuthority()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Roles",
  data() {
    return {
      // 角色列表数据
      roleDataList: [],

      // 添加角色对话框显示与隐藏
      addRoleVisible: false,

      // 添加角色表单数据
      addRoleForm: {
        // 角色名称
        roleName: "",
        // 角色描述
        roleDesc: "",
      },

      //  添加角色表单规则
      addRoleRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          {
            min: 2,
            max: 5,
            message: "长度在 2 到 5 个字符",
            trigger: "blur",
          },
        ],
        roleDesc: [
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10个字符",
            trigger: "blur",
          },
        ],
      },

      // 编辑角色对话框显示与隐藏
      editRoleVisible: false,

      // 编辑角色表单数据
      editRoleForm: {},

      // 编辑角色当前的id
      editRoleID: null,

      // 分配权限对话框显示与隐藏
      setAuthorityVisible: false,

      // 分配权限数据
      setAuthorityArray: [],

      // 树形结构配置
      props: {
        label: "authName",
        children: "children",
      },

      // 勾选上的数组
      defaultChecked: [],

      // 当前分配权限的角色id
      roleSetAuthorityId: "",
    };
  },
  components: {},
  props: {},
  methods: {
    // 获取角色列表数据
    async getRoleDataList() {
      // 发送请求
      let { data: res } = await this.$http.get(`/roles`);
      if (res.meta.status == 200) {
        // 设置权限列表数据
        this.roleDataList = res.data;
      } else {
        this.$message.error("获取角色列表数据失败");
      }
    },
    // 添加角色功能
    addRole() {
      this.$refs.addRoleRef.validate(async (valid) => {
        if (valid) {
          // 发送添加角色请求
          let { data: res } = await this.$http.post("/roles", {
            roleName: this.addRoleForm.roleName,
            roleDesc: this.addRoleForm.roleDesc,
          });
          if (res.meta.status == 201) {
            // 获取角色列表数据
            this.getRoleDataList();
            // 添加角色对话框隐藏
            this.addRoleVisible = false;
            this.$message.success("添加角色成功");
          } else {
            this.$message.error("添加角色失败");
          }
        }
      });
    },

    // 关闭添加角色对话框后 重置添加角色表单内容
    resetAddRoleForm() {
      this.$refs.addRoleRef.resetFields();
    },

    // 显示修改角色对话框
    async showEditRoleVisible(id) {
      // 保存编辑角色当前的id
      this.editRoleID = id;
      // 发起获取当前角色的请求
      let { data: res } = await this.$http.get(`/roles/${id}}`);
      if (res.meta.status == 200) {
        // 设置编辑角色表单数据
        this.editRoleForm = res.data;
      } else {
        this.$message.error("获取当前角色数据失败");
      }

      // 编辑角色对话框显示
      this.editRoleVisible = true;
    },

    // 编辑角色功能
    editRole() {
      this.$refs.editRoleRef.validate(async (valid) => {
        if (valid) {
          // 发送编辑角色请求
          let { data: res } = await this.$http.put(
            `/roles/${this.editRoleID}}`,
            {
              roleName: this.editRoleForm.roleName,
              roleDesc: this.editRoleForm.roleDesc,
            }
          );
          if (res.meta.status == 200) {
            // 获取角色列表数据
            this.getRoleDataList();
            // 编辑角色对话框隐藏
            this.editRoleVisible = false;
            this.$message.success("编辑角色成功");
          } else {
            this.$message.error("编辑角色失败");
          }
        }
      });
    },

    // 关闭编辑角色对话框后 重置添加角色表单内容
    resetEditRoleForm() {
      this.$refs.editRoleRef.resetFields();
    },

    // 删除角色功能
    removeRole(id) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 发送删除角色请求
          let { data: res } = await this.$http.delete(`/roles/${id}}`);
          if (res.meta.status == 200) {
            // 获取角色列表数据
            this.getRoleDataList();
            this.$message.success("删除角色成功");
          } else {
            this.$message.error("删除角色失败");
          }
        })
        .catch(() => {
          this.$message.info("已取消删除角色");
        });
    },

    // 显示分配权限对话框
    async showAuthorityVisible(role) {
      // console.log(role);

      // 设置当前分配权限的角色id
      this.roleSetAuthorityId = role.id;
      // console.log(this.roleSetAuthorityId);

      // 发起获取当前用户的请求
      let { data: res } = await this.$http.get(`/rights/tree`);
      if (res.meta.status == 200) {
        // 设置分配权限表单数据
        this.setAuthorityArray = res.data;
        // console.log(this.setAuthorityArray);

        // 递归遍历三级分类
        this.recursion(role, this.defaultChecked);
      } else {
        this.$message.error("获取权限列表数据失败");
      }

      // 分配权限对话框显示
      this.setAuthorityVisible = true;
    },

    // 递归遍历三级分类
    recursion(role, array) {
      // console.log(role.children);
      // console.log(array);
      if (role.children) {
        role.children.forEach((item) => {
          this.recursion(item, array);
        });
      } else {
        array.push(role.id);
      }
    },

    // 分配权限功能
    async setAuthority() {
      // 全部选中的数组
      let array = [
        ...this.$refs.setAuthorityRef.getCheckedKeys(),
        ...this.$refs.setAuthorityRef.getHalfCheckedKeys(),
      ];
      // console.log(array);

      // 发起获取当前用户的请求
      let { data: res } = await this.$http.post(
        `/roles/${this.roleSetAuthorityId}/rights`,
        {
          rids: array.join(","),
        }
      );

      if (res.meta.status == 200) {
        // 获取角色列表数据
        this.getRoleDataList();
        // 分配权限对话框隐藏
        this.setAuthorityVisible = false;
        this.$message.success("设置角色权限成功");
      } else {
        this.$message.error("设置角色权限失败");
      }
    },

    // 关闭分配权限对话框后 清空分配权限数组  勾选上的数组 当前分配权限的角色id
    clearSetAuthorityArray() {
      this.setAuthorityArray = [];
      // console.log(this.setAuthorityArray);
      this.defaultChecked = [];
      // console.log(this.defaultChecked);
      this.roleSetAuthorityId = "";
      // console.log(this.roleSetAuthorityId);
    },

    // 关闭tag标签触发
    closeTag(row, authorityId) {
      console.log(row);
      console.log(authorityId);
      this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 发送删除权限请求
          let { data: res } = await this.$http.delete(
            `/roles/${row.id}/rights/${authorityId}`
          );
          if (res.meta.status == 200) {
            // 获取角色列表数据
            // this.getRoleDataList();

            // 为了提升用户体验 不请求数据 在数组的基础上删除
            // 当前行的children 等于 后端返回来删除后的数据
            row.children = res.data;

            this.$message.success("删除权限成功");
          } else {
            this.$message.error("删除权限失败");
          }
        })
        .catch(() => {
          this.$message.info("已取消删除权限");
        });
    },
  },
  computed: {},
  watch: {},
  mounted() {
    // 获取角色列表数据
    this.getRoleDataList();
  },
};
</script>

<style scoped lang="less">
/* 表格 */
/deep/.el-table__expanded-cell {
  padding: 20px 50px;
  .el-tag {
    margin: 10px;
  }
}
// 上边框
.borderTop {
  border-top: 1px solid #eeeeee;
}

// 下边框
.borderBottom {
  border-bottom: 1px solid #eeeeee;
}
</style>
