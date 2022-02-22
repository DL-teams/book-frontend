<template>
  <personal-detail :is-disabled="true"></personal-detail>
</template>

<script>
import PersonalDetail from './components/PersonalDetail'

export default {
  name: "personal",
  components: { PersonalDetail },
}
</script>

<style scoped>

</style>
