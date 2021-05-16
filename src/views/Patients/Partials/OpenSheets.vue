<template>
<div>
  <v-data-table :items="currentlyOpenedSheets"
                :headers="medicalRecrodsHeader"
                show-expand
                single-expand
                no-data-text="Няма данни"
                @item-expanded="getAmbulatoryListTreatments"
                item-key="id">
    <template #expanded-item="{item}"
              class="align-center"
              style="padding: 25px">
      <td :colspan="currentlyOpenedSheets.length + 22">
        <v-card elevation="2" rounded outlined min-height="550">
          <v-card-title>
            <v-col>
              Данни от {{ item.type_of_sheet}} преглед
            </v-col>
            <v-col class="align-center" @click="getFirstAmbListDoc(item)">
              <v-btn color="blue lighten-1" class="white--text">
                <v-icon>
                  mdi-file-document
                </v-icon>
                <span>
                   {{ item.type_of_sheet }} лист
                </span>
              </v-btn>
            </v-col>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="6" order-md="6" class="cyan lighten-4" style="font-size: 24px;">
                <strong>
                  Анамнеза:
                </strong><br>
                <v-col style="color: #33333d">
                  <p style="text-shadow: white 1px -1px -1px">
                    {{ item.anamnesa }}
                  </p>
                </v-col>
              </v-col>
              <v-col cols="6" class="cyan lighten-1" style="font-size: 24px">
                <strong>
                  Обективно състояние:
                </strong><br>
                <v-col>
                  {{ item.obj_condition }}
                </v-col>
              </v-col>
            </v-row>
            <v-row>
              <br>
              <v-col cols="12">
                <v-data-table :items="ambListTreatments" :headers="ambListTreatmentsColumns"></v-data-table>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </td>
    </template>
    <template #item.date="{item}">
      {{ $moment(item.date).format("DD.MM.Y") }}
    </template>
    <template #item.leading_mkb="{item}">
      <span v-if="item.leading_mkb.length > 50">
      {{ `${item.leading_mkb.substring(0,50)} ...`}}
        <v-tooltip top color="primary">
          {{ `${item.leading_mkb}` }}
          <template #activator="{on, attrs}">
            <span v-on="on" v-bind="attrs">
              <v-icon color="primary" large>
                mdi-chat-question
              </v-icon>
            </span>
          </template>
        </v-tooltip>
      </span>
      <span v-else>
        {{ `${item.leading_mkb}`}}
      </span>
    </template>
    <template #item.status="{item}">
      <div v-if="item.status === 'closed'" class="text-right">
        Приключен
        <v-icon color="green" x-large >
          mdi-check
        </v-icon>
      </div>
      <div v-else class="text-right">
        Отворен
        <v-icon v-if="item.status !== 'closed'" x-large color="orange">
          mdi-clock
        </v-icon>
      </div>
    </template>
    <template #item.actions="{item}">
<!--      {{ item }}-->
      <v-menu>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
              color="primary"
              dark
              v-bind="attrs"
              v-on="on"
          >
            Действия
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="generateAmbulatoryFirstList(item)" v-show="item.type_of_sheet === 'Амб.Първичен'">
            <v-list-item-title>Печат на първичен амбулаторен лист</v-list-item-title>
          </v-list-item>
          <v-list-item @click="generateAmbulatorySecondList(item)" v-show="item.type_of_sheet === 'Амб.Първичен'">
            <v-list-item-title>Издаване на вторичен амбулаторен лист</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Редакция</v-list-item-title>
          </v-list-item>
          <v-list-item @click="deleteAmbulatoryList(item.id)">
            <v-list-item-title>Изтрий</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
  </v-data-table>
</div>
</template>

<script>
// const url = process.env.VUE_APP_REMOTE_SERVER_HOST_IP;
export default {
  props: ['patientId', 'patient'],
  name: "OpenSheets",
  data () {
    return {
      currentlyOpenedSheets: [],
      medicalRecrodsHeader: [
        {
          text: 'Дата',
          value: 'date',
          sortable: true
        },
        {
          text: 'Лист №',
          value: 'sheet_number'
        },
        {
          text: 'Водеща диагноза',
          value: 'leading_mkb',
          sortable: false
        },
        {
          text: 'Тип на листа',
          value: 'type_of_sheet',
          sortable: true
        },
        {
          text: 'Основна диагноза',
          value: 'main_diagnosys',
          sortable: false
        },
        {
          text: 'Статус',
          value: 'status',
          sortable: false
        },
        {
          text: '',
          value: 'actions',
          sortable: false
        },
      ],
      sheetsLoading: false,
      ambListTreatments: [],
      ambListTreatmentsColumns: [
        {
          text: 'cede',
          value: 'code'
        },
        {
          text: 'Наименование на процедурата',
          value: 'title'
        },
        {
          text: 'Амбулаторен лист',
          value: 'ambulatory_id'
        },
        {
          text: 'Кол.',
          value: 'duration'
        }
      ],
      treatmentLoading: true,
      patient_id: null
    }
  },
  created() {
    this.patient_id = this.$props.patientId
    this.openSheets(this.$props.patientId)
  },
  mounted() {
    // console.log('PATIENT: ', this.$props.patientId)
    this.$vuetify.lang.current = 'bg'
    console.log(this.$vuetify)
  },
  methods: {
    getFirstAmbListDoc(item) {
      console.log(item)
      this.$http.post(`/api/ambulatory/${item.id}/getFirstAmbSheetDocument`, item, {
        responseType: "arraybuffer"
      })
      .then(
          (data) => {
            FileSaver.saveAs(new Blob([data.data]), 'doc.docx');
          }
      )
    },

    generateAmbulatoryFirstList(item) {
      this.$http.post(`/api/ambulatory/${item.id}/generateAmbulatoryList`, item)
      .then(
          () => {
            setTimeout(() => {
              this.getFirstAmbListDoc(item)
            }, 500)
          }
      )
      .catch(
          (error) => {
            console.log(error)
          }
      )
    },
    generateAmbulatorySecondList(item) {
      this.$root.$emit('createFinalExam', item)
    },
    getAmbulatoryListTreatments(item) {
      this.ambListTreatments = []
      setTimeout(() => {
        this.treatmentLoading = true
        this.$http.get(`/api/ambulatory/${item.item.id}/treatments`)
            .then(
                (data) => {
                  this.ambListTreatments = data.data
                }
            )
            .catch(
                (error) => {
                  alert(error)
                }
            )
            .finally(() => {
              this.treatmentLoading = false
            })
      },750);
    },
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
                        // this.getAmbulatoryListTreatments()
                        this.openSheets(this.$props.patientId);
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
  }
}
import FileSaver from "file-saver";
</script>

<style scoped>

</style>