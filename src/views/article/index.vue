<template>
  <div class="container-article">
    <!-- 面包屑 -->
    <el-card>
      <div class="header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>-->
          <my-bread>内容管理</my-bread>
        </el-breadcrumb>
      </div>
      <el-form label-width="80px" :model="reqParams">
        <el-form-item label="状态">
          <el-radio-group v-model="reqParams.status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <!-- 下拉框封装components/my-channel.vue-->
          <!-- <el-select v-model="reqParams.channel_id" placeholder="请选择" clearable>
            <el-option
              v-for="item in channelOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
          ></el-option>
          </el-select> -->
          <!-- 使用频道组件 -->
          <my-channel v-model="reqParams.channel_id"></my-channel>
        </el-form-item>
        <el-form-item label="日期">
          <!-- <el-date-picker
            v-model="dateArr"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changeDate"
            value-format="yyyy-MM-dd"
          ></el-date-picker>-->
          <el-date-picker
            v-model="dateArr"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 筛选结果布局 -->
    <!-- scope对象是一个变量（）收集了插槽上所有的自定义属性 -->
    <!-- <page> -->
    <!-- 默认插槽 -->
    <!-- <slot></slot> -->

    <!-- 具名插槽 -->
    <!-- <div slot='content'>内容</div> -->

    <!-- 作用域插槽 -->
    <!-- <div slot="content" slot-scope="scope">{{scope.test}}</div> -->
    <!-- <template v-slot:content='scope'>内容{{scope.test}}</template> -->
    <!-- </page> -->
    <!-- <page> -->
    <!-- <div slot="footer">尾</div> -->
    <!-- </page> -->
    <!-- 筛选结果布局 -->
    <el-card style="margin-top:20px">
      <div slot="header">
        <span>根据筛选条件共查询到{{total}}条结果：</span>
      </div>
      <!-- 表格 -->
      <el-table :data="articles">
        <el-table-column label="封面">
          <template slot-scope="scope">
            <el-image :src="scope.row.cover.images[0]">
              <div slot="error">
                <img src="../../assets/error.gif" width="150" height="100" />
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="标题" prop="title"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status===0" type="info">草稿</el-tag>
            <el-tag v-if="scope.row.status===1">待审核</el-tag>
            <el-tag v-if="scope.row.status===2" type="success">审核通过</el-tag>
            <el-tag v-if="scope.row.status===3" type="warning">审核失败</el-tag>
            <el-tag v-if="scope.row.status===4" type="danger">已删除</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" prop="pubdate"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click='toEdit(scope.row.id)' type="primary" icon="el-icon-edit" circle plain>编辑</el-button>
            <el-button @click="delArticle" type="danger" icon="el-icon-edit" circle plain>删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 表格 -->
      <!-- <el-table :data="articles" style="width: 100%">
        <el-table-column label="封面">
          <template slot-scope="scope">
            <el-image :src="scope.row.cover.images[0]" style='width:150px;height:100px'>
              <div slot="error">
                <img src="../../assets/error.gif" width="150" height="100" />
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="标题" prop="title"></el-table-column>
        <el-table-column label="状态"></el-table-column>
        <el-table-column label="发布时间" prop="pubdate"></el-table-column>
        <el-table-column label="操作" width="120"></el-table-column>
      </el-table> -->

      <!-- 分页 -->
      <!-- layout="prev, pager, next"当前分页包含的数据 -->
      <!-- total总条数 -->
      <!-- page-size默认一页显示10条 -->
      <!-- current-page指定当前激活的按钮 -->
      <el-pagination
        style="margin-top:20px"
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="reqParams.per_page"
        :current-page="reqParams.page"
        @current-change="pager"
      ></el-pagination>

      <!-- 分页 -->
      <!-- <el-pagination background layout="prev, pager, next" :total="1000">
        <div></div>
      </el-pagination> -->
    </el-card>
  </div>
</template>
<script>
import Page from '@/test/page'
export default {
  component: { Page },
  data () {
    return {
      // 提交给后台的参数对象
      // 由axios进行数据提交，字段的值null，axios不会提交该字段
      reqParams: {
        status: null,
        channel_id: null
      },
      // channelOptions: [],
      dateArr: [],
      articles: [],
      // 总条数
      total: 0
    }
  },
  created () {
    // this.getChannelOptions()
    this.getArticles()
  },
  methods: {
    // async getChannelOptions () {
    //   // 获取数据
    //   const {
    //     data: { data }
    //   } = await this.$http.get('channels')
    //   // 赋值channelOptions
    //   this.channelOptions = data.channels
    // },

    // 获取文章列表数据
    async getArticles () {
      // 获取数据
      const {
        data: { data }
      } = await this.$http.get('articles', { params: this.reqParams })
      // 赋值给
      this.articles = data.results
      // 总条数数据赋值
      this.total = data.total_count
    },

    // 分页函数
    pager (newPage) {
      // 修改当前的页码为新的页码
      this.reqParams.page = newPage
      // 重新获取数据
      this.getArticles()
    },

    // 筛选
    search () {
      // 获取筛选数据（准备日期数据）
      // 处理频道空字符串问题
      if (this.reqParams.channel_id === '') {
        this.reqParams.channel_id = null
      }

      // 页码换成1
      this.reqParams.page = 1
      this.getArticles()
    },

    // 选择日期
    changeDate (dateArr) {
      // dataArr是数组[date,date]起始时间 结束时间
      // dataArr是数组[date,date] string==='2019-01-02'
      // value-form ='yyyy-MM-dd'格式换换成功
      // 清空日期后，dataArr是null，对应的begin end值也应该是null
      if (dateArr) {
        this.reqParams.begin_pubdate = dateArr[0]
        this.reqParams.end_pubdate = dateArr[1]
      } else {
        this.reqParams.begin_pubdate = null
        this.reqParams.end_pubdate = null
      }
    },

    // 去编辑
    toEdit (id) {
      // query传参
      this.$router.push({ path: '/publish', query: { id } })
    },

    // 删除
    async delArticle (id) {
      // 发请求
      await this.$http.delete(`articles/${id}`)
      // 提示
      this.$message.success('删除成功')
      // 更新列表
      this.getArticles()
    }
  }
}
</script>
<style scoped lang='less'>
</style>
