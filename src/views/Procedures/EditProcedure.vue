<template>
<div>
  edit procedure {{ record}}
  <v-form @submit.prevent="validateForm()" ref="procedureForm">
    <v-row>
      <v-col cols="2">
        <v-text-field label="Код" v-model="procedure.code"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field label="Наименование"
                      required
                      :rules="rules.titleRule"
                      v-model="procedure.title">

        </v-text-field>
      </v-col>
      <v-col cols="12">
        <v-textarea color="blue"
                    clearable
                    v-model="procedure.description"
                    label="Описание"
                    rows="3">
        </v-textarea>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-text-field label="Ед. цена"
                      :rules="rules.titleRule"
                      v-model="procedure.unitPrice"></v-text-field>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col>
        <v-btn block
               @click="updateProcedure(procedure.id)"
               color="green white--text">
          <v-icon>
            mdi-upload
          </v-icon>
          Запиши
        </v-btn>
      </v-col>
      <v-col>
        <v-btn block
               @click="destroyProcedure()"
               color="red accent-3 white--text">
          <v-icon>
            mdi-close
          </v-icon>
          Откажи
        </v-btn>
      </v-col>
    </v-row>

  </v-form>
</div>
</template>

<script>
export default {
  name: "EditProcedure",
  data () {
    return {
      formIsValid: true,
      record: null,
      procedure: {
        id: null,
        code: '',
        title: '',
        unitPrice:'',
        category: ''
      },
      rules: {
        titleRule: [
          v => !!v || 'Това поле е задължително',
        ]
      },
      procedureId: null
    }
  },
  mounted() {
    if (!this.$route.params.id) {
      this.$router.push('/procedures');
    }
    else {
      this.procedureId = this.$route.params.id
    }
    this.getProcedure(this.$route.params.id);
  },
  methods: {
    getProcedure(id) {
      this.$http.get(`/api/procedures/${id}`)
      .then(
          (data) => {
            this.procedure.id = data.data.id
            this.procedure.code = data.data.code
            this.procedure.title = data.data.title
            this.procedure.unitPrice = data.data.unit_price
            this.procedure.measure = data.data.measure
            this.procedure.category = data.data.category
          }
      )
      .catch(
          (error) => {
            console.log(error)
          }
      )
    },
    validateForm() {
      this.$refs.procedureForm.validate()
    },
    updateProcedure(id) {
      this.validateForm();
      if (this.formIsValid) {
        this.$http.put(`/api/procedures/${id}`, this.procedure)
            .then(
                (data) => {
                  console.log(data.status)
                  if (data.status === 200) {
                    this.procedure = {
                      code: null,
                      title: null,
                      measure: 'бр.',
                      unitPrice: null,
                      category: 'null',
                      description: null,
                    }
                    this.$router.push('/procedures');
                  }
                }
            )
            .catch((error) => {
              console.log('error ', error)
            });
      }
    },
  }
}
</script>

<style scoped>

</style>