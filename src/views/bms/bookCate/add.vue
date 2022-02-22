<template> 
  <book-cate-detail :is-edit='false'></book-cate-detail>
</template>
<script>
  import BookCateDetail from './components/BookCateDetail'
  export default {
    name: 'addBookCate',
    components: { BookCateDetail }
  }
</script>
<style>
</style>


