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
            {{ physiotherapist.firstname }} {{ physiotherapist.lastname }}
          </v-card-title>
          <v-card-text>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <v-col class="cyan">
  </v-col>
<!--  {{ currentSpecialist }}-->
  <v-row no-gutters v-if="currentSpecialist" :key="keyForSchedule">
    <v-col cols="12" class="elevation-4">
      <h2 style="padding: 10px">
     В момента се показва графикът на д-р {{ currentSpecialist.firstname }} {{ currentSpecialist.lastname }}
      </h2>

    </v-col>
    <v-col cols="12">
      <ejs-schedule :key="keyForSchedule"
                    height="760px"
                    ref="sce"
                    :workDays="scheduler.workDays"
                    :fields="scheduler.fields"
                    :eventSettings="scheduler"
                    v-if="currentSpecialist"
                    :locale="'bg'">

      </ejs-schedule>
    </v-col>
  </v-row>
</v-container>
</template>

<script>
import Vue from 'vue';
import { DataManager, ODataV4Adaptor } from '@syncfusion/ej2-data';
import { L10n } from '@syncfusion/ej2-base';

import { SchedulePlugin, Day, Week, WorkWeek, Month, Agenda,DragAndDrop,Resize } from '@syncfusion/ej2-vue-schedule';

// const url = process.env.VUE_APP_REMOTE_SERVER_HOST_IP;
Vue.use(SchedulePlugin);
import { loadCldr} from '@syncfusion/ej2-base';
import messages from './SchedulerTranslationMessages.json';
loadCldr(
    require('cldr-data/supplemental/numberingSystems.json'),
    require('cldr-data/main/bg/ca-gregorian.json'),
    require('cldr-data/main/bg/numbers.json'),
    require('cldr-data/main/bg/timeZoneNames.json')
);
L10n.load(messages)
export default {
  name: "SpecialistSchedule3",
  props: ['id'],
  provide: {
    schedule: [Day, Week, WorkWeek, Month, Agenda,DragAndDrop,Resize],
  },
  // beforeMount() {
  //   // this.idx =
  //   this.scheduler.dataSource = new DataManager({
  //     url: `/api/schedules/getAppointments/${this.$route.params.id}`, // 'controller/actions',
  //     requestType: 'GET',
  //     crudUrl: '/api/schedules/crud',
  //     adaptor: new UrlAdaptor()
  //   })
  // },
  // components: {SingleSchedulerSkeleton},
  data() {
    return {
      currentSpecialist: null,
      currentDoctor: null,
      keyForSchedule: 0,
      doctors: [],
      scheduler: {
        allowResizing: true,
        workDays: [1, 3, 5],
        // dataSource: this.initScheduler(1),
        fields: {
          id: 'id',
          subject: { name: 'Title' },
          startTime: { name: 'Start' },
          endTime: { name: 'End' },
          roomId: { name: 'room_id'}
        },

        workHours: {
          highlight: true,
          start: '07:00',
          end: '19:00'
        },
      },
      // eventTemplate: `<div class="#: title.toLowerCase().includes('лазер') ? 'red' : title #">#: kendo.toString(start, "hh:mm")  #  -  #: kendo.toString(end, "hh:mm") #
      //     <span>| #: title #</span></div>`,
      // headerDayTemplate: '<span>#=kendo.toString(date, \'ddd, dd.mM\')#</span>',
      workingHours: {
        start: this.$moment(),
        // end: this.$
      },
    }
  },
  mounted() {
    this.getDoctors()
  },
  methods: {
    // initScheduler(id) {
    //   // let dt  = new DataManager({
    //   //   url: 'https://ej2services.syncfusion.com/production/web-services/api/Schedule',
    //   //   adaptor: new ODataV4Adaptor(),
    //   //   crossDomain: true
    //   // });
    //   // let dt = new DataManager({
    //   //   url: `/api/schedules/crud/${id}`, // 'controller/actions',
    //   //   requestType: 'GET',
    //   //   crudUrl: `/api/schedules/crud/${id}`,
    //   //   adaptor: new UrlAdaptor()
    //   // })
    //
    //   return dt
    // },
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

      this.$nextTick(() => {

        this.scheduler.dataSource = new DataManager({
          url: `/api/schedules/getAppointments/${v.id}`,
          adaptor: new ODataV4Adaptor(),
          crossDomain: true,
          insertUrl: 'insertIRL'
        });

        this.keyForSchedule++;
      });
      // this.$forceUpdate()
    }
  }
}
</script>

<style>

@import '~@syncfusion/ej2-base/styles/bootstrap4.css';
@import '~@syncfusion/ej2-buttons/styles/bootstrap4.css';
@import '~@syncfusion/ej2-calendars/styles/bootstrap4.css';
@import '~@syncfusion/ej2-dropdowns/styles/bootstrap4.css';
@import '~@syncfusion/ej2-inputs/styles/bootstrap4.css';
@import '~@syncfusion/ej2-navigations/styles/bootstrap4.css';
@import '~@syncfusion/ej2-popups/styles/bootstrap4.css';
@import '~@syncfusion/ej2-vue-schedule/styles/bootstrap4.css';
</style>
