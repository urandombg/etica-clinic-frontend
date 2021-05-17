<template>
<div style="padding: 0; margin: 0">
  <v-container fluid>
    <h2 class="display-1" style="color: #000000">
      Създаване на
      <span>
        <strong>Вторичен амбулаторен лист</strong>
      </span>
      <span>
        към <strong>първичен амбулаторен лист №
        {{ $props.firstAmbSheet.id }}
        / {{ this.$moment($props.firstAmbSheet.date).format("DD.MM.Y") }}</strong>
      </span>
    </h2>
    <br>
    <v-form>
      <v-row>
        <v-col cols="12">
        <span style="font-size: 20px">
          Изберете дата на вторични амбулаторен лист:
        </span>
          <v-date-picker v-model="examForm.date"
                         full-width
                         show-week
                         show-current>

          </v-date-picker>
        </v-col>
      </v-row>
     <v-row class="elevation-8">
       <v-col cols="6" class="elevation-8">
         <h2 style="padding: 10px" class="info display-1 white--text">
           Анамнеза от първично посещение
         </h2>
         <br>
         <p style="font-size: 20px">
           {{ $props.firstAmbSheet.anamnesa}}
         </p>
       </v-col>
       <v-col cols="6"
              class="elevation-12">
         <h2 style="padding: 10px" class="blue accent-3 display-1 white--text">
           Обективно състояние от първично посещение
         </h2>
         <br>
         <p style="font-size: 20px">
           {{ $props.firstAmbSheet.anamnesa}}
         </p>
       </v-col>
       <v-col cols="12">
         <v-btn block
                @click="copyDataFromFirstAmbSheet($props)"
                color="green"
                class="white--text">
           Копирай данните от първичния амбулаторен лист
         </v-btn>
       </v-col>
       <v-col cols="6">
         <v-textarea outlined
                     background-color="light-blue lighten-4"
                     rounded
                     filled
                     height="320"
                     label="Анамнеза"
                     v-model="examForm.anamnesa">
         </v-textarea>
       </v-col>
       <v-col cols="6">
         <v-textarea outlined
                     rounded
                     filled
                     flat
                     label="Обективно състояние"
                     v-model="examForm.obj_condition"
                     height="320"
         >
         </v-textarea>
       </v-col>
     </v-row>
    </v-form>
    <v-row>
      <v-col>
        <v-btn block color="info" @click="createFinalVisit">
          Запази вторичния преглед
        </v-btn>
      </v-col>
    </v-row>
    {{ examForm }}
  </v-container>
</div>
</template>

<script>
// import Invoice from "@/views/Invoices/Invoice";

// const url = process.env.VUE_APP_REMOTE_SERVER_HOST_IP;
export default {
  name: "StepWizzSecondary",
  props: ['patient', 'doctor', 'firstAmbSheet'],
  data() {
    return {
      firstExam: null,
      examForm: {
        anamnesa: null,
        date: null,
        obj_condition: null,
        firstExamId: null
      }
    }
  },
  mounted() {
    setTimeout(() => {
      this.firstExam = this.$props.firstAmbSheet
      this.examForm.firstExamId = this.$props.firstAmbSheet.id
    }, 500)

  },
  methods: {
    copyDataFromFirstAmbSheet(data) {
      console.log(data)
      // this.examForm.anamnesa = data
      this.examForm.anamnesa = data.firstAmbSheet.anamnesa
      this.examForm.obj_condition = data.firstAmbSheet.obj_condition
    },
    createFinalVisit() {
      console.log(this.firstExam)
      // create second visit
      this.$http.post(`/api/ambulatory/${this.examForm.firstExamId}/createFinalExam`, this.examForm)
      .then(
          (data) => {
            console.log("success", data)
            this.$root.$emit('closeSecondaryStepWizz', true)
          }
      )
      .catch(
          (error) => {
            console.error(error)
          }
      )
    }
  },
  computed: {

  },

}
</script>

<style scoped>
.diagnosisList {
  font-size: 19px; border-bottom: 1px solid #0d47a1; border-top: 1px solid #0d47a1
}
</style>