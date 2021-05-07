<template>
  <div id="LoginLogs">
    <!-- 面包导航 -->
    <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:12px;">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文档工具</el-breadcrumb-item>
      <el-breadcrumb-item>登录日志</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 右侧卡片区域 -->
    <!-- 用户列表卡片区 -->
    <el-card class="box-card">
      <el-form size="mini" :inline="true" :model="queryMap" class="demo-form-inline">
        <el-form-item label="用户名">
          <el-input v-model="queryMap.username" placeholder="请输入用户名查询"></el-input>
        </el-form-item>
        <el-form-item label="IP地址">
          <el-input v-model="queryMap.ip" placeholder="请输入IP查询"></el-input>
        </el-form-item>
        <el-form-item label="登入地址">
          <el-input v-model="queryMap.location" placeholder="请输入登入地址查询"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" @click="submitQueryForm()" type="primary">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="batchDeleteLogin(selects)" icon="el-icon-delete" :disabled="this.selects.length === 0">批量
          </el-button>
        </el-form-item>
      </el-form>
      <!-- 表格区域 -->
      <template>
        <el-table border stripe size="mini" :data="LoginLogData"
                  style="width: 100%;" height="460" @selection-change="selectsChange">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column prop="id" type="index" label="ID" width="50"></el-table-column>
          <el-table-column prop="username" label="登入用户" width="150"></el-table-column>
          <el-table-column prop="loginTime" label="登入时间" width="190"></el-table-column>
          <el-table-column prop="location" label="登入地点" width="250"></el-table-column>
          <el-table-column prop="ip" label="IP地址"></el-table-column>
          <el-table-column prop="userSystem" label="操作系统" width="150"></el-table-column>
          <el-table-column prop="userBrowser" label="浏览器"></el-table-column>
          <el-table-column label="操作" width="100px;">
            <template slot-scope="scope">
              <el-button type="text" size="mini" icon="el-icon-delete"
                         @click="handleDelete(scope.$index, scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-card>
  </div>
</template>

<script>
import {addLogin, batchDelete, deleteLogin, getAllLogin, getQueryLogin} from "@/api/business/biz_login";
import MixinCUD from "@/components/MixinCUD";

export default {
  name: 'LoginLog',
  mixins: [MixinCUD],
  data() {
    return {
      selects: [], //选中的值显示
      LoginLogData: [],
      total: 0, //总共多少条数据
      queryMap: {//查询对象
        username: '',
        ip: '',
        location: ''
      },
      logIds: ''
    };
  },
  methods: {
    //批量删除
    batchDeleteLogin() {
      // let ids = this.selects.map(item => item.id).join(); //获取所有选中行的id组成的字符串，以逗号分隔
      let length = this.selects.length;
      console.log(length)
      for(let i=0;i<length-1;i++){
        console.log(this.selects[i])
        this.logIds += this.selects[i].id+','
      }
      this.logIds += this.selects[length-1].id
      console.log(this.logIds)
      this.$confirm('此操作将批量删除日志，是否继续？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: "warning"
      })
          .then(_ => {
            batchDelete(this.logIds)
                .then(res => {
                  this.submitQueryForm();//删除之后，重新查询table
                  this.$message({message: res.data, type: 'success'});
                }).catch(err => {
              this.$message({message: err.message, type: 'error'});
            })
          });
    },
    //勾选中的
    selectsChange(selects) {
      this.selects = selects;
    },
    //查询
    getData() {
      getQueryLogin(this.queryMap)
          .then(res => {
            this.setData(res);
          })
    },
    //删除登入日志
    deleteData(row) {
      this.$confirm("确定删除?")
          .then(_ => {
            deleteLogin(row.id)
                .then(res => {
                  this.submitQueryForm();//删除之后，重新查询table
                  this.$message({message: res.data, type: 'success'});
                }).catch(err => {
              this.$message({message: err.message, type: 'error'});
            })
          });
    },
    setData(res) {
      if (res.isok) {
        this.LoginLogData = res.data
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    getAllLogin().then(res => {
      console.log(res.data)
      next(vm => vm.setData(res))
    })
  }
};
</script>

