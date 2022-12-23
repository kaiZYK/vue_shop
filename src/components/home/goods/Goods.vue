<template>
  <div>
    <!-- 面包屑部分 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片部分 -->
    <el-card>
      <!-- 搜索部分 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <!-- 搜索输入框 -->
          <el-input
            placeholder="请输入内容"
            v-model="shopInfo.query"
            clearable
            @clear="getShopsDataList()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getShopsDataList()"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <!-- 添加商品按钮 -->
          <el-button type="primary" @click="addShop()">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 表格部分 -->
      <el-table :data="shopDataList" border stripe style="width: 100%">
        <el-table-column type="index" label="序号"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="700px">
        </el-table-column>
        <el-table-column prop="goods_price" label="价格(元)"> </el-table-column>
        <el-table-column prop="goods_number" label="商品数量">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="180px">
          <template slot-scope="scope">
            <!-- scope.row -->
            {{ scope.row.add_time | formattingTime() }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <!-- scope.row -->

            <!-- 编辑商品 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑商品"
              placement="top"
              :enterable="false"
            >
              <el-button type="primary" size="mini" icon="el-icon-edit">
              </el-button>
            </el-tooltip>

            <!-- 删除商品 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="删除商品"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="removeShop(scope.row.goods_id)"
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
        :current-page="shopInfo.pagenum"
        :page-sizes="[1, 2, 3, 5, 10]"
        :page-size="shopInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Goods",
  data() {
    return {
      // 商品列表数据
      shopDataList: [],

      // 请求的参数
      shopInfo: {
        // 查询的参数
        query: "",
        // 请求的页数
        pagenum: 1,
        // 请求的每一页的条数
        pagesize: 5,
      },

      // 商品的总数
      total: null,
    };
  },
  components: {},
  props: {},
  methods: {
    // 获取商品列表数据
    async getShopsDataList() {
      // 发送请求
      let { data: res } = await this.$http.get(
        `/goods?query=${this.shopInfo.query}&pagenum=${this.shopInfo.pagenum}&pagesize=${this.shopInfo.pagesize}`
      );
      if (res.meta.status == 200) {
        // 设置商品列表数据
        this.shopDataList = res.data.goods;
        // console.log(this.shopDataList);

        // 设置商品的总数
        this.total = res.data.total;
        // console.log(this.total);
      } else {
        this.$message.error("获取商品列表数据失败");
      }
    },

    // 分页页数改变后触发函数
    handleCurrentChange(value) {
      this.shopInfo.pagenum = value;
      // 获取商品列表数据
      this.getShopsDataList();
    },

    // 分页每一页的数据条数改变后触发函数
    handleSizeChange(value) {
      this.shopInfo.pagesize = value;
      // 获取商品列表数据
      this.getShopsDataList();
    },

    // 添加商品功能
    addShop() {
      this.$router.push("/add");
    },

    // 删除商品功能
    removeShop(id) {
      // console.log(id);
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 发送删除商品请求
          let { data: res } = await this.$http.delete(`/goods/${id}`);
          // console.log(res);
          if (res.meta.status == 200) {
            // 获取商品列表数据
            this.getShopsDataList();
            this.$message.success("删除商品成功");
          } else {
            this.$message.error("删除商品失败");
          }
        })
        .catch(() => {
          this.$message.info("已取消删除商品");
        });
    },
  },
  computed: {},
  watch: {},
  mounted() {
    // 获取商品列表数据
    this.getShopsDataList();
  },
  filters: {
    formattingTime(time) {
      let now = new Date(time);
      let year = now.getFullYear();
      let month =
        now.getMonth() + 1 < 10
          ? "0" + (now.getMonth() + 1)
          : now.getMonth() + 1;
      let date = now.getDate() < 10 ? "0" + now.getDate() : now.getDate();
      let hour = now.getHours() < 10 ? "0" + now.getHours() : now.getHours();
      let minute =
        now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
      let second =
        now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds();
      return `${year}-${month}-${date} ${hour}:${minute}:${second}`;
    },
  },
};
</script>

<style scoped lang="less"></style>
