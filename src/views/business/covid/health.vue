<template>
  <div class="health">
    <!--       面包屑导航-->
    <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:12px;">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>疫情防控</el-breadcrumb-item>
      <el-breadcrumb-item>健康报备</el-breadcrumb-item>
    </el-breadcrumb>
    <!--       打卡部分 style="height: 590px;"-->
    <el-card style="height: 590px;">
      <el-alert :closable="false" style="margin-bottom: 20px;" v-if="reported" show-icon
                :title="'今日已成功打卡,勤洗手,戴口罩,不群聚,打卡时间:['+ruleForm.createTime+']'" type="success">
      </el-alert>
      <h5 style="margin: 0px;padding: 0px;">基本信息
        <div style="float: right;margin-bottom: 10px;vertical-align: center;">
          <el-button @click="OpenHistory" size="small" type="warning">签到记录</el-button>
          <el-button style="margin-top: 5px;" type="primary"
                     size="small" @click="onSubmit" v-if="!reported">立即打卡
          </el-button>
          <el-button @click="reset" size="small" v-if="!reported">重置</el-button>
        </div>
      </h5>

      <!-- 抽屉 -->
      <el-drawer :with-header="false" :visible.sync="drawer" :direction="direction">
        <span>
          <el-card class="box-card" v-for="item in this.historyTable" :key="item.id"
                   style="margin-bottom: 10px;">
            <div class="text item">
               <ul>
                   <li>打卡人:{{ userInfo.username }}</li>
                   <li>打卡位置:{{ item.address }}</li>
                   <li>打卡时间:{{ item.createTime }}</li>
                   <li>健康状况:
                       <div style="float: right">
                             <el-tag v-if="item.situation===0" size="small" effect="dark"
                                     type="success">健康</el-tag>
                      <el-tag v-else-if="item.situation===1" size="small" effect="dark"
                              type="danger">发热</el-tag>
                      <el-tag v-else-if="item.situation===2" size="small" effect="dark"
                              type="warning">其他情况</el-tag>
                       </div>
                   </li>
               </ul>
            </div>
          </el-card>
          <!-- 分页 -->
           <el-pagination
               @current-change="handleCurrentChange"
               :current-page="queryMap.pageNum"
               :page-size="queryMap.pageSize"
               style="margin-top: 20px;"
               background
               small
               layout="prev, pager, next"
               :total="historyTotal">
              </el-pagination>
        </span>
      </el-drawer>

      <el-divider></el-divider>
        <el-form size="small" label-width="80px">
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="grid-content bg-purple">
                <el-form-item label="打卡人">
                  <el-input v-model="userInfo.username" disabled></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content bg-purple">
                <div class="grid-content bg-purple">
                  <el-form-item label="打卡时间">
                    <el-date-picker disabled v-model="nowTime" type="datetime" placeholder="选择日期时间">
                    </el-date-picker>
                  </el-form-item>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-form>

      <h5 style="margin: 0px;padding: 0px;">健康打卡</h5>

      <el-divider></el-divider>
      <el-form size="small" :inline="true" :label-position="'top'" :model="ruleForm" :rules="rules" ref="ruleFormRef"
               label-width="100px" class="demo-ruleForm">
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="省份" prop="valueProvince">
                <el-select :disabled="reported" v-model="ruleForm.valueProvince"
                           placeholder="请选择省" @change="changeProvince">
                  <el-option v-for="item in provinceList" :key="item.value"
                             :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="城市" prop="valueCity">
                <el-select :disabled="reported" v-model="ruleForm.valueCity"
                           placeholder="请选择市" @change="changeCity">
                  <el-option v-for="item in cityOptions" :key="item.value"
                             :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="区县" prop="valueOrigin">
                <el-select :disabled="reported" v-model="ruleForm.valueOrigin"
                           placeholder="请选择区" @change="changeOrigin">
                  <el-option v-for="item in originOptions" :key="item.label"
                             :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item v-if="reported" label="打卡位置" prop="valueOrigin">
                <el-tag size="small">
                  {{ ruleForm.address }}
                </el-tag>
              </el-form-item>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item label="目前健康状况" prop="situation">
                <el-radio-group :disabled="reported" v-model="ruleForm.situation">
                  <el-radio :label="0">健康</el-radio>
                  <el-radio :label="1">有咳嗽发热症状</el-radio>
                  <el-radio :label="2">其他情况</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item label="接触的人是否有疑似症状?  (冠状病毒检测结果为阳性或尚在等待检测结构)" prop="touch">
                <el-radio-group :disabled="reported" v-model="ruleForm.touch">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item label="自2020年1月1日起,是否在湖北省停留过 (保存转车路过)" prop="passby">
                <el-radio-group :disabled="reported" v-model="ruleForm.passby">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item label="自2020年1月1日起,是否有接待过来自湖北的客户,亲戚或朋友)" prop="reception">
                <el-radio-group :disabled="reported" v-model="ruleForm.reception">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </el-col>
        </el-row>

      </el-form>

    </el-card>
  </div>
</template>

<script>

import {history, isReport, report} from "@/api/business/biz_health";
import {getUserInfo} from "@/api/system/sys_user";

