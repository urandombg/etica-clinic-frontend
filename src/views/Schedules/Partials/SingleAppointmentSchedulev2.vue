<template>
<v-container fluid>
  <v-btn @click="$router.go(-1)" shaped color="blue white--text">
    <v-icon>
      mdi-arrow-left
    </v-icon>
    Върни се назад
  </v-btn>
  <h1 class="display-1">
    График стоматологични кабинети
  </h1>
  <v-row>
    <v-col cols="12">
    </v-col>
    <v-col cols="12">
      Лекари по дентална медицина:
    </v-col>
    <v-col v-for="(dentist, key) in dentists" :key="dentist.firstname" cols="3">
      <v-card @click="selectedDentist = dentist" :key="key" :class="selectedDentist === dentist ? 'cyan white--text' : 'grey accent-3 white--text'" shaped>
        <v-card-title>
          Д-р {{ dentist.firstname }} {{ dentist.lastname }}
        </v-card-title>
      </v-card>
    </v-col>
    <v-col v-if="selectedDentist" :key="scheduleInteractionKey" cols="12">
      <h2 class="elevation-4 display-1" style="padding: 15px;">
        График на д-р {{ selectedDentist.firstname }} {{ selectedDentist.lastname }}
      </h2>
      <kendo-scheduler :date="date"
                       :data-source="dentistScheduler()"
                       :workDayStart="workDayStart"
                       :workDayEnd="workDayEnd"
                       :showWorkHours="true"
                       @add="logList"
                       @onSave="saveEvent"
                       :date-header-template="headerDayTemplate"
                       :majorTimeHeaderTemplate="majorTimeHeaderTemplate"
                       :event-template="eventTemplate"
                       :key="scheduleInteractionKey"
                       >
        <kendo-scheduler-view :type="'day'" ></kendo-scheduler-view>
        <kendo-scheduler-view :type="'workWeek'" :selected="true"></kendo-scheduler-view>
        <kendo-scheduler-view :type="'month'"></kendo-scheduler-view>
        <kendo-scheduler-view :type="'agenda'"></kendo-scheduler-view>
      </kendo-scheduler>
    </v-col>
  </v-row>
  <v-dialog fullscreen
            hide-overlay
            v-model="eventFormDialog">
    <v-toolbar
        dark
        color="primary"
    >
      <v-btn
          icon
          dark
          @click="eventFormDialog = false"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title>Settings</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn
            color="green"
            @click="eventFormDialog = false"
        >
          <v-icon>
            mdi-plus
          </v-icon>
          Резервирай
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-card>
      <v-card-title>title</v-card-title>
      {{ time }}
      <v-card-text>
        <v-time-picker
            v-model="time"
            :allowed-hours="allowedHours"
            :allowed-minutes="allowedMinutes"
            class="mt-4"
            format="24hr"
            scrollable
            min="9:30"
            max="22:15"
        ></v-time-picker>
        <v-time-picker
            v-model="time"
            :allowed-hours="allowedHours"
            :allowed-minutes="allowedMinutes"
            class="mt-4"
            format="24hr"
            scrollable
            min="9:30"
            max="22:15"
        ></v-time-picker>
        <v-btn @click="saveEvent">
          Save
        </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</v-container>
</template>

<script>
// const url = process.env.VUE_APP_REMOTE_SERVER_HOST_IP;
import '@progress/kendo-ui/js/messages/kendo.messages.bg-BG'
import '@progress/kendo-ui/js/cultures/kendo.culture.bg-BG';

import kendo from '@progress/kendo-ui'
import {KendoScheduler, KendoSchedulerView} from '@progress/kendo-scheduler-vue-wrapper'

kendo.culture('bg-BG')

