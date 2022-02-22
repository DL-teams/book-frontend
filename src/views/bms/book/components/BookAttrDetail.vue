<template>
  <div style="margin-top: 50px">
    <el-form :model="value" ref="bookAttrForm" label-width="120px" style="width: 720px" size="small">
      <el-form-item label="属性类型：">
        <el-select v-model="value.bookAttributeCategoryId"
                   placeholder="请选择属性类型"
                   @change="handleBookAttrChange">
          <el-option
            v-for="item in bookAttributeCategoryOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品规格：">
        <el-card shadow="never" class="cardBg">
          <div v-for="(bookAttr,idx) in selectBookAttr">
            {{ bookAttr.name }}：
            <el-checkbox-group v-if="bookAttr.handAddStatus===0" v-model="selectBookAttr[idx].values">
              <el-checkbox v-for="item in getInputListArr(bookAttr.inputList)" :label="item" :key="item"
                           class="littleMarginLeft"></el-checkbox>
            </el-checkbox-group>
            <div v-else>
              <el-checkbox-group v-model="selectBookAttr[idx].values">
                <div v-for="(item,index) in selectBookAttr[idx].options" style="display: inline-block"
                     class="littleMarginLeft">
                  <el-checkbox :label="item" :key="item"></el-checkbox>
                  <el-button type="text" class="littleMarginLeft" @click="handleRemoveBookAttrValue(idx,index)">删除
                  </el-button>
                </div>
              </el-checkbox-group>
              <el-input v-model="addBookAttrValue" style="width: 160px;margin-left: 10px" clearable></el-input>
              <el-button class="littleMarginLeft" @click="handleAddBookAttrValue(idx)">增加</el-button>
            </div>
          </div>
        </el-card>
        <el-table style="width: 100%;margin-top: 20px"
                  :data="value.skuStockList"
                  border>
          <el-table-column
            v-for="(item,index) in selectBookAttr"
            :label="item.name"
            :key="item.id"
            align="center">
            <template slot-scope="scope">
              {{ getBookSkuSp(scope.row, index) }}
            </template>
          </el-table-column>
          <el-table-column
            label="销售价格"
            width="80"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.price"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="商品库存"
            width="80"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.stock"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="库存预警值"
            width="80"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.lowStock"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="SKU编号"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.skuCode"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="80"
            align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="handleRemoveBookSku(scope.$index, scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          style="margin-top: 20px"
          @click="handleRefreshBookSkuList">刷新列表
        </el-button>
        <el-button
          type="primary"
          style="margin-top: 20px"
          @click="handleSyncBookSkuPrice">同步价格
        </el-button>
        <el-button
          type="primary"
          style="margin-top: 20px"
          @click="handleSyncBookSkuStock">同步库存
        </el-button>
      </el-form-item>
      <el-form-item label="属性图片：" v-if="hasAttrPic">
        <el-card shadow="never" class="cardBg">
          <div v-for="(item,index) in selectBookAttrPics">
            <span>{{ item.name }}:</span>
            <single-upload v-model="item.pic"
                           style="width: 300px;display: inline-block;margin-left: 10px"></single-upload>
          </div>
        </el-card>
      </el-form-item>
      <el-form-item label="商品参数：">
        <el-card shadow="never" class="cardBg">
          <div v-for="(item,index) in selectBookParam" :class="{littleMarginTop:index!==0}">
            <div class="paramInputLabel">{{ item.name }}:</div>
            <el-select v-if="item.inputType===1" class="paramInput" v-model="selectBookParam[index].value">
              <el-option
                v-for="item in getParamInputList(item.inputList)"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
            <el-input v-else class="paramInput" v-model="selectBookParam[index].value"></el-input>
          </div>
        </el-card>
      </el-form-item>
      <el-form-item label="商品相册：">
        <multi-upload v-model="selectBookPics"></multi-upload>
      </el-form-item>
      <el-form-item label="规格参数：">
        <el-tabs v-model="activeHtmlName" type="card">
          <el-tab-pane label="电脑端详情" name="pc">
            <tinymce :width="595" :height="300" v-model="value.detailHtml"></tinymce>
          </el-tab-pane>
          <el-tab-pane label="移动端详情" name="mobile">
            <tinymce :width="595" :height="300" v-model="value.detailMobileHtml"></tinymce>
          </el-tab-pane>
        </el-tabs>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button type="primary" size="medium" @click="handleFinishCommit">完成，提交商品</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {fetchList as fetchBookAttrCateList} from '@/api/bookAttrCate'
import {fetchList as fetchBookAttrList} from '@/api/bookPress'
import SingleUpload from '@/components/Upload/singleUpload'
import MultiUpload from '@/components/Upload/multiUpload'
import Tinymce from '@/components/Tinymce'

