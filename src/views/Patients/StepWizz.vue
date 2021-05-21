<template>
<div style="padding: 0; margin: 0">
  <v-row>
    <v-col
        cols="12"
        lg="6"
    >

    </v-col>

    <v-col cols="8">
      <h1 class="display-2 black--text" style=" padding: 25px">Създаване на нов първичен преглед</h1>
    </v-col>
    <v-col class="text-right">
      <v-btn color="red"
             x-large
             @click="closeStepWizzForm"
             class="white--text">
        Откажи
        <v-icon>
          mdi-close
        </v-icon>
      </v-btn>
    </v-col>
  </v-row>
  <v-stepper v-model="e1" class="grey lighten-5 blue--text">
    <v-stepper-header>
      <v-stepper-step
          :complete="e1 > 1"
          step="1"
      >
        Преглед
      </v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step
          :complete="e1 > 2"
          step="2"
      >
        Назначаване на процедури
      </v-stepper-step>

<!--      <v-divider></v-divider>-->
<!--      <v-stepper-step :complete="e1 > 3" :color=" e1 < 3 ? 'blue' : 'green'" step="3">-->
<!--        Карта на пациента-->
<!--      </v-stepper-step>-->
<!--      <v-divider></v-divider>-->
<!--      <v-stepper-step step="4">-->
<!--        Записване на часове-->
<!--      </v-stepper-step>-->
      <v-divider></v-divider>
      <v-stepper-step step="3">
        Печат на амбулаторен лист
      </v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">
        <v-overlay dark
                   absolute
                   v-if="isLoading" >
          <v-progress-circular color="white"
                               indeterminate
                               :size="250"
                               rotate="right">
            <h1>
              Моля, изчакайте!
            </h1>
          </v-progress-circular>
        </v-overlay>
        <v-card
            class="mb-12 elevation-7"
            min-height="350"
        >
          <v-card-text>
            <v-row>
              <v-col cols="6">
                <label style="font-size: 19px">Дата на първичния преглед:</label>
                <v-menu
                    v-model="menu2"
                    :close-on-content-click="false"
                    max-width="290"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        :value="computedDateFormattedMomentjs"
                        clearable
                        filled
                        label="Дата на амбулаторния лист"
                        readonly
                        v-bind="attrs"
                        v-on="on"

                        @click:clear="date = null"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                      v-model="examForm.date"
                      show-week
                      :locale="'bg'"
                      @input="menu2 = false"
                      @change="menu2 = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="6">
                <label style="font-size: 19px">Вид на прегледа: </label>
                <v-select v-model="examForm.visitType"
                          id="typeOfVisit"
                          label="Вид на прегледа"
                          :items="visitTypes"
                          item-text="text"
                          filled
                          item-value="value">

                </v-select>

              </v-col>
              <v-col cols="12"
                     class="indigo lighten-4 text--white elevation-4">
              <MkbMain @addDiagnose="addDiagnose"></MkbMain>
              </v-col>

              <v-col cols="12">
                <div v-if="examForm.diagnosys.length > 0">
                  <v-row>
                    <v-col cols="12"
                           class="indigo lighten-5 display-1"
                           style="border-bottom:
                           3px solid #28aa3b">
                      Диагнози:
                    </v-col>
                  </v-row>
                 <v-row>
                   <v-col cols="12">
                     <v-list style="padding: 20px">
                       <v-list-item class="elevation-1 diagnosisList" v-for="(diag, index) in examForm.diagnosys" :key="index">
                         <v-col cols="10" :key="updateKey" :class="diag.leading_mkb ? 'orange' : ''">
                           {{index += 1}}. <strong>{{diag.code}} </strong> {{ diag.name }}
                           <small>{{ diag.name_latin }}</small>
                         </v-col>
                         <v-col>
                           <v-btn v-show="diag.leading_mkb !== true" block color="yellow accent-4" @click="markAsMainDiagnose(diag)">
                             <v-icon>
                               mdi-crown
                             </v-icon>
                             Това е водещата диагноза!
                           </v-btn>
                           <v-btn v-show="diag.leading_mkb === true" block color="yellow accent-1" @click="unmarkAsMainDiagnose(diag)">
                             Не е водеща диагноза
                           </v-btn>
                           <v-btn block class="white--text" @click="removeElementFromDiagnosysArray(diag)" color="red">
                            <v-icon>
                              mdi-minus
                            </v-icon>
                             Изтрий
                           </v-btn>
                         </v-col>
                       </v-list-item>
                     </v-list>
                   </v-col>
                 </v-row>
                </div>
              </v-col>
              <v-col cols="12">
                <v-btn color="blue"
                       class="white--text"
                       rounded
                       block
                       outlined
                       @click="anamnesisTemplates">
                  <v-icon>
                    mdi-clipboard-outline
                  </v-icon>
                  <span>
                        Шаблони
                    </span>
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-textarea outlined
                            background-color="light-blue lighten-4"
                            rounded
                            filled
                            @selectAndChooseTemplate="alert('fire')"
                            height="320"
                            label="Анамнеза"
                            v-model="examForm.anamnesa">
                </v-textarea>
              </v-col>
              <v-col cols="6">
