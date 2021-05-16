<template>
  <v-row>
    <v-col>
      <v-card style="height: 100%" header-bg-variant="dark" header-text-variant="white" class="text-center">
        <div slot="header">
          <h2>
            <strong>
              Доставчик:
            </strong>
          </h2>
        </div>
        <v-card-body>
          <label for="company">Избери фирма</label>
          <v-select id="company" v-model="deliveryCompany" size="lg">
            <v-select-option v-for="(company, index) of companies"
                             :key="index"
                             :value="company">
              {{ company.name }}
            </v-select-option>
          </v-select>
          <br>
          <br>
<!--          TODO:-->
<!--          <v-overlay :show="deliveryCompany.name ? true : false" size="lg">-->
            <div>
              <v-row class="text-left">
                <v-col style="font-size: 40px">
                  <strong>
                    Доставчик:
                  </strong>
                </v-col>
                <v-col>
                  {{ deliveryCompany.name }}
                </v-col>
              </v-row>
            </div>
            <v-row class="text-left">
              <v-col>
                <strong>
                  Идент.№:
                </strong>
              </v-col>
              <v-col>
                {{ deliveryCompany.bulstat}}
              </v-col>
            </v-row>
            <v-row class="text-left">
              <v-col>
                <strong>
                  Булстат
                </strong>
              </v-col>
              <v-col>
                {{ deliveryCompany.vatRegistration ? 'BG' + deliveryCompany.bulstat : deliveryCompany.bulstat }}
              </v-col>
            </v-row>
            <v-row class="text-left">
              <v-col>
                <strong>
                  Адрес:
                </strong>
              </v-col>
              <v-col>
                {{ deliveryCompany.address }}
              </v-col>
            </v-row>
            <v-row class="text-left">
              <v-col>
                <strong>
                  Град:
                </strong>
              </v-col>
              <v-col>
                {{ deliveryCompany.city }}
              </v-col>
            </v-row>
            <v-row class="text-left">
              <v-col>
                <strong>
                  МОЛ:
                </strong>
              </v-col>
              <v-col>
                {{ deliveryCompany.mol }}
              </v-col>
            </v-row>
            <v-row class="text-left">
              <v-col>
                <strong>
                  Телефон:
                </strong>
              </v-col>
              <v-col>
                {{ deliveryCompany.phone }}
              </v-col>
            </v-row>
<!--          todo: -->
<!--          </v-overlay>-->
        </v-card-body>
      </v-card>
    </v-col>
    <v-col>
      <v-card style="height: 100%" header-bg-variant="dark" header-text-variant="white" class="text-center">
        <div slot="header">
          <h2>
            Детайли за фактурата
          </h2>
        </div>
        <v-card-body>
          <h1 class="text-xl-center">
            № {{ $moment(invoiceDate).format('DD.MM.YYYY') }}
          </h1>
<!--          <label>Дата на фактурата:</label>-->
<!--          <v-form-group>-->
            <v-row>
              <v-datepicker id="invoiceDate"
                            type="date"
                            :locale="'bg'"
                            :today-button="true"
                            label-next-month="Следващ месец"
                            :close-button="true"
                            close-button-variant="warning"
                            label-close-button="Затвори календара"
                            label-today-button="Избери днешна дата"
                            today-button-variant="info"
                            label-no-date-selected="Не избрана дата на документа"
                            label-help=""
                            :value-as-date="true"
                            :initial-date="$moment(invoiceDate).format('MM-DD')"
                            :value="$moment(invoiceDate).format('DD.MM.YYYY')"
                            :menu-class="'w-100'"
                            calendar-width="100%"
                            v-model="invoiceDate">
              </v-datepicker>
            </v-row>
