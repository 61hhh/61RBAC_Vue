<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:12px;">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>疫情防控</el-breadcrumb-item>
      <el-breadcrumb-item>疫情地图</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 界面上方 疫情信息图表和el-card -->
    <el-row :gutter="10">
      <!-- echarts图表 -->
      <el-col :span="12">
        <el-card>
          <div id="myChart" style="height: 520px"></div>
        </el-card>
      </el-col>
      <!-- table -->
      <el-col :span="12">
        <div style="height: 520px">
          <el-tabs type="border-card" style="width: 840px">
            <el-tab-pane label="疫情概览">
              <el-table height="520" border :data="info" v-loading="loading" >
                <el-table-column prop="name" label="名称">
                </el-table-column>
                <el-table-column prop="value" label="数量">
                  <template slot-scope="scope">
                    <el-tag effect="plain" size="mini">{{ scope.row.value }}人</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="yesterday" label="较昨日">
                  <template slot-scope="scope">
                    <el-tag effect="plain" size="mini" v-if="scope.row.yesterday>0" type="danger">
                      {{ scope.row.yesterday }} 人
                    </el-tag>
                    <el-tag effect="plain" size="mini" v-else type="success">{{ scope.row.yesterday }}人</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="time" label="时间">
                  <span style="font-size: 11px;">{{ times }}</span>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <!-- TOP10城市 -->
            <el-tab-pane label="Top10城市">
              <el-table height="520" border :data="top10" style="font-size: 10px;">
                <el-table-column prop="name" label="城市名"></el-table-column>
                <el-table-column prop="ename" label="英文"></el-table-column>
                <el-table-column prop="jwsrNum" label="境外输入">
                  <template slot-scope="scope">
                    <el-tag v-text="scope.row.jwsrNum+'人'" size="mini" type="danger" effect="plain"></el-tag>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
    </el-row>

    <!-- 城市概况总览 -->
    <el-row :gutter="10" style="margin-top:10px;">
      <el-col :span="24">
        <div class="grid-content bg-purple">
          <el-card>
            <el-table stripe :data="tableData" style="width: 100%;">
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <el-table :data="scope.row.city" style="width: 100%">
                    <el-table-column prop="name" label="城市/区" width="200"></el-table-column>

                    <el-table-column sortable label="现存确诊" prop="econNum"></el-table-column>
                    <el-table-column sortable label="累计确诊" prop="cureNum"></el-table-column>
                    <el-table-column sortable label="疑似" prop="susNum"></el-table-column>
                    <el-table-column sortable label="死亡" prop="deathNum"></el-table-column>
                    <el-table-column sortable label="现存无症状" prop="asymptomNum"></el-table-column>
                  </el-table>
                </template>
              </el-table-column>
              <el-table-column sortable label="省份" prop="name"></el-table-column>
              <el-table-column sortable label="现存确诊" prop="econNum"></el-table-column>
              <el-table-column sortable label="累计确诊" prop="value"></el-table-column>
              <el-table-column sortable label="疑似" prop="susNum"></el-table-column>
              <el-table-column sortable label="死亡" prop="deathNum"></el-table-column>
              <el-table-column sortable label="现存无症状" prop="asymptomNum"></el-table-column>
            </el-table>
          </el-card>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import "echarts/map/js/china";
import jsonp from "jsonp";

const option = {
  title: {
    text: "疫情地图",
    link: "https://baidu.com",
    subtext: "疫情地图",
    sublink: "https://baidu.com"
  },
  series: [
    {
      name: "确诊人数",
      type: "map", //告诉echarts要去渲染一个地图
      map: "china",
      label: {
        show: true, // 控制对应地区的汉字
        color: "#333",
        fontSize: 10
      },
      roam: true, //控制地图放大缩小
      zoom: 1.2, //控制地图的放大缩小
      data: [], //用来展示后台给的数据  {name:xx,value:xxx}
      /*      控制地图板块的颜色和边框*/
      itemStyle: {
        areaColor: "#83b5e7",
        borderColor: "dark" //边框颜色
      },
      /*     控制鼠标滑过之后的背景色和字体颜色*/
      emphasis: {
        label: {
          color: "#fff",
          fontsize: 12
        },
        itemStyle: {
          areaColor: "#83b5e7"
        }
      }
    }
  ],
  visualMap: [
    {
      type: "piecewise",
      show: true,
      pieces: [
        //分段
        {min: 10000},
        {min: 1000, max: 9990},
        {min: 100, max: 999},
        {min: 10, max: 99},
        {min: 1, max: 9}
      ],
      inRange: {
        symbol: "rect",
        color: ["#ffc0b1", "#e70520"]
      },
      itemWidth: 20,
      itemHeight: 10
    }
  ],
  tooltip: {
    trigger: "item" //鼠标移入后显示人数
  }
};

export default {
  name: 'CovidMap',
  data() {
    return {
      times: '',
      loading: true,
      info: [],
      tableData: [],
      top10: [],
    }
  },
  mounted() {
    this.getData();
    // 基于准备好的dom，初始化echarts实例
    let myChart = this.$echarts.init(document.getElementById('myChart'))
    // 绘制图表
    myChart.setOption(option);
  },
  methods: {
    getData() {
      jsonp(
          "https://interface.sina.cn/news/wap/fymap2020_data.d.json?_=1580892522427", //接口
          {},
          (err, data) => {
            if (!err) {
              //代表请求数据成功
              let list = data.data.list.map(item => ({
                name: item.name,
                value: item.value
              })); //从接口获取到数据后，使用map()函数，进行接口数据映射
              option.series[0].data = list;
              this.tableData = data.data.list;

              let myChart = this.$echarts.init(document.getElementById("myChart"));
              myChart.setOption(option);
              //这行代码能执行的前提是DOM已经渲染完成，只有DOM已渲染完成才能echarts初始化
              this.buildTable(data); //构建表格数据
            }
          }
      );
    },
    buildTable(data) {
      var data = data.data;
      let data1 = {
        name: "现存确诊",
        value: data.econNum,
        yesterday: data.add_daily["addecon_new"]
      };
      let data2 = {
        name: "累计境外输入",
        value: data.jwsrNum,
        yesterday: data.add_daily["addjwsr"]
      };
      let data3 = {
        name: "现无症状",
        value: data.asymptomNum,
        yesterday: data.add_daily["addasymptom"]
      };
      let data4 = {
        name: "现存确诊重症",
        value: data.heconNum,
        yesterday: data.add_daily["addhecon_new"]
      };
      let data5 = {
        name: "累计确诊",
        value: data.gntotal,
        yesterday: data.add_daily["addcon_new"]
      };
      let data6 = {
        name: "累计死亡",
        value: data.deathtotal,
        yesterday: data.add_daily["adddeath_new"]
      };
      let data7 = {
        name: "累计治愈",
        value: data.curetotal,
        yesterday: data.add_daily["addcure_new"]
      };
      let data8 = {
        name: "现存疑似",
        value: data.sustotal,
        yesterday: data.add_daily["wjw_addsus_new"]
      };
      this.times = data.times;
      this.top10 = data.jwsrTop;

      this.info.push(data1);
      this.info.push(data2);
      this.info.push(data3);
      this.info.push(data4);
      this.info.push(data5);
      this.info.push(data6);
      this.info.push(data7);
      this.info.push(data8);
      this.loading = false;
    }
  }

}
</script>

<style lang="less" scoped>

</style>