<!--                <v-col cols="12" class="text-left">-->
<!--                  <v-btn color="grey lighten-2" rounded @click="anamnesisTemplates">-->
<!--                    <v-icon>-->
<!--                      mdi-clipboard-outline-->
<!--                    </v-icon>-->
<!--                    <span>-->
<!--                          Шаблони-->
<!--                    </span>-->
<!--                  </v-btn>-->
<!--                </v-col>-->
                <v-textarea outlined
                            rounded
                            filled
                            flat
                            label="Обективно състояние"
                            v-model="examForm.objectCondition"
                            height="320"
                >
                </v-textarea>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-row>
          <v-col>
            <v-btn block
                   @click="closeStepWizzForm"
                   outlined
                   color="red"
                   class="white--text">
              <v-icon>
                mdi-close
              </v-icon>
              Откажи
            </v-btn>
          </v-col>
          <v-col>
            <v-btn
                color="primary"
                block
                @click="createExam"
            >
              Напред
              <v-icon>
                mdi-arrow-right
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-stepper-content>
<!--      // назначаване на процедури-->
      <v-stepper-content step="2">
        <v-overlay dark absolute v-if="isLoading" >
          <v-progress-circular color="white" indeterminate :size="250" rotate="right">
            <h1>
              Моля, изчакайте!
            </h1>
          </v-progress-circular>
        </v-overlay>
        <v-card
            class="mb-12"
        >
          <v-card-text>
            <invoice-table-items ref="items" :invoice-items="$store.state.patientExam.procedures" :render-columns="[]"></invoice-table-items>
          </v-card-text>
        </v-card>
        <v-row>
          <v-col>
            <v-btn @click="e1 = 1" block color="orange">
              <v-icon>
                mdi-arrow-left
              </v-icon>
              Назад
            </v-btn>
          </v-col>
          <v-col>
            <v-btn
                color="primary" block
                @click="saveItemsIntoStore"
            >
              Напред
              <v-icon>
                mdi-arrow-right
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-stepper-content>
<!--      Oтбелязване на места-->
<!--      <v-stepper-content step="3">-->
<!--        <v-card-->
<!--            class="mb-12"-->
<!--            color="grey lighten-1"-->
<!--            height="200px"-->
<!--        ></v-card>-->
<!--        <v-row>-->
<!--          <v-col>-->
<!--            <v-btn color="orange" class="white&#45;&#45;text" block @click="e1 = 2">-->
<!--              <v-icon>-->
<!--                mdi-arrow-left-->
<!--              </v-icon>-->
<!--              Върни се при "Назначаване на процедури"-->
<!--            </v-btn>-->
<!--          </v-col>-->
<!--          <v-col>-->
<!--            <v-btn-->
<!--                color="primary"-->
<!--                block-->
<!--                class="white&#45;&#45;text"-->
<!--                @click="e1 = 4"-->
<!--            >-->
<!--              Продължи към записване на часове-->
<!--              <v-icon>-->
<!--                mdi-arrow-right-->
<!--              </v-icon>-->
<!--            </v-btn>-->
<!--          </v-col>-->
<!--        </v-row>-->
<!--      </v-stepper-content>-->
<!--&lt;!&ndash;      Записване на часове &ndash;&gt;-->
<!--      <v-stepper-content step="4">-->
<!--        <v-card-->
<!--            class="mb-12"-->
<!--            color="grey lighten-1"-->
<!--            height="200px"-->
<!--        >-->
<!--        </v-card>-->
<!--        <v-row>-->
<!--          <v-col>-->
<!--            <v-btn @click="e1 = 3"-->
<!--                   block-->
<!--                   x-large-->
<!--                   outlined-->
<!--                   color="orange">-->
<!--              <v-icon>-->
<!--                mdi-arrow-left-->
<!--              </v-icon>-->
<!--              Върни се на-->
<!--              <strong>-->
<!--                "Карта на пациента"-->
<!--               </strong>-->
<!--            </v-btn>-->
<!--          </v-col>-->
<!--          <v-col>-->
<!--            <v-btn-->
<!--                block-->
<!--                class="white&#45;&#45;text"-->
<!--                color="green"-->
<!--                x-large-->
<!--                shaped-->
<!--                rounded-->
<!--                @click="createRecord"-->
<!--            >-->
<!--              Завърши прегледа!-->
<!--              <v-icon large>-->
<!--                mdi-content-save-->
<!--              </v-icon>-->
<!--            </v-btn>-->
<!--          </v-col>-->
<!--        </v-row>-->
<!--      </v-stepper-content>-->
      <v-stepper-content step="3">
        <v-card
            class="mb-12"
            color="grey lighten-1"
            min-height="200px"
        >
          <v-btn @click="createRecord" block color="green white--text" style="height: 200px">
            <v-icon>
              mdi-content-save
            </v-icon>
            Приключи прегледа

          </v-btn>
        </v-card>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
