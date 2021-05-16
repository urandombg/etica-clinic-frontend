<template>
  <div>#: kendo.toString(start, "H:mm")  #  -  #: kendo.toString(end, "H:mm") #' +
    '<span> | #: title #</span>
    <span> - </span>
  </div>
</template>

<script>
import kendo from '@progress/kendo-ui'
export default {
  name: "EventTemplate"
}
</script>

<style scoped>

</style>