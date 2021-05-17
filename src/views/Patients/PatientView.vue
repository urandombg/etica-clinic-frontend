<template>
<div>
  <v-container fluid>
    <v-sheet
        v-if="loading"
        :color="`grey ${theme.isDark ? 'darken-2' : 'lighten-4'}`"
        class="pa-1"
    >
      <v-skeleton-loader
          class="mx-auto"
          type="card"
      ></v-skeleton-loader>
    </v-sheet>
    <v-card elevation="10" color="cyan accent-4" v-else>
       <v-card-title>
         <h1 class="white--text">
        <span>
          {{ patient.fullName}}
        </span>
         </h1>
       </v-card-title>
       <div class="elevation-3 white text-md-start" style="padding: 14px">
         <strong>
           Възраст:
         </strong>
         <span>
          {{ $moment().year() - $moment(patient.birthday).year() }} години.
        </span>
         |
         <v-tooltip top>
           ИНДЕКС НА ТЕЛЕСНИ МАЗНИНИ (Body Mass Index) BMI
           <template #activator="{on, attrs}">
                   <span
                       v-bind="attrs"
                       v-on="on"
                   >
                     ИТМ: {{ (90 / Math.pow(200, 2)) * 10000 }}
                   </span>
           </template>
         </v-tooltip>
       </div>
       <v-card-text>
         <v-tabs v-model="tab"
                 show-arrows
                 grow background-color="transparent"
                 center-active>
           <v-tab active-class="white">
             <v-icon color="primary" dense size="40">mdi-doctor</v-icon>
             <span>
            ПРЕГЛЕДИ
              <v-badge offset-x="10" offset-y="-6" :content="patient !== undefined ? patient['medicalRecords'].count : 0" color="cyan" bordered>
             </v-badge>
          </span>
           </v-tab>
           <v-tab active-class="white">
             <v-icon>
               mdi-bug
             </v-icon>
             Заболявания
             <v-badge offset-x="8" offset-y="-2" :content="(patient.allergies.length + (patient.disease ? patient.disease.length : 0)) + 'бр.'" color="red" bordered>
             </v-badge>
           </v-tab>
           <v-tab active-class="white">
             <v-icon>
               mdi-camera
             </v-icon>
             <v-icon>
               mdi-file
             </v-icon>
              Файлове / медия
             <v-badge offset-x="8" offset-y="-2" :content="patient !== undefined ? patient['medicalRecords'].count : 0" color="cyan" bordered>
             </v-badge>
           </v-tab>
           <v-tab active-class="white">
             <v-icon>
               mdi-bug
             </v-icon>
             Бележки
           </v-tab>
           <v-tab active-class="white">
             <v-icon>
               mdi-clock
             </v-icon>
             Напомняния
           </v-tab>
           <v-tab>
             <v-icon>
               mdi-eur
             </v-icon>
             Текущи сметки
           </v-tab>

           <v-tab-item>
             <step-wizz v-show="stepWizShow"
                        class="elevation-20"
                        :patient="patient"
                        :key="stepWizzKey">
             </step-wizz>
             <step-wizz-secondary :patient="patient"
                                  v-if="stepWizShowSecondary"
                                  :first-amb-sheet="firstAmbSheet">
             </step-wizz-secondary>

             <v-card elevation="2" v-show="!stepWizShow">

               <v-card-title class="display-1">
                <v-row>
                  <v-col cols="6" lg="6">
                    <v-icon large>
                      mdi-clock-time-eight
                    </v-icon>
                   Текущи
                  </v-col>
                  <v-col class="text-right" cols="2" lg="6">
                    <v-btn
                          color="green white--text"
                           @click="callStepWizz()">
                      <v-icon color="" x-large>
                        mdi-file-plus
                      </v-icon>
                      Първичен преглед
                    </v-btn>
                  </v-col>
                </v-row>

               </v-card-title>
             </v-card>
             <v-alert border="left"
                       colored-border
                       type="info"
                       color="blue accent-4"
                       v-if="currentlyOpenedSheets.length <= 0"
                       elevation="2">
               <v-row>
                 <v-col cols="12" class="text-left">
                   Няма налични данни за текущи прегледи.
                 </v-col>
               </v-row>
               <div class="text-left">
                 <div class="text-right">
                 </div>
               </div>
             </v-alert>
             <v-card-text>
                <open-sheets v-show="(!stepWizShow)"
                             :patient-id="this.$route.params.id"
                             :patient="patient"
                             :key="openedSheetsKey">
                </open-sheets>
             </v-card-text>
             <v-card elevation="9" color="cyan lighten-2">
               <v-card-title class="align-center white--text display-1">
                 <v-icon large color="dark">
                   mdi-history
                 </v-icon>
                 <span>
                   Предишни
                 </span>
               </v-card-title>
             </v-card>
             <v-card-text>
               <closed-sheets :patient-id="$route.params.id"
                              :key="openedSheetsKey"
                              v-if="!stepWizShow">

               </closed-sheets>
             </v-card-text>
           </v-tab-item>
           <v-tab-item>
              <v-card>
                <v-card-title class="text-center">
                  <h1 class="display-1 text-center">
                    ЗАБОЛЯВАНИЯ & АЛЕРГИИ
                  </h1>
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col>
                      <span class="display-2 display-block">
                        Алергий:
                      </span>
                      <CreateAlergy :patient_id="patient.id"></CreateAlergy>
                    </v-col>
                    <v-col>
                  <span class="display-2 display-block">
                    Заболявания
                  </span>
                      <DiseaseComponent :patient_id="patient.id"></DiseaseComponent>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
           </v-tab-item>
           <v-tab-item>
             <h2 class="cyan accent-3 white--text display-2 elevation-1" style="padding: 40px">
               В процес на разработка.
             </h2>
           </v-tab-item>
           <v-tab-item>

             <h2 class="cyan accent-3 white--text display-2 elevation-1" style="padding: 40px">
               В процес на разработка.
             </h2>
           </v-tab-item>
           <v-tab-item>
             <h2 class="cyan accent-3 white--text display-2 elevation-1" style="padding: 40px">
               В процес на разработка.
             </h2>
           </v-tab-item>
           <v-tab-item>
           </v-tab-item>
         </v-tabs>
       </v-card-text>
     </v-card>
  </v-container>

