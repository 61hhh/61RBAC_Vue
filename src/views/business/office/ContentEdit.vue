<template>
  <div id="content-main">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:12px;">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>内容管理</el-breadcrumb-item>
      <el-breadcrumb-item>内容编辑</el-breadcrumb-item>
    </el-breadcrumb>

<!--    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">-->
<!--      <el-form-item label="标题" prop="title">-->
<!--        <el-input v-model="ruleForm.name"></el-input>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="摘要" prop="desc">-->
<!--        <el-input type="textarea" v-model="ruleForm.desc"></el-input>-->
<!--      </el-form-item>-->
<!--      &lt;!&ndash; mavon-editor &ndash;&gt;-->
<!--      <el-form-item label="内容" prop="content" >-->
<!--        <mavon-editor v-model="ruleForm.content"-->
<!--                      style="height: 100%" ref=md-->
<!--                      font-size="16px" class="edit-content">-->
<!--        </mavon-editor>-->
<!--      </el-form-item>-->
<!--      <el-form-item>-->
<!--        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>-->
<!--        <el-button @click="resetForm('ruleForm')">重置</el-button>-->
<!--      </el-form-item>-->
<!--    </el-form>-->
    <h2>内容编辑</h2>


  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        title: '',
        desc: '',
        content: ''
      },
      rules: {
        name: [
          {required: true, message: '请输入标题名称', trigger: 'blur'},
          {min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur'}
        ],
        desc: [
          {required: true, message: '请填写文章摘要', trigger: 'blur'}
        ],
        content: [
          {required: true, message: '请输入正文内容！', trigger: 'blur'}
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style scoped>
.content-main{
  text-align: center;
}
.edit-content{
  height: 600px;
}
</style>