<!--<pre>-->
<!--      {{ examForm }}-->
<!--</pre>-->

<v-dialog v-model="showAnamnesisTemplateModal"
          eager
          origin="top top"
          max-width="80%"
          light
          transition="dialog-top-transition"
          >

    <anamnesis-template></anamnesis-template>
<!--    {{ this.examForm }}-->
</v-dialog>


  <v-overlay color="blue-grey" opacity="0.44" dark v-if="creating">
    <h1 class="display-4">
      Записване на преглед. Моля, изчакайте!
    </h1>
    <v-progress-circular
        class="text-center"
        indeterminate
        color="primary"
    ></v-progress-circular>
  </v-overlay>
</div>
</template>

<script>
// import Invoice from "@/views/Invoices/Invoice";
import InvoiceTableItems from "@/views/Invoices/InvoiceTableItems";
import MkbMain from "@/views/Mkb/MkbMain";
import FileSaver from 'file-saver';
import AnamnesisTemplate from "@/views/Patients/Partials/AnamnesisTemplate";

const url = process.env.VUE_APP_REMOTE_SERVER_HOST_IP;
export default {
  name: "StepWizz",
  props: ['patient', 'doctor'],
  components: {AnamnesisTemplate, MkbMain, InvoiceTableItems},
  data() {
    return {
      pdfFile: null,
      e1: 1,
      select: null,
      entries: [],
      mkb: '',
      items: [],
      visitTypes: [
        {
          text: 'Амбулаторен първичен',
          selected: true,
          value: 1,
        },
        // {
        //   text: 'Амбулаторен вторичен',
        //   value: 2,
        // },
      ],
      isLoading: false,
      model: null,
      search: null,
      creating: false,
      menu2: false,
      examForm: {
        date: this.$moment().toISOString().substr(0,10),
        anamnesa: '',
        objectCondition: '',
        visitType: '',
        mainDiagnose: null,
        diagnosys: [],
        patient: {}
      },
      updateKey: 0,
      showAnamnesisTemplateModal: false,
      showObjConditionTemplateModal: false
    }
  },
  mounted() {
    if (this.$props.patient) {
       this.examForm.patient = {
         id: this.$props.patient.id,
         fullName: this.$props.patient.fullName,
         firstname: this.$props.patient.firstname,
         middlename: this.$props.patient.middlename,
         lastname: this.$props.patient.lastname,
         egn: this.$props.patient.egn,
         city: this.$props.patient.city,
         address: this.$props.patient.address,
         streetNumber: this.$props.patient.st,
         phone: this.$props.patient.phone,
       }
    }
    let self = this
    this.$root.$on('selectAndChooseTemplate', function (template) {
      self.examForm.anamnesa = template.anamnesis
      self.examForm.objectCondition = template.obj_condition
    });
    // console.log(this.$http.)
  },
  methods: {
    anamnesisTemplates() {
        this.showAnamnesisTemplateModal = !this.showAnamnesisTemplateModal
      // if (!this.examForm.leading_mkb) {
      //   this.showAnamnesisTemplateModal = false
      //   this.$swal.fire({
      //     icon: 'info',
      //     text: `Моля, маркирайте водеща диагноза, за да имате възможността да достъпите шаблоните!`,
      //     confirmButtonText: 'Добре!',
      //     confirmButtonColor: 'green',
      //     focusConfirm: true
      //   })
      // }
      // else {
      //   this.showAnamnesisTemplateModal = true
      // }
    },
    getPdf() {
      fetch(`${url}/storage/ab.pdf`, {
        method: 'GET',
        responseType: 'arraybuffer'
      })
          .then(response => response.blob())
      .then(blob => {
        FileSaver.saveAs(blob, 'df.pdf')
      })
      // this.$http.get(`/storage/ab.pdf`, {
      //   responseType: 'arraybuffer',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Accept': 'application/pdf'
      //   },
      //   cors: 'no-cors'
      // })
      // .then(
      //     () => {
      //       console.log('ddb', this.$http.defaults.baseURL)
      //       // console.log(data)
      //     }
      // )
      // .catch(() => console.log(this.$http.defaults.headers.common))
    },
    removeElementFromDiagnosysArray(element) {
      this.examForm.diagnosys.splice(this.examForm.diagnosys.indexOf(element), 1)
    },
    markAsMainDiagnose(diagnose) {
      let index = this.examForm.diagnosys.indexOf(diagnose)
      if (index !== -1) {
        this.examForm.diagnosys[index]['leading_mkb'] = true
        this.examForm['leading_mkb'] = diagnose
      }

      this.updateKey +=1;
    },
    unmarkAsMainDiagnose(diagnose) {
      let index = this.examForm.diagnosys.indexOf(diagnose)
      if (index !== -1) {
        this.examForm.diagnosys[index].leading_mkb = false
      }

      this.updateKey +=1;
    },
    querySelections (v) {
      this.loading = true
      this.$http.get(`https://mediately.co/api/v4/icd/bg/?query=${v}`)
          .then(
              (data) => {
                this.items = data.data
              }
          )
        this.loading = false
    },

    itemText(vax) {
      console.log(vax)
      return `${vax.code} - ${vax.name}`
    },
    addDiagnose(diagnose) {
        this.examForm.diagnosys.push(diagnose);
    },
    createRecord() {
      setTimeout(() => {
        this.$http.post(`/api/ambulatory`, this.examForm)
            .then(
                () => {
                  this.closeStepWizzForm();
                }
            )
            .catch(
                (err) => {
                  console.error(err)
                  this.isLoading = false
                  this.creating = false
                }
            )
            .finally(
                () => {
                  this.isLoading = false
                  this.creating = false
                  this.$store.state.patientExam = {}
                  // this.$destroy()
                }
            );
      },500)
      // console.log()

      this.$store.commit('resetPatientExamForm');
      // this.e1 = 0
      this.e1 = 5

    },
    createExam() {
      this.isLoading = true
      setTimeout(() => {
        this.$store.commit('setAnamnesa', this.examForm.anamnesa);
        this.$store.commit('setExamDate', this.examForm.date);
        this.$store.commit('setDiagnosys', this.examForm.diagnosys);
        this.$store.commit('setObjectCondition', this.examForm.objectCondition);
        this.$store.commit('setPatientDetails', this.$props.patient)
        this.$store.commit('setPatientVisitType', this.examForm.visitType)

        this.e1 = 2
        this.isLoading = false
      }, 520)

    },
    searchItem(query) {
      console.log(query)
      // https://mediately.co/api/v4/icd/bg/?query=10
    },
    saveItemsIntoStore() {
      this.isLoading = true
      setTimeout(() => {
        this.$store.commit('setPatientProcedures',this.$refs.items.itemsToInvoice)
        this.examForm['procedures'] = this.$store.state.invoice.items
        this.isLoading = false
        this.e1 = 3;
      }, 500)

    },
    closeStepWizzForm() {
      this.$root.$emit('stepWizzCloseForm', true)
    }
  },
  computed: {
    fields () {
      if (!this.model) return []

      return Object.keys(this.model).map(key => {
        return {
          key,
          value: this.model[key] || 'n/a',
        }
      })
    },
    computedDateFormattedMomentjs() {
      return this.examForm.date ? this.$moment(this.examForm.date).format("DD.MM.Y") : '';
    }
  },
  watch: {
    search (val) {
      // Items have already been loaded
      if (this.items.length > 0) return

      this.isLoading = true
      setTimeout(() => {
        // Lazily load input items
        this.$http.get(`https://mediately.co/api/v4/icd/bg/?query=${val}`,{
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': true,
            'Access-Control-Allow-Headers': 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range',
            'Access-Control-Expose-Headers': 'Content-Length,Content-Range',
            'Allow': 'GET, POST, PUT, DELETE, OPTIONS, HEAD'
          }
        })
            .then(res => {
              // let result = []
              this.items = res.data
            })
            .catch(err => {
              console.log(err)
            })
            .finally(() => (this.isLoading = false))
      }, 500)
    },
  },
}
</script>

<style scoped>
.diagnosisList {
  font-size: 19px; border-bottom: 1px solid #0d47a1; border-top: 1px solid #0d47a1
}
</style>