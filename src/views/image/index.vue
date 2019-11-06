<template>
  <div class="container">
    <el-card>
      <!-- 头 -->
      <div slot="header">
        <my-bread>素材管理</my-bread>
      </div>
      <!-- 按钮 -->
      <div class="btn_box">
        <!-- 单选框 -->
        <el-radio-group @change="toggleList" v-model="reqParams.collect" size="small">
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
        <!-- 饿了么对话框组件 -->
        <el-button
          type="success"
          style="float:right"
          size="small"
          @click="open"
        >添加素材</el-button>
        <el-dialog title="添加素材" :visible.sync="dialogVisible" width="300px">
          <!-- 上传组件 -->
          <!-- show-file-list是element框架中文件列表是否显示 -->
            <!-- action是图片上传的接口地址 -->
            <!-- header上传组件的请求头 -->
            <!-- name时提交文件的字段名称需要和后台保持一致 -->
          <el-upload
            class="avatar-uploader"
            action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
            :show-file-list="false"
            :headers='headers'
            name='image'
            :on-success="handelSuccess"
          >
            <img class="avatar" v-if="imageUrl" :src="imageUrl" alt />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-dialog>
      </div>
      <!-- 素材区域 -->
      <div class="img_list">
        <div class="img_item" v-for="item in images" :key="item.id">
          <img :src="item.url" />
          <div class="footer" v-show="!reqParams.collect">
            <span
              class="el-icon-star-off"
              :class="{red:item.is_collected}"
              @click="toggleStatus(item)"
            ></span>
            <span class="el-icon-delete" @click="deleteImage(item.id)"></span>
          </div>
        </div>
      </div>
      <!-- 分页 -->
      <el-pagination
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
import local from '@/utils/local.js'
export default {
  data () {
    return {
      reqParams: {
        collect: false,
        page: 1,
        per_page: 10
      },
      // 素材列表
      images: [],
      // 总条数
      total: 0,
      // 控制对话框 显示与隐藏
      dialogVisible: false,
      // 上传成功后的图片地址
      imageUrl: null,
      // 请求头
      headers: {
        Authorization: `Bearer ${local.getUser().token}`
      }
    }
  },
  // 组件初始化获取数据
  created () {
    this.getImages()
  },
  methods: {
    async getImages () {
      // 获取数据
      const {
        data: { data }
      } = await this.$http.get('user/images', { params: this.reqParams })
      // 赋值给images
      this.images = data.results
      // 总条数
      this.total = data.total_count
    },
    // 切换全部与收藏列表
    toggleList () {
      this.reqParams.page = 1
      this.getImages()
    },
    // 当前页
    pager (newPage) {
      this.reqParams.page = newPage
      this.getImages()
    },
    // 切换 添加收藏和取消收藏
    async toggleStatus (item) {
      const {
        data: { data }
      } = await this.$http.put(`user/images/${item.id}`, {
        collect: !item.is_collected
      })
      // 成功（改变当前图片的状态，提示）
      item.is_collected = data.collect
      this.$message.success(data.collect ? '添加收藏成功' : '取消收藏成功')
    },
    // 删除
    deleteImage (id) {
      // 显示确认框
      this.$confirm('此操作将永久删除该图片', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // 发请求
          await this.$http.delete(`user/images/${id}`)
          // 提示
          this.$message.success('删除成功')
          // 更新列表
          this.getImages()
        })
        .catch(() => {
          // 点击了取消
        })
    },
    // 添加素材
    addImage () {
      this.$alert('这是一段内容', '标题名称', {
        confirmButtonText: '确定',
        callback: action => {
          this.$message({
            type: 'info',
            message: `action: ${action}`
          })
        }
      })
    },
    // 上传图片成功
    handelSuccess (res) {
      // res响应主体   res.data.url就是图片的地址
      // 预览
      this.imageUrl = res.data.url
      // 提示
      this.$message.success('上传成功')
      // 2s后关闭
      window.setTimeout(() => {
        // 关闭
        this.dialogVisible = false
        // 更新列表
        this.getImages()
      }, 1000)
    },
    // 打开对话框
    open () {
      this.dialogVisible = true
      this.imageUrl = null
    }
  }
}
</script>

<style scoped lang='less'>
.img_list {
  margin-top: 20px;
  .img_item {
    width: 150px;
    height: 150px;
    border: 1px dashed #ddd;
    position: relative;
    display: inline-block;
    margin-right: 50px;
    margin-bottom: 20px;
    img {
      width: 100%;
      height: 100%;
    }
    .footer {
      width: 100%;
      height: 30px;
      background: rgba(0, 0, 0, 0.3);
      position: absolute;
      bottom: 0;
      left: 0;
      line-height: 30px;
      text-align: center;
      span {
        margin: 0 20px;
        &.red {
          color: red;
        }
      }
    }
  }
}
</style>
