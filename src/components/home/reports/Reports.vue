<template>
  <div>
    <!-- 面包屑部分 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片部分 -->
    <el-card>
      <!-- echarts容器 -->
      <div class="container"></div>
    </el-card>
  </div>
</template>

<script>
// 引入echarts框架
import * as echarts from "echarts";
// 引入lodash框架
import _ from "lodash";
export default {
  name: "Reports",
  data() {
    return {
      // 默认的echarts的配置项
      defaultEchartsOption: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
      },
    };
  },
  components: {},
  props: {},
  methods: {
    // 设置echarts图表
    async setEcharts() {
      let { data: res } = await this.$http.get(`reports/type/1`);
      console.log(res);
      if (res.meta.status == 200) {
        // 获取echarts容器
        let container = document.getElementsByClassName("container")[0];

        // 创建echarts实例
        let myChart = echarts.init(container);

        // echarts的配置项
        let option = _.merge(this.defaultEchartsOption, res.data);

        // 设置echarts的option配置项
        myChart.setOption(option);
      } else {
        this.$message.error("获取图表数据失败");
      }
    },
  },
  computed: {},
  watch: {},
  mounted() {
    // 设置echarts图表
    this.setEcharts();
  },
};
</script>

<style scoped lang="less">
// echarts容器
.container {
  width: 750px;
  height: 400px;
}
</style>
