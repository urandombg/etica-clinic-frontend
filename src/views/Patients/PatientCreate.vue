<template>
<v-container fluid>
  <v-container fluid>
   <v-card shaped elevation="11" style="padding: 15px">
     <v-overlay absolute v-if="isLoading">
       <v-progress-circular indeterminate color="indigo" width="10" size="405">
         <span style="color: white" class="display-1">
           Зарежда, моля изчакайте!
         </span>
       </v-progress-circular>
     </v-overlay>

     <v-card-title>
      <h1>
        <v-icon x-large color="green">
          mdi-account-plus
        </v-icon>
        Добавяне на нов пациент
      </h1>
     </v-card-title>
<!--{{ patientInfo }}-->
    <v-form     ref="form"
                v-model="valid"
                lazy-validation>
      <v-alert
          v-if="noRecordFoundInCloud"
          text
          prominent
          dismissible
          type="error"
          icon="mdi-cloud-alert"
      >
        Няма немерени данни за този пациент с това ЕГН в базата данни!
      </v-alert>
      <v-row>
        <v-col cols="12" md="12">
          <v-text-field required
                        v-model="patientInfo.egn"
                        color="warning"
                        :rules="egnRule"
                        :counter="10"
                        reqired
                        placeholder="ЕГН/ЛНЧ"
                        label="ЕГН">
            <v-btn slot="append" color="warning" shaped x-large :disabled="canCheckForRecord" @click="checkRecord">
              <v-icon>
                mdi-cloud-download
              </v-icon>
              <span>
               Провери за съществуващ запис
            </span>
            </v-btn>
          </v-text-field>
        </v-col>
        <v-col
            cols="12"
            md="4"
        >
          <v-text-field
              v-model="patientInfo.firstname"
              :rules="nameRules"
              label="Име"
              required
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field v-model="patientInfo.middlename" placeholder="Презиме">
          </v-text-field>
        </v-col>

        <v-col
            cols="12"
            md="4"
        >
          <v-text-field
              v-model="patientInfo.lastname"
              :rules="nameRules"
              :counter="10"
              label="Фамилия"
              required
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-select :items="patientInfo.sexOptions"
                    v-model="patientInfo.sex"
                    label="Пол"
                    :rules="sexRule"
                    required>

          </v-select>
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field v-model="patientInfo.birthday"
                        label="Дата на раждане"
                        :rules="birthdayRule"
                        required
                        placeholder="Изписва се по следния начин: 07.04.1982">
          </v-text-field>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="12" md="4">
          <v-autocomplete :items="cities.cities"
                          v-model="patientInfo.city"
                          :item-value="itemValue"
                          :item-text="cityName">

          </v-autocomplete>
<!--          <city-autocomplete-partial></city-autocomplete-partial>-->
        </v-col>

        <v-col cols="12" md="6">
          <v-autocomplete v-model="patientInfo.street"
                          required
                          :disabled="!patientInfo.city"
                          label="Адрес"

                          :search-input.sync="streetSearch"
                          :item-text="fullStreetName"
                          :items="streets">

          </v-autocomplete>
        </v-col>
        <v-col cols="2" md="2">
          <v-text-field v-model="patientInfo.streetNumber"
                        :disabled="!patientInfo.street"
                        required
                        label="№"></v-text-field>
        </v-col>
        <v-col cols="6" md="6">
<!--          <vue-phone-number-input v-model="patientInfo.phone"-->
<!--                                  size="lg"-->
<!--                                  default-country-code="BG"-->
<!--                                  example="1244414242"-->
<!--                                  :required="true"-->
<!--                                  clearable-->
<!--                                  :translations="translations">-->

