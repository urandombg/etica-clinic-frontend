<template>
<div>
  <autocomplete :search="search"
                ref="mkbSearch"
                placeholder="Търси в диагноза в МКБ-10."
                :key="klok"
                @keypress.enter="unhandledExcpt"
                @submit="handleSubmit"
                :get-result-value="getResultValue">
    <template #result="{ result, props }">
      <li
          v-bind="props"
          class="autocomplete-result wiki-result"
      >
        <div>
          <strong>{{ result.code }}</strong> {{ result.name }}
          <p>
            {{ result.name_latin }}
            <br>
            <strong>секция: </strong> кодиране: <u>{{ result.icd_set.codes }}</u> - {{ result.icd_set.name }}
          </p>
        </div>
      </li>
    </template>
    <template #no-results="{ res, props}">
      nqma res {{ res }} {{ props }}
    </template>
  </autocomplete>
  <br>
  <v-btn @click="addDiagnoseToList" color="info" large block>
    Добави диагноза
  </v-btn>
</div>
</template>

<script>
import Vue from 'vue';
// import axios from 'axios';
import Autocomplete from '@trevoreyre/autocomplete-vue'
import '@trevoreyre/autocomplete-vue/dist/style.css'

Vue.use(Autocomplete)
export default {
  name: "MkbMain",
  components: {
    Autocomplete
  },
  data () {
    return {
      klok: 0,
      items: [],
      chosenDiagnoses: [],
      diagnose: '',
      isLoading: false
    }

  },
  mounted() {
    // this.getRoot()
  },

  methods: {
    unhandledExcpt() {
      this.$swal.fire({
        icon: 'info',
        text: 'Възможността за избор с бутон Enter ще бъде имплементирана по-късно. За сега е възможност избор на диагноса само с левия бутон на мишката.',
        timer: 3900
      })
     this.klok++;
    },
    handleSubmit(value) {
      this.diagnose = value
      value = null
    },
    addDiagnoseToList() {
      if (!this.diagnose) {
        alert("Try again");
      } else {
        this.chosenDiagnoses.push(this.diagnose)
        this.$emit('addDiagnose',this.diagnose)
        this.klok++;
      }
    },
    getResultValue(result) {
      return `${result.code} ${result.name}`
    },

    search(val) {
      // Items have already been loaded
      // const url = `https://mediately.co/api/v4/icd/bg/?query=${val}`

      return new Promise(resolve => {
        if (val.length < 3) {
          return resolve([])
        }

       setTimeout(() => {
         this.isLoading = true

         this.$http.post(`/api/mkb`, {
           q: val
         })
         .then(
             (data) => {
               resolve(data.data)
             }
         )

       }, 500)
        this.isLoading = false
      })

    }
  },
  watch: {
      // search(val) {
      //   // Items have already been loaded
      //   if (this.items.length > 0) return
      //
      //   this.isLoading = true
      //     axios.get(`https://mediately.co/api/v4/icd/bg/?query=${val}`)
      //         .then(res => {
      //             this.items = res.data
      //         })
      //         .catch(err => {
      //           console.log(err)
      //         })
      //         .finally(() => (this.isLoading = false))
      // }
  }
}
</script>

<style scoped>
.autocomplete-input {
  font-size: 24px;
}
.autocomplete-result-list {
  font-size: 24px;
}

</style>