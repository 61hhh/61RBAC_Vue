<template>
  <div id="message">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:12px;">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>个人办公</el-breadcrumb-item>
      <el-breadcrumb-item>公告留言</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="title">公告留言板</div>
    <div class="wrapper">
      <!-- 发布留言 -->
      <el-form :model="messageForm" ref="messageForm">
        <el-form-item class="title1">
          <el-input v-model="messageForm.title" clearable placeholder="留言标题"></el-input>
        </el-form-item>
        <el-form-item class="content">
          <el-input type="textarea" :rows="3" v-model="messageForm.content" clearable placeholder="留言内容"></el-input>
        </el-form-item>
        <el-form-item class="btn">
          <el-button type="primary" @click="submit()">提交留言</el-button>
        </el-form-item>
      </el-form>

      <!-- 评论 展示 -->
      <div class="all">
        <ul class="msglist">
          <li class="list" @mouseenter="enter(index)" @mouseleave="leave(index)"
              v-for="(data,index) in msg" :key="index">
            <p class="title" style="font-weight: bolder;font-size: 20px"><i class="iconfont icon-untitled33"></i>《{{ data.title }}》</p>
            <p class="content">{{ data.content }}</p>
            <p class="date"><i class="iconfont icon-date"></i>{{ data.time }}</p>
            <div v-for="(replayData,index2) in data.bizReplays" :key="index2">
              <p class="comment"><i class="iconfont icon-huifuxiaoxi"></i>{{ replayData.replay }}</p>
            </div>
            <span class="replay" @click="replay(data.id)" v-if="flag && index == current">Comment</span>
          </li>
        </ul>
      </div>

      <div class="pagination">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pagination.page"
            :page-sizes="[4,6,8,10]"
            :page-size="pagination.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagination.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {addMessage, addReplay, getMessage} from "@/api/business/biz_message";
import MixinCUD from "@/components/MixinCUD";

export default {
  name: 'message',
  mixins: [MixinCUD],
  data() {
    return {
      flag: false,
      current: 0,
      messageForm: {},
      replayForm: {},
      pagination: { //分页后的留言列表
        page: 1, //当前页
        total: null, //记录条数
        size: 4 //每页条数
      },
      msg: []
    }
  },
  created() {
    this.getMsg()
  },

  methods: {
    getMsg() {
      getMessage(this.pagination).then(res => {
        this.msg = res.data.records;
        console.log(this.msg)
      })
    },
    //改变当前记录条数
    handleSizeChange(val) {
      this.pagination.size = val
      this.getMsg()
    },
    //改变当前页码，重新发送请求
    handleCurrentChange(val) {
      this.pagination.page = val
      this.getMsg()
    },
    //提交留言
    submit() {
      if (this.title === null || this.content === null) { //非空判断
        this.$message({type: 'error', message: '留言标题或内容不能为空'})
      } else {
        this.messageForm.time = new Date()
        addMessage(this.messageForm).then(res => {
          this.$message({type: "success", message: "留言成功！"})
          this.getMsg()
        })
      }
      this.reset()
      this.getMsg()
    },
    replay(messageId) { //回复留言功能
      this.$prompt('回复留言', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
        inputErrorMessage: '回复不能为空'
      }).then(({value}) => {
        this.replayForm.replay = value
        this.replayForm.messageId = messageId
        this.replayForm.replayTime = new Date()
        addReplay(this.replayForm).then(res => {
          this.getMsg()
        })
        this.$message({type: 'success', message: '回复成功'});
      }).catch(() => {
        this.$message({type: 'info', message: '取消输入'});
      });
    },
    enter(index) {
      this.flag = true
      this.current = index
    },
    leave(index) {
      this.flag = false;
      this.current = index;
    },
    reset() {
      this.$refs.messageForm.clearValidate();
      this.messageForm = {};
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination {
  display: flex;
  justify-content: center;
}

#message {
  width: 980px;
  margin: 0 auto;
}

.title {
  font-size: 36px;
  margin: 20px;
}

.content {
  padding: 20px 0px;
}

#message {
  .btn {
    padding-bottom: 20px;
  }

  .all {
    .date {
      color: rgb(80, 157, 202);
      line-height: 45px;
      font-size: 13px;
    }

    .list {
      background-color: #eee;
      padding: 10px;
      border-radius: 4px;
      margin: 10px 0px;
      position: relative;
      transition: all .3s ease;

      .title {
        color: #5f5f5f;
        margin: 0px;
        line-height: 30px;
      }

      .content {
        padding: 0px;
      }

      .icon-untitled33 {
        font-size: 13px;
        margin-right: 4px;
      }

      .icon-date {
        font-size: 13px;
        margin-right: 4px;
        color: rgb(80, 157, 202);
      }

      .replay {
        position: absolute;
        right: 30px;
        bottom: 15px;
        color: tomato;
        cursor: pointer;
        transition: all .3s ease;
      }

      .comment {
        margin: -7px 0px;
        padding-bottom: 12px;
        font-size: 13px;
        color: #28b2b4;

        i {
          margin-right: 4px;
        }
      }
    }
  }
}

#message .wrapper {
  background-color: #fff;
  padding: 20px;

}
</style>
