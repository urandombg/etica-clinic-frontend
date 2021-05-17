<template>
  <div>
    <v-data-table
      :items="closedMedicalSheets"
      show-expand
      :items-per-page="20"
      single-expand
      :loading.sync="sheetsLoading"
      item-key="id"
      :headers="medicalRecrodsHeader"
      @item-expanded="getAmbulatoryListTreatments"
    >
      <template #expanded-item="{item}">
        <td :colspan="medicalRecrodsHeader.length + 2">
          <v-card
            elevation="24"
            rounded
          >
            <v-card-title>
              Данни от {{ item.type_of_sheet }}
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col>
                  <v-btn>
                    Изтегли амбулаторен първичен лист
                  </v-btn>
                </v-col>
              </v-row>
              <br>
              <v-row>
                <v-col
                  cols="6"
                  order-md="6"
                  class="cyan lighten-4"
                  style="font-size: 19px"
                >
                  <strong>
                    Анамнеза:
                  </strong><br>
                  <p>
                    {{ item.anamnesa }}
                  </p>
                </v-col>
                <v-col
                  cols="6"
                  class="cyan lighten-1"
                  style="font-size: 19px"
                >
                  <strong>
                    Обективно състояние:
                  </strong><br>
                  <p>
                    {{ item.obj_condition }}
                  </p>
                </v-col>
              </v-row>
              <br><br><br>
              <v-row>
                <br>
                <v-col>
                  <h2
                    class="elevation-2 grey white--text"
                    style="padding: 10px"
                  >
                    <v-icon>
                      mdi-format-list-checkbox
                    </v-icon>
                    Назначени процедури
                  </h2>
                  <v-data-table
                    class="elevation-4"
                    locale="BG"
                    :items="ambListTreatments"
                    :loading.sync="treatmentLoading"
                    :headers="ambListTreatmentsColumns"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </td>
      </template>
      <template #item.date="{item}">
        {{ $moment(item.date).format("DD.MM.Y") }}
      </template>
      <template #item.type_of_visit="{item}">
        <v-icon
          v-if="item.type_of_sheet === 'Амб. Първичен' || item.type_of_sheet === 'Амб.Първичен'"
          color="primary"
        >
          mdi-account-arrow-right
        </v-icon>
        <v-icon v-else>
          mdi-account-arrow-left
        </v-icon>
        {{ item.type_of_sheet }}
      </template>
      <template #item.main_diagnosys="{item}">
        {{ `${item.anamnesa.substring(0,64)} ...` }}
      </template>
      <template #item.leading_mkb="{item}">
        <span v-if="item.leading_mkb.length > 50">
          {{ `${item.leading_mkb.substring(0,50)} ...` }}
          <v-tooltip
            top
            color="primary"
          >
            {{ `${item.leading_mkb}` }}
            <template #activator="{on, attrs}">
              <span
                v-bind="attrs"
                v-on="on"
              >
                <v-icon
                  color="primary"
                  large
                >
                  mdi-chat-question
                </v-icon>
              </span>
            </template>
          </v-tooltip>
        </span>
        <span v-else>
          {{ `${item.leading_mkb}` }}
        </span>
      </template>
      <template #item.main_diagnosys="{item}">
        <span v-if="item.obj_condition.length > 50">
          {{ `${item.main_diagnosys.substring(0,50)} ...` }}
          <v-tooltip
            top
            color="primary"
          >
            {{ `${item.main_diagnosys}` }}
            <template #activator="{on, attrs}">
              <span
                v-bind="attrs"
                v-on="on"
              >
                <v-icon
                  color="primary"
                  large
                >
                  mdi-chat-question
                </v-icon>
              </span>
            </template>
          </v-tooltip>
        </span>
        <span v-else>
          {{ `${item.obj_condition}` }}
        </span>
      </template>
      <template #item.status="{item}">
        <div
          v-if="item.status === 'closed'"
          class="text-right"
        >
          Приключен
          <v-icon
            color="green"
            x-large
          >
            mdi-check
          </v-icon>
        </div>
        <div
          v-else
          class="text-right"
        >
          Отворен
          <v-icon
            v-if="item.status !== 'closed'"
            x-large
            color="orange"
          >
            mdi-clock
          </v-icon>
        </div>
      </template>
      <template #item.actions="{item}">
        <v-menu>
          <template #activator="{ on, attrs}">
            <v-btn
              dark
              color="primary"
              v-bind="attrs"
              v-on="on"
            >
              Действия
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click=" item.type_of_sheet === 'Амб. Първичен' ? generateAmbulatoryFirstList(item) : generateAmbulatorySecondList(item)"
                         class="grey lighten-4">
              <v-list-item-title>
                <v-icon>
                  mdi-download
                </v-icon>
                {{ item.type_of_sheet === 'Амб. Първичен' ? "ДА": "не" }}
                Изтегли амбулаторния лист
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="getFirstAmbListDoc(item)">
              <v-list-item-title>
                <v-icon color="red">
                  mdi-delete
                </v-icon>
                Изтрий този лист
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import FileSaver from 'file-saver'
export default {
  name: "ClosedSheets",
  components: {
  },
  props: ['patientId'],
  data() {
    return {
      medicalRecrodsHeader: [
        {
          text: 'Дата',
          value: 'date',
          field: 'date',
          sortable: true
        },
        {
          text: 'Лист №',
          value: 'id'
        },
        {
          text: 'Водеща диагноза',
          value: 'leading_mkb',
          sortable: false
        },
        {
          text: 'Тип на листа',
          value: 'type_of_visit',
          sortable: true
        },
        {
          text: 'Основна диагноза',
          value: 'main_diagnosys',
          sortable: false
        },
        {
          text: 'Статус',
          field: 'status',
          value: 'status',
          sortable: false
        },
        {
          text: '',
          value: 'actions',
          sortable: false
        },
      ],
      closedMedicalSheets: [],
      sheetsLoading: true,
      ambListTreatments: [],
      ambListTreatmentsColumns: [
        {
          text: 'Наименование на процедурата',
          value: 'title'
        },
        {
          text: 'Кол.',
          value: 'duration'
        }
      ],
      treatmentLoading: true
    }
  },
  created() {
    this.closedSheets(this.$props.patientId);
  },
  mounted() {
  },
  methods: {
    generateAmbulatorySecondList(item) {
      this.getFirstAmbListDoc(item);
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
    getFirstAmbListDoc(item) {
      this.$http.post(`/api/ambulatory/${item.id}/generateAmbulatoryList`, item, {
        responseType: "arraybuffer"
      })
          .then(
              (data) => {
                // console.log('dt', data.data)
                // console.log(FileSaver)
                // console.log(crc32.str("9610124497"))
                if (item.type_of_sheet.replace(' ', '') === 'Амб.Първичен') {
                  console.log(this.$moment(item.date).format('DDmY'))

                  FileSaver.saveAs(new Blob([data.data]), `${this.$moment(item.date).format('DDmY')}-initialExam.docx`);
                } else {
                  FileSaver.saveAs(new Blob([data.data]),  `${this.$moment(item.date).format('DDmY')}-finalExam.docx`);
                }
              }
          )
      .catch((error) => {
        console.log(error.message)
      })
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
    },
    generateAmbulatoryFirstList(item) {
      this.$http.post(`/api/ambulatory/${item.id}/generateAmbulatoryList`, item)
          .then(
              () => {
                // console.log('ЛОГАДАТ', data)
              }
          )
          .catch(
              (error) => {
                console.log(error)
              }
          )
      .finally(() => {
        setTimeout(() => {
          this.getFirstAmbListDoc(item)
        }, 350)
      })
    },
  }
}
</script>

<style scoped>
</style>