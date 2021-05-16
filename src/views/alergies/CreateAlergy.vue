<template>
<div>
    <v-text-field placeholder="Добави алергия, като напишеш наименованието в това поле"
                  v-model="title"
                  label="Наименование на алергията">

    </v-text-field>
    <v-btn color="warning"
           @click="createAllergyForPatient"
           block
           rounded
           shaped
           v-if="title.length > 0">
     <v-icon>
       mdi-plus
     </v-icon> Добави алергия
    </v-btn>
  <br>
  <v-progress-linear
      bottom
      rounded
      v-show="loading"
      :size="50"
      color="warning"
      indeterminate
  ></v-progress-linear>
    <div v-if="allergies.length <= 0">
      <v-alert outlined rounded color="warning" class="white--text">
        <v-icon large>
          mdi-information
        </v-icon>
        Няма налична информация за алергии.
      </v-alert>
    </div>
    <v-list outlined rounded elevation="4" v-if="allergies.length > 0">
      <v-list-item v-for="(item, key) in allergies" :key="key">
        <v-list-item-content>
          <v-list-item-title>
            <v-row>
              <v-col cols="6" md="6">
                {{ item.title | capitalize }}
              </v-col>
              <v-col cols="6" md="6" class="text-right">
                <v-btn  rounded small elevation="0" @click="deleteAllergy(item.id)" color="red" class="white--text">
                  <v-icon>
                    mdi-delete
                  </v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
</div>
</template>

<script>
import axios from "axios";
export default {
  name: "CreateAlergy",
  props: ['patient_id'],
  data() {
    return {
      id: this.$props.patient_id,
      title: '', // TODO
      allergies: [],
      loading: false,
    }
  },
  methods: {
    deleteAllergy(id) {
      axios.post(`/api/allergies/delete`, {
        id: id
      })
      .then(
          (data) => {
            this.loading = true
            if (data.data) {
              this.getAllergiesForPatient(this.id)
            }
          }
      )
    },
    getAllergiesForPatient(id) {
      axios.get(`/api/allergies/getAllergies/${id}`)
      .then(
          (data) => {
            this.loading = true
            this.allergies = data.data
            this.loading = false
          }
      )
      .catch(
          (error) => this.allergies = 'FUUUUUUUUX' + error
      )

    },
    createAllergyForPatient() {
      this.loading = true

      axios.post(`/api/allergies/create`, {
        title: this.title,
        patient_id: this.id
      })
      .then(
          (data) => {
            this.allergies.push(data.data)
            this.title = ''
            this.loading = false
          }
      )
      .catch(
          (er) => console.log(er)
      )
    }
  },
  mounted() {
    if (this.$props.patient_id === undefined || this.$props.patient_id === '') {
      console.log("Няма ID на пациента!")
    } 

    this.getAllergiesForPatient(this.$props.patient_id)
  },
  filters: {
    capitalize: function (value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  }
}
</script>

<style scoped>

</style>