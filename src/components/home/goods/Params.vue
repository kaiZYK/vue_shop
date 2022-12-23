<template>
  <div>
    <!-- 面包屑部分 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片部分 -->
    <el-card>
      <!-- 提示信息部分 -->
      <el-alert
        title="注意: 只允许为第三级分类设置相关参数!"
        type="warning"
        show-icon
      >
      </el-alert>
      <!-- 选择商品分类部分 -->
      <span class="cascaderTitle">选择商品分类: </span>
      <el-cascader
        v-model="checkoutCateId"
        :options="cateOptions"
        :props="cateProps"
        clearable
        placeholder="请选择商品分类"
        @change="checkoutCateIdChange()"
      ></el-cascader>

      <!-- 选项卡部分 -->
      <el-tabs v-model="tabsActiveName" @tab-click="handleClick">
        <!--  动态参数部分 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加参数按钮 -->
          <el-row :gutter="20">
            <el-col :span="4">
              <el-button
                type="primary"
                size="mini"
                @click="addCateVisible = true"
                :disabled="this.checkoutCateId.length == 0"
              >
                添加参数
              </el-button>
            </el-col>
          </el-row>
          <!-- 表格部分 -->
          <el-table :data="manyData" border stripe style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- scope.row -->
                <!-- {{ scope.row }} -->
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="removeAttr(scope.row, item)"
                >
                  {{ item }}
                </el-tag>

                <!-- 添加tag -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.addTagVisible"
                  v-model="scope.row.addTagValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showAddTagVisible(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="序号"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作" width="300px">
              <template slot-scope="scope">
                <!-- scope.row -->

                <!-- 编辑 -->
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="
                    showEditCateVisible(scope.row.attr_id, scope.row.cat_id)
                  "
                  >编辑
                </el-button>

                <!-- 删除 -->

                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="removeCate(scope.row.attr_id, scope.row.cat_id)"
                  >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!--  静态属性部分 -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加属性按钮 -->
          <el-row :gutter="20">
            <el-col :span="4">
              <el-button
                type="primary"
                size="mini"
                @click="addCateVisible = true"
                :disabled="this.checkoutCateId.length == 0"
              >
                添加属性
              </el-button>
            </el-col>
          </el-row>
          <!-- 表格部分 -->
          <el-table :data="onlyData" border stripe style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- scope.row -->
                <!-- {{ scope.row }} -->
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="removeAttr(scope.row, item)"
                >
                  {{ item }}
                </el-tag>

                <!-- 添加tag -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.addTagVisible"
                  v-model="scope.row.addTagValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showAddTagVisible(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="序号"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作" width="300px">
              <template slot-scope="scope">
                <!-- scope.row -->

                <!-- 编辑 -->
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="
                    showEditCateVisible(scope.row.attr_id, scope.row.cat_id)
                  "
                  >编辑
                </el-button>

                <!-- 删除 -->

                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="removeCate(scope.row.attr_id, scope.row.cat_id)"
                  >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数对话框 -->
    <el-dialog
      :title="`添加${getManyOnlyName}`"
      :visible.sync="addCateVisible"
      width="50%"
      @close="resetAddCateForm()"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateRules"
        ref="addCateRef"
        label-width="130px"
      >
        <el-form-item prop="attr_name" :label="`${getManyOnlyName}名称：`">
          <el-input
            :placeholder="`请输入${getManyOnlyName}名称`"
            v-model="addCateForm.attr_name"
            clearable
          >
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑参数对话框 -->
    <el-dialog
      :title="`编辑${getManyOnlyName}`"
      :visible.sync="editCateVisible"
      width="50%"
      @close="resetEditCateForm()"
    >
      <el-form
        :model="editCateForm"
        :rules="addCateRules"
        ref="editCateRef"
        label-width="130px"
      >
        <el-form-item prop="attr_name" :label="`${getManyOnlyName}名称：`">
          <el-input
            :placeholder="`请输入${getManyOnlyName}名称`"
            v-model="editCateForm.attr_name"
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
  name: "Params",
  data() {
    return {
      // 级联的商品分类数据
      cateOptions: [],

      // 级联选中的商品分类id
      checkoutCateId: [],

      //  商品分类级联配置项
      cateProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },

      // 选项卡选中的数据
      tabsActiveName: "many",

      // 动态参数数据
      manyData: [],

      // 静态属性数据
      onlyData: [],

      // 添加参数对话框显示与隐藏
      addCateVisible: false,

      // 添加参数表单数据
      addCateForm: {
        // 参数名称
        attr_name: "",
      },

      //  添加参数表单规则
      addCateRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },

      // 编辑参数对话框显示与隐藏
      editCateVisible: false,

      // 编辑参数表单数据
      editCateForm: {},

      // 当前分类的属性id
      attr_id: null,

      // 当前分类的分类id
      cat_id: null,
    };
  },
  components: {},
  props: {},
  methods: {
    // 获取商品分类数据
    async getCateData() {
      // 发送请求
      let { data: res } = await this.$http.get(`/categories`);
      // console.log(res);
      if (res.meta.status == 200) {
        // 设置级联商品分类数据
        this.cateOptions = res.data;
      } else {
        this.$message.error("获取商品分类数据失败");
      }
    },

    // 选中的级联选中的父类id改变触发
    checkoutCateIdChange() {
      // console.log(this.checkoutCateId);
      // 判断选中的id是否不为空 发送请求
      if (this.checkoutCateId.length != 0) {
        // 获取动态参数或静态属性数据
        this.getManyOnlyData();
      } else {
        // 重置动态参数和静态属性数据
        this.manyData = [];
        this.onlyData = [];
      }
    },

    // 获取动态参数或静态属性数据
    async getManyOnlyData() {
      let { data: res } = await this.$http.get(
        `categories/${
          this.checkoutCateId[this.checkoutCateId.length - 1]
        }/attributes`,
        {
          params: {
            sel: this.tabsActiveName,
          },
        }
      );
      // console.log(res);
      if (res.meta.status == 200) {
        res.data.forEach((item) => {
          // 判断是否为空 如果为空 就为空数组
          item.attr_vals =
            item.attr_vals == "" ? [] : item.attr_vals.split(" ");

          // 在每一项上面添加tag输入框的显示与隐藏
          item.addTagVisible = false;

          // 在每一项上面添加添加tag输入框的值
          item.addTagValue = "";
        });
        // 判断请求的是动态参数还是静态属性
        if (this.tabsActiveName == "many") {
          // 设置动态参数数据
          this.manyData = res.data;
          // console.log(this.manyData);
        } else if (this.tabsActiveName == "only") {
          // 设置静态属性数据
          this.onlyData = res.data;
          // console.log(this.onlyData);
        }
      } else {
        this.$message.error(`获取${this.getManyOnlyName}数据失败`);
      }
    },

    // 选中选项卡触发
    handleClick(tab, event) {
      // console.log(tab);
      // console.log(event);
      // console.log(this.tabsActiveName);

      // 判断选中的id是否不为空 发送请求
      if (this.checkoutCateId.length != 0) {
        // 获取动态参数或静态属性数据
        this.getManyOnlyData();
      } else {
        this.$message.error(`获取${this.getManyOnlyName}数据失败`);
      }
    },

    // 添加参数功能
    addCate() {
      this.$refs.addCateRef.validate(async (valid) => {
        if (valid) {
          // 发送添加参数请求
          let { data: res } = await this.$http.post(
            `/categories/${
              this.checkoutCateId[this.checkoutCateId.length - 1]
            }/attributes`,
            {
              attr_name: this.addCateForm.attr_name,
              attr_sel: this.tabsActiveName,
            }
          );
          if (res.meta.status == 201) {
            // 获取参数列表数据
            this.getManyOnlyData();
            // 添加参数对话框隐藏
            this.addCateVisible = false;
            this.$message.success(`添加${this.getManyOnlyName}成功`);
          } else {
            this.$message.error(`添加${this.getManyOnlyName}失败`);
          }
        }
      });
    },

    // 关闭添加参数对话框后 重置添加参数表单内容
    resetAddCateForm() {
      this.$refs.addCateRef.resetFields();
    },

    // 显示修改参数对话框
    async showEditCateVisible(attr_id, cat_id) {
      // 设置当前属性id
      this.attr_id = attr_id;
      // 设置当前分类id
      this.cat_id = cat_id;

      // 发起获取当前参数的请求
      let { data: res } = await this.$http.get(
        `/categories/${this.cat_id}/attributes/${this.attr_id}`
      );
      if (res.meta.status == 200) {
        // 设置编辑参数表单数据
        this.editCateForm = res.data;
      } else {
        this.$message.error(`获取${this.getManyOnlyName}数据失败`);
      }

      // 编辑参数对话框显示
      this.editCateVisible = true;
    },

    // 编辑参数功能
    editCate() {
      this.$refs.editCateRef.validate(async (valid) => {
        if (valid) {
          // 发送编辑参数请求
          let { data: res } = await this.$http.put(
            `/categories/${this.cat_id}/attributes/${this.attr_id}`,
            {
              attr_name: this.editCateForm.attr_name,
              attr_sel: this.tabsActiveName,
            }
          );
          if (res.meta.status == 200) {
            // 获取参数列表数据
            this.getManyOnlyData();
            // 编辑参数对话框隐藏
            this.editCateVisible = false;
            this.$message.success(`编辑${this.getManyOnlyName}成功`);
          } else {
            this.$message.error(`编辑${this.getManyOnlyName}失败`);
          }
        }
      });
    },

    // 关闭编辑参数对话框后 重置添加参数表单内容
    resetEditCateForm() {
      this.$refs.editCateRef.resetFields();
    },

    // 删除参数功能
    removeCate(attr_id, cat_id) {
      this.$confirm("此操作将永久删除该参数, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 发送删除参数请求
          let { data: res } = await this.$http.delete(
            `/categories/${cat_id}/attributes/${attr_id}`
          );
          if (res.meta.status == 200) {
            // 获取参数列表数据
            this.getManyOnlyData();
            this.$message.success(`删除${this.getManyOnlyName}成功`);
          } else {
            this.$message.error(`删除${this.getManyOnlyName}失败`);
          }
        })
        .catch(() => {
          this.$message.info(`已取消删除${this.getManyOnlyName}`);
        });
    },

    // 编辑动态参数或静态属性tag功能
    async addAttr_vals(row) {
      // 发送添加参数请求
      let { data: res } = await this.$http.put(
        `/categories/${row.cat_id}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" "),
        }
      );
      // console.log(row);
      // console.log(res);
      if (res.meta.status == 200) {
        // 获取参数列表数据
        // this.getManyOnlyData();

        // 提升用户体验 编辑完成之后不请求数据刷新页面 重新赋值
        row.attr_vals = res.data.attr_vals.split(" ");
        this.$message.success(`编辑${this.getManyOnlyName}成功`);
      } else {
        this.$message.error(`编辑${this.getManyOnlyName}失败`);
      }
    },

    // 删除动态参数或静态属性的tag值
    removeAttr(row, value) {
      // console.log(row);
      // console.log(value);
      // 查找当前要删除的下标
      let index = row.attr_vals.findIndex((item) => {
        return item == value;
      });
      // console.log(index);

      // 数组删除要删除的元素
      row.attr_vals.splice(index, 1);
      // console.log(row.attr_vals);

      // 编辑动态参数或静态属性tag功能
      this.addAttr_vals(row);
    },

    // 添加tag输入框的显示
    showAddTagVisible(row) {
      // 添加tag输入框的显示
      row.addTagVisible = true;
      // 文本框自动获取焦点
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    // 输入框按下回车失去焦点触发
    handleInputConfirm(row) {
      // 判断输入的值去除空格是否为空
      if (row.addTagValue.trim() != "") {
        // 数组添加值
        row.attr_vals.push(row.addTagValue);

        // 编辑动态参数或静态属性tag功能
        this.addAttr_vals(row);
      }

      // 添加tag输入框的隐藏
      row.addTagVisible = false;

      // 清空输入框的内容
      row.addTagValue = "";
    },
  },
  computed: {
    // 获取动态参数或静态属性的名字
    getManyOnlyName() {
      if (this.tabsActiveName == "many") {
        return "动态参数";
      } else if (this.tabsActiveName == "only") {
        return "静态属性";
      }
    },
  },
  watch: {},
  mounted() {
    // 获取商品分类数据
    this.getCateData();
  },
};
</script>

<style scoped lang="less">
/* 级联名称 */
.cascaderTitle {
  font-size: 12px;
}

/* 下拉级联 */
.el-cascader {
  margin: 15px 0px;
}

/* tag标签部分 */
.el-tag {
  margin: 5px;
}

/* tag按钮 */
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

/* tag添加标签 */
.input-new-tag {
  width: 90px;
  margin-left: 10px;
}
</style>
