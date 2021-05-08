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
        <el-table-column  label="内容" width="" align="center">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-message" @click="CheckMail(scope.$index, scope.row,'修改文章信息')">
              查看内容</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="发布时间" width="200" align="center"/>
        <el-table-column label="管理" width="200" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" icon="el-icon-delete" circle
                       @click="handleDelete(scope.$index, scope.row)"/>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 查看邮件内容 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="dialogForm" ref="dialogForm" label-width="100px">
        <el-form-item label="邮件标题" prop="title">
          <el-input v-model="dialogForm.title" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮件内容" prop="content">
          <el-input v-model="dialogForm.content" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="发件人" prop="createBy">
          <el-input v-model="dialogForm.createBy" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog" size="mini" type="primary">确 定</el-button>
      </div>
    </el-dialog>

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
      },
      dialogTitle:'',
      dialogFormVisible: false,
      dialogForm:{
        title: '',
        content:'',
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
    },
    CheckMail(index, row,dialogTitle){
      this.dialogFormVisible = true;
      this.dialogTitle = dialogTitle
      this.resetDialogForm()
      this.dialogForm = {...row}
    },
    closeDialog(){
      this.dialogFormVisible = false;
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
