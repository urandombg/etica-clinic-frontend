import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import kendo from '@progress/kendo-ui';
import {load} from '@telerik/kendo-intl';
import '@progress/kendo-ui/js/messages/kendo.messages.bg-BG.js'
import VueSweetalert2 from 'vue-sweetalert2';
import axios from 'axios';
import 'sweetalert2/dist/sweetalert2.min.css';
Vue.use(VueSweetalert2);
import moment from 'moment';

Vue.use(moment);
/*
* AXIOS HEADERS NEEDED FOR CORS ORIGIN REQUEST
 */
Vue.prototype.$http = axios;
Vue.prototype.$moment = moment;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['Access-Control-Allow-Headers'] = 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
axios.defaults.headers.common['Allow'] = 'GET, POST, PUT, DELETE, OPTIONS, HEAD';

if (store.state.apiKey) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${store.state.apiKey}`
}
load(
    require("cldr-data/supplemental/likelySubtags.json"),
    require("cldr-data/supplemental/currencyData.json"),
    require("cldr-data/supplemental/weekData.json"),

    require("cldr-data/main/bg/numbers.json"),
    require("cldr-data/main/bg/currencies.json"),
    require("cldr-data/main/bg/ca-gregorian.json"),
    require("cldr-data/main/bg/dateFields.json"),

    require("cldr-data/main/bg/timeZoneNames.json"))

Vue.use(kendo)

kendo.culture('bg-BG');

Vue.config.productionTip = false

new Vue({
  router,
  store,
  moment,
  vuetify,
  render: h => h(App),
  computed: {
    /**
     * @see https://medium.com/@pratheekhegde/displaying-application-breadcrumbs-in-vue-js-85456dc8a370
     */
    breadCrumbs () {
      let pathArray = this.$route.path.split('/')
      pathArray.shift()
      const breadCrumbs = []
      // needed to handle the intermediary entries for nested vue routes
      let breadcrumb = ''
      let lastIndexFound = 0
      for (let i = 0; i < pathArray.length; ++i) {
        breadcrumb = `${breadcrumb}${'/'}${pathArray[i]}`
        if (this.$route.matched[i] &&
            Object.hasOwnProperty.call(this.$route.matched[i], 'meta') &&
            Object.hasOwnProperty.call(this.$route.matched[i].meta, 'breadCrumb')) {
          breadCrumbs.push({
            href: i !== 0 && pathArray[i - (i - lastIndexFound)]
                ? '/' + pathArray[i - (i - lastIndexFound)] + breadcrumb
                : breadcrumb,
            disabled: i + 1 === pathArray.length,
            text: this.$route.matched[i].meta.breadCrumb || pathArray[i]
          })
          lastIndexFound = i
          breadcrumb = ''
        }
      }
      return breadCrumbs
    }
  }
}).$mount('#app');
