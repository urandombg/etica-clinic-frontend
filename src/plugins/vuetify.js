import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import bg from 'vuetify/lib/locale/bg'
Vue.use(Vuetify);

export default new Vuetify({
    lang: {
        locales: {
            bg
        },
        current: 'bg'
    }
});
