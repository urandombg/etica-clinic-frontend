<template>
<v-container fluid>
  <v-btn @click="$router.go(-1)" shaped color="blue white--text">
    <v-icon>
      mdi-arrow-left
    </v-icon>
    Върни се назад
  </v-btn>
  <v-row>
    <v-col v-if="selectedDentist" :key="scheduleInteractionKey" cols="12">
      <h2 class="elevation-4 display-1" style="padding: 15px;">
        График на д-р {{ selectedDentist.firstname }} {{ selectedDentist.lastname }}
      </h2>
      <kendo-scheduler :date="date"
                       :data-source="orthoScheduler()"
                       :workDayStart="workDayStart"
                       :workDayEnd="workDayEnd"
                       :showWorkHours="true"
                       :mobile="true"
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
import '@progress/kendo-ui/js/cultures/kendo.culture.bg-BG'
import kendo from '@progress/kendo-ui'
import {KendoScheduler, KendoSchedulerView} from '@progress/kendo-scheduler-vue-wrapper'

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
      orthos: [],
      selectedDentist: { "id": 9, "firstname": "Димитър", "middlename": null, "lastname": "Стаматов", "mobile": "1089715", "email": "Лекар по дентална медицина", "speciality":
            "Ортопедия", "roomId": 6, "created_at": null, "updated_at": "2021-04-02 07:19:45", "affiliation_before": "Д-р", "affiliation_after": null }
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
    this.$http.get(`/api/schedules/getOrthoSchedule`)
    .then(
        (data) => {
          this.orthos = data.data
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
      var ds = this.orthoScheduler()
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
    orthoScheduler() {
      // console.log(this.selectedDentist)
      let roomId = this.selectedDentist.roomId
      let doctorId = this.selectedDentist.id
      let schedule = 1
      console.log(roomId)
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
  },
  watch: {
    selectedDentist() {
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