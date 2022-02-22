<template>
  <el-card class="form-container" shadow="never">
    <el-form :model="bookPress"
             :rules="rules"
             ref="bookPressFrom"
             label-width="150px">
      <el-form-item label="出版社编码：" prop="code">
        <el-input v-model="bookPress.code"></el-input>
      </el-form-item>
      <el-form-item label="出版社名称：" prop="name">
        <el-input v-model="bookPress.name"></el-input>
      </el-form-item>
      <el-form-item label="排序：">
        <el-input v-model="bookPress.sort"></el-input>
      </el-form-item>
      <el-form-item label="是否显示：">
        <el-radio-group v-model="bookPress.showStatus">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('bookPressFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('bookPressFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import {fetchList, createBookPress, updateBookPress, getBookPress} from '@/api/bookPress';
import {getBookAttrInfo} from '@/api/bookPress';
import SingleUpload from '@/components/Upload/singleUpload';

const defaultBookPress = {
  description: '',
  icon: '',
  keywords: '',
  name: '',
  navStatus: 0,
  parentId: 0,
  bookUnit: '',
  showStatus: 0,
  sort: 0,
  bookAttributeIdList: []
};
export default {
  name: "BookPressDetail",
  components: {SingleUpload},
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      bookPress: Object.assign({}, defaultBookPress),
      selectBookPressList: [],
      rules: {
        name: [
          {required: true, message: '请输入品牌名称', trigger: 'blur'},
          {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
        ]
      },
      filterAttrs: [],
      filterBookAttrList: [{
        value: []
      }]
    }
  },
  created() {
    if (this.isEdit) {
      getBookPress(this.$route.query.id).then(response => {
        this.bookPress = response.data;
      });
    } else {
      this.bookPress = Object.assign({}, defaultBookPress);
    }
    this.getSelectBookPressList();
  },
  methods: {
    getSelectBookPressList() {
      fetchList(0, {pageSize: 100, pageNum: 1}).then(response => {
        this.selectBookPressList = response.data.list;
        this.selectBookPressList.unshift({id: 0, name: '无上级分类'});
      });
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('是否提交数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (this.isEdit) {
              // this.bookPress.bookAttributeIdList = this.getBookAttributeIdList();
              updateBookPress(this.$route.query.id, this.bookPress).then(response => {
                this.$message({
                  message: '修改成功',
                  type: 'success',
                  duration: 1000
                });
                this.$router.back();
              });
            } else {
              // this.bookPress.bookAttributeIdList = this.getBookAttributeIdList();
              createBookPress(this.bookPress).then(response => {
                this.$refs[formName].resetFields();
                this.resetForm(formName);
                this.$message({
                  message: '提交成功',
                  type: 'success',
                  duration: 1000
                });
              });
            }
          });

        } else {
          this.$message({
            message: '验证失败',
            type: 'error',
            duration: 1000
          });
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.bookPress = Object.assign({}, defaultBookPress);
      this.getSelectBookPressList();
      this.filterBookAttrList = [{
        value: []
      }];
    },
    removeFilterAttr(bookAttributeId) {
      if (this.filterBookAttrList.length === 1) {
        this.$message({
          message: '至少要留一个',
          type: 'warning',
          duration: 1000
        });
        return;
      }
      var index = this.filterBookAttrList.indexOf(bookAttributeId);
      if (index !== -1) {
        this.filterBookAttrList.splice(index, 1)
      }
    },
    handleAddFilterAttr() {
      if (this.filterBookAttrList.length === 3) {
        this.$message({
          message: '最多添加三个',
          type: 'warning',
          duration: 1000
        });
        return;
      }
      this.filterBookAttrList.push({
        value: null,
        key: Date.now()
      });
    }
  },
  filters: {
    filterLabelFilter(index) {
      if (index === 0) {
        return '筛选属性：';
      } else {
        return '';
      }
    }
  }
}
</script>

<style scoped>

</style>
