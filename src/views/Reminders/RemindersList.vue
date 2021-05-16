<template>
<div>
  <v-card>
    <v-card-title class="info white--text">
      <v-icon color="white" x-large>
        mdi-clock
      </v-icon>
      <h1 class="display-1">Напомняния:</h1>
    </v-card-title>
    <v-card-text>
      <v-simple-table dark v-if="reminders.length > 0">
        <thead>
        <tr>
          <th>№</th>
          <th>Напомняне на</th>
          <th>Съобщение</th>
          <th>Известяване чрез</th>
          <th>Честота</th>
          <th>Известие до</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(reminder, indexKey) in reminders" :key="indexKey">
          <td>
            {{ indexKey + 1}}
          </td>
          <td>{{ reminder.remind_on }}</td>
          <td>{{ reminder.message }}</td>
          <td>
            {{ JSON.parse(reminder.type_of_reminder)}}
          </td>
          <td>
            {{ reminder.reminder_frequency}}
          </td>
          <td>
            {{ reminder.recipients_notify}}
          </td>
        </tr>
        </tbody>
      </v-simple-table>
      <br>
      <v-alert
          v-if="reminders.length <= 0"
          border="bottom"
          colored-border
          type="info"
          elevation="2"
      >
        Няма налични записи!
      </v-alert>
      <v-card-actions>
        {{ this.patientId}}
        <v-btn outlined block color="info" :loading="loading" @click="dialog = true">
          <v-icon>
            mdi-pencil
          </v-icon>
          Добави напомняне
        </v-btn>
      </v-card-actions>
    </v-card-text>
  </v-card>
  <v-dialog       v-model="dialog"
                  light
                  transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar
          dark
          color="primary"
      >
        <v-btn
            icon
            dark
            @click="dialog = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>
          <v-icon>
            mdi-calendar
          </v-icon>
          Създаване на ново напомняне</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn
              rounded
              color="green"
              @click="createReminder"
          >
            <v-icon>
              mdi-disk
            </v-icon>
            Запази напомнянето
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text>
        <reminder-form doctor-id="0" patient-id="5"></reminder-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</div>
</template>

<script>
import axios from 'axios';
import ReminderForm from "@/views/Reminders/ReminderForm";
const apiAddress = 'http://192.168.69.17/api';

export default {
name: "ReminderList",
  props: ['patient_id'],
  components: {ReminderForm},
  data () {
    return {
      loading: false,
      dialog: false,
      reminders: [],
      patientId: 5
    }
  },
  methods: {
    getAllRemindersForPatient() {
      axios.get(`${apiAddress}/patients/${this.patientId}/reminders`)
          .then(
              (data) => {
                this.loading = true
                this.reminders = data.data
                this.loading = false
              }
          )
          .catch(
              (err) => {
                console.log(err)
              }
          )
    },
    createReminder(){
      this.dialog = true
      this.$emit('createReminderForPatient', 'fokewf')
      this.$root.$emit('createReminderForPatient', true)
    }
  },
  mounted() {
    this.getAllRemindersForPatient(5);
  },

}
</script>

<style scoped>

</style>