<template>
  <v-app>
    <v-app-bar
        app
        color="dark"
        dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" ></v-app-bar-nav-icon>
      <div class="d-flex align-center">
        <v-img
            class="shrink mr-2"
            contain
            src="./assets/eti.png"
            transition="scale-transition"
            width="123"
            style="box-shadow: 6px 5px 15px #343232"
        />
      </div>
      <v-spacer></v-spacer>
      <h2>
        {{ $route.name }}
      </h2>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-navigation-drawer
        v-model="drawer"
        absolute
        class="elevation-14"
        style="z-index: 9999999"
    >
      <v-list
          nav
      >
        <v-list-item-group
            active-class="blue--text text--accent-4"
        >
          <v-list-item href="/dashboard" @click="drawer = !drawer">
            <v-list-item-title>
              <v-icon>
                mdi-monitor-dashboard
              </v-icon>
              Табло
            </v-list-item-title>
          </v-list-item>
          <v-list-item href="/patients" @click="drawer = !drawer">
            <v-list-item-title>
              <v-icon>
                mdi-account-multiple
              </v-icon>
              Пациенти
            </v-list-item-title>
          </v-list-item>
          <v-list-item href="/login" @click="drawer = !drawer">
            <v-list-item-title>
              <v-icon>
                mdi-login
              </v-icon>
              Вход
            </v-list-item-title>
          </v-list-item>

        </v-list-item-group>
      </v-list>
      <v-btn block @click="drawer = !drawer">
        <v-icon>
          mdi-arrow-left
        </v-icon>

        Затвори това меню
      </v-btn>
    </v-navigation-drawer>

    <v-main>
      <v-row class="light-blue lighten-5 elevation-2">
        <v-breadcrumbs
            :items="breadCrumbs"
            large
        >
          <template v-slot:item="props">
            <router-link :to="props.item.href" v-if="!props.item.disabled">
              <v-breadcrumbs-item
                  :class="[props.item.disabled && 'disabled']"
              >
                {{ props.item.text }}
              </v-breadcrumbs-item>
            </router-link>
            <v-breadcrumbs-item
                :class="[props.item.disabled && 'disabled']"
                v-else
            >
              {{ props.item.text }} {{$route.meta.name ? $route.meta.name : '' }}
            </v-breadcrumbs-item>
          </template>
        </v-breadcrumbs>
      </v-row>
      <ParentContainer/>
    </v-main>
  </v-app>
</template>

<script>
import ParentContainer from "@/views/ParentContainer";
export default {
  name: 'App',

  components: {
    ParentContainer

  },
  data () {
    return {
      value: 'recent',
      items: [
        {
          text: 'Dashboard',
          disabled: false,
          href: '#',
        },
        {
          text: 'Link 1',
          disabled: false,
          href: '#',
        },
        {
          text: 'Link 2',
          disabled: true,
          href: '#',
        },
      ],
      drawer: false,
      mini: true,
      axiosHeaders: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('api_token')}`
        }
      }
    }
  },
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
};
</script>