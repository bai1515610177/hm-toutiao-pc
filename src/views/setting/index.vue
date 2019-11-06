<template>
  <div class="container-setting">
    <el-card>
      <div slot="header">
        <my-bread>个人设置</my-bread>
      </div>
      <!-- 布局--栅格 -->
      <el-row>
        <el-col :span="12">
          <!-- 表单 -->
          <el-form  label-width="120px">
            <el-form-item label="编号">1</el-form-item>
            <el-form-item label="手机">1</el-form-item>
            <el-form-item label="媒体名称">
                <el-input  v-model="userInfo.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍">
                <el-input type='textarea' :rows='3'  v-model='userInfo.intro'></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
                <el-input v-model='userInfo.email'></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type='primary'>保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
            <!-- 上传组件 -->
                      <el-upload
            class="avatar-uploader"
            action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
            :show-file-list="false"
          >
            <img class="avatar" v-if="imageUrl" :src="imageUrl" alt />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <p style="text-align:center">修改头像</p>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      userInfo: {
        name: null,
        intro: null,
        email: null
      },
      imageUrl: null
    }
  }
}
</script>

<style>
</style>
