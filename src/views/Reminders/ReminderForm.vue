<template>
<div>
    <div v-if="selectedTemplate.length > 0">
      Ще напомня на
      <strong>
        {{ $moment(reminder.remind_on).format('DD.MM.YYYY') }}
      </strong>, на {{ reminder.recipients_notify }} със следното съобщение
      <div v-if="selectedTemplate.length > 0 || customMessage">
        <v-card>
          <v-card-title class="grey lighten-4 black--text">
             Съдържание на съобщението:
          </v-card-title>
          <v-card-text style="margin:10px; font-size: 19px; font-style: italic" v-if="customMessage">
            {{ (messageTemplates.find(el => el.value === selectedTemplate).textTemplate) }}
          </v-card-text>
          <v-card-text v-else>
            {{ reminder.message}}
          </v-card-text>
        </v-card>
      </div>
    </div>
    <v-form>
        <v-select v-model="reminder.type_of_reminder"
                  label="Как да напомня?"
                  :items="reminder_types"
                  multiple
                  outlined
                  item-text="text"
                  value="value"></v-select>
        <v-spacer></v-spacer>
        <v-select v-model="reminder.recipients_notify"
                  item-text="text"
                  item-value="value"
                  multiple
                  label="На кого да напомня"
                  :items="recipients"
        ></v-select>
        <v-menu
            v-model="showDatePicker"
            :close-on-content-click="false"
            :nudge-right="140"
            offset-y
            min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
                v-model="reminder.remind_on"
                label="Кога да напомня"
                readonly
                v-bind="attrs"
                v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
              v-model="reminder.remind_on"
              locale="bg"
              show-current
              show-adjacent-months
              show-week
              year-icon="mdi-calendar-blank"
              prev-icon="mdi-skip-previous"
              next-icon="mdi-skip-next"
              @input="showDatePicker = false"
          ></v-date-picker>
        </v-menu>
        <v-select :items="messageTemplates"
                  v-model="selectedTemplate"
                  shaped
                  label="Какво да напомня?"
                  item-value="value"
                  item-text="text">
        </v-select>
        <v-textarea
            name="message"
            v-if="customMessage"
            label="Съобщение"
            :disabled="true"
            :value="(typeof messageTemplates.find(el => el.value === selectedTemplate) === 'object') ? messageTemplates.find(el => el.value === selectedTemplate).textTemplate : ''"
        >

        </v-textarea>
        <v-textarea
            name="message"
            v-model="reminder.message"
            v-else
            label="Напишете Вашето съобщение тук"
        >

        </v-textarea>
      </v-form>
    <pre>
      {{ reminder }}
      {{ createReminder}}
    </pre>
</div>
</template>

<script>
export default {
name: "ReminderForm",
  props: ['patientId','doctorId'],
  data () {
    return {
      showDatePicker: false,
      customMessage: false,
      createReminder: false,
      selectedTemplate: '',
      messageTemplates: [
        {
          text: 'Контролен преглед',
          value: 'followUp',
          textTemplate: `Здравейте, Рангел! Клиника Етика се грижи за здравето на нашите пациенти и с това съобщение искаме да Ви поканим на безплатен контролен преглед при нас. Можете да запишете час, от този линк или да се обадите на  0700 900 700.`
        },
        {
          text: 'Да прави комплекса от упражнения',
          value: 'homeWork',
          textTemplate: ''
        },
        {
          text: 'Друго съобщение',
          value: 'customMessage',
          textTemplate: ''
        },
      ],
      reminder_types: [
        {
          text: 'SMS',
          value: 'sms'
        },
        {
          text: 'Имейл',
          value: 'email'
        },
        {
          text: 'Телефонно обаждане',
          value: 'phoneCall'
        },
        {
          text: 'Само като запис в досието',
          value: 'disableAllNotifications'
        },
      ],
      recipients: [
        {
          text: 'Лекар и клиничен персонал',
          value: 'doctor'
        },
        {
          text: 'Пациент',
          value: 'pacient'
        },
      ],
      reminder: {
        type_of_reminder: '',
        remind_on: this.$moment().format('Y-MM-DD'),
        reminder_frequency: '',
        message: '',
        recipients_notify: '',
      },
    }
  },
  methods: {
    saveReminder(){
      console.log('fxfx')
    }
  },
  updated() {
    console.log(this.$props.evt)
  },
  mounted() {

  },
  watch: {
    selectedTemplate (x) {
      console.log(x)
      if(this.selectedTemplate !== null)  {
        this.reminder.message = this.messageTemplates.find(el => el.value === this.selectedTemplate).textTemplate
      }
      else {
        this.customMessage = true
      }
    }
  }

}
</script>

<style scoped>

</style>