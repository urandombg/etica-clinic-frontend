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
<!--      <v-select v-model="selectedDentist"-->
<!--                :items="dentists"-->
<!--                solo-inverted-->
<!--                :item-text="dentistFullName"-->
<!--                item-value="id">-->

<!--      </v-select>-->
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
                       :mobile="true"
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
</v-container>
</template>

<script>
// const url = process.env.VUE_APP_REMOTE_SERVER_HOST_IP;
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
      scheduleInteractionKey: 0,
      dentists: [],
      selectedDentist: null,
      date: this.$moment().toDate(),
      workDayStart: new Date(2020, 10, 10, 8, 0, 0),
      workDayEnd: new Date(2020, 10, 10, 19, 0, 0),
      doctors: [],
      eventTemplate: `<div>#: kendo.toString(start, "H:mm")  #  -
            #: kendo.toString(end, "H:mm") #<span> | #: title #</span> <span> - </span></div>`,
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
            isAllDay: {type: "boolean", from: "IsAllDay"},
            description: {from: "Description"},
            recurrenceId: {from: "RecurrenceID"},
            recurrenceRule: {from: "RecurrenceRule"},
            recurrenceException: {from: "RecurrenceException"},
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

<style>
.ots {
  background-color: #faf;
}
</style>