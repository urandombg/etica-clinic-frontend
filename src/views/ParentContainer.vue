<template>
<div><br>
  <router-view></router-view>
</div>
</template>

<script>
export default {
name: "ParentContainer",
  beforeCreate() {
  },
  mounted() {
    if (!localStorage.getItem('apiKey')) {
      this.$router.push(`/login`);
    }
  },
  methods: {

  },
  computed: {
    breadCrumbs () {
    let pathArray = this.$route.path.split('/')
    pathArray.shift()
    const breadCrumbs = []
    // needed to handle the intermediary entries for nested vue routes
    let breadcrumb = ''
    let lastIndexFound = 0
    for (let i = 0; i < pathArray.length; ++i) {
      breadcrumb = `${breadcrumb}${'/'}${pathArray[i]}`
      if (this.$route.matched[i] &&
          Object.hasOwnProperty.call(this.$route.matched[i], 'meta') &&
          Object.hasOwnProperty.call(this.$route.matched[i].meta, 'breadCrumb')) {
        breadCrumbs.push({
          href: i !== 0 && pathArray[i - (i - lastIndexFound)]
              ? '/' + pathArray[i - (i - lastIndexFound)] + breadcrumb + 'tutu'
              : breadcrumb,
          disabled: i + 1 === pathArray.length,
          text: this.$route.matched[i].meta.breadCrumb || pathArray[i]
        })
        lastIndexFound = i
        breadcrumb = ''
      }
    }
    return breadCrumbs
  }
  }
}
</script>
<style>
@import "~@progress/kendo-theme-bootstrap/dist/bootstrap-3.css";
</style>
<style scoped>

</style>