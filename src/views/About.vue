<template>
  <div class="about">
    <v-subheader>
      <h1>Пациенти</h1>
    </v-subheader>
    <v-row>
      <v-col cols="3">
        <v-text-field label="Търси"></v-text-field>
      </v-col>
    </v-row>
    <v-data-table :items="items" :headers="headers">
    </v-data-table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'abpiut',

  data() {
    return {
      items: [],
      headers: [
        {
          text: 'Име',
          align: 'start',
          sortable: false,
          value: 'firstname',
        },
        {
          text: 'Презиме',
          sortable: false,
          value: 'middlename',
        },
        {
          text: 'Фамилия',
          sortable: true,
          searchable: true,
          value: 'lastname',
        },
      ],
    }
  },
  mounted() {
    axios.get(`http://192.168.10.10/api/patients`)
        .then(
            (data) => {
              this.items = data.data
            }
        )
  }
}
</script>