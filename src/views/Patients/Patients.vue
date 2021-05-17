<template>
  <div class="paco">
    <v-subheader>
      <h1>Пациенти</h1>
      <v-icon></v-icon>
    </v-subheader>
    <v-container fluid>
      <v-alert
          v-if="errors.length > 0"
          type="error"
          border="top"
          color="red lighten-2"
          dark
      >
        Възникна фатална грешка при извличането на данни!
        <p v-if="errors.data" class="display-1">
          <strong>
            {{ errors.data.message }}
          </strong>
        </p>
      </v-alert>
      <v-btn shaped
             rounded
             x-large
             color="success"
             @click="$router.push(`/patients/create`)">
        <v-icon>
          mdi-account-plus
        </v-icon>
        <span>
          Добави нов пациент
        </span>
      </v-btn>

<!--      <v-container fluid>-->
<!--        <v-row>-->
<!--          <v-col cols="10" md="10">-->
<!--            <v-autocomplete label="Търси"-->
<!--                            item-text="firstname"-->
<!--                            item-value="firstname"-->
<!--                            v-model="select"-->
<!--                            :loading="loading"-->
<!--                            :search-input.sync="search"-->
<!--                            :items="items"-->
<!--                            outline-->
<!--                            hide-no-data>-->
<!--              <template #item="{item}">-->
<!--                {{ item.firstname }} {{ item.lastname}}-->
<!--              </template>-->
<!--            </v-autocomplete>-->
<!--          </v-col>-->
<!--          <v-col cols="2" md="2">-->
<!--            <v-select :items="headers" :item-value="headers.value" :no-data-text="'nqma'" label="Търси по"></v-select>-->
<!--          </v-col>-->
<!--        </v-row>-->
<!--      </v-container>-->
<!--      <v-spacer></v-spacer>-->
      <v-row>
        <v-col cols="12"></v-col>
        <v-col cols="12"></v-col>
      </v-row>
      <vue-good-table :rows="items"
                      :columns="headers"
      >
        <template slot="table-row" slot-scope="props">
          <div v-if="props.column.label === 'действия'">
            <v-btn @click="$router.push(`/patients/${props.row.id}`)">
              Отвори
            </v-btn>
            <v-menu
                offset-y
            >
              <template v-slot:activator="{ attrs, on }">
                <v-btn
                    color="light-blue"
                    class="white--text"
                    v-bind="attrs"
                    v-on="on"
                >
                  Действия
                </v-btn>
              </template>

              <v-list>
                <v-list-item link>
                  <v-list-item-title>
                    <v-icon>
                      mdi-clock-in
                    </v-icon>
                    Запиши час за посещение
                  </v-list-item-title>
                </v-list-item>
                <v-list-item link>
                  <v-list-item-title>
                    <v-icon>
                      mdi-email
                    </v-icon>
                    Изпрати съобщение
                  </v-list-item-title>
                </v-list-item>
                <v-list-item
                    link
                    @click="deletePatient(props.row)"
                >
                  <v-list-item-title>
                    <div class="red accent-1">
                      Изтрии
                    </div>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </template>
      </vue-good-table>
<!--      <v-data-table :items="items"-->
<!--                    class="elevation-14"-->
<!--                    show-select-->
<!--                    item-class="striped"-->
<!--                    no-results-text="sdf"-->
<!--                    group-desc-->
<!--                    :loading="loading"-->
<!--                    :headers="headers">-->
<!--        <template #no-data>-->
<!--          <div class="display-3 warning white&#45;&#45;text" style="padding: 30px">-->
<!--            Няма намерени резултати!-->
<!--          </div>-->
<!--        </template>-->
<!--        <template #item.firstname="{item}">-->
<!--          {{ item.firstname }}-->
<!--        </template>-->
<!--        <template #item.middlename="{item}">-->
<!--          {{ item.middlename }}-->
<!--        </template>-->
<!--        <template #item.lastname="{item}">-->
<!--          <strong>-->
<!--            {{ item.lastname }}-->
<!--          </strong>-->
<!--        </template>-->
<!--        <template #item.lastname="{item}">-->
<!--          <strong>-->
<!--            {{ item.lastname }}-->
<!--          </strong>-->
<!--        </template>-->
<!--        <template #item.city="{item}">-->
<!--          {{ item.city}}-->
<!--        </template>-->
<!--        <template #item.phone="{item}">-->
<!--          <a :href="`tel:${item.phone}`">-->
<!--            {{ item.phone}}-->
<!--          </a>-->
<!--        </template>-->
<!--        <template #item.actions="{item}">-->
<!--          <v-btn @click="$router.push(`/patients/${item.id}`)">-->
<!--            Виж-->
<!--          </v-btn>-->
<!--          <v-menu-->
<!--              offset-y-->
<!--          >-->
<!--            <template v-slot:activator="{ attrs, on }">-->
<!--              <v-btn-->
<!--                  color="light-blue"-->
<!--                  class="ma-5"-->
<!--                  v-bind="attrs"-->
<!--                  v-on="on"-->
<!--              >-->
<!--               Действия-->
<!--              </v-btn>-->
<!--            </template>-->

