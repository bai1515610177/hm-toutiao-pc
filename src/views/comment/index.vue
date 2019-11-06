<template>
  <div class="container-comment">
    <el-card>
      <div slot="header">
        <my-bread>评论管理</my-bread>
      </div>
      <!-- 表格 -->
      <el-table :data='articles'>
        <el-table-column prop="title" label="标题" width="400"></el-table-column>
        <el-table-column prop="total_comment_count" label="总评论数"></el-table-column>
        <el-table-column prop="fans_comment_count" label="粉丝评论数"></el-table-column>
        <el-table-column label="状态">
            <template slot-scope="scope">{{scope.row.comment_status?'正常':'关闭'}}</template>
        </el-table-column>
        <el-table-column label="操作" width="120">
            <template slot-scope="scope">
        <el-button
          size="small"
          type="danger"
          v-if = 'scope.row.comment_status'
          @click="toggleStatus(scope.row)">关闭评论</el-button>
        <el-button
          size="small"
          type="success"
         v-else
         @click="toggleStatus(scope.row)">打开评论</el-button>
      </template>
        </el-table-column>
      </el-table>
            <el-pagination
        style="margin-top:20px"
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="reqParams.per_page"
        :current-page="reqParams.page"
        @current-change="pager"
      ></el-pagination>

    </el-card>
  </div>
</template>

<script>
export default {
  created () {
    this.getArticles()
  },
  methods: {
    // 打开与关闭评论
    // row 有 id  comment_status
    toggleStatus (row) {
      const text = row.comment_status ? '确认关闭评论吗' : '确认打开评论吗'
      // 打开对话框
      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      //   .then(async () => {
      //     // 发送修改状态请求
      //     const { data: { data } } = await this.$http.put(`comments/status?article_id=${row.id}`, {
      //       allow_comment: !row.comment_status
      //     })
      //     // 成功
      //     this.$message.success(data.allow_comment ? '打开评论成功' : '关闭评论成功')
      //     // 更新当前文章的状态
      //     row.comment_status = data.allow_comment
      //   }).catch(() => {
      //   })
        .then(async () => {
        // 发送修改状态请求
          const { data: { data } } = await this.$http.put(`comments/status?article_id=${row.id}`, {
            allow_comment: !row.comment_status
          })
          // 成功
          this.$message.success(data.allow_comment ? '打开评论成功' : '关闭评论成功')
          // 更新当前文章的状态
          row.comment_status = data.allow_comment
        }).catch(() => {})
    },
    // 分页函数
    pager (newPage) {
      // 修改当前的页码为新的页码
      this.reqParams.page = newPage
      // 重新获取数据
      this.getArticles()
    },
    async getArticles () {
      const { data: { data } } = await this.$http.get('articles', { params: this.reqParams })
      this.articles = data.results
      this.total = data.total_count
    }
  },
  data () {
    return {
      articles: [],
      // 请求参数
      reqParams: {
        page: 1,
        per_page: 20,
        response_type: 'comment'
      },
      // 总条数
      total: 0
    }
  }
}
</script>

<style>
</style>
