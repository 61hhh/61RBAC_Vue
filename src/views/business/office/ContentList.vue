<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:12px;">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>内容管理</el-breadcrumb-item>
      <el-breadcrumb-item>内容列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 查询导航栏 -->
    <el-card body-style="padding: 0">
      <el-form ref="queryForm" :model="queryForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="标题" prop="titleLike">
              <el-input v-model="queryForm.titleLike"
                        placeholder="请输入标题或摘要内容"/>
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
                         icon="el-icon-plus" @click="toAddContent()">新增
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <!-- 查询内容区域 -->
    <el-card>
      <el-table :data="tableData" border default-expand-all stripe style="width: 100%;margin-bottom: 20px;">
        <el-table-column prop="title" label="标题" width="300" align="center"/>
        <el-table-column prop="abstraction" label="摘要" width="300" align="center"/>
        <el-table-column prop="content" label="内容" width="" align="center"/>
        <el-table-column prop="createBy" label="发布者" width="200" align="center"/>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" circle
                       @click="handleEdit(scope.$index, scope.row,'修改文章信息')"/>
            <el-button size="mini" type="danger" icon="el-icon-delete" circle
                       @click="handleDelete(scope.$index, scope.row)"/>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible"
               :before-close="beforeDialogClose">
      <el-form :model="dialogForm" ref="dialogForm"
               :rules="dialogFormRules" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="dialogForm.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="摘要" prop="abstraction">
          <el-input v-model="dialogForm.abstraction" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="发布人" prop="author">
          <el-input v-model="dialogForm.createBy" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="submitDialogForm" size="mini" type="primary">确 定</el-button>
        <el-button @click="handleCloseDialog" size="mini">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import MixinCUD from '@/components/MixinCUD'
import {deleteContent, getAllContent, getQueryContent, updateContent} from "@/api/business/biz_content";

export default {
  name: "SystemDict",
  mixins: [MixinCUD],
  data() {
    return {
      tableData: [],
      queryFormRefName: "queryForm",
      queryForm: {
        titleLike: ""
      },
      dialogFormVisible: false,
      dialogTitle: "",
      dialogRefName: "dialogForm",
      dialogForm: {
        id: null,
        title: '',
        abstraction: '',
        createBy: ''
      },
      dialogFormRules: {
        title: [
          {required: true, message: '请输入标题', trigger: 'blur'},
        ],
        abstraction: [
          {required: true, message: '请输入摘要', trigger: 'blur'},
        ]
      }
    }
  },
  methods: {
    handleRefresh() {
      this.$store.dispatch("refreshContent")
          .then(res => {
            this.$message({message: "刷新成功！", type: 'success'});
          })
    },
    toAddContent() {
      //跳转到编辑文章页面
      this.$router.replace('/home/content/edit');
    },
    //查询
    getData() {
      getQueryContent(this.queryForm.titleLike)
          .then(res => {
            this.setData(res)
          })
    },
    //更新只针对文章标题和摘要
    updateData() {
      updateContent(this.dialogForm)
          .then(res => {
            this.handleRefresh()
            this.$message({message: res.data, type: 'success'});
            this.submitQueryForm();//修改之后，重新查询table
            this.handleCloseDialog();
          })
    },
    deleteData(row) {
      this.$confirm("确定删除文章:[" + row.title + "]?")
          .then(_ => {
            deleteContent(row.id)
                .then(res => {
                  this.handleRefresh()
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
    getAllContent().then(res => {
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
