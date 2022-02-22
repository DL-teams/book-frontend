<template> 
  <book-detail :is-edit='true'></book-detail>
</template>
<script>
  import BookDetail from './components/BookDetail'
  export default {
    name: 'updateBook',
    components: { BookDetail }
  }
</script>
<style>
</style>