export default {
name: "SingleAppointmentSchedule",
  components: {
    'kendo-scheduler': KendoScheduler,
    'kendo-scheduler-view': KendoSchedulerView,
  },
  data() {
    return {
      allowedHours: null,
      allowedMinutes: null,
      time: null,
      eventFormDialog: false,
      scheduleInteractionKey: 0,
      dentists: [],
      selectedDentist: { "id": 13, "firstname": "Деян", "middlename": null, "lastname": "Йорданов", "mobile": "1089715", "email": "Лекар по дентална медицина", "speciality": "Лекар по дентална медицина", "roomId": 10, "created_at": null, "updated_at": "2021-04-02 07:19:45", "affiliation_before": "Д-р", "affiliation_after": null }
      ,
      date: this.$moment().toDate(),
      workDayStart: new Date(2020, 10, 10, 8, 0, 0),
      workDayEnd: new Date(2020, 10, 10, 19, 0, 0),
      doctors: [],
      eventTemplate: '<div class="k.event.modified">#: kendo.toString(start, "H:mm")  #  -  #: kendo.toString(end, "H:mm") #' +
          '<span> | #: title #</span> <span> - </span></div>',
      headerDayTemplate: '<span>#=kendo.toString(date, \'dddd, dd.mM\')#</span>',
      majorTimeHeaderTemplate: '<span>#=kendo.toString(date, \'HH:mm\')#</span>',
      workingHours: {
        start: this.$moment(),
        // end: this.$
      },
      schema: {
        model: {
          id: "id",
          fields: {
            id: {from: "id", type: "number"},
            title: {
              from: "Title",
              validation: {required: true, validationMessage: 'Това поле е задължително! Напиши поне име на пациент'}
            },
            start: {type: "date", from: "Start"},
            end: {type: "date", from: "End"},
            startTimezone: {from: "StartTimezone"},
            description: {from: "Description"},
            recurrenceId: {from: "RecurrenceID"},
            recurrenceRule: {from: "RecurrenceRule"},
            recurrenceException: {from: "RecurrenceException"},
            isAllDay: {type: "boolean", from: "IsAllDay"},
            roomId: {from: "room_id"},
            doctorId: {from: "doctor_id"},
          }
        },
      },
    }
  },
  mounted() {
    this.$http.get(`/api/schedules/getDentistsSchedule`)
    .then(
        (data) => {
          this.dentists = data.data
        }
    )
  },
  methods: {
    saveEvent() {
      let eventData = {
        title: 'mama',
        start: new Date(2021,2,29, 8,15),
        end: new Date(2021,2,29, 8,45),
      }
      var ds = this.dentistScheduler()
      ds.add(eventData)
      ds.sync();
      this.eventFormDialog = false
      ds.read()
    },
    logList(ev) {
      ev.preventDefault();
      this.eventFormDialog = true
      
      console.log(ev)
    },
    onNavigate(e) {
      console.log(e)
      this.scheduleInteractionKey +=1
      this.date = e.date
    },
    dentistScheduler() {
      // console.log(this.selectedDentist)
      let roomId = this.selectedDentist.roomId
      let doctorId = this.selectedDentist.id
      let schedule = 1
      return new kendo.data.SchedulerDataSource({
        transport: {
          read: {
            url: `/api/schedules/getAppointments/${doctorId}`,
            method: 'GET',
            dataType: 'json'
          },
          update: {
            url: `/api/schedules/updateRecord/0`,
            method: 'POST',
            dataType: 'json'
          },
          create: {
            url: `/api/schedules/createAndBlockEventForSpecialists/${doctorId}/${roomId}/${schedule}`,
            method: 'POST',
            dataType: 'json'
          },
          destroy: {
            url: `/api/schedules/destroyAppointment`,
            method: 'POST',
            dataType: 'json'
          }
        },
        batch: true,
        schemaModelId: "id",
        schema: this.schema,
      })
    },
    dentistName(id) {
      let name = null
       this.dentists.find(dentist => {
        if (dentist.id === id) {
          name = `${dentist.firstname} ${dentist.lastname}`
        }
      })
      return name
    },
    dentistFullName(dentist) {
      return `Д-р ${dentist.firstname} ${dentist.lastname}`
    }
  },
  watch: {
    selectedDentist() {
      // console.log()
      // console.log(this.selectedDentist)
      // this.dentistScheduler()
      this.scheduleInteractionKey +=1
    },
    date (value) {
      console.log('date', value)
    }
  }
}
</script>

<style scoped>
.cok {

}
</style>