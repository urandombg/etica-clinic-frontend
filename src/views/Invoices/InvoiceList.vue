<template>
<div>
  <b-card>
    <b-card-body>
      <h1>
        Invoices
      </h1>
      <b-table :items="invoices"></b-table>
      <b-form-group>
        <b-input>ok</b-input>
      </b-form-group>
    </b-card-body>
  </b-card>
</div>
</template>

<script>
import axios from 'axios';
export default {
name: "InvoiceList",
  data() {
    return  {
      invoices: [],
    }
  },
  mounted() {
    axios.get(
        `/api/invoices`
    )
    .then(
        (data) => {
          this.invoices = data.data
        }
    )
  }
}
</script>

<style scoped>

</style>