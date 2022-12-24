<template>
  <div>
    <!-- 面包屑部分 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片部分 -->
    <el-card>
      <!-- 头部提示信息 -->
      <el-alert title="添加商品信息" type="info" center show-icon> </el-alert>

      <!-- 步骤条 -->
      <el-steps :active="stepsActive - 0" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tabs标签侧边栏 -->
      <el-tabs
        tab-position="left"
        style="height: 200px"
        :value="stepsActive"
        :before-leave="TabsBeforeLeave"
      >
        <el-tab-pane label="基本信息" name="0">
          <el-form :model="addShopForm" :rules="addShopRules" ref="addShopRef">
            <el-form-item prop="goods_name" :label="`商品名称：`">
              <el-input
                :placeholder="`请输入商品名称`"
                v-model="addShopForm.goods_name"
                clearable
              >
              </el-input>
            </el-form-item>
            <el-form-item prop="goods_price" :label="`商品价格：`">
              <el-input
                :placeholder="`请输入商品价格`"
                v-model="addShopForm.goods_price"
                type="number"
                clearable
              >
              </el-input>
            </el-form-item>
            <el-form-item prop="goods_weight" :label="`商品重量：`">
              <el-input
                :placeholder="`请输入商品重量`"
                v-model="addShopForm.goods_weight"
                type="number"
                clearable
              >
              </el-input>
            </el-form-item>
            <el-form-item prop="goods_number" :label="`商品数量：`">
              <el-input
                :placeholder="`请输入商品数量`"
                v-model="addShopForm.goods_number"
                type="number"
                clearable
              >
              </el-input>
            </el-form-item>
            <el-form-item prop="goods_cat" :label="`商品分类：`">
              <el-cascader
                v-model="addShopForm.goods_cat"
                :options="cateOptions"
                :props="cateProps"
                clearable
                placeholder="请选择商品分类"
                @change="checkoutCateIdChange()"
              ></el-cascader>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
          <el-row v-for="(item1, index1) in manyData" :key="item1.attr_id">
            <el-col :span="24">
              <el-row>
                <el-col :span="24" class="manyDataTitle">
                  {{ item1.attr_name }}
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <!-- {{ item1.attr_vals }} -->
                  <el-checkbox-group v-model="item1.attr_vals">
                    <el-checkbox
                      v-for="(item2, index2) in item1.attr_vals"
                      :key="index2"
                      :label="item2"
                      border
                    >
                    </el-checkbox>
                  </el-checkbox-group>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
          <el-form>
            <el-form-item
              :label="item.attr_name"
              v-for="(item, index) in onlyData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals" clearable></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <!-- 上传 -->
          <el-upload
            action="http://127.0.0.1:8888/api/private/v1/upload"
            :headers="uploadHeaders"
            :file-list="fileList"
            list-type="picture"
            :on-success="handleSuccess"
            :on-error="handleError"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <quill-editor v-model="addShopForm.goods_introduce"> </quill-editor>
          <!-- 添加商品 -->
          <el-button type="primary" @click="addShop()" class="addShop"
            >添加商品</el-button
          >
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 查看图片的缩略图对话框 -->
    <el-dialog
      title="图片预览"
      :visible.sync="picCateVisible"
      width="50%"
      @close="clearPicSrc()"
    >
      <img :src="picSrc" class="picSrc" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Add",
  data() {
    return {
      // 步骤条选中项
      stepsActive: 0,

      // 级联的商品分类数据
      cateOptions: [],

      //  商品分类级联配置项
      cateProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },

      // 添加商品表单数据
      addShopForm: {
        // 商品名称
        goods_name: "",
        // 商品价格
        goods_price: "",
        // 商品重量
        goods_weight: "",
        // 商品数量
        goods_number: "",
        // 商品分类 级联选中的商品分类id
        goods_cat: [],
        // 商品的参数 动态参数和静态属性
        attrs: [],
        // 上传的图片临时路径
        pics: [],
        // 商品介绍
        goods_introduce: "",
      },

      //  添加商品表单规则
      addShopRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },

      // 动态参数数据
      manyData: [],

      // 静态属性数据
      onlyData: [],

      // 上传图片的请求头
      uploadHeaders: {
        Authorization: window.sessionStorage.getItem("token"),
      },

      // 图片上传成功的列表
      fileList: [],

      // 查看图片的缩略图对话框显示与隐藏
      picCateVisible: false,

      // 查看图片的缩略图的路径
      picSrc: "",
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
      // console.log(this.addShopForm.goods_cat);
      // 判断选中的id是否不为空 发送请求
      if (this.addShopForm.goods_cat.length != 3) {
        // 选中的不是三级分类删除数组id
        this.addShopForm.goods_cat = [];
        // 重置动态参数和静态属性数据
        this.manyData = [];
        this.onlyData = [];
        // console.log(this.addShopForm.goods_cat);
      }
    },

    // 获取动态参数数据
    async getManyData() {
      // 获取动态参数
      let { data: res } = await this.$http.get(
        `categories/${
          this.addShopForm.goods_cat[this.addShopForm.goods_cat.length - 1]
        }/attributes`,
        {
          params: {
            sel: "many",
          },
        }
      );
      // console.log(res);
      if (res.meta.status == 200) {
        res.data.forEach((item) => {
          // 判断是否为空 如果为空 就为空数组
          item.attr_vals =
            item.attr_vals == "" ? [] : item.attr_vals.split(" ");
        });
        // 设置动态参数数据
        this.manyData = res.data;
        // console.log(this.manyData);
      } else {
        this.$message.error(`获取动态参数数据失败`);
      }
    },

    // 获取静态属性数据
    async getOnlyData() {
      // 获取静态属性
      let { data: res } = await this.$http.get(
        `categories/${
          this.addShopForm.goods_cat[this.addShopForm.goods_cat.length - 1]
        }/attributes`,
        {
          params: {
            sel: "only",
          },
        }
      );
      // console.log(res);
      if (res.meta.status == 200) {
        // res.data.forEach((item) => {
        //   // 判断是否为空 如果为空 就为空数组
        //   item.attr_vals =
        //     item.attr_vals == "" ? [] : item.attr_vals.split(" ");
        // });
        // 设置静态属性数据
        this.onlyData = res.data;
        // console.log(this.onlyData);
      } else {
        this.$message.error(`获取静态属性数据失败`);
      }
    },

    // 切换标签的触发函数
    TabsBeforeLeave(activeName, oldActiveName) {
      // console.log(activeName);
      // console.log(oldActiveName);

      // console.log(this.stepsActive);

      if (activeName == "0") {
        // 设置当前的选中的为新的值
        this.stepsActive = activeName;
      } else {
        // 设置当前的选中的为新的值
        this.stepsActive = activeName;

        // 判断商品分类 级联选中的商品分类id数组长度是否为3 判断是否选中三级分类
        if (this.addShopForm.goods_cat.length == 3) {
          // 设置当前的选中的为新的值
          this.stepsActive = activeName;

          // 判断是1 或者 2 来获取动态参数或静态属性数据
          if (activeName == "1") {
            // 获取动态参数数据
            this.getManyData();
          } else if (activeName == "2") {
            // 获取静态属性数据
            this.getOnlyData();
          }
        } else {
          // 没有选中三级分类 不能切换tabs 为0
          this.stepsActive = "0";
          // console.log(this.stepsActive);
          this.$message.error("请先选择商品分类");
          // 禁止切换tags标签
          return false;
        }
      }
    },

    // 上传图片成功触发
    handleSuccess(response, file, fileList) {
      // console.log(response);
      // console.log(file);
      // console.log(fileList);

      // 添加到图片列表数组
      this.fileList.push({
        name: file.name,
        url: file.response.data.url,
        tmp_path: file.response.data.tmp_path,
        uid: file.uid,
      });
      // console.log(this.fileList);

      // 清空请求的临时路径数组
      this.addShopForm.pics = [];

      // 遍历图片列表数组把每一项的tmp_path拿出来
      this.fileList.forEach((item) => {
        // 临时路径数组重新添加
        this.addShopForm.pics.push({
          pic: item.tmp_path,
        });
      });
      // console.log(this.addShopForm.pics);

      this.$message.success("上传图片成功");
    },

    // 上传图片失败触发
    handleError(err, file, fileList) {
      // console.log(err);
      // console.log(file);
      // console.log(fileList);
      this.$message.error("上传图片失败");
    },

    // 删除上传的图片触发
    handleRemove(file, fileList) {
      // console.log(file);
      // console.log(fileList);
      // 查找要删除图片的下标
      let index = this.fileList.findIndex((item) => {
        return item.uid == file.uid;
      });
      // console.log(index);
      // 删除当前下标的图片对象
      this.fileList.splice(index, 1);
      // console.log(this.fileList);

      // 清空请求的临时路径数组
      this.addShopForm.pics = [];

      // 遍历图片列表数组把每一项的tmp_path拿出来
      this.fileList.forEach((item) => {
        // 临时路径数组重新添加
        this.addShopForm.pics.push({
          pic: item.tmp_path,
        });
      });
      // console.log(this.addShopForm.pics);

      this.$message.success("删除图片成功");
    },

    // 点击上传的图片查看缩略图触发
    handlePreview(file) {
      // console.log(file);
      // 查看图片的缩略图对话框显示
      this.picCateVisible = true;

      // 设置查看图片的缩略图的路径
      this.picSrc = file.url;
    },

    // 查看图片的缩略图对话框关闭是触发 清空图片路径
    clearPicSrc() {
      // 清空查看图片的缩略图的路径
      this.picSrc = "";
    },

    // 添加商品功能
    addShop() {
      this.$refs.addShopRef.validate(async (valid) => {
        if (valid) {
          // 遍历动态参数放入attrs商品的参数中
          this.manyData.forEach((item) => {
            this.addShopForm.attrs.push({
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(","),
            });
          });

          // 遍历静态属性放入attrs商品的参数中
          this.onlyData.forEach((item) => {
            this.addShopForm.attrs.push({
              attr_id: item.attr_id,
              attr_value: item.attr_vals,
            });
          });

          // 发送添加参数请求
          let { data: res } = await this.$http.post(`/goods/`, {
            goods_name: this.addShopForm.goods_name,
            goods_price: this.addShopForm.goods_price,
            goods_weight: this.addShopForm.goods_weight,
            goods_number: this.addShopForm.goods_number,
            goods_cat: this.addShopForm.goods_cat.join(","),
            attrs: this.addShopForm.attrs,
            pics: this.addShopForm.pics,
            goods_introduce: this.addShopForm.goods_introduce,
          });
          // console.log(res);

          if (res.meta.status == 201) {
            // 路由重定向到商品列表页
            this.$router.push("/goods");

            //  重置添加商品表单内容
            this.$refs.addShopRef.resetFields();

            this.$message.success(`添加商品成功`);
          } else {
            this.$message.error(`添加商品失败`);
          }
        } else {
          this.$message.error(`请填写表单中的必填项`);
        }
      });
    },
  },
  computed: {},
  watch: {},
  mounted() {
    // 获取商品分类数据
    this.getCateData();
  },
};
</script>

<style scoped lang="less">
/* 步骤条 */
.el-steps {
  margin: 15px 0px;
  box-sizing: border-box;
  padding: 0 60px;
}

/deep/.el-step__title {
  font-size: 12px !important;
  margin-left: -12px;
}

/*  tabs标签侧边栏 */
.el-tabs {
  height: auto !important;
}

/* 输入框 */
.el-input {
  margin-top: 10px;
}

/* 级联 */
.el-cascader {
  display: block;
  width: 220px;
  margin-top: 50px;
}

/* 动态参数的标题 */
.manyDataTitle {
  color: #606266;
}

/* 多选框组 */
.el-checkbox-group {
  margin: 15px 0px;
  .el-checkbox {
    margin: 5px;
  }
}

/* 缩略图图片 */
.picSrc {
  width: 100%;
}

/* 富文本框 */
/deep/.ql-container {
  min-height: 300px;
}

/* 添加商品 */
.addShop {
  margin-top: 15px;
}
</style>
