<template>
  <div>
    <el-form :model="value" :rules="rules" ref="bookInfoForm" label-width="120px" style="width: 600px" size="small">
      <el-form-item label="图书分类：" prop="bookCategoryId">
        <el-cascader
          v-model="selectBookCateValue"
          :options="bookCateOptions">
        </el-cascader>
      </el-form-item>
      <el-form-item label="图书名称：" prop="name">
        <el-input v-model="value.name"></el-input>
      </el-form-item>
      <el-form-item label="出版社：" prop="brandId">
        <el-select
          v-model="value.brandId"
          @change="handleBrandChange"
          placeholder="请选择出版社">
          <el-option
            v-for="item in brandOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="图书库存：">
        <el-input v-model="value.stock"></el-input>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button type="primary" size="medium" @click="handleFinishCommit">完成，提交商品</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {fetchListWithChildren} from '@/api/bookCate'
import {fetchList as fetchBrandList} from '@/api/brand'
import {getBook} from '@/api/book';

export default {
  name: "BookInfoDetail",
  props: {
    value: Object,
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      hasEditCreated: false,
      //选中商品分类的值
      selectBookCateValue: [],
      bookCateOptions: [],
      brandOptions: [],
      rules: {
        name: [
          {required: true, message: '请输入商品名称', trigger: 'blur'},
          {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
        ],
        subTitle: [{required: true, message: '请输入商品副标题', trigger: 'blur'}],
        bookCategoryId: [{required: true, message: '请选择商品分类', trigger: 'blur'}],
        brandId: [{required: true, message: '请选择商品品牌', trigger: 'blur'}],
        description: [{required: true, message: '请输入商品介绍', trigger: 'blur'}],
        requiredProp: [{required: true, message: '该项为必填项', trigger: 'blur'}]
      }
    };
  },
  created() {
    this.getBookCateList();
    this.getBrandList();
  },
  computed: {
    //商品的编号
    bookId() {
      return this.value.id;
    }
  },
  watch: {
    bookId: function (newValue) {
      if (!this.isEdit) return;
      if (this.hasEditCreated) return;
      if (newValue === undefined || newValue == null || newValue === 0) return;
      this.handleEditCreated();
    },
    selectBookCateValue: function (newValue) {
      if (newValue != null && newValue.length === 2) {
        this.value.bookCategoryId = newValue[1];
        this.value.bookCategoryName = this.getCateNameById(this.value.bookCategoryId);
      } else {
        this.value.bookCategoryId = null;
        this.value.bookCategoryName = null;
      }
    }
  },
  methods: {
    handleFinishCommit() {
      this.$emit('finishCommit', this.isEdit);
    },
    //处理编辑逻辑
    handleEditCreated() {
      if (this.value.bookCategoryId != null) {
        this.selectBookCateValue.push(this.value.cateParentId);
        this.selectBookCateValue.push(this.value.bookCategoryId);
      }
      this.hasEditCreated = true;
    },
    getBookCateList() {
      fetchListWithChildren().then(response => {
        let list = response.data;
        this.bookCateOptions = [];
        for (let i = 0; i < list.length; i++) {
          let children = [];
          if (list[i].children != null && list[i].children.length > 0) {
            for (let j = 0; j < list[i].children.length; j++) {
              children.push({label: list[i].children[j].name, value: list[i].children[j].id});
            }
          }
          this.bookCateOptions.push({label: list[i].name, value: list[i].id, children: children});
        }
      });
    },
    getBrandList() {
      fetchBrandList({pageNum: 1, pageSize: 100}).then(response => {
        this.brandOptions = [];
        let brandList = response.data.list;
        for (let i = 0; i < brandList.length; i++) {
          this.brandOptions.push({label: brandList[i].name, value: brandList[i].id});
        }
      });
    },
    getCateNameById(id) {
      let name = null;
      for (let i = 0; i < this.bookCateOptions.length; i++) {
        for (let j = 0; j < this.bookCateOptions[i].children.length; j++) {
          if (this.bookCateOptions[i].children[j].value === id) {
            name = this.bookCateOptions[i].children[j].label;
            return name;
          }
        }
      }
      return name;
    },
    handleNext(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('nextStep');
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
    handleBrandChange(val) {
      let brandName = '';
      for (let i = 0; i < this.brandOptions.length; i++) {
        if (this.brandOptions[i].value === val) {
          brandName = this.brandOptions[i].label;
          break;
        }
      }
      this.value.brandName = brandName;
    }
  }
}
</script>

<style scoped>
</style>