export default {
  name: "BookAttrDetail",
  components: {SingleUpload, MultiUpload, Tinymce},
  props: {
    value: Object,
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      //编辑模式时是否初始化成功
      hasEditCreated: false,
      //商品属性分类下拉选项
      bookAttributeCategoryOptions: [],
      //选中的商品属性
      selectBookAttr: [],
      //选中的商品参数
      selectBookParam: [],
      //选中的商品属性图片
      selectBookAttrPics: [],
      //可手动添加的商品属性
      addBookAttrValue: '',
      //商品富文本详情激活类型
      activeHtmlName: 'pc'
    }
  },
  computed: {
    //是否有商品属性图片
    hasAttrPic() {
      if (this.selectBookAttrPics.length < 1) {
        return false;
      }
      return true;
    },
    //商品的编号
    bookId() {
      return this.value.id;
    },
    //商品的主图和画册图片
    selectBookPics: {
      get: function () {
        let pics = [];
        if (this.value.pic === undefined || this.value.pic == null || this.value.pic === '') {
          return pics;
        }
        pics.push(this.value.pic);
        if (this.value.albumPics === undefined || this.value.albumPics == null || this.value.albumPics === '') {
          return pics;
        }
        let albumPics = this.value.albumPics.split(',');
        for (let i = 0; i < albumPics.length; i++) {
          pics.push(albumPics[i]);
        }
        return pics;
      },
      set: function (newValue) {
        if (newValue == null || newValue.length === 0) {
          this.value.pic = null;
          this.value.albumPics = null;
        } else {
          this.value.pic = newValue[0];
          this.value.albumPics = '';
          if (newValue.length > 1) {
            for (let i = 1; i < newValue.length; i++) {
              this.value.albumPics += newValue[i];
              if (i !== newValue.length - 1) {
                this.value.albumPics += ',';
              }
            }
          }
        }
      }
    }
  },
  created() {
    this.getBookAttrCateList();
  },
  watch: {
    bookId: function (newValue) {
      if (!this.isEdit) return;
      if (this.hasEditCreated) return;
      if (newValue === undefined || newValue == null || newValue === 0) return;
      this.handleEditCreated();
    }
  },
  methods: {
    handleFinishCommit() {
      this.$emit('finishCommit', this.isEdit);
    },
    handleEditCreated() {
      //根据商品属性分类id获取属性和参数
      if (this.value.bookAttributeCategoryId != null) {
        this.handleBookAttrChange(this.value.bookAttributeCategoryId);
      }
      this.hasEditCreated = true;
    },
    getBookAttrCateList() {
      let param = {pageNum: 1, pageSize: 100};
      fetchBookAttrCateList(param).then(response => {
        this.bookAttributeCategoryOptions = [];
        let list = response.data.list;
        for (let i = 0; i < list.length; i++) {
          this.bookAttributeCategoryOptions.push({label: list[i].name, value: list[i].id});
        }
      });
    },
    getBookAttrList(type, cid) {
      let param = {pageNum: 1, pageSize: 100, type: type};
      fetchBookAttrList(cid, param).then(response => {
        let list = response.data.list;
        if (type === 0) {
          this.selectBookAttr = [];
          for (let i = 0; i < list.length; i++) {
            let options = [];
            let values = [];
            if (this.isEdit) {
              if (list[i].handAddStatus === 1) {
                //编辑状态下获取手动添加编辑属性
                options = this.getEditAttrOptions(list[i].id);
              }
              //编辑状态下获取选中属性
              values = this.getEditAttrValues(i);
            }
            this.selectBookAttr.push({
              id: list[i].id,
              name: list[i].name,
              handAddStatus: list[i].handAddStatus,
              inputList: list[i].inputList,
              values: values,
              options: options
            });
          }
          if (this.isEdit) {
            //编辑模式下刷新商品属性图片
            this.refreshBookAttrPics();
          }
        } else {
          this.selectBookParam = [];
          for (let i = 0; i < list.length; i++) {
            let value = null;
            if (this.isEdit) {
              //编辑模式下获取参数属性
              value = this.getEditParamValue(list[i].id);
            }
            this.selectBookParam.push({
              id: list[i].id,
              name: list[i].name,
              value: value,
              inputType: list[i].inputType,
              inputList: list[i].inputList
            });
          }
        }
      });
    },
    //获取设置的可手动添加属性值
    getEditAttrOptions(id) {
      let options = [];
      for (let i = 0; i < this.value.bookAttributeValueList.length; i++) {
        let attrValue = this.value.bookAttributeValueList[i];
        if (attrValue.bookAttributeId === id) {
          let strArr = attrValue.value.split(',');
          for (let j = 0; j < strArr.length; j++) {
            options.push(strArr[j]);
          }
          break;
        }
      }
      return options;
    },
    //获取选中的属性值
    getEditAttrValues(index) {
      let values = new Set();
      if (index === 0) {
        for (let i = 0; i < this.value.skuStockList.length; i++) {
          let sku = this.value.skuStockList[i];
          let spData = JSON.parse(sku.spData);
          if (spData != null && spData.length >= 1) {
            values.add(spData[0].value);
          }
        }
      } else if (index === 1) {
        for (let i = 0; i < this.value.skuStockList.length; i++) {
          let sku = this.value.skuStockList[i];
          let spData = JSON.parse(sku.spData);
          if (spData != null && spData.length >= 2) {
            values.add(spData[1].value);
          }
        }
      } else {
        for (let i = 0; i < this.value.skuStockList.length; i++) {
          let sku = this.value.skuStockList[i];
          let spData = JSON.parse(sku.spData);
          if (spData != null && spData.length >= 3) {
            values.add(spData[2].value);
          }
        }
      }
      return Array.from(values);
    },
    //获取属性的值
    getEditParamValue(id) {
      for (let i = 0; i < this.value.bookAttributeValueList.length; i++) {
        if (id === this.value.bookAttributeValueList[i].bookAttributeId) {
          return this.value.bookAttributeValueList[i].value;
        }
      }
    },
    handleBookAttrChange(value) {
      this.getBookAttrList(0, value);
      this.getBookAttrList(1, value);
    },
    getInputListArr(inputList) {
      return inputList.split(',');
    },
    handleAddBookAttrValue(idx) {
      let options = this.selectBookAttr[idx].options;
      if (this.addBookAttrValue == null || this.addBookAttrValue == '') {
        this.$message({
          message: '属性值不能为空',
          type: 'warning',
          duration: 1000
        });
        return
      }
      if (options.indexOf(this.addBookAttrValue) !== -1) {
        this.$message({
          message: '属性值不能重复',
          type: 'warning',
          duration: 1000
        });
        return;
      }
      this.selectBookAttr[idx].options.push(this.addBookAttrValue);
      this.addBookAttrValue = null;
    },
    handleRemoveBookAttrValue(idx, index) {
      this.selectBookAttr[idx].options.splice(index, 1);
    },
    getBookSkuSp(row, index) {
      let spData = JSON.parse(row.spData);
      if (spData != null && index < spData.length) {
        return spData[index].value;
      } else {
        return null;
      }
    },
    handleRefreshBookSkuList() {
      this.$confirm('刷新列表将导致sku信息重新生成，是否要刷新', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.refreshBookAttrPics();
        this.refreshBookSkuList();
      });
    },
    handleSyncBookSkuPrice() {
      this.$confirm('将同步第一个sku的价格到所有sku,是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.value.skuStockList !== null && this.value.skuStockList.length > 0) {
          let tempSkuList = [];
          tempSkuList = tempSkuList.concat(tempSkuList, this.value.skuStockList);
          let price = this.value.skuStockList[0].price;
          for (let i = 0; i < tempSkuList.length; i++) {
            tempSkuList[i].price = price;
          }
          this.value.skuStockList = [];
          this.value.skuStockList = this.value.skuStockList.concat(this.value.skuStockList, tempSkuList);
        }
      });
    },
    handleSyncBookSkuStock() {
      this.$confirm('将同步第一个sku的库存到所有sku,是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.value.skuStockList !== null && this.value.skuStockList.length > 0) {
          let tempSkuList = [];
          tempSkuList = tempSkuList.concat(tempSkuList, this.value.skuStockList);
          let stock = this.value.skuStockList[0].stock;
          let lowStock = this.value.skuStockList[0].lowStock;
          for (let i = 0; i < tempSkuList.length; i++) {
            tempSkuList[i].stock = stock;
            tempSkuList[i].lowStock = lowStock;
          }
          this.value.skuStockList = [];
          this.value.skuStockList = this.value.skuStockList.concat(this.value.skuStockList, tempSkuList);
        }
      });
    },
    refreshBookSkuList() {
      this.value.skuStockList = [];
      let skuList = this.value.skuStockList;
      //只有一个属性时
      if (this.selectBookAttr.length === 1) {
        let attr = this.selectBookAttr[0];
        for (let i = 0; i < attr.values.length; i++) {
          skuList.push({
            spData: JSON.stringify([{key: attr.name, value: attr.values[i]}])
          });
        }
      } else if (this.selectBookAttr.length === 2) {
        let attr0 = this.selectBookAttr[0];
        let attr1 = this.selectBookAttr[1];
        for (let i = 0; i < attr0.values.length; i++) {
          if (attr1.values.length === 0) {
            skuList.push({
              spData: JSON.stringify([{key: attr0.name, value: attr0.values[i]}])
            });
            continue;
          }
          for (let j = 0; j < attr1.values.length; j++) {
            let spData = [];
            spData.push({key: attr0.name, value: attr0.values[i]});
            spData.push({key: attr1.name, value: attr1.values[j]});
            skuList.push({
              spData: JSON.stringify(spData)
            });
          }
        }
      } else {
        let attr0 = this.selectBookAttr[0];
        let attr1 = this.selectBookAttr[1];
        let attr2 = this.selectBookAttr[2];
        for (let i = 0; i < attr0.values.length; i++) {
          if (attr1.values.length === 0) {
            skuList.push({
              spData: JSON.stringify([{key: attr0.name, value: attr0.values[i]}])
            });
            continue;
          }
          for (let j = 0; j < attr1.values.length; j++) {
            if (attr2.values.length === 0) {
              let spData = [];
              spData.push({key: attr0.name, value: attr0.values[i]});
              spData.push({key: attr1.name, value: attr1.values[j]});
              skuList.push({
                spData: JSON.stringify(spData)
              });
              continue;
            }
            for (let k = 0; k < attr2.values.length; k++) {
              let spData = [];
              spData.push({key: attr0.name, value: attr0.values[i]});
              spData.push({key: attr1.name, value: attr1.values[j]});
              spData.push({key: attr2.name, value: attr2.values[k]});
              skuList.push({
                spData: JSON.stringify(spData)
              });
            }
          }
        }
      }
    },
    refreshBookAttrPics() {
      this.selectBookAttrPics = [];
      if (this.selectBookAttr.length >= 1) {
        let values = this.selectBookAttr[0].values;
        for (let i = 0; i < values.length; i++) {
          let pic = null;
          if (this.isEdit) {
            //编辑状态下获取图片
            pic = this.getBookSkuPic(values[i]);
          }
          this.selectBookAttrPics.push({name: values[i], pic: pic})
        }
      }
    },
    //获取商品相关属性的图片
    getBookSkuPic(name) {
      for (let i = 0; i < this.value.skuStockList.length; i++) {
        let spData = JSON.parse(this.value.skuStockList[i].spData);
        if (name === spData[0].value) {
          return this.value.skuStockList[i].pic;
        }
      }
      return null;
    },
    //合并商品属性
    mergeBookAttrValue() {
      this.value.bookAttributeValueList = [];
      for (let i = 0; i < this.selectBookAttr.length; i++) {
        let attr = this.selectBookAttr[i];
        if (attr.handAddStatus === 1 && attr.options != null && attr.options.length > 0) {
          this.value.bookAttributeValueList.push({
            bookAttributeId: attr.id,
            value: this.getOptionStr(attr.options)
          });
        }
      }
      for (let i = 0; i < this.selectBookParam.length; i++) {
        let param = this.selectBookParam[i];
        this.value.bookAttributeValueList.push({
          bookAttributeId: param.id,
          value: param.value
        });
      }
    },
    //合并商品属性图片
    mergeBookAttrPics() {
      for (let i = 0; i < this.selectBookAttrPics.length; i++) {
        for (let j = 0; j < this.value.skuStockList.length; j++) {
          let spData = JSON.parse(this.value.skuStockList[j].spData);
          if (spData[0].value === this.selectBookAttrPics[i].name) {
            this.value.skuStockList[j].pic = this.selectBookAttrPics[i].pic;
          }
        }
      }
    },
    getOptionStr(arr) {
      let str = '';
      for (let i = 0; i < arr.length; i++) {
        str += arr[i];
        if (i != arr.length - 1) {
          str += ',';
        }
      }
      return str;
    },
    handleRemoveBookSku(index, row) {
      let list = this.value.skuStockList;
      if (list.length === 1) {
        list.pop();
      } else {
        list.splice(index, 1);
      }
    },
    getParamInputList(inputList) {
      return inputList.split(',');
    },
    handlePrev() {
      this.$emit('prevStep')
    },
    handleNext() {
      this.mergeBookAttrValue();
      this.mergeBookAttrPics();
      this.$emit('nextStep')
    }
  }
}
</script>

<style scoped>
.littleMarginLeft {
  margin-left: 10px;
}

.littleMarginTop {
  margin-top: 10px;
}

.paramInput {
  width: 250px;
}

.paramInputLabel {
  display: inline-block;
  width: 100px;
  text-align: right;
  padding-right: 10px
}

.cardBg {
  background: #F8F9FC;
}
</style>
