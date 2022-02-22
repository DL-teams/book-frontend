<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="coupon"
             :rules="rules"
             ref="couponFrom"
             label-width="150px"
             size="small">
      <el-form-item label="优惠券类型：">
        <el-select v-model="coupon.type">
          <el-option
            v-for="type in typeOptions"
            :key="type.value"
            :label="type.label"
            :value="type.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="优惠券名称：" prop="name">
        <el-input v-model="coupon.name" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="适用平台：">
        <el-select v-model="coupon.platform">
          <el-option
            v-for="item in platformOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="总发行量：" prop="publishCount">
        <el-input v-model.number="coupon.publishCount" placeholder="只能输入正整数" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="面额：" prop="amount">
        <el-input v-model.number="coupon.amount" placeholder="面值只能是数值，限2位小数" class="input-width">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="每人限领：">
        <el-input v-model="coupon.perLimit" placeholder="只能输入正整数" class="input-width">
          <template slot="append">张</template>
        </el-input>
      </el-form-item>
      <el-form-item label="使用门槛：" prop="minPoint">
        <el-input v-model.number="coupon.minPoint" placeholder="只能输入正整数" class="input-width">
          <template slot="prepend">满</template>
          <template slot="append">元可用</template>
        </el-input>
      </el-form-item>
      <el-form-item label="领取日期：" prop="enableTime">
        <el-date-picker type="date" placeholder="选择日期" v-model="coupon.enableTime" class="input-width"></el-date-picker>
      </el-form-item>
      <el-form-item label="有效期：">
        <el-date-picker type="date" placeholder="选择日期" v-model="coupon.startTime" style="width: 150px"></el-date-picker>
        <span style="margin-left: 20px;margin-right: 20px">至</span>
        <el-date-picker type="date" placeholder="选择日期" v-model="coupon.endTime" style="width: 150px"></el-date-picker>
      </el-form-item>
      <el-form-item label="可使用商品：">
        <el-radio-group v-model="coupon.useType">
          <el-radio-button :label="0">全场通用</el-radio-button>
          <el-radio-button :label="1">指定分类</el-radio-button>
          <el-radio-button :label="2">指定商品</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-show="coupon.useType===1">
        <el-cascader
          clearable
          placeholder="请选择分类名称"
          v-model="selectBookCate"
          :options="bookCateOptions">
        </el-cascader>
        <el-button @click="handleAddBookCategoryRelation()">添加</el-button>
        <el-table ref="bookCateRelationTable"
                  :data="coupon.bookCategoryRelationList"
                  style="width: 100%;margin-top: 20px"
                  border>
          <el-table-column label="分类名称" align="center">
            <template slot-scope="scope">{{scope.row.parentCategoryName}}>{{scope.row.bookCategoryName}}</template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="100">
            <template slot-scope="scope">
              <el-button size="mini"
                         type="text"
                         @click="handleDeleteBookCateRelation(scope.$index, scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item v-show="coupon.useType===2">
        <el-select
          v-model="selectBook"
          filterable
          remote
          reserve-keyword
          placeholder="商品名称/商品货号"
          :remote-method="searchBookMethod"
          :loading="selectBookLoading">
          <el-option
            v-for="item in selectBookOptions"
            :key="item.bookId"
            :label="item.bookName"
            :value="item.bookId">
            <span style="float: left">{{ item.bookName }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">NO.{{ item.bookSn }}</span>
          </el-option>
        </el-select>
        <el-button @click="handleAddBookRelation()">添加</el-button>
        <el-table ref="bookRelationTable"
                  :data="coupon.bookRelationList"
                  style="width: 100%;margin-top: 20px"
                  border>
          <el-table-column label="商品名称" align="center">
            <template slot-scope="scope">{{scope.row.bookName}}</template>
          </el-table-column>
          <el-table-column label="货号" align="center"  width="120" >
            <template slot-scope="scope">NO.{{scope.row.bookSn}}</template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="100">
            <template slot-scope="scope">
              <el-button size="mini"
                         type="text"
                         @click="handleDeleteBookRelation(scope.$index, scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input
          class="input-width"
          type="textarea"
          :rows="5"
          placeholder="请输入内容"
          v-model="coupon.note">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('couponFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('couponFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
  import {createCoupon,getCoupon,updateCoupon} from '@/api/coupon';
  import {fetchSimpleList as fetchBookList} from '@/api/book';
  import {fetchListWithChildren} from '@/api/bookCate'
  const defaultCoupon = {
    type: 0,
    name: null,
    platform: 0,
    amount: null,
    perLimit: 1,
    minPoint: null,
    startTime: null,
    endTime: null,
    useType: 0,
    note: null,
    publishCount: null,
    bookRelationList: [],
    bookCategoryRelationList: []
  };
  const defaultTypeOptions = [
    {
      label: '全场赠券',
      value: 0
    },
    {
      label: '会员赠券',
      value: 1
    },
    {
      label: '购物赠券',
      value: 2
    },
    {
      label: '注册赠券',
      value: 3
    }
  ];
  const defaultPlatformOptions = [
    {
      label: '全平台',
      value: 0
    },
    {
      label: '移动平台',
      value: 1
    },
    {
      label: 'PC平台',
      value: 2
    }
  ];
  export default {
    name: 'CouponDetail',
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        coupon: Object.assign({}, defaultCoupon),
        typeOptions: Object.assign({}, defaultTypeOptions),
        platformOptions: Object.assign({}, defaultPlatformOptions),
        rules: {
          name: [
            {required: true, message: '请输入优惠券名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
          publishCount: [
            {type: 'number',required: true, message: '只能输入正整数', trigger: 'blur'}
          ],
          amount: [
            {type: 'number',required: true,message: '面值只能是数值，0.01-10000，限2位小数',trigger: 'blur'}
          ],
          minPoint: [
            {type: 'number',required: true,message: '只能输入正整数',trigger: 'blur'}
          ]
        },
        selectBook:null,
        selectBookLoading: false,
        selectBookOptions:[],
        selectBookCate: null,
        bookCateOptions: []
      }
    },
    created(){
      if(this.isEdit){
        getCoupon(this.$route.query.id).then(response=>{
          this.coupon=response.data;
        });
      }
      this.getBookCateList();
    },
    methods:{
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('是否提交数据', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if(this.isEdit){
                updateCoupon(this.$route.query.id,this.coupon).then(response=>{
                  this.$refs[formName].resetFields();
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration:1000
                  });
                  this.$router.back();
                });
              }else{
                createCoupon(this.coupon).then(response=>{
                  this.$refs[formName].resetFields();
                  this.$message({
                    message: '提交成功',
                    type: 'success',
                    duration:1000
                  });
                  this.$router.back();
                });
              }
            });
          } else {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration:1000
            });
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.coupon = Object.assign({},defaultCoupon);
      },
      searchBookMethod(query){
        if (query !== '') {
          this.loading = true;
          fetchBookList({keyword:query}).then(response=>{
            this.loading=false;
            let bookList = response.data;
            this.selectBookOptions = [];
            for(let i=0;i<bookList.length;i++){
              let item = bookList[i];
              this.selectBookOptions.push({bookId:item.id,bookName:item.name,bookSn:item.bookSn});
            }
          });
        } else {
          this.selectBookOptions = [];
        }
      },
      handleAddBookRelation(){
        if(this.selectBook===null){
          this.$message({
            message: '请先选择商品',
            type: 'warning'
          });
          return
        }
        this.coupon.bookRelationList.push(this.getBookById(this.selectBook));
        this.selectBook=null;
      },
      handleDeleteBookRelation(index,row){
        this.coupon.bookRelationList.splice(index,1);
      },
      handleAddBookCategoryRelation(){
        if(this.selectBookCate===null||this.selectBookCate.length===0){
          this.$message({
            message: '请先选择商品分类',
            type: 'warning'
          });
          return
        }
        this.coupon.bookCategoryRelationList.push(this.getBookCateByIds(this.selectBookCate));
        this.selectBookCate=[];
      },
      handleDeleteBookCateRelation(index,row){
        this.coupon.bookCategoryRelationList.splice(index,1);
      },
      getBookById(id){
        for(let i=0;i<this.selectBookOptions.length;i++){
          if(id===this.selectBookOptions[i].bookId){
            return this.selectBookOptions[i];
          }
        }
        return null;
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
      getBookCateByIds(ids){
        let name;
        let parentName;
        for (let i = 0; i < this.bookCateOptions.length; i++) {
          if (this.bookCateOptions[i].value === ids[0]) {
            parentName = this.bookCateOptions[i].label;
            for (let j = 0; j < this.bookCateOptions[i].children.length; j++) {
              if (this.bookCateOptions[i].children[j].value === ids[1]) {
                name = this.bookCateOptions[i].children[j].label;
              }
            }
          }
        }
        return {bookCategoryId: ids[1], bookCategoryName: name, parentCategoryName: parentName};
      }
    }
  }
</script>
<style scoped>
  .input-width {
    width: 60%;
  }
</style>