<!--          </vue-phone-number-input>-->
                   <v-text-field label="Телефон:" v-model="patientInfo.phone"></v-text-field>
        </v-col>
        <v-col cols="6" md="6">
          <v-text-field label="email:" v-model="patientInfo.email"></v-text-field>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="6">
          <v-btn block shaped rounded color="success" @click="savePatient()">
            Запази и отвори
          </v-btn>
        </v-col>
        <v-col cols="6">
          <v-btn @click="$router.push('/patients')" block outlined shaped rounded color="info">
            Запази и се върни в списъка с пациенти
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
   </v-card>
  </v-container>

  <v-dialog
      v-model="dialog"
      persistent
      dark
  >
    <v-card>
      <v-card-title class="headline">
        Имаме готови данни за този пациент!
      </v-card-title>
      <v-card-text class="cyan white--text" v-if="foundedData.patientInfo">
        <p class="display-1">
          Моля, прегледай внимателно данните по-долу и ги сравни със сегашните!
        </p>
        <h1 >
        </h1>
          <v-list>
            <v-list-item v-for="(inf, x) in foundedData.patientInfo" :key="x">
              <div class="display-3">
              <strong style="color: orangered">Пациентът се казва:</strong>
                <br>
              {{ `${inf['NAME']} ${inf['SURNAME']}
              ${inf['FAMILY']}, адрес: ${inf['TOWN']},
${inf['STREET']} ${inf['NUMBER']}, роден на ${inf['BORN']}` }}
              </div>
            </v-list-item>
          </v-list>
      </v-card-text>
      <v-card-actions>
        <v-btn-toggle rounded multiple>
          <v-btn color="green" @click="useFoundedDataFromCheck">Използвай данните от базата данни</v-btn>
          <v-btn color="red" @click="dialog = false">Данните са некоректни, няма да ги използвам!</v-btn>
        </v-btn-toggle>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-overlay class="text-center" color="primary" v-if="showOverlayBeforeSave">
    <v-progress-circular
        size="125"
        color="red"
        indeterminate
    >
      <v-icon>
        mdi-cloud-upload
      </v-icon>
    </v-progress-circular>

    <h1>
      Един момент, моля!
    </h1>
    <p class="text-center">
      Записвам данните в базата данни!
    </p>
  </v-overlay>
</v-container>
</template>

