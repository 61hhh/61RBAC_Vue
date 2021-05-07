<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:12px;">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>个人办公</el-breadcrumb-item>
      <el-breadcrumb-item>历史邮件</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 查询导航栏 -->
    <el-card body-style="padding: 0">
      <el-form ref="queryForm" :model="queryForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="标题" prop="titleLike">
              <el-input v-model="queryForm.titleLike" placeholder="请输入标题"/>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="6">
            <el-form-item>
              <el-button type="primary" size="small"
                         @click="submitQueryForm()" icon="el-icon-search">查询
              </el-button>
              <el-button type="primary" size="small" plain
                         @click="resetQueryForm()" icon="el-icon-refresh">重置
              </el-button>
              <el-button type="primary" size="small" style="margin: 0 0 10px 20px"
                         icon="el-icon-plus" @click="toAddMail()">发邮件
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <!-- 查询内容区域 -->
    <el-card>
      <el-table :data="tableData" border default-expand-all stripe style="width: 100%;margin-bottom: 20px;">
        <el-table-column prop="address" label="收件人" width="300" align="center"/>
        <el-table-column prop="title" label="标题" width="300" align="center"/>
        <el-table-column prop="content" label="内容" width="" align="center"/>
        <el-table-column prop="createTime" label="发布时间" width="200" align="center"/>
        <el-table-column label="管理" width="200" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" icon="el-icon-delete" circle
                       @click="handleDelete(scope.$index, scope.row)"/>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

  </div>
</template>

<script>
import MixinCUD from '@/components/MixinCUD';
import {emailDelete, getAllEmail, getQueryMail} from "@/api/business/biz_mail";

export default {
  name: "EmailHistory",
  mixins: [MixinCUD],
  data() {
    return {
      tableData: [],
      queryFormRefName: "queryForm",
      queryForm: {
        titleLike: ""
      }
    }
  },
  methods: {
    toAddMail(){
      this.$router.push('/home/office/email')
    },
    //查询
    getData() {
      getQueryMail(this.queryForm.titleLike)
          .then(res => {
            this.setData(res)
          })
    },
    deleteData(row) {
      this.$confirm("确定删除邮件?")
          .then(_ => {
            emailDelete(row.id)
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
        this.tableData = res.data
        console.log(res.data)
        console.log(this.tableData)
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    getAllEmail().then(res => {
      next(vm => vm.setData(res))
    })
  }
}
</script>

<style scoped>
.el-form {
  margin-top: 20px;
}
</style>
