<template>
<v-container fluid>
  <v-card>
    <v-card-title>
      Потребители
    </v-card-title>
    <v-card-text>
      <v-data-table :items="users" :headers="headers">
        <template v-slot:item.actions="{item}">
          <v-btn color="green" @click="$router.push(`/users/${item.id}`)">
            {{ item.id }}
            Отвори
          </v-btn>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</v-container>
</template>

<script>
export default {
name: "Users",
  data () {
    return {
      users: [],
      errors: [],
      headers: [
        {
          text: 'Потребителско име',
          value: 'email',
          sortable: false
        },
        {
          text: 'Име',
          value: 'name',
          sortable: false
        },
        {
          text: 'ниво на достъп',
          sortable: false,
          value: 'roles'
        },
        {
          text: 'специалност',
          value: 'specialty',
          sortable: false
        },
        {
          text: '',
          sortable: false,
          value: 'actions'
        },
      ],
      isLoading: false
    };
  },
  mounted() {
    // let confToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvYXBwLmV0aWNhLmNlbnRlclwvYXBpXC9sb2dpbiIsImlhdCI6MTYxNTQ2NDg0MCwiZXhwIjoxNjE1NDY4NDQwLCJuYmYiOjE2MTU0NjQ4NDAsImp0aSI6ImM2elVSY2ZSSm9aUVB1aWUiLCJzdWIiOjEsInBydiI6Ijg3ZTBhZjFlZjlmZDE1ODEyZmRlYzk3MTUzYTE0ZTBiMDQ3NTQ2YWEifQ.AgbjK0JUznQqnCsxq863oTBnMyeLyR6gEcrU9BlohkY";
    let confToken = "";

    if (localStorage.getItem('api_token')) {
      confToken = localStorage.getItem('api_token');
    }
    let axiConf = {
      headers: {
        Authorization: `Bearer ${confToken}`
      }
    }
    this.$axios.get('/api/users', axiConf)
    .then(
        (users) => {
          // console.log(users.data.users)
          this.users = users.data.users
        }
    )
    .catch(
        (errors) => {
          this.errors.push(errors)
        }
    )
  }
}
</script>

<style scoped>

</style>
