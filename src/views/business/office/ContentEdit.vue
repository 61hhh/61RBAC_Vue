<template>
  <div id="content-main">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:12px;">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>内容管理</el-breadcrumb-item>
      <el-breadcrumb-item>内容编辑</el-breadcrumb-item>
    </el-breadcrumb>

    <el-form :model="contentForm" :rules="contentFormRules" ref="contentForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="标题" prop="title">
        <el-input v-model="contentForm.title"></el-input>
      </el-form-item>
      <el-form-item label="摘要" prop="abstraction">
        <el-input type="textarea" v-model="contentForm.abstraction"></el-input>
      </el-form-item>
      <!-- mavon-editor -->
      <div style="height: 610px">
        <el-form-item label="内容" prop="content">
          <mavon-editor v-model="contentForm.content"
                        style="height: 600px" ref=md
                        font-size="16px" class="edit-content">
          </mavon-editor>
        </el-form-item>
      </div>
      <el-form-item>
        <el-button type="primary" @click="submitContentForm">立即创建</el-button>
        <el-button @click="resetForm('contentForm')">重置</el-button>
      </el-form-item>
    </el-form>


  </div>
</template>

<script>
import {addContent} from "@/api/business/biz_content";

export default {
  data() {
    return {
      ruleForm: {
        title: '',
        abstraction: '',
        content: ''
      },
      contentRefName: "contentForm",
      contentForm: {
        title: '',
        abstraction: '',
        content: '',
        author: ''
      },
      contentFormRules: {
        title: [
          {required: true, message: '请输入标题名称', trigger: 'blur'},
          {min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur'}
        ],
        abstraction: [
          {required: true, message: '请填写文章摘要', trigger: 'blur'}
        ],
        content: [
          {required: true, message: '请输入正文内容！', trigger: 'blur'}
        ]
      }
    };
  },
  methods: {
    submitContentForm() {
      this.$refs[this.contentRefName].validate((valid) => {
        if (valid) {
          this.$confirm("确定发布内容吗?")
              .then(_ => {
                this.addData();
                //取消新增或修改也要重置表单
                this.$router.push('/home/content/list');
              }).catch(err => {
            this.handleCloseDialog();
          });
        } else {
          return false;
        }
      });
    },
    addData() {
      // getUserInfo().then(res=>{
      //   console.log(res.data.username)
      //   this.setAuthor(res.data.username)
      // })
      addContent(this.contentForm).then(res => {
        this.$message({message: res.data, type: 'success'});
        this.$refs[this.contentRefName].resetFields();
      })
    },
    // setAuthor(authorName){
    //   this.contentForm.author = authorName;
    // },
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
