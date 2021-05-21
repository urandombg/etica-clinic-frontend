<template>
<v-container>
<!--  <v-overlay v-show="!overlayShow">-->
<!--    <v-progress-circular indeterminate size="350">-->
<!--      Зарежда. Моля, изчакайте!-->
<!--    </v-progress-circular>-->

<!--  </v-overlay>-->
  <v-card>
    <v-card-title class="info white--text">
      Вход в системата
    </v-card-title>
    <v-card-text>
      <br>
      <v-alert type="error" color="red" v-if="showMessage" dismissible>
        <span v-if="message.data.error === 'Unauthorized'">
          Грешно потребителско име или парола
        </span>
        <span v-else>
          Фатална грешка! - {{ message }}
        </span>
      </v-alert>
      <v-form>
        <v-row>
          <v-col cols="12">
            <v-text-field label="Потребителско име" v-model="email">
            </v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field type="password" label="Парола" v-model="password">
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn block color="info" @click="login()" height="50">
              Вход
              <v-icon>
                mdi-login
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
  <br>
</v-container>
</template>

<script>
// const url = process.env.VUE_APP_REMOTE_SERVER_HOST_IP;

// import axios from 'axios'
export default {
name: "Login",
  data () {
    return {
      email: '',
      password: '',
      showMessage: false,
      message: '',
      overlayShow: true,
      name: '',
      password_confirmation: ''
    }
  },
  methods: {
    login() {
      // let self = this;
      // console.log(url)
        this.$http.post(`/api/login`, {
          email: this.email,
          password: this.password
        })
          .then(
              (data) => {
                this.$store.commit('setApiKey', data.data.access_token)
                localStorage.setItem('apiKey', data.data.access_token)
                this.$router.push('/dashboard')
              }
          )
      .catch(
          (error) => {
            this.showMessage = true
            this.message = error.response
          }
      )
      // this.overlayShow = false
      // self.overlayShow = true
      // axios.post(  `${url}/api/login`, {
      //   headers: {
      //     Authorization: `Bearer ${localStorage.getItem('api_token')}`,
      //     "Access-Control-Allow-Headers": "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range",
      //     'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      //     'Access-Control-Allow-Origin': '*',
      //     'Allow': 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
      //     'Access-Control-Expose-Headers': 'Content-Length,Content-Range'
      //   },
      //   email: self.email,
      //   password: self.password,
      // }).then(function (response) {
      //   self.email = '';
      //   self.password = '';
      //   console.log(response.data.access_token)
      //   let token = response.data.access_token
      //   this.$store.commit('setApiKeyToStore',token)
      // })
      // .catch(function (error) {
      //   self.message = 'Incorrect E-mail or password';
      //   self.showMessage = true;
      //   // console.log(error);
      //   self.message = error.response
      //   // console.log(error.response.status)
      // })
      // // .finally(() => {
      // //   if (localStorage.getItem("api_token").length >0) {
      // //     this.$router.push('/');
      // //     this.overlayShow = false
      // //   }
      // // })

    },
    // register() {
    //   var self = this;
    //   axios.post(  '/api/register', {
    //     headers: {
    //       Authorization: `Bearer ${localStorage.getItem('api_token')}`,
    //
    //       "Access-Control-Allow-Headers": "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range",
    //       'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    //       'Access-Control-Allow-Origin': 'https://app.etica.center',
    //       'Allow': 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
    //       'Access-Control-Expose-Headers': 'Content-Length,Content-Range'
    //     },
    //     name: self.name,
    //     email: self.email,
    //     password: self.password,
    //     password_confirmation: self.password_confirmation
    //   }).then(function (response) {
    //     self.name = '';
    //     self.email = '';
    //     self.password = '';
    //     self.password_confirmation = '';
    //     console.log(response);
    //   })
    //       .catch(function (error) {
    //         console.log(error);
    //       });
    //
    // }
  },
  mounted() {
    // console.log(this.$http.defaults.headers.common)
  }
}
</script>

<style scoped>

</style>
