<template>
<v-container fluid>
  <v-btn @click="$router.go(-1)" shaped color="blue white--text">
    <v-icon>
      mdi-arrow-left
    </v-icon>
    Върни се назад
  </v-btn>
  <v-container fluid>
    <v-row>
      <v-col v-for="(neurologist, key) in doctors"
             cols="12"
             md="6"
             xl="6"
             :key="key">
        <v-card shaped :key="neurologist.id"
                @click="currentSpecialist = neurologist"
                :class="currentSpecialist === neurologist ? 'cyan white--text' : 'grey accent-3 white--text'">
          <v-card-title>
           <span v-if="neurologist"> {{ getFullSpecialist(neurologist) }}</span>
          </v-card-title>
          <v-card-text>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <v-row no-gutters v-if="currentSpecialist">
    <v-col cols="12" class="elevation-4">
      <v-row dense>
        <v-col cols="8" style="border-bottom: 14px solid #00babb">
          <h1 style="padding: 10px;" class="align-lg-baseline">
            В момента се показва графикът на  <span>{{ getFullSpecialist(currentSpecialist) }}</span>
          </h1>
        </v-col>
        <v-col cols="4" style="border-bottom: 14px solid #00babb; bottom: 0;">
        </v-col>
      </v-row>
     <v-row>
       <v-col cols="12">
         <kendo-scheduler :date="date"
                          ref="kda"
                          :data-source="remoteDataSource()"
                          :showWorkHours="true"
                          :workDayStart="workDayStart"
                          :workDayEnd="workDayEnd"
                          :date-header-template="headerDayTemplate"
                          :mobile="true"
                          :event-template="eventTemplate"
                          @onAdd="onAdd"
                          @edit="logchange"
                          @navigate="onNavigate">
           <kendo-scheduler-view :type="'day'"></kendo-scheduler-view>
           <kendo-scheduler-view :type="'workWeek'" :selected="true"></kendo-scheduler-view>
           <kendo-scheduler-view :type="'month'"></kendo-scheduler-view>
           <kendo-scheduler-view :type="'agenda'"></kendo-scheduler-view>
         </kendo-scheduler>
       </v-col>
     </v-row>
    </v-col>
  </v-row>
  <v-dialog v-model="eventDialog">
    <v-card>
      <v-form>
        <v-text-field label="Име на пациента"></v-text-field>
        <v-text-field label="ПРеглед за"></v-text-field>
        <v-btn @click="onAdd">submit</v-btn>
      </v-form>
    </v-card>
  </v-dialog>

</v-container>

</template>

<script>
// const url = process.env.VUE_APP_REMOTE_SERVER_HOST_IP;
import kendo from '@progress/kendo-ui'
import '@progress/kendo-ui/js/messages/kendo.messages.bg-BG'
import '@progress/kendo-ui/js/cultures/kendo.culture.bg-BG'
import {KendoScheduler, KendoSchedulerView} from '@progress/kendo-scheduler-vue-wrapper'

kendo.culture('bg-BG');

export default {
  name: "SpecialistSchedule",
  components: {
    'kendo-scheduler': KendoScheduler,
    'kendo-scheduler-view': KendoSchedulerView,
  },
  data() {
    return {
      eventDialog: false,
      currentSpecialist: null,
      currentDoctor: null,
      secondCalDate: this.$moment().toDate(),
      keyForSchedule: 0,
      date: this.$moment().toDate(),
      workDayStart: new Date(2020, 10, 10, 8, 0, 0),
      workDayEnd: new Date(2020, 10, 10, 19, 0, 0),
      doctors: [],
      eventTemplate: `<div class="#: title.toLowerCase().includes('лазер') ? 'red' : title #">#: kendo.toString(start, "HH:mm")  #  -  #: kendo.toString(end, "HH:mm") #
          <span>| #: title #</span></div>`,
      headerDayTemplate: '<span>#=kendo.toString(date, \'dddd, dd.mM\')#</span>',
      workingHours: {
        start: this.$moment(),
        // end: this.$
      },
      schema: {
        model: {
          id: "id",
          fields: {
            id: {from: "id", type: "number"},
            title: {from: "Title", validation: {required: true, validationMessage: 'Това поле е задължително! Напиши поне име на пациент'}},
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
    this.getDoctors()
  },
  methods: {
    onAdd(av) {
      console.log(av)
      this.remoteDataSource().add({
        ded: "da"
      })
    },
    logchange(e) {
console.log('eeeeeeee,', e)

    },
    remoteDataSource() {
      // console.log(this.currentSpecialist)
      let roomId = this.currentSpecialist.roomId
      let doctorId = this.currentSpecialist.id
      let schedule = this.roomId
      return new kendo.data.SchedulerDataSource({
        transport: {
          read: {
            url: `/api/schedules/getAppointments/${this.currentSpecialist.id}`,
            method: 'GET',
            dataType: 'json',
          },
          update: {
            url: `/api/schedules/updateRecord/${roomId}`,
            method: 'POST',
            dataType: 'json',
          },
          create: {
            url: `/api/schedules/createAndBlockEventForSpecialists/${doctorId}/${roomId}/${schedule}`,
            method: 'POST',
            dataType: 'json',
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
    onNavigate(e) {
      console.log(this.$refs.kda)
      this.keyForSchedule +=1
      this.secondCalDate = e.date
    },
    fullName(item) {
      return `Д-р ${item.firstname} ${item.lastname}`
    },
    getDoctors() {
      this.$http.get(`/api/schedules/getOrthoSchedule`)
      .then(
          (data) => {
            this.doctors = data.data
          }
      ).catch(
          (error) => {
            this.$swal.fire({
              icon: 'error',
              text: `Проблем при извличането на данни от базата данни - ${error}`
            })
          }
      )
    },
    getFullSpecialist(specialist) {
      if (specialist.affiliation_after) {
        return `${specialist.affiliation_before} ${specialist.firstname} ${specialist.lastname} ${specialist.affiliation_after}`
      }
      else {
        return `${specialist.affiliation_before} ${specialist.firstname} ${specialist.lastname}`
      }
      // return `Somethings is not right here!!! Check DB`;
    }
  },
  watch: {
    currentSpecialist(v) {
      this.currentDoctor = this.doctors.find(d => d.id === v)
      console.log(v)
      // this.$http.get(`/api/schedules/getAppointments/${this.currentSpecialist.id}`)
      //     .then((data) => {
      //       console.log(data.data)
      //     })
    },
  },
}
</script>

<style>
.movie-template {
  background-color: #34b034;
  color: #fafafa;
  height: 100%;
}

</style>