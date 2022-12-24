<template>
  <div>
    <!-- 面包屑部分 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片部分 -->
    <el-card>
      <!-- 搜索部分 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <!-- 搜索输入框 -->
          <el-input
            placeholder="请输入搜索内容"
            v-model="orderInfo.query"
            clearable
            @clear="getOrdersDataList()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrdersDataList()"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 表格部分 -->
      <el-table :data="ordersDataList" border stripe style="width: 100%">
        <el-table-column type="index" label="序号"> </el-table-column>
        <el-table-column prop="order_number" width="200px" label="订单编号">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格"> </el-table-column>
        <el-table-column prop="pay_status" label="是否支付">
          <template slot-scope="scope">
            <!-- scope.row -->
            <!-- {{ scope.row.pay_status }} -->
            <el-tag type="success" v-if="scope.row.pay_status == 1">
              已付款
            </el-tag>
            <el-tag type="warning" v-if="scope.row.pay_status == 0"
              >未付款</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"> </el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope">
            <!-- scope.row -->
            {{ scope.row.create_time | formattingTime() }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100px">
          <template slot-scope="scope">
            <!-- scope.row -->

            <!-- 修改地址 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="修改地址"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-edit"
                circle
                @click="editAddressVisible = true"
              >
              </el-button>
            </el-tooltip>

            <!-- 查看物流 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="查看物流"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="success"
                size="mini"
                icon="el-icon-location"
                circle
                @click="showLogisticsVisible()"
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
        :current-page="orderInfo.pagenum"
        :page-sizes="[1, 2, 3, 5, 10]"
        :page-size="orderInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 修改地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="editAddressVisible"
      width="50%"
      @close="resetEditAddressForm()"
    >
      <el-form
        :model="editAddressForm"
        :rules="editAddressRules"
        ref="editAddressRef"
        label-width="100px"
      >
        <el-form-item prop="address1" label="省市区/县：">
          <el-cascader
            v-model="editAddressForm.address1"
            :options="cityData"
            :props="addressProps"
            placeholder="请选择省市区/县"
          ></el-cascader>
        </el-form-item>
        <el-form-item prop="address2" label="详细地址：">
          <el-input
            placeholder="请输入详细地址"
            v-model="editAddressForm.address2"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editAddressVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAddressVisible = false">
          确 定
        </el-button>
      </span>
    </el-dialog>

    <!-- 查看物流对话框 -->
    <el-dialog title="查看物流" :visible.sync="logisticsVisible" width="50%">
      <el-timeline reverse="reverse">
        <el-timeline-item
          v-for="(item, index) in logisticsDataList"
          :key="item.time"
          :timestamp="item.time"
        >
          {{ item.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
// 导入地址数据
import citydata from "./citydata.js";
export default {
  name: "Orders",
  data() {
    return {
      // 订单列表数据
      ordersDataList: [],

      // 请求的参数
      orderInfo: {
        // 查询的参数
        query: "",
        // 请求的页数
        pagenum: 1,
        // 请求的每一页的条数
        pagesize: 5,
      },

      // 订单的总数
      total: null,

      // 修改地址表单数据
      editAddressForm: {
        address1: [],
        address2: "",
      },

      // 地址数据源
      cityData: citydata,

      // 修改地址级联配置项
      addressProps: {
        expandTrigger: "hover",
        value: "value",
        label: "label",
        children: "children",
      },

      // 修改地址表单规则
      editAddressRules: {
        address1: [
          { required: true, message: "请选择省市区/县", trigger: "blur" },
        ],
        address2: [
          { required: false, message: "请输入详细地址", trigger: "blur" },
        ],
      },

      // 修改地址对话框显示与隐藏
      editAddressVisible: false,

      // 物流数据
      logisticsDataList: [
        {
          time: "2018-05-10 09:39:00",
          ftime: "2018-05-10 09:39:00",
          context: "已签收,感谢使用顺丰,期待再次为您服务",
          location: "",
        },
        {
          time: "2018-05-10 08:23:00",
          ftime: "2018-05-10 08:23:00",
          context:
            "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
          location: "",
        },
        {
          time: "2018-05-10 07:32:00",
          ftime: "2018-05-10 07:32:00",
          context: "快件到达 [北京海淀育新小区营业点]",
          location: "",
        },
        {
          time: "2018-05-10 02:03:00",
          ftime: "2018-05-10 02:03:00",
          context:
            "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
          location: "",
        },
        {
          time: "2018-05-09 23:05:00",
          ftime: "2018-05-09 23:05:00",
          context: "快件到达 [北京顺义集散中心]",
          location: "",
        },
        {
          time: "2018-05-09 21:21:00",
          ftime: "2018-05-09 21:21:00",
          context: "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
          location: "",
        },
        {
          time: "2018-05-09 13:07:00",
          ftime: "2018-05-09 13:07:00",
          context: "顺丰速运 已收取快件",
          location: "",
        },
        {
          time: "2018-05-09 12:25:03",
          ftime: "2018-05-09 12:25:03",
          context: "卖家发货",
          location: "",
        },
        {
          time: "2018-05-09 12:22:24",
          ftime: "2018-05-09 12:22:24",
          context: "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
          location: "",
        },
        {
          time: "2018-05-08 21:36:04",
          ftime: "2018-05-08 21:36:04",
          context: "商品已经下单",
          location: "",
        },
      ],
      // 查看物流对话框显示与隐藏
      logisticsVisible: false,
    };
  },
  components: {},
  props: {},
  methods: {
    // 获取订单列表数据
    async getOrdersDataList() {
      // 发送请求
      let { data: res } = await this.$http.get(
        `/orders?query=${this.orderInfo.query}&pagenum=${this.orderInfo.pagenum}&pagesize=${this.orderInfo.pagesize}`
      );
      if (res.meta.status == 200) {
        // 设置订单列表数据
        this.ordersDataList = res.data.goods;
        // console.log(this.ordersDataList);

        // 设置订单的总数
        this.total = res.data.total;
        // console.log(this.total);
      } else {
        this.$message.error("获取订单列表数据失败");
      }
    },

    // 分页页数改变后触发函数
    handleCurrentChange(value) {
      this.orderInfo.pagenum = value;
      // 获取订单列表数据
      this.getOrdersDataList();
    },

    // 分页每一页的数据条数改变后触发函数
    handleSizeChange(value) {
      this.orderInfo.pagesize = value;
      // 获取订单列表数据
      this.getOrdersDataList();
    },

    // 关闭修改地址对话框后 重置修改地址表单内容
    resetEditAddressForm() {
      this.$refs.editAddressRef.resetFields();
    },

    // 查看物流对话框显示
    async showLogisticsVisible() {
      // 后台获取物流数据失败 设置到本地数据
      // let { data: res } = await this.$http.get(`/kuaidi/1106975712662`);
      // console.log(res);
      // if (res.meta.status == 200) {
      //   // 设置物流数据
      //   this.logisticsDataList = res.data;
      // } else {
      //   this.$message.error("获取物流数据失败");
      // }

      // 查看物流对话框显示
      this.logisticsVisible = true;
    },
  },
  computed: {},
  watch: {},
  mounted() {
    // 获取订单列表数据
    this.getOrdersDataList();
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

<style scoped lang="less">
/* 级联 */
.el-cascader {
  width: 100%;
}
</style>