<!--          </v-form-group>-->
          <v-form-group label="Тип на документа">
            <div class="tree-view-item">
              {{ $v.invoiceType }}
            </div>
            <span v-if="invoiceType">
              {{ invoiceType.text }}
            </span>
            {{ invoiceType}}
            <span>
              <v-btn size="sm">
                Промени
              </v-btn>
            </span>
            <v-select v-model.trim="$v.invoiceType.$model" size="lg" :options="invoiceTypes" ></v-select>
          </v-form-group>
          <v-form-group label="Начин на плащане:">
            <v-select v-model="paymentMethod" size="lg">
              <v-select-option v-for="(option, key) in $store.state.paymentOptions" :key="key" :value="option.value">
                {{ option.text }}
              </v-select-option>
            </v-select>
          </v-form-group>
        </v-card-body>
      </v-card>
    </v-col>
    <v-col>
      <v-card style="height: 100%" header-bg-variant="dark" header-text-variant="white" class="text-center">
        <div slot="header">
          <h2>
            <strong>
              Получател:
            </strong>
          </h2>
        </div>
        <v-card-body>
<!--          {{ $v.customer.$dirty }}-->
          <v-form-group
            label="Име на пациент / фирма">
            <v-form-group>
              <multiselect :options="customers"
                           track-by="firstname"
                           label="firstname"
                           :custom-label="customLabel"
                           :class="$v.customer.$invalid ? 'is-invalid' : 'is-valid'"
                           :show-labels="false"
                           :allow-empty="false"
                           v-model.trim="$v.customer.$model">
              </multiselect>
            </v-form-group>
            <v-checkbox class="text-left form-control-lg"
                        v-model="invoiceToPrivateIndividual"
                        v-show="customer.firstname">
              <strong>
                Издай фактурата на частно лице
              </strong>
            </v-checkbox>
            <v-form-invalid-feedback v-show="$v.customer.$dirty && $v.customer.$touch()">
              invalid
            </v-form-invalid-feedback>
          </v-form-group>
          <div>
            {{ invoiceToPrivateIndividual }}
            <v-row>
              <v-col class="text-left" v-if="customer.commercial" v-show="!invoiceToPrivateIndividual">
                <v-list-group v-for="(commercial, index) in customer.commercial" :key="index">
                  <v-list-group-item variant="primary">
                    <strong>
                      Наменование:
                    </strong> <br>
                    {{ commercial.name}}
                  </v-list-group-item>
                  <v-list-group-item>
                    <strong>
                      Адрес:
                    </strong> <br>
                    {{ commercial.address}}
                  </v-list-group-item>
                  <v-list-group-item>
                    <strong>
                      Телефон:
                    </strong> <br>
                    {{ commercial.phone}}
                  </v-list-group-item>
                  <v-list-group-item>
                    <strong>
                      ЕИК:
                    </strong> <br>
                    {{ commercial.eik}}
                  </v-list-group-item>
                  <v-list-group-item>
                    <strong>
                      БУЛСТАТ:
                    </strong> <br>
                    {{ commercial.vat_registration === 1 ? `BG${commercial.eik}` : commercial.eik }}
                  </v-list-group-item>
                  <v-list-group-item>
                    <strong>
                      МОЛ:
                    </strong> <br>
                    {{ commercial.mol }}
                  </v-list-group-item>
                </v-list-group>
              </v-col>
              <v-col v-show="invoiceToPrivateIndividual">
                <v-list-group>
                  <v-list-group-item variant="info">
                    <strong>
                      Име и фамилия:
                    </strong> <br>
                    {{ customer.firstname }} {{ customer.lastname }}
                  </v-list-group-item>
                  <v-list-group-item>
                    <strong>
                     Адрес:
                    </strong> <br>
                    {{ customer.address }}
                  </v-list-group-item>
                </v-list-group>
              </v-col>
            </v-row>
