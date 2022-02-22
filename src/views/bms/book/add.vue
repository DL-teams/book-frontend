<template> 
  <book-detail :is-edit='false'></book-detail>
</template>
<script>
  import BookDetail from './components/BookDetail'
  export default {
    name: 'addBook',
    components: { BookDetail }
  }
</script>
<style>
</style>
