<template>
  <div id="main">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:12px;">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>内容管理</el-breadcrumb-item>
      <el-breadcrumb-item>内容编辑</el-breadcrumb-item>
    </el-breadcrumb>

    <h2>
      内容列表
    </h2>
  </div>
</template>

<script>
export default {
  name: "ContentList",
  data() {
    return {
      article:{}
    }
  },
}
</script>

<style scoped>
</style>
