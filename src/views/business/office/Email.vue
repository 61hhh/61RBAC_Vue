<template>
  <div id="content-main" style="height: 100%;">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:12px;">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>个人中心</el-breadcrumb-item>
      <el-breadcrumb-item>邮件发送</el-breadcrumb-item>
    </el-breadcrumb>

    <el-form :model="mailForm" :rules="mailFormRules" ref="mailForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="收件人" prop="address">
        <el-input v-model="mailForm.address"></el-input>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="mailForm.title"></el-input>
      </el-form-item>
      <!-- mavon-editor -->
      <div style="height: 610px">
        <el-form-item label="内容" prop="content">
          <mavon-editor v-model="mailForm.content"
                        style="height: 600px" ref=md
                        font-size="16px" class="edit-content">
          </mavon-editor>
        </el-form-item>
      </div>
      <el-form-item>
        <el-button type="primary" @click="submitMailForm">发送邮件</el-button>
        <el-button @click="resetForm('mailForm')">重置</el-button>
      </el-form-item>
    </el-form>


  </div>
</template>

<script>
import {emailAdd, emailSend} from "@/api/business/biz_mail";

export default {
  data() {
    return {
      mailForm: {
        address: '',
        title: '',
        content: '',
      },
      mailRefName: "mailForm",
      mailFormRules: {
        address: [
          {required: true, message: '请填写收件人', trigger: 'blur'},
        ],
        title: [
          {required: true, message: '请输入标题名称', trigger: 'blur'},
        ],
        content: [
          {required: true, message: '请输入正文内容！', trigger: 'blur'}
        ]
      }
    };
  },
  methods: {
    submitMailForm() {
      console.log("submit!")
      this.$refs[this.mailRefName].validate((valid) => {
        if (valid) {
          this.$confirm("发送邮件?")
              .then(_ => {
                let myReg=/^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/;
                if(myReg.test(this.mailForm.address)){
                  this.addData();
                  this.sendMail();
                }else {
                  alert("邮箱格式错误！");
                }
                //取消新增或修改也要重置表单
              }).catch(err => {
            this.handleCloseDialog();
          });
        } else {
          return false;
        }
      });
    },
    addData() {
      emailAdd(this.mailForm).then(res => {
        this.$message({message: res.data, type: 'success'});
        this.$refs[this.mailRefName].resetFields();
      })
    },
    sendMail(){
      emailSend(this.mailForm).then(res=>{
        this.$message({message: res.data, type: 'success'});
        this.$refs[this.mailRefName].resetFields();
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style scoped>
.content-main {
  text-align: center;
}

.edit-content {
  height: 600px;
}
</style>
