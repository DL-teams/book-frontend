<template> 
  <el-card class="form-container" shadow="never">
    <book-info-detail
      v-model="bookParam"
      :is-edit="isEdit">
    </book-info-detail>
  </el-card>
</template>
<script>
import BookInfoDetail from './BookInfoDetail';
import {createBook, getBook, updateBook} from '@/api/book';

const defaultBookParam = {
  albumPics: '',
  brandId: null,
  brandName: '',
  deleteStatus: 0,
  description: '',
  detailDesc: '',
  detailHtml: '',
  detailMobileHtml: '',
  detailTitle: '',
  feightTemplateId: 0,
  flashPromotionCount: 0,
  flashPromotionId: 0,
  flashPromotionPrice: 0,
  flashPromotionSort: 0,
  giftPoint: 0,
  giftGrowth: 0,
  keywords: '',
  lowStock: 0,
  name: '',
  newStatus: 0,
  note: '',
  originalPrice: 0,
  pic: '',
  //会员价格{memberLevelId: 0,memberPrice: 0,memberLevelName: null}
  memberPriceList: [],
  //商品满减
  bookFullReductionList: [{fullPrice: 0, reducePrice: 0}],
  //商品阶梯价格
  bookLadderList: [{count: 0, discount: 0, price: 0}],
  previewStatus: 0,
  price: 0,
  bookAttributeCategoryId: null,
  //商品属性相关{bookAttributeId: 0, value: ''}
  bookAttributeValueList: [],
  //商品sku库存信息{lowStock: 0, pic: '', price: 0, sale: 0, skuCode: '', spData: '', stock: 0}
  skuStockList: [],
  //商品相关专题{subjectId: 0}
  subjectBookRelationList: [],
  //商品相关优选{prefrenceAreaId: 0}
  prefrenceAreaBookRelationList: [],
  bookCategoryId: null,
  bookCategoryName: '',
  bookSn: '',
  promotionEndTime: '',
  promotionPerLimit: 0,
  promotionPrice: null,
  promotionStartTime: '',
  promotionType: 0,
  publishStatus: 0,
  recommandStatus: 0,
  sale: 0,
  serviceIds: '',
  sort: 0,
  stock: 0,
  subTitle: '',
  unit: '',
  usePointLimit: 0,
  verifyStatus: 0,
  weight: 0
};
export default {
  name: 'BookDetail',
  components: {BookInfoDetail},
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      active: 0,
      bookParam: Object.assign({}, defaultBookParam),
    }
  },
  created() {
    if (this.isEdit) {
      getBook(this.$route.query.id).then(response => {
        this.bookParam = response.data;
      });
    }
  },
  methods: {
    finishCommit(isEdit) {
      this.$confirm('是否要提交该产品', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (isEdit) {
          updateBook(this.$route.query.id, this.bookParam).then(response => {
            this.$message({
              type: 'success',
              message: '提交成功',
              duration: 1000
            });
            this.$router.back();
          });
        } else {
          createBook(this.bookParam).then(response => {
            this.$message({
              type: 'success',
              message: '提交成功',
              duration: 1000
            });
            location.reload();
          });
        }
      })
    }
  }
}
</script>
<style>
.form-container {
  width: 800px;
}
</style>


