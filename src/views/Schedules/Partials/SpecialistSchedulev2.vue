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
      <v-col v-for="(physiotherapist, key) in doctors" :key="key">
        <v-card shaped :key="physiotherapist.id"
                @click="currentSpecialist = physiotherapist"
                :class="currentSpecialist === physiotherapist ? 'cyan white--text' : 'grey accent-3 white--text'">
          <v-card-title>
            {{physiotherapist.affiliation_before}} {{ physiotherapist.firstname }} {{ physiotherapist.lastname }} {{ physiotherapist.affiliation_after }}
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
            В момента се показва графикът на д-р {{ currentSpecialist.firstname }} {{ currentSpecialist.lastname }}
          </h1>
        </v-col>
        <v-col cols="4" style="border-bottom: 14px solid #00babb; bottom: 0;">
<!--          <img src="@/assets/doctors/janet.png" alt="Д-р Думанова" style="float: right; bottom: 0"/>-->
        </v-col>
      </v-row>
     <v-row>
       <v-col cols="12">
         <kendo-scheduler :date="date"
                          ref="kda"
                          :data-source="remoteDataSource()"
                          :showWorkHours="true"
                          :date-header-template="headerDayTemplate"
                          :majorTick="15"
                          :mobile="true"
                          locale="bg"
                          :event-template="eventTemplate"
                          @navigate="onNavigate">
           <kendo-scheduler-view :type="'day'"></kendo-scheduler-view>
           <kendo-scheduler-view :type="'workWeek'"></kendo-scheduler-view>
           <kendo-scheduler-view :type="'month'"></kendo-scheduler-view>
           <kendo-scheduler-view :type="'agenda'"></kendo-scheduler-view>
         </kendo-scheduler>
       </v-col>
     </v-row>
    </v-col>
  </v-row>
</v-container>
</template>

<script>
// import Vue from 'vue';
// const url = process.env.VUE_APP_REMOTE_SERVER_HOST_IP;
import kendo from '@progress/kendo-ui'
import '@progress/kendo-ui/js/messages/kendo.messages.bg-BG'
import '@progress/kendo-ui/js/cultures/kendo.culture.bg-BG';
import {load} from "@telerik/kendo-intl";

const {KendoSchedulerView} = require("@progress/kendo-scheduler-vue-wrapper");

const {KendoScheduler} = require("@progress/kendo-scheduler-vue-wrapper");
// Vue.use(KendoScheduler)
load(
    require("cldr-data/supplemental/likelySubtags.json"),
    require("cldr-data/supplemental/currencyData.json"),
    require("cldr-data/supplemental/weekData.json"),

    require("cldr-data/main/bg/numbers.json"),
    require("cldr-data/main/bg/currencies.json"),
    require("cldr-data/main/bg/ca-gregorian.json"),
    require("cldr-data/main/bg/dateFields.json"),

    require("cldr-data/main/bg/timeZoneNames.json"))

kendo.culture('bg-BG')

export default {
  name: "SpecialistSchedule",
  components: {
    'kendo-scheduler': KendoScheduler,
    'kendo-scheduler-view': KendoSchedulerView,
  },
  data() {
    return {
      currentSpecialist: null,
      currentDoctor: null,
      secondCalDate: this.$moment().toDate(),
      keyForSchedule: 0,
      date: this.$moment().toDate(),
      workDayStart: new Date(2020,10,10, 9,30,0),
      workDayEnd: new Date(2020,10,10, 14,30,0),
      doctors: [],
      eventTemplate: `<div class="#: title.toLowerCase().includes('лазер') ? 'red' : title #">#: kendo.toString(start, "hh:mm")  #  -  #: kendo.toString(end, "hh:mm") #
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
            physicianId: {from: "physicianId"},
          }
        },
      },
    }
  },
  mounted() {
    this.getDoctors()
  },
  methods: {
    remoteDataSource() {
      // console.log(this.currentSpecialist)
      let roomId = 0
      let doctorId = this.currentSpecialist.id
      let schedule = 1
      return new kendo.data.SchedulerDataSource({
        transport: {
          read: {
            url: `/api/schedules/getAppointments/${this.currentSpecialist.id}`,
            method: 'GET',
            dataType: 'json',
          },
          update: {
            url: `/api/schedules/updateRecord/0`,
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
    // specializedProceduresSchedule() {
    //   let roomId = this.currentDoctor.roomId
    //   let doctorId = this.currentSpecialist
    //   let schedule = 1
    //   return new kendo.data.SchedulerDataSource({
    //     transport: {
    //       read: {
    //         url: `/api/schedules/getAppointments/${doctorId}`,
    //         method: 'GET',
    //         dataType: 'json',
    //
    //       },
    //       update: {
    //         url: `/api/schedules/updateRecord/0`,
    //         method: 'POST',
    //         dataType: 'json'
    //       },
    //       create: {
    //         url: `/api/schedules/createAndBlockEventForSpecialists/${doctorId}/${roomId}/${schedule}`,
    //         method: 'POST',
    //         dataType: 'json'
    //       },
    //       // destroy: {
    //       //   url: `https://demos.telerik.com/kendo-ui/service/tasks/destroy`,
    //       //   dataType: 'jsonp'
    //       // }
    //     },
    //     batch: true,
    //     schemaModelId: "id",
    //     schema: this.schema,
    //   })
    // },
    onNavigate(e) {
      console.log(this.$refs.kda)
      this.keyForSchedule +=1
      this.secondCalDate = e.date
    },
    fullName(item) {
      return `Д-р ${item.firstname} ${item.lastname}`
    },
    getDoctors() {
      this.$http.get(`/api/schedules/getPhysiotherapistSchedule`)
      .then(
          (data) => {
            // console.log(data.data)
            this.doctors = data.data
          }
      )
    }
  },
  watch: {
    currentSpecialist(v) {
      this.currentDoctor = this.doctors.find(d => d.id === v)
      // console.log(v)
    }
  }
}
</script>

<style>
.movie-template {
  background-color: #34b034;
  color: #fafafa;
  height: 100%;
}

</style>