export default {
  data() {
    return {
      drawer: false,
      direction: 'rtl',
      queryMap: {
        pageNum: 1,
        pageSize: 4
      },
      reported: false,
      historyTable: [],
      historyTotal: 0,
      provinceList: [], // 省列表
      cityList: [], // 市列表
      originList: [], // 区列表
      cityOptions: [], // 市下拉框数据
      originOptions: [] // 区下拉框数据
      ,
      ruleForm: {},
      nowTime: new Date(),
      userInfo: {
        username: ''
      },
      rules: {
        situation: [
          {required: true, message: "请选择当前情况", trigger: "blur"},
        ],
        touch: [
          {required: true, message: "请选择是否接触", trigger: "blur"},
        ],
        passby: [
          {required: true, message: "请选择是否路过", trigger: "blur"},
        ],
        reception: [
          {required: true, message: "请选择是否招待", trigger: "blur"},
        ],
        valueProvince: [
          {required: true, message: "请输入省份", trigger: "blur"}
        ],
        valueCity: [{required: true, message: "请输入城市", trigger: "blur"}],
        valueOrigin: [
          {required: true, message: "请输入区县", trigger: "blur"}
        ],
      },
    }
  },
  methods: {
    OpenHistory() {
      this.drawer = true;
      this.reportHistory();
    },
    //翻页
    handleCurrentChange(current) {
      this.queryMap.pageNum = current;
      this.reportHistory();
    },
    //打卡历史记录
    reportHistory() {
      history(this.queryMap).then(res => {
        console.log("调用history")
        console.log(res.data)
        this.historyTable = res.data.records;
        console.log("historyTable")
        console.log(this.historyTable)
        this.historyTotal = res.data.total;
      }).catch(err => {
        this.$message({message: err.message, type: 'error'});
      })
    },
    //今日是否已签到
    isReport() {
      isReport().then(res => {
        console.log("调用isReport")
        console.log(res.data);
        if (res.data) {
          this.reported = true;
          this.ruleForm = res.data;
        } else {
          this.reported = false;
          this.$notify.warning({
            title: '温馨提示',
            message: '您今日还未打卡,别忘记了哟~'
          });
        }
      }).catch(err => {
        this.$message({message: "今日健康报备检查错误:" + err.message, type: 'error'});
      })
    },
    //打卡
    onSubmit() {
      this.$refs.ruleFormRef.validate((valid) => {
        if (valid) {
          this.ruleForm.address = this.ruleForm.province + "/" + this.ruleForm.city + "/" + this.ruleForm.origin;
          report(this.ruleForm).then(res => {
            console.log("report之后的显示")
            this.reported = true;
            this.ruleForm.createTime = this.nowTime;
            this.$message({message: "今日打卡成功！", type: 'success'});
          }).catch(err => {
            this.$message.error("健康报备失败:" + err.msg);
          })
        } else {
          return false;
        }
      });
    },
    //重置打卡表单
    reset() {
      this.$refs.ruleFormRef.clearValidate();
      this.ruleForm = {};
    },
    currentTime() {
      setInterval(this.getDate, 500);
    },
    getDate() {
      this.nowTime = new Date();
    },
    // 选择省
    changeProvince(val) {
      this.provinceList.forEach((province, index) => {
        if (val.toString() === this.provinceList[index].value) {
          this.cityOptions = this.provinceList[index].children;
          this.ruleForm.valueCity = this.provinceList[index].children[0].value; //设置市的值
          this.ruleForm.city = this.provinceList[index].children[0].label;
          this.ruleForm.valueOrigin = this.provinceList[index].children[0].children[0].value; //设置县的值
          this.ruleForm.origin = this.provinceList[index].children[0].children[0].label;
          this.originOptions = this.provinceList[index].children[0].children;
          //set value
          this.ruleForm.province = this.provinceList[index].label;
        }
      });
    },
    // 选择市
    changeCity(val) {
      this.cityList.forEach((city, index) => {
        if (val.toString() === this.cityList[index].value) {
          this.originOptions = this.cityList[index].children;
          this.ruleForm.valueOrigin = this.cityList[index].children[0].value; //设置县的值;
          //set value
          this.ruleForm.city = this.cityList[index].label;
        }
      });
    },
    // 选择区
    changeOrigin(val) {
      this.ruleForm.valueOrigin = val;
      this.originList.forEach((origin, index) => {
        if (val.toString() === this.originList[index].value) {
          //set value
          this.ruleForm.origin = this.originList[index].label;
        }
      });
      //添加this.$forceUpdate();进行强制渲染，效果实现。搜索资料得出结果：因为数据层次太多，render函数没有自动更新，需手动强制刷新。
      this.$forceUpdate();
    },

    _getJsonData() {
      let ChinaData = require("../../../assets/provinces.json")
      console.log("通过getJsonData拿到json数据")//测试拿到json数据

      this.provinceList = [];
      this.cityList = [];
      this.originList = [];
      ChinaData.forEach(item => {
        if (item.value.match(/0000$/)) {
          this.provinceList.push({
            value: item.value,
            label: item.name,
            children: []
          });
        } else if (item.value.match(/00$/)) {
          this.cityList.push({
            value: item.value,
            label: item.name,
            children: []
          });
        } else {
          this.originList.push({
            value: item.value,
            label: item.name
          });
        }
      });
      for (let index in this.provinceList) {
        for (let index1 in this.cityList) {
          if (this.provinceList[index].value.slice(0, 2) === this.cityList[index1].value.slice(0, 2)) {
            this.provinceList[index].children.push(this.cityList[index1]);
          }
        }
      }
      for (let item1 in this.cityList) {
        for (let item2 in this.originList) {
          if (this.originList[item2].value.slice(0, 4) === this.cityList[item1].value.slice(0, 4)) {
            this.cityList[item1].children.push(this.originList[item2]);
          }
        }
      }
    }
  },
  created() {
    this.isReport();
    getUserInfo().then(res=>{
      console.log(res)
      this.userInfo.username = res.data.username;
    })
    console.log("用户信息")
    console.log(this.userInfo);
    this._getJsonData();
  },
  mounted() {
    this.currentTime();
  },
  // 销毁定时器
  beforeDestroy: function () {
    if (this.getDate) {
      clearInterval(this.getDate); // 在Vue实例销毁前，清除时间定时器
    }
  }

}
</script>