</div>
</template>

<script>
// import axios from "axios";
import CreateAlergy from "@/views/alergies/CreateAlergy";
import DiseaseComponent from "@/views/Diseases/DiseaseComponent";
import StepWizz from "@/views/Patients/StepWizz";
import OpenSheets from "@/views/Patients/Partials/OpenSheets";
import ClosedSheets from "@/views/Patients/Partials/ClosedSheets";
import StepWizzSecondary from "@/views/Patients/StepWizzSecondary";
// const url = process.env.VUE_APP_REMOTE_SERVER_HOST_IP

export default {
name: "PatientView",
  components: {StepWizzSecondary, ClosedSheets, OpenSheets, StepWizz, DiseaseComponent, CreateAlergy},
  data() {
    return {
      dialog: false,
      patient: {},
      tab: '#tab-allergies',
      loading: true,
      theme: 'af',
      stepWizShow: false,
      stepWizShowSecondary: false,
      firstAmbSheet: null,
      closedMedicalSheets: [],
      currentlyOpenedSheets: [],
      sheetsLoading: true,
      openedSheetsKey: 0,
      stepWizzKey: 0,
    }
  },
  methods: {
    deleteAmbulatoryList(id) {
      console.log(id)
      this.$swal.fire({
        icon: "warning",
        html: `<strong class="red--text">ВНИМАНИЕ!</strong>Избрахте да изтрийте напълно амбулаторен лист. Това действие е необратимо! Сигурни ли сте, че искате да го изтрийте?`,
        showDenyButton: true,
        confirmButtonText: 'Потвърждавам, изтрий листа!',
        denyButtonText: 'Отказ'
      }).then(
          (a) => {
            if (a.isConfirmed) {
              this.$http.delete(`/api/ambulatory/${id}/delete`)
              .then(
                  () => {
                    this.openedSheetsKey += 1;
                  }
              )
              .catch(
                  (err) => {
                    this.$swal.fire({
                      text: `error ${err}`,
                      icon: "error",
                    })
                  }
              )
            } else {
              this.$swal.fire({
                icon: "info",
                text: "Действието беше отказано!"
              })
            }
          }
      )
      .catch((ne) => {
        console.log(ne)
      })
      // this.$http.delete(`/api/ambulatory/${id}/delete`)
      // .then(
      //     (data) => {
      //       console.log(data.data)
      //     }
      // )
      // .catch(
      //     (err) => {
      //       this.$swal.fire({
      //         text: `error ${err}`,
      //         icon: "error",
      //       })
      //     }
      // )
    },
    callStepWizz() {
      this.stepWizShow = !this.stepWizShow
    },
    async openSheets(id) {
      let opened = this.$http.request(`/api/patients/${id}/openedSheets`);
       await opened.then(
          (data) => {
            this.sheetsLoading = true
            this.currentlyOpenedSheets = data.data
          }
      )
           .finally( () => {
                 this.sheetsLoading = false
               }
           )
    },
    async closedSheets(id) {
      let opened = this.$http.request(`/api/patients/${id}/closedSheets`);
       await opened.then(
          (data) => {
            this.sheetsLoading = true
            this.closedMedicalSheets = data.data
          }
      )
      .finally( () => {
            this.sheetsLoading = false
        }
      )
    }
  },
  mounted() {
    setTimeout(() => {
      this.closedSheets(this.$route.params.id);
      this.openSheets(this.$route.params.id)
    }, 500)

    let self = this;
    this.$root.$on('stepWizzCloseForm', function () {
      self.stepWizShow = false
      self.stepWizzKey += 1
    });
    this.$root.$on('createFinalExam', function (dt) {
        self.stepWizShowSecondary = true
        self.firstAmbSheet = dt
    });
    this.$root.$on('closeSecondaryStepWizz', function () {
      self.stepWizShowSecondary = false
      self.stepWizzKey += 1

    });
  },
  beforeCreate() {
    if (this.$route.params.id) {
      this.$http.get(`/api/patients/${this.$route.params.id}`)
          .then(
              (data) => {
                this.patient = data.data
                this.$route.meta.name = `${this.patient.fullName}`
                setTimeout(() => {
                  this.loading = false
                },50)
              }
          )
          .catch(er => console.log(er))
    }
    else {
      this.$router.push('/patients')
    }
  },
  watch: {
    // stepWizzKey
    stepWizzKey: function () {
      setTimeout(() => {
        this.openedSheetsKey+=2;
      },500)
      // console.log('цьжьцжьцж', val)
    }
  }
}
</script>

<style scoped>

</style>
