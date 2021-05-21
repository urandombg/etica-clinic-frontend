<template>
<div>
  <autocomplete :search="search"
                ref="mkbSearch"
                placeholder="Търси диагноза в МКБ-10."
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
            <strong>секция: </strong> <i style="color: #212020"><u>{{ result.icd_set.codes }}</u> - {{ result.icd_set.name }}</i>
          </p>
        </div>
      </li>
    </template>
    <template #no-results="{ res, props}">
      Няма намерени резултати! {{ res }} {{ props }}
    </template>
  </autocomplete>
  <br>
  <v-btn @click="addDiagnoseToList"
         color="info"
         :disabled="disableSearch"
         large
         block>
    <v-icon>
      mdi-plus
    </v-icon>
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
      disableSearch: false,
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
      this.handleSubmit(this.diagnose)
    },
    handleSubmit(value) {
      this.diagnose = value
      value = null

    },
    addDiagnoseToList() {
      if (!this.diagnose) {
        this.$swal.fire({
          icon: 'warning',
          text: 'Моля, изберете диагноза за въвеждане!'
        })
      } else {
        // this.chosenDiagnoses.push(this.diagnose)
        this.$emit('addDiagnose',this.diagnose)
        this.klok++;
        this.diagnose = null
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