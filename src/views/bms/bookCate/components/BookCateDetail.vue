<template>
  <el-card class="form-container" shadow="never">
    <el-form :model="bookCate"
             :rules="rules"
             ref="bookCateFrom"
             label-width="150px">
      <el-form-item label="分类名称：" prop="name">
        <el-input v-model="bookCate.name"></el-input>
      </el-form-item>
      <el-form-item label="上级分类：">
        <el-select v-model="bookCate.parentId"
                   placeholder="请选择分类">
          <el-option
            v-for="item in selectBookCateList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="排序：">
        <el-input v-model="bookCate.sort"></el-input>
      </el-form-item>
      <el-form-item label="是否显示：">
        <el-radio-group v-model="bookCate.showStatus">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
<!--      <el-form-item v-for="(filterBookAttr, index) in filterBookAttrList"-->
<!--                    :label="index | filterLabelFilter"-->
<!--                    :key="filterBookAttr.key"-->
<!--      >-->
<!--        <el-cascader-->
<!--          clearable-->
<!--          v-model="filterBookAttr.value"-->
<!--          :options="filterAttrs">-->
<!--        </el-cascader>-->
<!--        <el-button style="margin-left: 20px" @click.prevent="removeFilterAttr(filterBookAttr)">删除</el-button>-->
<!--      </el-form-item>-->
<!--      <el-form-item>-->
<!--        <el-button size="small" type="primary" @click="handleAddFilterAttr()">新增</el-button>-->
<!--      </el-form-item>-->
      <el-form-item label="关键词：">
        <el-input v-model="bookCate.keywords"></el-input>
      </el-form-item>
      <el-form-item label="分类描述：">
        <el-input type="textarea" :autosize="true" v-model="bookCate.description"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('bookCateFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('bookCateFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
  import {fetchList, createBookCate, updateBookCate, getBookCate} from '@/api/bookCate';
  import {fetchListWithAttr} from '@/api/bookAttrCate';
  import {getBookAttrInfo} from '@/api/bookPress';
  import SingleUpload from '@/components/Upload/singleUpload';

  const defaultBookCate = {
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
    name: "BookCateDetail",
    components: {SingleUpload},
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        bookCate: Object.assign({}, defaultBookCate),
        selectBookCateList: [],
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
        getBookCate(this.$route.query.id).then(response => {
          this.bookCate = response.data;
        });
        // getBookAttrInfo(this.$route.query.id).then(response => {
        //   if (response.data != null && response.data.length > 0) {
        //     this.filterBookAttrList = [];
        //     for (let i = 0; i < response.data.length; i++) {
        //       this.filterBookAttrList.push({
        //         key: Date.now() + i,
        //         value: [response.data[i].attributeCategoryId, response.data[i].attributeId]
        //       })
        //     }
        //   }
        // });
      } else {
        this.bookCate = Object.assign({}, defaultBookCate);
      }
      this.getSelectBookCateList();
      // this.getBookAttrCateList();
    },
    methods: {
      getSelectBookCateList() {
        fetchList(0, {pageSize: 100, pageNum: 1}).then(response => {
          this.selectBookCateList = response.data.list;
          this.selectBookCateList.unshift({id: 0, name: '无上级分类'});
        });
      },
      getBookAttrCateList() {
        fetchListWithAttr().then(response => {
          let list = response.data;
          for (let i = 0; i < list.length; i++) {
            let bookAttrCate = list[i];
            let children = [];
            if (bookAttrCate.bookAttributeList != null && bookAttrCate.bookAttributeList.length > 0) {
              for (let j = 0; j < bookAttrCate.bookAttributeList.length; j++) {
                children.push({
                  label: bookAttrCate.bookAttributeList[j].name,
                  value: bookAttrCate.bookAttributeList[j].id
                })
              }
            }
            this.filterAttrs.push({label: bookAttrCate.name, value: bookAttrCate.id, children: children});
          }
        });
      },
      // getBookAttributeIdList() {
      //   //获取选中的筛选商品属性
      //   let bookAttributeIdList = [];
      //   for (let i = 0; i < this.filterBookAttrList.length; i++) {
      //     let item = this.filterBookAttrList[i];
      //     if (item.value !== null && item.value.length === 2) {
      //       bookAttributeIdList.push(item.value[1]);
      //     }
      //   }
      //   return bookAttributeIdList;
      // },
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('是否提交数据', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if (this.isEdit) {
                // this.bookCate.bookAttributeIdList = this.getBookAttributeIdList();
                updateBookCate(this.$route.query.id, this.bookCate).then(response => {
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration: 1000
                  });
                  this.$router.back();
                });
              } else {
                // this.bookCate.bookAttributeIdList = this.getBookAttributeIdList();
                createBookCate(this.bookCate).then(response => {
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
        this.bookCate = Object.assign({}, defaultBookCate);
        this.getSelectBookCateList();
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
