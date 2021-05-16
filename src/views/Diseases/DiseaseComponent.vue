<template>
<div>
  <v-text-field placeholder="Добави заболяване, като напишеш наименованието в това поле"
                v-model="title"
                label="Наименование на заболяването">

  </v-text-field>
  <v-btn color="warning"
         @click="createDiseaseForPatient"
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
  <div v-if="diseases.length <= 0">
    <v-alert rounded outlined color="warning" class="white--text">
      <v-icon large>
        mdi-information
      </v-icon>
      Няма налична информация за алергии.
    </v-alert>
  </div>
  <v-list outlined rounded elevation="4" v-if="diseases.length > 0">
    <v-list-item v-for="(item, key) in diseases" :key="key">
      <v-list-item-content>
        <v-list-item-title>
          <v-row>
            <v-col cols="6" md="6">
              {{ item.name | capitalize}}
            </v-col>
            <v-col cols="6" md="6" class="text-right">
              <v-btn  rounded small elevation="0" @click="deleteDisease(item.id)" color="red" class="white--text">
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
import axios from 'axios';

export default {
  name: "DiseaseComponent",
  props: ['patient_id'],
  data () {
    return {
      id: this.$props.patient_id,
      title: '',
      loading: false,
      diseases: []
    }
  },
  mounted() {
    if (this.$props.patient_id === undefined || this.$props.patient_id === '') {
      console.log("Няма ID на пациента!")
    }

    this.getDiseasesForPatient(this.$props.patient_id)
  },
  methods: {
    getDiseasesForPatient(id) {
      axios.get(`/api/diseases/getDiseases/${id}`)
          .then(
              (data) => {
                this.loading = true
                this.diseases = data.data
                this.loading = false
              }
          )
          .catch(
              (error) => this.diseases = 'FUUUUUUUUX' + error
          )

    },
    createDiseaseForPatient() {
      this.loading = true

      axios.post(`/api/diseases/create`, {
        title: this.title,
        patient_id: this.id
      })
          .then(
              (data) => {
                this.diseases.push(data.data)
                this.title = ''
                this.loading = false
              }
          )
          .catch(
              (er) => console.log(er)
          )
    },
    deleteDisease(itemId){
      this.loading = true

      axios.post(`/api/diseases/delete`, {
        id: itemId
      })
          .then(
              (data) => {
                console.log(data.data)
                this.title = ''
                this.loading = false
                this.getDiseasesForPatient(this.id)
              }
          )
          .catch(
              (er) => console.log(er)
          )
    }
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