<template>
  <div>
    <el-row>
      <!-- 添加文件 -->
      <el-col :span="8">
        <el-form :model="form">
          <el-form-item label="上传附件" :label-width="formLabelWidth">
            <br/>
            <el-upload ref="upload" accept="image/png,image/gif,image/jpg,image/jpeg"
                       list-type="picture-card" :limit="limitNum" :auto-upload="false"
                       :on-exceed="handleExceed" :before-upload="handleBeforeUpload"
                       :on-preview="handlePreview" :on-remove="handleRemove"
                       action="#" :http-request="uploadFileAli">
              <i class="el-icon-upload"></i>
            </el-upload>
            <!-- 预览图片 -->
            <el-dialog :visible.sync="dialogVisible">
              <img width="50%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="primary" @click="submitFile">立即上传</el-button>
            <el-button size="small">取消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <!-- 查看文件 -->
      <el-col :span="16">
        <div>
          <!-- 查询导航栏 -->
          <el-card body-style="padding: 2">
            <el-form ref="queryForm" :model="queryForm" label-width="80px">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="文件名" prop="titleLike">
                    <el-input v-model="queryForm.titleLike" placeholder="请文件名"/>
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
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-card>
          <!-- 查看结果 -->
          <el-table :data="tableData" border default-expand-all stripe style="width: 100%;margin-bottom: 20px;">
            <el-table-column prop="fileName" label="文件名" width="300" align="center"/>
            <el-table-column label="内容" width="" align="center">
              <template slot-scope="scope">
                <el-button type="primary" icon="fa-file-text-o" @click="CheckUrl(scope.$index, scope.row,'查看文件URL')">
                  查看内容
                </el-button>
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
        </div>
      </el-col>
    </el-row>

    <!-- 查看文件地址 -->
    <el-dialog :title="FileDialogTitle" :visible.sync="FileDialogFormVisible">
      <el-form :model="FileDialogForm" ref="dialogForm" label-width="100px">
        <el-form-item label="名称" prop="fileName">
          <el-input v-model="FileDialogForm.fileName" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="fileUrl">
          <el-input v-model="FileDialogForm.fileUrl" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog" size="mini" type="primary">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import MixinCUD from "@/components/MixinCUD";
import {addFile, deleteFile, getAllFile, getQueryFile, uploadALI} from "@/api/business/biz_file";

export default {
  name: 'FileUpload',
  mixins: [MixinCUD],
  data() {
    return {
      fileList: [
        {name: 'food.jpeg', url: ''}
      ],

      dialogVisible: false,
      dialogImageUrl: '',
      formLabelWidth: '100px',
      limitNum: 4,
      form: {},
      fileInfo: {
        fileName: '',
        fileUrl: '',
        createTime: '',
      },


      bizFile: {},
      tableData: [],
      queryFormRefName: "queryForm",
      queryForm: {
        titleLike: ''
      },
      FileDialogFormVisible: false,
      FileDialogTitle: '',
      FileDialogForm: {
        fileUrl: '',
        fileName: ''
      }
    }
  },
  methods: {
    handleBeforeUpload(file) {
      console.log("before")
      console.log(file)
      if (!(file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/jpg' || file.type === 'image/jpeg')) {
        this.$notify.warning({
          title: '格式有误！',
          message: '请上传格式为png、gif、jpg、jpeg的图片!'
        })
      }
      let size = file.size / 1024 / 1024 / 2
      if (size > 2) {
        this.$notify.warning({
          title: '文件超出大小！',
          message: '图片大小需小于2M!'
        })
      }
    },
    // 文件超出个数限制时
    handleExceed(files, fileList) {
      console.log("超出个数限制")
      this.$notify.warning({
        title: '超出个数限制',
        message: '限制单次最多上传4个文件'
      })
    },
    // 文件列表移除文件时
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    // 点击文件列表中已上传的文件
    handlePreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    uploadFileAli(file) {
      console.log("进入upload方法")
      let fileList = new FormData();
      fileList.append("file", file.file);


      uploadALI(fileList).then(res => {
        this.fileInfo.fileName = file.file.name
        this.fileInfo.fileUrl = res.data.returnFileUrl
        addFile(this.fileInfo).then(addRes => {
          this.$message({message: "保存信息成功！", type: 'success'});
        })
        this.$message({message: res.data.success, type: 'success'});
        console.log("上传成功，下一步调用submitQueryForm")
        this.resetAll();
      }).catch(err => {
        this.$message({message: err.data, type: 'error'});
      })

      this.getData()
    },
    submitFile() {
      this.$refs.upload.submit();
    },
    CheckUrl(index, row, dialogTitle) {
      this.FileDialogFormVisible = true;
      this.FileDialogTitle = dialogTitle
      this.resetDialogForm()
      this.FileDialogForm = {...row}
    },
    closeDialog() {
      this.FileDialogFormVisible = false;
    },
    getData() {
      getQueryFile(this.queryForm.titleLike)
          .then(res => {
            this.setData(res)
          })
    },
    deleteData(row) {
      this.$confirm("确定删除文件信息吗?")
          .then(_ => {
            deleteFile(row.id)
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
      }
    },
    resetAll(){
      console.log("重置el-upload、queryForm")
      this.$refs.upload.clearFiles();
      this.$refs[this.queryFormRefName].resetFields();
      this.submitQueryForm()
      getAllFile().then(res=>{
        this.setData(res)
      })
    }
  },
  beforeRouteEnter(to, from, next) {
    getAllFile().then(res => {
      next(vm => vm.setData(res))
    })
  }
}
</script>

<style lang="scss" scoped>

</style>
