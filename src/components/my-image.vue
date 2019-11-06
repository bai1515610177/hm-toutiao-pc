<template>
  <div class="my-image">
    <!-- 按钮 -->
    <div class="btn_box" @click="open">
      <!-- 按钮默认图片 -->
      <!-- 如果value有图片你传入的地址，使用默认图的地址 -->
      <img :src="value||defaultImage" />
    </div>
    <!-- 对话框 -->
    <el-dialog :visible.sync="dialogVisible" width="750px">
      <!-- 素材库和上传图片tabs -->
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="素材库" name="image">
          <!-- 按钮 -->
          <el-radio-group @change="toggleList" v-model="reqParams.collect" size="small">
            <el-radio-button :label="false">全部</el-radio-button>
            <el-radio-button :label="true">收藏</el-radio-button>
          </el-radio-group>
          <!-- 列表 -->
          <div class="img_list">
            <div
              class="img_item"
              v-for="item in images"
              :key="item.id"
              @click="selectedImage(item.url)"
              :class="{selected:selectedImageUrl===item.url}"
            >
              <img :src="item.url" />
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
        </el-tab-pane>
        <el-tab-pane label="上传图片" name="upload">
          <!-- 上传组件 -->
          <!-- show-file-list是element框架中文件列表是否显示 -->
          <!-- action是图片上传的接口地址 -->
          <!-- header上传组件的请求头 -->
          <!-- name时提交文件的字段名称需要和后台保持一致 -->
          <el-upload
            class="avatar-uploader"
            action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
            :show-file-list="false"
            :headers="headers"
            name="image"
            :on-success="handelSuccess"
          >
            <img class="avatar" v-if="uploadImageUrl" :src="uploadImageUrl" alt />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmImage">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import local from '@/utils/local.js'
import defaultImage from '../assets/default.png'
export default {
  name: 'my-image',
  // value在发布文章的时候没有值，编辑的时候才有图片数据
  props: ['value'],
  data () {
    return {
      // 默认图片
      defaultImage,
      // defaultImage: '../assets/default.png',
      // 请求头
      headers: {
        Authorization: `Bearer ${local.getUser().token}`
      },
      // 请求图片地址
      uploadImageUrl: null,
      // 控制对话框显示与隐藏
      dialogVisible: false,
      // 当前激活选项卡的name值
      activeName: 'image',
      // 提交的筛选参数
      reqParams: {
        collect: false,
        page: 1,
        per_page: 8
      },
      // 图片列表
      images: [],
      // 总条数
      total: 0,
      // 当前选中的图片地址
      selectedImageUrl: null
    }
  },
  methods: {
    // 确认图片
    confirmImage () {
      if (this.activeName === 'image') {
        // 素材库
        if (!this.selectedImageUrl) {
          return this.$message.warning('请选中一张图片')
        }
        // 给img的src赋值图片地址
        // this.defaultImage = this.selectedImageUrl
        this.$emit('input', this.selectedImageUrl)
        this.dialogVisible = false
      } else {
        // 上传图片
        if (!this.uploadImageUrl) {
          return this.$message.warning('请上传一张图片')
        }
        // 给img的src赋值图片地址
        // this.defaultImage = this.uploadImageUrl
        this.$emit('input', this.uploadImageUrl)
        this.dialogVisible = false
      }
    },
    // 上传成功
    handelSuccess (res) {
      // 预览
      this.uploadImageUrl = res.data.url
      // 提示
      this.$message.success('上传成功')
    },
    // 选中图片
    selectedImage (url) {
      this.selectedImageUrl = url
      console.log(this.selectedImageUrl)
    },

    // 切换列表
    toggleList () {
      this.reqParams.page = 1
      // 获取素材列表
      this.getImages()
    },
    // 分页
    pager (newPage) {
      this.reqParams.page = newPage
      // 获取素材列表
      this.getImages()
    },
    // 打开对话框
    open () {
      this.dialogVisible = true
      // 获取素材列表
      this.getImages()
    },
    // 获取素材列表
    async getImages () {
      // 获取数据
      const {
        data: { data }
      } = await this.$http.get('user/images', { params: this.reqParams })
      // 赋值给images
      this.images = data.results
      // 总条数
      this.total = data.total_count
    }
  }
}
</script>

<style scoped lang='less'>
.my-image {
  display: inline-block;
  margin-right: 20px;
  .img_item {
    margin-top: 20px;
    margin-right: 20px;
    display: inline-block;
    width: 150px;
    height: 120px;
    position: relative;
    img {
      width: 100%;
      height: 100%;
    }
    &.selected::after {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3) url("../assets/selected.png") no-repeat
        center/50px 50px;
    }
  }
}
</style>
