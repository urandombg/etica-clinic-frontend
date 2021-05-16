<template>
<div>
  <v-container fluid>
    <v-card>
      <v-card-title>
        <h2>
          Създаване на нова процедура
        </h2>
      </v-card-title>
      <v-card-text>
        <v-form lazy-validation
                ref="procedureForm">
          <v-row>
            <v-col cols="12">
              <v-select :items="categories"
                        filled
                        eager
                        :rules="rules.category"
                        v-model="procedure.category"
                        label="Категория">

              </v-select>
            </v-col>
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
            <v-col cols="2">
              <v-text-field v-model="procedure.measure"
                            :rules="rules.measure"
                            label="Мярка">

              </v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field label="Ед. цена"
                            :rules="rules.priceRule"
                            v-model="procedure.unitPrice"></v-text-field>
            </v-col>
          </v-row>

          <v-row no-gutters>
            <v-col>
              <v-btn block
                     @click="validateForm()"
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
        <pre>
          {{ procedure }}
        </pre>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</div>
</template>

<script>
// const url = process.env.VUE_APP_REMOTE_SERVER_HOST_IP;
export default {
  name: "CreateNewProcedure",
  data () {
    return {
      categories: [
        {
          text: 'Физиотерапия',
          value: 'Физиотерапия'
        },
        {
          text: 'Дентална медицина',
          value: 'Дентална медицина'
        },
        {
          text: 'Кардиология',
          value: 'Кардиология'
        },
        {
          text: 'Кинезитерапия',
          value: 'Кинезитерапия'
        },
        {
          text: 'Масажни процедури',
          value: 'Масажни процедури'
        },
        {
          text: 'Физикална терапия',
          value: 'Физикална терапия'
        },
        {
          text: 'Ортопедия',
          value: 'Ортопедия'
        },
        {
          text: 'ВИСОКОСПЕЦИАЛИЗИРАНА ТЕРАПИЯ',
          value: 'ВИСОКОСПЕЦИАЛИЗИРАНА ТЕРАПИЯ'
        },
      ],
      procedure: {
        code: null,
        title: null,
        measure: null,
        unitPrice: null,
        category: null,
        // description: null,
      },
      formIsValid: true,
      rules: {
        titleRule: [
          v => !!v || 'Това поле е задължително',
          ],
        priceRule: [
          v => !!v || 'Това поле е задължително',
          ],
        category: [
            v => !!v || 'Моля, избери категория в която да се запише тази процедура!'
        ],
        measure: [
            v => !!v || 'Моля, посочете мярка!'
        ],

        }
      }
    },
  mounted() {

  },
  methods: {
    validateForm() {
      // this.$refs.procedureForm.
      this.$refs.procedureForm.validate()
      this.saveProcedure();
    },
    saveProcedure() {
      if (this.formIsValid === true) {
        this.$http.post(`/api/procedures`, this.procedure)
            .then(
                (data) => {
                  console.log(data.status)
                  if (data.status === 200) {
                    this.procedure = {
                      code: null,
                      title: null,
                      measure: null,
                      unitPrice: null,
                      category: null,
                      description: null,
                    }
                    this.$router.push('/procedures');
                  }
                }
            )
            .catch((error) => {
              this.$swal.fire({
                icon: "error",
                text: `${error}`
              })
            });
      }
    },
    destroyProcedure() {

    }
  }
}
</script>

<style scoped>

</style>