<template>
<v-container>
<h1>
 Преглед на потребителски профил
</h1>
<!--  <u><i><span v-if="userData.name">{{ userData.email }}, {{ userData.name}}</span></i></u>-->
  <v-form :disabled="!editing">
    <v-text-field  v-model="userData.email" disabled label="Потребителско име:"></v-text-field>
    <v-text-field  v-model="userData.name" label="Име на потребителя:"></v-text-field>
    <v-row>
      <v-col>
        <v-btn @click="editing = true" v-if="!editing" :disabled="editing" color="info" large block>
          <v-icon>
            mdi-pen
          </v-icon>
          Редактирай
        </v-btn>
        <v-btn v-if="editing" block color="green" large class="white--text" @click="saveChanges">
          Запази промените
        </v-btn>
      </v-col>
      <v-col>
        <v-btn @click="editing = false"
              block
               class="white--text"
               :disabled="!editing"
               color="red" large>
          <v-icon>
            mdi-close
          </v-icon>
          Отказ
        </v-btn>
      </v-col>
    </v-row>
  </v-form>

  <v-overlay v-if="isLoading">
    <v-progress-circular indeterminate>Зареждане на данни. Моля, изчакайте!</v-progress-circular>
  </v-overlay>
</v-container>
</template>

<script>
export default {
  name: "ViewUser",
  data() {
    return {
      editing: false,
      userData: '',
      isLoading: false
    };
  },

  mounted() {
    let confToken = "";

    if (localStorage.getItem('api_token')) {
      confToken = localStorage.getItem('api_token');
    }
    let axiConf = {
      headers: {
        Authorization: `Bearer ${confToken}`
      }
    }

    this.isLoading = true
    // todo implement auth header
    if (this.$route.params.id) {
      let id = this.$route.params.id
      this.$http.get(`/api/users/${id}`, axiConf)
      .then(
        (data) => {
          // console.log(data.data)
          this.userData = data.data
        }
      )
      .catch(
        (error) => {
          // console.log(error.response.data.message)
          if (error.response.data.message === "Unauthenticated.") {
            this.$router.push(`/login`)
          }
        }
      )
      .finally(() => {
        this.isLoading = false
      })
    }
    else {
      this.$router.push(`/users`)
    }
  },
  methods: {
    saveChanges() {
      this.$http.put(`/api/users/${this.userData.id}`)
      .then(
        (data) => {
          console.log(data)
        }
      )
    }
  }
}
</script>

<style scoped>

</style>
