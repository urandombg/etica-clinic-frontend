import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import createPersistedState from "vuex-persistedstate";

const state = {
  invoice: {
    invoiceCompany: {},
    paymentMethod: null,
    paymentOptions: [
      {
        value: 'cash',
        text: 'в брой'
      },
      {
        value: 'card',
        text: 'с кредитна/дебитна карта'
      },
      {
        value: 'wireTransfer',
        text: 'Банков трансфер'
      }
    ],
    invoiceType: null,
    invoiceDate: null,
    customer: {},
    items: [],
    subtotal: 0,
    vatAmount: 0,
    total: 0
  },
  patientExam: {
    anamnesa: '',
    leading_mkb: '',
    sheet_number: 0,
    date: null,
    objectCondition: '',
    mainDiagnose: '',
    visitType: '',
    diagnosys: [],
    procedures: [],
    patient: {},
    status: 'open'
  },
  abandonedExams: [],
  paymentOptions: [
    {
      value: 'cash',
      text: 'в брой'
    },
    {
      value: 'card',
      text: 'с кредитна/дебитна карта'
    },
    {
      value: 'wireTransfer',
      text: 'Банков трансфер'
    }
  ],
  isAuthenticated: false,
  apiKey: null
}


const mutations = {
  resetPatientExamForm(state) {
    state.patientExam = {
      anamnesa: '',
      leading_mkb: '',
      sheet_number: 0,
      date: null,
      objectCondition: '',
      mainDiagnose: '',
      visitType: '',
      diagnosys: [],
      procedures: [],
      patient: {},
      status: 'open'
    }
  },
  setApiKey(state, payload) {
    state.apiKey = payload
  },
  invoiceCompnay (state, payload) {
    state.invoice.invoiceCompany = payload
  },
  setCustomer (state, payload) {
    state.invoice.customer = payload
  },
  invoiceDate (state, payload) {
    state.invoice.invoiceDate = payload
  },
  setItems (state, payload) {
    state.invoice.items = payload
    // console.log(state.items)
  },
  setInvoiceType (context, payload) {
    context.invoice.customer.privateInvoice = payload
  },
  pushItemToItems (state, payload) {
    state.invoice.items.push(payload)
  },
  setSubtotal(state, payload) {
    state.invoice.subtotal = payload
  },
  setVatAmount(state, payload) {
    state.invoice.vatAmount = payload
  },
  setTotal(state, payload) {
    state.invoice.total = payload
  },
  paymentMethod (state, payload) {
    state.invoice.paymentMethod = payload
  },
  invoiceType (state, payload) {
    state.invoice.invoiceType = payload
  },
  /*
  * Exam form Mutations
  * */
  setExamDate(state, payload) {
    state.patientExam.date = payload
  },
  setAnamnesa(state, payload) {
    state.patientExam.anamnesa = payload
  },
  setDiagnosys(state, payload) {
    state.patientExam.diagnosys = payload
  },
  setObjectCondition(state, payload) {
    state.patientExam.objectCondition = payload
  },
  setPatientExamStatus(state, payload) {
    state.patientExam.status = payload
  },
  setPatientProcedures(state, payload) {
    state.patientExam.procedures = payload
  },
  setPatientDetails(state, payload) {
    state.patientExam.patient = payload
  },
  setPatientVisitType(state, payload) {
    state.patientExam.visitType = payload
  },

}
const actions = {
  // setApiKeyToStore(context, payload) {
  //     context.commit('setApiKey',payload)
  // },
  setDocumentType (context, payload) {
    context.commit('invoiceType', payload)
  },
  setInvoiceDate (context, payload) {
    context.commit('invoiceDate', payload)
  },
  setPaymentMethod (context, payload) {
    context.commit('paymentMethod', payload)
  },
  addItemToItems (context, payload) {
    context.commit('pushItemToItems', payload)
  },
  removeDiagnoseFromPatientExamCard(context, payload) {
    let arrayElement = context.state.patientExam.diagnosys;
    if (arrayElement.indexOf(payload !== -1)) {
      arrayElement.splice(arrayElement.indexOf(payload), 1);
    }
    else {
      return `Something's went wrong with deleting!`
    }
  },

  // changeInvoiceCompanyProperty (context) {
  //   // context.customer.
  // }
}

export default new Vuex.Store({
  state,
  actions,
  mutations,
  plugins: [createPersistedState()]
})
