<template>
  <div>
    <!-- 面包屑部分 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片部分 -->
    <el-card>
      <!-- 添加分类按钮 -->
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="primary" @click="showAddCateVisible()">
            添加分类
          </el-button>
        </el-col>
      </el-row>
      <!-- 表格部分 -->
      <tree-table
        class="table"
        :data="cateDataList"
        show-index
        index-text="序号"
        stripe
        :columns="tableColumns"
        :selection-type="false"
        :expand-type="false"
        border
      >
        <!-- 是否有效 -->
        <template slot="isDeleted" slot-scope="scope">
          <!-- scope.row -->
          <!-- {{ scope.row.cat_deleted }} -->
          <i class="el-icon-success" v-if="scope.row.cat_deleted == false"></i>
          <i
            class="el-icon-error"
            v-else-if="scope.row.cat_deleted == true"
          ></i>
        </template>

        <!-- 排序 -->
        <template slot="sort" slot-scope="scope">
          <!-- scope.row -->
          <!-- {{ scope.row.cat_level }} -->
          <el-tag size="mini" v-if="scope.row.cat_level == 0">一级</el-tag>
          <el-tag
            type="success"
            size="mini"
            v-else-if="scope.row.cat_level == 1"
          >
            二级
          </el-tag>
          <el-tag
            type="warning"
            size="mini"
            v-else-if="scope.row.cat_level == 2"
          >
            三级
          </el-tag>
        </template>

        <!-- 操作 -->
        <template slot="operation" slot-scope="scope">
          <!-- scope.row -->
          <!-- 编辑 -->
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="showEditCateVisible(scope.row.cat_id)"
            >编辑
          </el-button>

          <!-- 删除 -->

          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeCate(scope.row.cat_id)"
            >删除
          </el-button>
        </template>
      </tree-table>

      <!-- 分页部分 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="cateInfo.pagenum"
        :page-sizes="[1, 2, 3, 5, 10]"
        :page-size="cateInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateVisible"
      width="50%"
      @close="resetAddCateForm()"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateRules"
        ref="addCateRef"
        label-width="100px"
      >
        <el-form-item prop="cat_name" label="分类名称：">
          <el-input
            placeholder="请输入分类名称"
            v-model="addCateForm.cat_name"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <el-cascader
            v-model="checkoutCat_pid"
            :options="addCateOptions"
            :props="addCateProps"
            clearable
            placeholder="请选择父级分类"
            @change="checkoutCat_pidChange()"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类对话框 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editCateVisible"
      width="50%"
      @close="resetEditCateForm()"
    >
      <el-form
        :model="editCateForm"
        :rules="addCateRules"
        ref="editCateRef"
        label-width="100px"
      >
        <el-form-item prop="cat_name" label="分类名称：">
          <el-input
            placeholder="请输入分类名称"
            v-model="editCateForm.cat_name"
            clearable
          >
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Categories",
  data() {
    return {
      // 分类列表数据
      cateDataList: [],

      // 请求的参数
      cateInfo: {
        // 请求的页数
        pagenum: 1,
        // 请求的每一页的条数
        pagesize: 5,
      },

      // 权限的总数
      total: null,

      //表格的配置
      tableColumns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          prop: "cat_deleted",
          type: "template",
          template: "isDeleted",
        },
        {
          label: "排序",
          prop: "cat_level",
          type: "template",
          template: "sort",
        },
        {
          label: "操作",
          type: "template",
          template: "operation",
          width: "200px",
        },
      ],

      // 添加分类对话框显示与隐藏
      addCateVisible: false,

      // 添加分类表单数据
      addCateForm: {
        // 分类名称
        cat_name: "",
        // 父级份类id 默认为一级id
        cat_pid: 0,
        // 分类等级 默认为一级分类
        cat_level: 0,
      },

      // 级联的一级分类和二级分类数据
      addCateOptions: [],

      // 级联选中的父类id
      checkoutCat_pid: [],

      //  添加分类级联配置项
      addCateProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
        // 可以选择任意一项
        checkStrictly: true,
      },

      //  添加分类表单规则
      addCateRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },

      // 编辑分类对话框显示与隐藏
      editCateVisible: false,

      // 编辑分类表单数据
      editCateForm: {},

      // 编辑分类当前的id
      editCateID: null,
    };
  },
  components: {},
  props: {},
  methods: {
    // 获取分类列表数据
    async getCateDataList() {
      // 发送请求
      let { data: res } = await this.$http.get(`/categories`, {
        params: {
          pagenum: this.cateInfo.pagenum,
          pagesize: this.cateInfo.pagesize,
        },
      });
      // console.log(res);
      if (res.meta.status == 200) {
        // 设置权限列表数据
        this.cateDataList = res.data.result;

        // 设置权限总数
        this.total = res.data.total;
      } else {
        this.$message.error("获取分类列表数据失败");
      }
    },

    // 分页页数改变后触发函数
    handleCurrentChange(value) {
      this.cateInfo.pagenum = value;
      // 获取权限列表数据
      this.getCateDataList();
    },

    // 分页每一页的数据条数改变后触发函数
    handleSizeChange(value) {
      this.cateInfo.pagesize = value;
      // 获取权限列表数据
      this.getCateDataList();
    },

    // 显示添加分类对话框
    async showAddCateVisible() {
      // 发送请求
      let { data: res } = await this.$http.get(`/categories`, {
        params: {
          type: 2,
        },
      });
      // console.log(res);
      if (res.meta.status == 200) {
        // 设置级联的一级分类和二级分类数据
        this.addCateOptions = res.data;
      } else {
        this.$message.error("获取分类列表数据失败");
      }
      // 添加分类对话框显示
      this.addCateVisible = true;
    },

    // 选中的级联选中的父类id改变触发
    checkoutCat_pidChange() {
      // console.log(this.checkoutCat_pid);
      // 判断数组的长度来判断是要添加一级 二级 三级分类
      if (this.checkoutCat_pid.length == 0) {
        // 设置父级份类id
        this.addCateForm.cat_pid = 0;
        // 设置分类等级
        this.addCateForm.cat_level = this.checkoutCat_pid.length;
      } else if (this.checkoutCat_pid.length == 1) {
        // 设置父级份类id
        this.addCateForm.cat_pid = this.checkoutCat_pid[0];
        // 设置分类等级
        this.addCateForm.cat_level = this.checkoutCat_pid.length;
      } else if (this.checkoutCat_pid.length == 2) {
        // 设置父级份类id
        this.addCateForm.cat_pid = this.checkoutCat_pid[1];
        // 设置分类等级
        this.addCateForm.cat_level = this.checkoutCat_pid.length;
      }
      // console.log(this.addCateForm.cat_pid);
      // console.log(this.addCateForm.cat_level);
    },

    // 添加分类功能
    addCate() {
      this.$refs.addCateRef.validate(async (valid) => {
        if (valid) {
          // 发送添加分类请求
          let { data: res } = await this.$http.post("/categories", {
            cat_name: this.addCateForm.cat_name,
            cat_pid: this.addCateForm.cat_pid,
            cat_level: this.addCateForm.cat_level,
          });
          if (res.meta.status == 201) {
            // 获取分类列表数据
            this.getCateDataList();
            // 添加分类对话框隐藏
            this.addCateVisible = false;
            this.$message.success("添加分类成功");
          } else {
            // 添加分类对话框隐藏
            this.addCateVisible = false;
            this.$message.error("添加分类失败");
          }
        }
      });
    },

    // 关闭添加分类对话框后 重置添加分类表单内容
    resetAddCateForm() {
      // 重置添加分类名称表单数据
      this.$refs.addCateRef.resetFields();
      // 重置分类名称
      this.addCateForm.cat_name = "";
      // 重置父级份类id 默认为一级id
      this.addCateForm.cat_pid = 0;
      // 重置分类等级 默认为一级分类
      this.addCateForm.cat_level = 0;
      // 清空级联选中的父亲id
      this.checkoutCat_pid = [];
    },

    // 显示修改分类对话框
    async showEditCateVisible(id) {
      // 保存编辑分类当前的id
      this.editCateID = id;
      // 发起获取当前分类的请求
      let { data: res } = await this.$http.get(`/categories/${id}}`);
      if (res.meta.status == 200) {
        // 设置编辑分类表单数据
        this.editCateForm = res.data;
      } else {
        this.$message.error("获取当前分类数据失败");
      }

      // 编辑分类对话框显示
      this.editCateVisible = true;
    },

    // 编辑分类功能
    editCate() {
      this.$refs.editCateRef.validate(async (valid) => {
        if (valid) {
          // 发送编辑分类请求
          let { data: res } = await this.$http.put(
            `/categories/${this.editCateID}}`,
            {
              cat_name: this.editCateForm.cat_name,
            }
          );
          if (res.meta.status == 200) {
            // 获取分类列表数据
            this.getCateDataList();
            // 编辑分类对话框隐藏
            this.editCateVisible = false;
            this.$message.success("编辑分类成功");
          } else {
            this.$message.error("编辑分类失败");
          }
        }
      });
    },

    // 关闭编辑分类对话框后 重置添加分类表单内容
    resetEditCateForm() {
      this.$refs.editCateRef.resetFields();
    },

    // 删除分类功能
    removeCate(id) {
      this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 发送删除分类请求
          let { data: res } = await this.$http.delete(`/categories/${id}}`);
          if (res.meta.status == 200) {
            // 获取分类列表数据
            this.getCateDataList();
            this.$message.success("删除分类成功");
          } else {
            this.$message.error("删除分类失败");
          }
        })
        .catch(() => {
          this.$message.info("已取消删除分类");
        });
    },
  },
  computed: {},
  watch: {},
  mounted() {
    // 获取分类列表数据
    this.getCateDataList();
  },
};
</script>

<style scoped lang="less">
/* 表格 */
.table {
  margin-top: 15px;
}

/* 成功的icon */
.el-icon-success {
  color: #90ee90;
}
/* 失败的icon */
.el-icon-error {
  color: red;
}
/* 级联 */
.el-cascader {
  width: 100%;
}
</style>
