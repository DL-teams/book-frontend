<template>
  <el-card class="form-container" shadow="never">
    <el-form :model="data"
             ref="bookCateFrom"
             label-width="120px">
      <el-form-item label="用户名：" prop="username">
        <span v-if="!isEdit">{{ data.username }}</span>
        <el-input v-else v-model="data.username"></el-input>
      </el-form-item>
      <el-form-item label="密码：" prop="password">
        <span v-if="!isEdit">{{ data.password }}</span>
        <el-input v-else v-model="data.password"></el-input>
      </el-form-item>
      <el-form-item label="手机号：" prop="phone">
        <span v-if="!isEdit">{{ data.phone }}</span>
        <el-input v-else v-model="data.phone"></el-input>
      </el-form-item>
      <el-form-item label="专业：" prop="major">
        <span v-if="!isEdit">{{ data.major }}</span>
        <el-input v-else v-model="data.major"></el-input>
      </el-form-item>
      <el-form-item label="专业：" prop="major">
        <span v-if="!isEdit">{{ data.major }}</span>
        <el-input v-else :disabled="true" v-model="data.major"></el-input>
      </el-form-item>
      <el-form-item v-if="!isEdit" style="text-align: right">
        <el-button @click="edit" type="primary" size="small">编辑</el-button>
      </el-form-item>
      <el-form-item v-else style="text-align: right">
        <el-button @click="cancel" size="small">取 消</el-button>
        <el-button @click="modify" type="primary" size="small">确 定</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import {searchData} from '@/api/personal';

const defaultData = {
  username: '1',
  password: '1',
  phone: '123456',
  major: '计算机',
};
export default {
  name: "personalData",
  props: {
    isDisabled: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      data: Object.assign({}, defaultData),
      isEdit: false
    }
  },
  created() {
    // searchData("a", "").then(response => {
    // this.bookPress = response.data;
    // this.inputListFormat = this.bookPress.inputList.replace(/,/g,'\n');
    // });
  },
  methods: {
    edit() {
      this.isEdit = true
      this.isDisabled = false
    },
    cancel() {
      this.isEdit = false
      this.isDisabled = true
    },
    modify() {

    }
  },
  filters: {}
}
</script>

<style scoped>
</style>
