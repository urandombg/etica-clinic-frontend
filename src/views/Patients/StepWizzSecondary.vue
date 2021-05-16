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
     <v-row class="elevation-8">
       <v-col cols="6" class="elevation-8">
         <h2 style="padding: 10px" class="info display-1 white--text">
           Анамнеза от Първичен амбулаторен лист № {{ $props.firstAmbSheet.id}}
         </h2>
         <br>
         <p style="font-size: 20px">
           {{ $props.firstAmbSheet.anamnesa}}
         </p>
       </v-col>
       <v-col cols="6"
              class="elevation-12">
         <h2 style="padding: 10px" class="blue accent-3 display-1 white--text">
           Обективно състояние от Първичен амбулаторен лист № {{ $props.firstAmbSheet.id}}
         </h2>
         <br>
         <p style="font-size: 20px">
           {{ $props.firstAmbSheet.anamnesa}}
         </p>
       </v-col>
       <v-col cols="12">
         <v-date-picker v-model="examForm.date"></v-date-picker>
       </v-col>
       <v-col cols="6">
         <v-textarea outlined
                     background-color="light-blue lighten-4"
                     rounded
                     filled
                     height="320"
                     label="Анамнеза"
                     v-model="examForm.anamnesa">
           <template #append>
             <v-btn color="blue" class="white--text" rounded outlined>
               <v-icon>
                 mdi-menu
               </v-icon>
               <span>
                Шаблони
              </span>
             </v-btn>
           </template>
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
           <template #append>
             <v-btn color="blue" class="white--text" rounded outlined>
               <v-icon>
                 mdi-menu
               </v-icon>
               <span>
                Шаблони
              </span>
             </v-btn>
           </template>
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
  </v-container>
  <pre>
    {{ $props.firstAmbSheet }}
  </pre>
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
    createFinalVisit() {
      console.log(this.firstExam)
      // create second visit
      this.$http.post(`/api/ambulatory/${this.examForm.firstExamId}/createFinalExam`, this.examForm)
      .then(
          (data) => {
            console.log("success", data)
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