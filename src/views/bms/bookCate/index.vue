<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          @click="getList"
          type="primary"
          size="small">
          查询
        </el-button>
        <el-button
          style="float: right;margin-right: 15px"
          @click="clearQuery"
          size="small">
          重置
        </el-button>
      </div>
      
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="分类编号：">
            <el-input style="width: 203px" v-model="listQuery.code" placeholder="分类编号"></el-input>
          </el-form-item>

          <el-form-item label="分类名称：">
            <el-input style="width: 203px" v-model="listQuery.name" placeholder="分类名称"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">数据列表</span>
      <el-button
        class="btn-add"
        @click="handleAddBookCate()"
        size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="bookCateTable"
                style="width: 100%"
                :data="list"
                v-loading="listLoading" border>
        <el-table-column label="分类编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.code}}</template>
        </el-table-column>
        <el-table-column label="分类名称" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="级别" width="100" align="center">
          <template slot-scope="scope">{{scope.row.parentId | levelFilter}}</template>
        </el-table-column>
<!--        <el-table-column label="图书数量" width="100" align="center">-->
<!--          <template slot-scope="scope">{{scope.row.bookCount }}</template>-->
<!--        </el-table-column>-->
        <el-table-column label="是否显示" width="100" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleShowStatusChange(scope.$index, scope.row)"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.showStatus">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="排序" width="100" align="center">
          <template slot-scope="scope">{{scope.row.sort }}</template>
        </el-table-column>
        <el-table-column label="设置" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="disableNextLevel(scope.row.parentId)"
              size="mini"
              @click="handleShowLastLevel">查看上级
            </el-button>
            <el-button
              v-else
              size="mini"
              @click="handleShowNextLevel(scope.$index, scope.row)">查看下级
            </el-button>
<!--            <el-button-->
<!--              size="mini"-->
<!--              @click="handleTransferBook(scope.$index, scope.row)">转移商品-->
<!--            </el-button>-->
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleUpdate(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.pageNum"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {fetchList,deleteBookCate,updateShowStatus,updateNavStatus} from '@/api/bookCate'

  export default {
    name: "bookCateList",
    data() {
      return {
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          pageNum: 1,
          pageSize: 5,
          code: '',
          name: ''
        },
        parentId: 0
      }
    },
    created() {
      this.resetParentId();
      this.getList();
    },
    watch: {
      $route(route) {
        this.resetParentId();
        this.getList();
      }
    },
    methods: {
      resetParentId(){
        this.listQuery.pageNum = 1;
        if (this.$route.query.parentId != null) {
          this.parentId = this.$route.query.parentId;
        } else {
          this.parentId = 0;
        }
      },
      handleAddBookCate() {
        this.$router.push('/bms/addBookCate');
      },
      clearQuery() {
        this.listQuery.code = '';
        this.listQuery.name = '';
      },
      getList() {
        this.listLoading = true;
        fetchList(this.parentId, this.listQuery).then(response => {
          console.log(response);
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
        });
      },
      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getList();
      },
      // handleNavStatusChange(index, row) {
      //   let data = new URLSearchParams();
      //   let ids=[];
      //   ids.push(row.id)
      //   data.append('ids',ids);
      //   data.append('navStatus',row.navStatus);
      //   updateNavStatus(data).then(response=>{
      //     this.$message({
      //       message: '修改成功',
      //       type: 'success',
      //       duration: 1000
      //     });
      //   });
      // },
      handleShowStatusChange(index, row) {
        let data = new URLSearchParams();
        let ids=[];
        ids.push(row.id)
        data.append('ids',ids);
        data.append('showStatus',row.showStatus);
        updateShowStatus(data).then(response=>{
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
        });
      },
      handleShowNextLevel(index, row) {
        console.log('handleShowNextLevel ->')
        this.$router.push({path: '/bms/bookCate', query: {parentId: row.id}})
      },
      handleShowLastLevel() {
        this.$router.push({path: '/bms/bookCate'})
      },
      handleTransferBook(index, row) {
        console.log('handleAddBookCate');
      },
      handleUpdate(index, row) {
        this.$router.push({path:'/bms/updateBookCate',query:{id:row.id}});
      },
      handleDelete(index, row) {
        this.$confirm('是否要删除该品牌', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteBookCate(row.id).then(response => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1000
            });
            this.getList();
          });
        });
      },
      disableNextLevel(value) {
        return value !== 0;
      }
    },
    filters: {
      levelFilter(value) {
        console.log('value ->', value)
        if (value === 0) {
          return '一级';
        } else if (value === 1) {
          return '二级';
        }
      }
    }
  }
</script>

<style scoped>

</style>