<script>
import Vue from 'vue';
import cities from '../../assets/cities.json';
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';
import Vuelidate from 'vuelidate'
Vue.use(Vuelidate)
// const url = process.env.VUE_APP_REMOTE_SERVER_HOST_IP
// const url = process.env.VUE_APP_REMOTE_SERVER_HOST_IP;
Vue.component('vue-phone-number-input', VuePhoneNumberInput);
export default {
name: "PatientCreate",
  data() {
    return {
      cities: cities,
      search: null,
      isLoading: false,
      streets: [],
      streetSearch: null,
      foundedData: [],
      translations: {
        countrySelectorLabel: 'Код',
        countrySelectorError: 'Choisir un pays',
        phoneNumberLabel: 'Телефонен номер без 0 отпред',
        example: 'Пример:'
      },
      dialog: false,
      noRecordFoundInCloud: false,
      patientInfo: {
        firstname: '',
        middlename: '',
        lastname: '',
        sex: '',
        sexOptions: [
          {
            value: 'м',
            text: 'Мъжки'
          },
          {
            value: 'ж',
            text: 'Женски'
          },
        ],
        street: '',
        streetNumber: '',
        city: '',
        egn: '',
        birthday: '',
        phone: '',
        email: '',
      },
      valid: true,
      showOverlayBeforeSave: false,
      nameRules: [
        v => !!v || 'Името на пациента е задължително',
        v => v.length <= 10 || 'Полето име е задължително',
      ],
      emailRules: [
        v => /.+@.+/.test(v) || 'E-mail must be valid',
      ],
      egnRule: [
        v => !!v || 'ЕГН-то е задължително',
      ],
      sexRule: [
        v => !!v || 'Моля, посочете пола!',
      ],
      birthdayRule: [
        v => !!v || 'Дата на раждане е задължително',
      ],
      cityRule: [
        v => !!v || 'Това поле е задължително',
        v => v.length <= 1 || 'Полето име е задължително',
      ],
      canCheckForRecord: true
    }
  },
  methods: {
    getStreet () {
        this.$http.post(`http://ee.econt.com/services/Nomenclatures/NomenclaturesService.getStreets.json`,{
          cityID: this.patientInfo.city.cityID
        })
                  .then(
                      (data) => {
                        // console.log(data.data)
                        this.streets = data.data
                      }
                  )
                  .catch(
                      (error) => {
                        this.$swal({
                          type: 'error',
                          text: `Error ${error}`
                        })
                      }
                  )
    },
    //TODO ! HANDLE ERROR 500 when DB unavailable!!!!!!!!!
    useFoundedDataFromCheck() {

      // close dialog and set data
      let patientData = this.foundedData.patientInfo[0];
      this.patientInfo.firstname = patientData.NAME
      this.patientInfo.middlename = patientData.SURNAME
      this.patientInfo.lastname = patientData.FAMILY
      this.patientInfo.birthday = patientData.BORN
      this.patientInfo.sex = patientData.SEX
      this.patientInfo.city = patientData.TOWN
      this.patientInfo.street = patientData.STREET

      this.patientInfo.streetNumber = patientData.NUMBER
      this.dialog = false

    },
    checkRecord() {
      this.isLoading = true
      this.$http.post(`/api/patients/recordCheck`, {
        egn: this.patientInfo.egn
      }, { timeout: 5000})
      .then(
          (data) => {
            if (data.data.patientInfo && data.data.medicalRecords) {
              this.dialog = true
              this.foundedData = data.data
            } else {
              this.noRecordFoundInCloud = true
            }
          }
      )
      .catch(
          (er) => {
            this.$swal.fire({
              icon: 'error',
              title: `Това действие отне твърде дълго време, за да завърши!`,
              text: `Грешката е: ${er.code}, ${er.message}. Моля, свържете се със системния администратор на телефон
                                ${process.env.VUE_APP_SYSTEM_ADMINISTRATOR_PHONE} -
                                ${process.env.VUE_APP_SYSTEM_ADMINISTRATOR_NAME}`
            })
          }
      )
      .finally(() => {
        this.isLoading = false
      })
    },
    savePatient() {
      if (this.$refs.form.validate()) {
        // this.isLoading = true
          this.$http.post(`/api/patients`, this.patientInfo, {
            // timeout: 12500
          })
              .then(
                  (data) => {
                    if (data.data.patientExist && data.data.patientExist.length > 0) {
                      this.$router.push(`/patients/${data.data.patientExist[0].id}`)
                    }
                    else {
                      console.log('afaelse', data.data)
                      // this.showOverlayBeforeSave = true // todo!!
                      this.$router.push(`/patients/${data.data.Patient.id}`)
                    }
                    // console.log(data.data)
                    this.showOverlayBeforeSave = false
                  }
              )
              .catch(
                  (er) => {
                    this.$swal.fire({
                      icon: 'error',
                      iconColor: 'red',
                      text: `${er}`
                    })
                    console.log(er)
                    this.isLoading = false
                  }
              )
      }

    },
    cityName(value) {
      return `${value.name}, ${value.regionName}`
    },
    findCityBeforeAssign(city) {
      let founded = '';
        this.cities.cities.find(cityToFind => {
          if (city.toLocaleLowerCase() === cityToFind.name.toLocaleLowerCase()) {
            founded = cityToFind
            return founded
            // return founded
          }
          else {
            founded = null;
          }
        })
      return founded;
    },
    itemValue(value) {
      return value
    },
    fullStreetName(value) {
      return `${value.name}`
    }

  },
  watch: {
    'patientInfo.egn': function (v) {
        this.canCheckForRecord = !(v.length === 10);
    },
    streetSearch(city) {

      // Items have already been loaded
      if (this.streets.length > 0) return

      this.isLoading = true
      console.log(city)


      this.$http.post(`http://ee.econt.com/services/Nomenclatures/NomenclaturesService.getStreets.json`, {
        cityID: this.patientInfo.city.id
      },
          {
            headers: {
              "Access-Control-Allow-Headers": "*",
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json"
            },
            mode: 'cors'
          })
          .then(
              (data) => {
                // console.log(data)
                this.streets = data.data.streets
              }
          )
          .catch((error) => {
            console.log(error)
          })
          .finally(() => (this.isLoading = false))

    }
  }
}
</script>

<style scoped>

</style>