<!--          <v-row class="text-left">-->
<!--              <v-col>-->
<!--                <strong>-->
<!--                  Получател:-->
<!--                </strong>-->
<!--              </v-col>-->
<!--              <v-col v-if="!invoiceToPrivateIndividual">-->
<!--                {{ customer.commercial === '' ? customer.firstname : (customer.commercial ? customer.commercial.company : '') }}-->
<!--              </v-col>-->
<!--              <v-col v-if="invoiceToPrivateIndividual">-->
<!--                {{ customer.firstname }}-->
<!--              </v-col>-->
<!--            </v-row>-->
<!--          <v-row class="text-left">-->
<!--            <v-col>-->
<!--              <strong>-->
<!--                Идент.№:-->
<!--              </strong>-->
<!--            </v-col>-->
<!--            <v-col v-if="!invoiceToPrivateIndividual">-->
<!--              {{ customer.commercial === '' ? customer.firstname : (customer.commercial ? customer.commercial.bulstat : '') }}-->
<!--            </v-col>-->
<!--            <v-col v-if="invoiceToPrivateIndividual">-->
<!--              {{ customer.lastname }}-->
<!--            </v-col>-->
<!--          </v-row>-->
<!--          <v-row class="text-left">-->
<!--            <v-col>-->
<!--              <strong>-->
<!--                Булстат-->
<!--              </strong>-->
<!--            </v-col>-->
<!--            <v-col v-if="!invoiceToPrivateIndividual">-->
<!--              {{ customer.commercial === '' ? customer.firstname : (customer.commercial ? 'BG' + customer.commercial.bulstat : '') }}-->
<!--            </v-col>-->
<!--            <v-col v-if="invoiceToPrivateIndividual">-->
<!--              99999999-->
<!--            </v-col>-->
<!--          </v-row>-->
<!--          <v-row class="text-left">-->
<!--            <v-col>-->
<!--              <strong>-->
<!--                Адрес:-->
<!--              </strong>-->
<!--            </v-col>-->
<!--            <v-col v-if="!invoiceToPrivateIndividual">-->
<!--              {{ customer.commercial === '' ? customer.firstname : (customer.commercial ? customer.commercial.address : '') }}-->
<!--            </v-col>-->
<!--            <v-col v-if="invoiceToPrivateIndividual">-->
<!--              {{ customer.address }}-->
<!--            </v-col>-->
<!--          </v-row>-->
<!--          <v-row class="text-left">-->
<!--            <v-col>-->
<!--              <strong>-->
<!--                Град:-->
<!--              </strong>-->
<!--            </v-col>-->
<!--            <v-col v-if="!invoiceToPrivateIndividual">-->
<!--              {{ customer.invoiceDetails === '' ? customer.firstname : (customer.invoiceDetails ? customer.invoiceDetails.city : '') }}-->
<!--            </v-col>-->
<!--            <v-col v-if="invoiceToPrivateIndividual">-->
<!--              {{ customer.city }}-->
<!--            </v-col>-->
<!--          </v-row>-->
<!--          <v-row class="text-left">-->
<!--            <v-col>-->
<!--              <strong>-->
<!--                МОЛ:-->
<!--              </strong>-->
<!--            </v-col>-->
<!--            <v-col v-if="!invoiceToPrivateIndividual">-->
<!--              {{ customer.invoiceDetails === '' ? customer.firstname : (customer.invoiceDetails ? customer.invoiceDetails.mol : '') }}-->
<!--            </v-col>-->
<!--            <v-col v-if="invoiceToPrivateIndividual">-->
<!--              {{ customer.firstname }} {{ customer.lastname}}-->
<!--            </v-col>-->
<!--          </v-row>-->
<!--          <v-row class="text-left">-->
<!--            <v-col>-->
<!--              <strong>-->
<!--                Телефон:-->
<!--              </strong>-->
<!--            </v-col>-->
<!--            <v-col>-->
<!--              {{ customer.invoiceDetails === '' ? customer.firstname : (customer.invoiceDetails ? customer.invoiceDetails.phone : '-') }}-->
<!--            </v-col>-->
<!--          </v-row>-->
          </div>
        </v-card-body>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import Multiselect from 'vue-multiselect'
