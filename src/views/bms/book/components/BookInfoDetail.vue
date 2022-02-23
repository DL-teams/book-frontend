<template>
  <div>
    <el-form :model="value" :rules="rules" ref="bookInfoForm" label-width="120px" style="width: 600px" size="small">
      
      <el-form-item label="图书编号：" prop="id" width="215px">
        <el-input v-model="value.id "></el-input>
      </el-form-item>
      <el-form-item label="图书条形码：" prop="pic">
        <el-input v-model="value.pic "></el-input>
      </el-form-item>
      <el-form-item label="图书名称：" prop="name">
        <el-input v-model="value.name"></el-input>
      </el-form-item>
      <el-form-item label="图书作者：" prop="author">
        <el-input v-model="value.author "></el-input>
      </el-form-item>

      <el-form-item label="图书分类：" prop="bookCategoryId">
        <el-cascader
          v-model="selectBookCateValue"
          :options="bookCateOptions">
        </el-cascader>
      </el-form-item>

      <el-form-item label="出版社：" prop="brandId">
        <el-select
          v-model="value.brandId"
          @change="handleBrandChange"
          placeholder="请选择出版社：">
          <el-option
            v-for="item in brandOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="单价：" prop="price">
        <el-input v-model="value.price "></el-input>
      </el-form-item>
      <el-form-item label="出版时间：" prop="time">
        <div class="block">
          <el-date-picker
            v-model="value1"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="总册数：" prop="number">
        <el-input v-model="value.number "></el-input>
      </el-form-item>
      <el-form-item label="备注：" prop="remark">
        <el-input v-model="value.remark "></el-input>
      </el-form-item>
      <el-form-item label="所在书架：" prop="bookCategoryId">
        <el-cascader
          v-model="selectBookCateValue"
          :options="bookCateOptions">
        </el-cascader>
      </el-form-item>

      <el-form-item label="在库数量："prop="stock" >
        <el-input v-model="value.stock"></el-input>
      </el-form-item>

      <el-form-item >
        <el-button type="primary" size="medium" @click="handleFinishCommit">完成</el-button>
         <el-button size="medium" @click="resetForm('bookInfoForm')">重置</el-button>
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
        id: [{required: true, message: '请输入图书编号', trigger: 'blur'}],
        name: [
          {required: true, message: '请输入商品名称', trigger: 'blur'},
          {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
        ],
        pic: [
          {required: true, message: '请输入图书条形码', trigger: 'blur'},
          {min: 2, max: 140, message: '长度在 2 到 15 个字符', trigger: 'blur'}
        ],
        author: [{required: true, message: '请输入图书作者', trigger: 'blur'}],
        time: [{required: true, message: '请输入出版时间', trigger: 'blur'}],
        stock:[{required: true, message: '请输入数量', trigger: 'blur'}],
        bookCategoryId: [{required: true, message: '请选择商品分类', trigger: 'blur'}],
        brandId: [{required: true, message: '请选择商品品牌', trigger: 'blur'}],
       
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
    resetForm(formName) {
      this.$refs[formName].resetFields();
      // this.bookCate = Object.assign({}, defaultBookCate);
      // this.getSelectBookCateList();
      // this.filterBookAttrList = [{
      //   value: []
      // }];
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
