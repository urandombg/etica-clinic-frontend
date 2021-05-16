<template>
<v-container fluid>
  <v-calendar day-format=""></v-calendar>
  <v-row>
    <v-col class="timeCell">
      {{ this.$moment() }}
    </v-col>
    <v-col class="cyan">

    </v-col>
    <v-col class="blue">

    </v-col>
    <v-col class="primary">

    </v-col>
    <v-col class="purple">

    </v-col>
  </v-row>
</v-container>
</template>

<script>
export default {
  props: {

  },
  name: "schedulex"
  }
</script>

<style scoped>
.timeCell {
  background-color: cyan;
}
</style>