import Vue from 'vue'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import axios from 'axios';

Vue.use(require('vue-moment'))

export default {
  name: 'InvoiceHeader',
  mixins: [validationMixin],
  components: {
    Multiselect,
  },
  data () {
    return {
      invoiceToPrivateIndividual: false,
      invoiceType: null,
      paymentMethod: null,
      paymentOptions: this.$store.state.paymentOptions,
      invoiceTypes: [
        {
          value: 'taxInvoice',
          text: 'Данъчна фактура'
        },
        {
          value: 'creditNote',
          text: 'Кредитно известие'
        },
        {
          value: 'debitNote',
          text: 'Дебитно известие'
        },
        {
          value: 'proforma',
          text: 'Проформа известие'
        }
      ],
      invoiceDate: this.$moment().format('YYYY-MM-DD'),
      companies: [],
      deliveryCompany: {},
      customer: '',
      customers: []

    }
  },
  created() {
    this.getPatientsAsCustomers();
  },
  mounted () {
    if (this.$store.state.invoiceDate === null || this.$store.state.invoiceDate === undefined) {
      this.$store.dispatch('setInvoiceDate', this.$moment().format('YYYY-MM-DD'))
    }
    axios.get('/api/firms')
         .then(
            (data) => {
              let mape = {}
              data.data.map(val => {
                mape.id = val.id
                mape.alias = val.alias ? val.alias : null
                mape.name = val.name
                mape.address = val.address
                mape.city = val.city
                mape.bulstat = val.eik
                mape.vatRegistration = val.vat_registration
                mape.phone = val.phone
                mape.mol = val.mol
                this.companies.push(mape)
                mape = {}
              })
            }
        );

    // set date into store
    if (this.$store.state.invoiceDate === null) {
      this.$store.dispatch('setInvoiceDate', this.invoiceDate)
    }

    // also paymentMethod
    if (this.$store.state.paymentMethod === null) {
      this.$store.dispatch('setPaymentMethod', this.$store.state.paymentOptions[0].value)
    }
    // also documentType
    if (this.$store.state.invoiceType === null) {
      this.$store.dispatch('setDocumentType', this.invoiceTypes[0].value)
      this.invoiceType = this.invoiceTypes.find(value => value.value === 'taxInvoice')
    }
  },
  methods: {
    onInputChange() {

    },
    selectHandler() {

    },
    clickHandler() {

    },

    getPatientsAsCustomers() {
      axios.get(`/api/patients`)
          .then(
              (data) => {
                this.customers = data.data
                console.log(data.data)
              }
          )
    },
    customLabel ({ firstname, lastname }) {
      return `${firstname} ${lastname}`
    }
  },
  validations: {
    invoiceDate: {
      required
    },
    invoiceType: {
      required
    },
    customer: {
      required
    }
  },
  watch: {
    invoiceType (value) {
      this.$store.dispatch('setDocumentType', this.invoiceTypes.find(value1 => value1.value === value))
      this.invoiceType = this.invoiceTypes.find(value1 => value1.value === value)
      // console.log(this.$store.state)
    },
    invoiceDate (value) {
      // console.log(value)
      this.$store.dispatch('setInvoiceDate', this.$moment(value).format('DD.MM.Y'))
    },
    paymentMethod () {
      this.$store.dispatch('setPaymentMethod', this.paymentMethod)
    },
    customer () {
      this.$store.commit('setCustomer', this.customer)
    },
    deliveryCompany(value) {
      this.$store.state.invoice.invoiceCompany = value
    },
    invoiceToPrivateIndividual (value) {
      this.$store.commit('setInvoiceType', value)
    }
  }
}
</script>

<style scoped>
.tree-view-item {
  color: #35495E;
  size: 18px;
  text-align: left;
  white-space: pre-wrap;
  box-sizing: inherit;
  font-family: monaco, monospace;
  font-size: 14px;
  margin-left: 18px;
}
</style>