<!--            <v-list>-->
<!--              <v-list-item>-->
<!--                <v-list-item-title>Виж</v-list-item-title>-->
<!--              </v-list-item>-->
<!--              <v-list-item link>-->
<!--                <v-list-item-title>-->
<!--                  <v-icon>-->
<!--                    mdi-clock-in-->
<!--                  </v-icon>-->
<!--                  Запиши час за посещение-->
<!--                </v-list-item-title>-->
<!--              </v-list-item>-->
<!--              <v-list-item link>-->
<!--                <v-list-item-title>-->
<!--                  <v-icon>-->
<!--                    mdi-email-->
<!--                  </v-icon>-->
<!--                  Изпрати съобщение-->
<!--                </v-list-item-title>-->
<!--              </v-list-item>-->
<!--              <v-list-item-->
<!--                  link-->
<!--                  @click="deletePatient(item)"-->
<!--              >-->
<!--                <v-list-item-title>-->
<!--                  <div class="red accent-1">-->
<!--                   Изтрии-->
<!--                  </div>-->
<!--                </v-list-item-title>-->
<!--              </v-list-item>-->
<!--            </v-list>-->
<!--          </v-menu>-->
<!--        </template>-->
<!--      </v-data-table>-->
    </v-container>

  </div>
</template>

<script>
// const url = process.env.VUE_APP_REMOTE_SERVER_HOST_IP;
import 'vue-good-table/dist/vue-good-table.css'
import { VueGoodTable } from 'vue-good-table';

export default {
name: "Patients",
  components: {
  VueGoodTable
  },
  data: function () {
    return {
      show: true,
      searchTerm: null,
      select: null,
      search: null,
      loading: false,
      items: [],
      headers: [
        {
          text: 'Име',
          label: 'Име',
          align: 'start',
          sortable: false,
          field: 'firstname',
          value: 'firstname',
          filterOptions: {
            enabled: true,
            placeholder: 'Име на пациента',
            trigger: 'enter',
          }
        },
        {
          text: 'Презиме',
          label: 'Презиме',
          sortable: true,
          searchable: true,
          value: 'middlename',
          field: 'middlename',
          filterOptions: {
            enabled: true,
            placeholder: 'Презиме на пациента',
            trigger: 'enter',
          }
        },
        {
          text: 'Фамилия',
          label: 'Фамилия',
          sortable: true,
          searchable: true,
          value: 'lastname',
          field: 'lastname',
          filterOptions: {
            enabled: true,
            placeholder: 'Фамилия на пациента',
            trigger: 'enter',
          }
        },
        {
          text: 'Град',
          label: 'Град',
          value: 'city',
          field: 'city'
        },
        {
          text: 'Телефон',
          label: 'Телефон',
          searchable: true,
          value: 'phone',
          field: 'phone',
          type: 'phone'
        },
        {
          text: 'действия',
          label: 'действия',
          value: 'actions',
          sortable: false,
          field: 'actions',
          html: true
        }
      ],
      foundedData: [],

      errors: [],
      confToken: '',
    }
  },
  mounted() {
    this.getPatients(); 
  },
  methods: {

    getPatients() {
      this.loading = true
      // console.log(this.$http.defaults.headers)
      this.$http.get(`/api/patients`)
          .then(
              (data) => {
                // console.log(axiosHeaders)
                if (!data.data) {
                  this.items = [];
                  this.loading =false
                }
                this.items = data.data;
                this.loading = false
              }
          )
          .catch(
              (error) => {
                this.items = [];
                this.loading = false
                this.errors = error.response
                // console.log(error.response)
              }
          )
    },
    async deletePatient(patient) {
        const { value: conf } = await this.$swal.fire({
          title: 'Въведи думата "изтрии", за да изтриеш записа!',
          inputLabel: 'Моля, въведи',
          input: 'text',
        })
        if (conf === "изтрии") {
          this.$swal.fire({
            icon: 'warning',
            text: `Записът на ${patient.firstname} ${patient.lastname} беше изтрит`
          })
          this.$http.delete(`/api/patients/${patient.id}`, {
            id: patient.id
          })
          .then(
              () => {
                this.getPatients()
              }
          )
        }
        else {
          await this.$swal.fire({
            icon: 'warning',
            title: "Записът не беше изтрит!"
          })
        }
      },
    querySelections (v) {
      this.loading = true
        this.items = this.items.reduce((entity,e) => {
          if (v.toLocaleLowerCase() === entity['FAMILY'].toLocaleLowerCase()) {
            return e
          }
        })
        this.loading = false
    },
  },
  watch: {
    model(val) {
      if (val != null) this.tab = 0
      else this.tab = null
    },
    search(val) {
      // Items have already been loaded
      if (this.items.length > 0) return
      console.log('жааааа ->', val)
      this.isLoading = true
    }
  }
}
</script>

<style scoped>
@import "~@progress/kendo-ui/css/web/kendo.bootstrap-v4.css";
</style>
<style>
.v-data-table-header {
  font-family: Roboto;
  size: 41px;
  background-color: #efefef;
}
.v-data-table-header .text-start {
  font-size: 40px;
}
</style>
