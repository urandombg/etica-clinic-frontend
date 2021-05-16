<template>
<div>
  <v-container>
    {{ tabs }}
  </v-container>
  <v-container>
    <v-card>
      <v-toolbar
          color="teal accent-4"
          >
        <template v-slot:extension>
          <v-tabs
              v-model="currentItem"
              grow
              slider-size="3"
              slider-color="green"
          >
            <v-tab
                v-for="item in tabItems"
                :key="item.alias"
                ripple
                active-class="white darken-1"
                :href="'#tab-' + item.alias"
            >
              <v-icon  dense size="40">
                {{ item.icon }}
              </v-icon>
              {{ item.text }}
            </v-tab>
          </v-tabs>
        </template>
      </v-toolbar>
      <v-tabs-items v-model="currentItem">
        <v-tab-item
            v-for="item in tabItems"
            :key="item.alias"
            :value="'tab-' + item.alias"
        >
          <v-card flat>
            <v-card-text>
              <h2>{{ item.text }}</h2>
                {{ text }}
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-container>
  <v-container>
    <v-card>
      <v-card-text>
        <v-tabs v-model="tabs" grow background-color="transparent">
          <v-tab active-class="white" href="#tab-ra">
            <v-icon color="primary" dense size="40">mdi-doctor</v-icon>
            <span>
              ПРЕГЛЕДИ
            </span>
          </v-tab>
          <v-tab active-class="white" href="#tab-zabolqvaniq">
            <v-icon>
              mdi-bug
            </v-icon>
            Заболявания

          </v-tab>
          <v-tab active-class="white">
            <v-icon>
              mdi-files
            </v-icon>
            Файлове / медия
          </v-tab>
          <v-tab active-class="white">
            <v-icon>
              mdi-bug
            </v-icon>
            Бележки
          </v-tab>
          <v-tab>
            Текущи сметки
          </v-tab>

          <v-tabs-items v-model="tabs">
            <v-tab-item value="#tab-ra">
              <v-tabs color="indigo darken-1" active-class="light-blue lighten-5" grow>
                <v-tab>Частни прегледи</v-tab>
                <v-tab>
                  <v-badge offset-x="5" offset-y="10" content="4" color="cyan" bordered>
                    НЗОК прегледи
                  </v-badge>
                </v-tab>
                <v-tab-item>
                  <v-card elevation="9">
                    <v-card-title class="display-1">
                      Текущи
                    </v-card-title>
                  </v-card>
                  <v-card-text>
                    <v-data-table :items="[]">
                      <template #no-data>
                        <h1 class="display-1" style="color: orangered">
                          Няма данни
                        </h1>
                      </template>
                    </v-data-table>
                  </v-card-text>
                  <v-card elevation="9" color="cyan lighten-2">
                    <v-card-title class="align-center white--text display-1">
                      Предишни
                    </v-card-title>
                  </v-card>
                  <v-card-text>
                    <v-data-table :items="[]"
                                  :headers="medicalRecrodsHeader"
                                  show-expand
                                  single-expand
                                  item-key="id">
                      <template #expanded-item="{item}">
                        <td :colspan="medicalRecrodsHeader.length + 2">
                          <v-card elevation="24" rounded>
                            <v-card-title>
                              Данни от
                              <span>
                                 <strong> {{item.type_of_visit}}</strong>
                               </span>
                            </v-card-title>
                            <v-card-text>
                              <v-row>
                                <v-col cols="6" order-md="6" class="cyan lighten-4" style="font-size: 19px">
                                  <strong>
                                    Анамнеза:
                                  </strong><br>
                                  <p>
                                    {{ item.anamnesa }}
                                  </p>
                                </v-col>
                                <v-col cols="6" class="cyan lighten-1" style="font-size: 19px">
                                  <strong>
                                    Обективно състояние:
                                  </strong><br>
                                  <p>
                                    {{ item.obj_condition }}
                                  </p>
                                </v-col>
                              </v-row>
                              <br><br><br>
                              <v-row>
                                <br>
                                <v-col cols="12">
                                  <v-simple-table dark fixed-header>
                                    <template v-slot:default>
                                      <thead>
                                      <tr>
                                        <th class="text-left">
                                          Код
                                        </th>
                                        <th class="text-left">
                                          Наименование на процедурата
                                        </th>
                                        <th class="text-left">
                                          Брой процедури
                                        </th>
                                      </tr>
                                      </thead>
                                      <tbody>
                                      <tr
                                          style="border: 10px #faf solid"
                                          v-for="item in item.procedures"
                                          :key="item.title"
                                      >
                                        <td>{{ item.code }}</td>
                                        <td>{{ item.title }}</td>
                                        <td>{{ item.qty }}</td>
                                      </tr>
                                      </tbody>
                                    </template>
                                  </v-simple-table>
                                </v-col>
                              </v-row>
                            </v-card-text>
                          </v-card>
                        </td>
                      </template>
                      <template #item.status="{item}">
                        <div v-if="item.status === 'closed'" class="text-right">
                          Приключен
                          <v-icon color="green" x-large >
                            mdi-check
                          </v-icon>
                        </div>
                        <div v-else class="text-right">
                          Отворен
                          <v-icon v-if="item.status !== 'closed'" x-large color="orange">
                            mdi-clock
                          </v-icon>
                        </div>
                      </template>
                    </v-data-table>
                  </v-card-text>
                  <!--                   <v-stepper v-model="e1">-->
                  <!--                     <v-stepper-header>-->
                  <!--                       <v-stepper-step-->
                  <!--                           :complete="e1 > 1"-->
                  <!--                           step="1"-->
                  <!--                       >-->
                  <!--                        Преглед-->
                  <!--                       </v-stepper-step>-->

                  <!--                       <v-divider></v-divider>-->

                  <!--                       <v-stepper-step-->
                  <!--                           :complete="e1 > 2"-->
                  <!--                           step="2"-->
                  <!--                       >-->
                  <!--                         Назначаване на процедури-->
                  <!--                       </v-stepper-step>-->

                  <!--                       <v-divider></v-divider>-->

                  <!--                       <v-stepper-step step="3">-->
                  <!--                         Записване на часове-->
                  <!--                       </v-stepper-step>-->
                  <!--                     </v-stepper-header>-->

                  <!--                     <v-stepper-items>-->
                  <!--                       <v-stepper-content step="1">-->
                  <!--                         <v-card-->
                  <!--                             class="mb-12 elevation-7"-->
                  <!--                             height="200px"-->
                  <!--                         >-->
                  <!--                           <v-card-text>-->
                  <!--                             lele-->
                  <!--                           </v-card-text>-->

                  <!--                         </v-card>-->

                  <!--                         <v-btn-->
                  <!--                             color="primary"-->
                  <!--                             @click="e1 = 2"-->
                  <!--                         >-->
                  <!--                           Напред-->
                  <!--                         </v-btn>-->

                  <!--                         <v-btn text>-->
                  <!--                           Отказ-->
                  <!--                         </v-btn>-->
                  <!--                       </v-stepper-content>-->

                  <!--                       <v-stepper-content step="2">-->
                  <!--                         <v-card-->
                  <!--                             class="mb-12"-->
                  <!--                             color="grey lighten-1"-->
                  <!--                             height="200px"-->
                  <!--                         >-->
                  <!--                           <v-card-text></v-card-text>-->
                  <!--                         </v-card>-->

                  <!--                         <v-btn-->
                  <!--                             color="primary"-->
                  <!--                             @click="e1 = 3"-->
                  <!--                         >-->
                  <!--                           Напред-->
                  <!--                         </v-btn>-->

                  <!--                         <v-btn text @click="e1 = 1">-->
                  <!--                           Назад-->
                  <!--                         </v-btn>-->
                  <!--                       </v-stepper-content>-->

                  <!--                       <v-stepper-content step="3">-->
                  <!--                         <v-card-->
                  <!--                             class="mb-12"-->
                  <!--                             color="grey lighten-1"-->
                  <!--                             height="200px"-->
                  <!--                         ></v-card>-->

                  <!--                         <v-btn-->
                  <!--                             color="primary"-->
                  <!--                             @click="e1 = 1"-->
                  <!--                         >-->
                  <!--                           Continue-->
                  <!--                         </v-btn>-->

                  <!--                         <v-btn text @click="e1 = 2">-->
                  <!--                           Върни се при "Назначаване на процедури"-->
                  <!--                         </v-btn>-->
                  <!--                       </v-stepper-content>-->
                  <!--                     </v-stepper-items>-->
                  <!--                   </v-stepper>-->
                </v-tab-item>
                <v-tab-item>
                </v-tab-item>
              </v-tabs>
            </v-tab-item>
            <v-tab-item>
              <v-card>
                <v-card-title class="text-center">
                  <h1 class="display-1 text-center">
                    ЗАБОЛЯВАНИЯ
                  </h1>
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col>
                    <span class="display-2 display-block">
                      Алергий:
                    </span>
                      <v-list outlined rounded elevation="4">
                        <v-list-item>--
                          <v-list-item-content>
                            <v-list-item-title>Single-line item</v-list-item-title>
                            <v-list-item-title>Single-line item</v-list-item-title>
                            <v-list-item-title>Single-line item</v-list-item-title>
                            <v-list-item-title>Single-line item</v-list-item-title>
                            <v-list-item-title>Single-line item</v-list-item-title>
                            <v-list-item-title>Single-line item</v-list-item-title>
                            <v-list-item-title>Single-line item</v-list-item-title>
                            <v-list-item-title>Single-line item</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-col>
                    <v-col>
                    <span class="display-2 display-block">
                      Заболявания
                    </span>
                      <v-list outlined rounded elevation="4">
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title>Single-line item</v-list-item-title>
                            <v-list-item-title>Single-line item</v-list-item-title>
                            <v-list-item-title>Single-line item</v-list-item-title>
                            <v-list-item-title>Single-line item</v-list-item-title>
                            <v-list-item-title>Single-line item</v-list-item-title>
                            <v-list-item-title>Single-line item</v-list-item-title>
                            <v-list-item-title>Single-line item</v-list-item-title>
                            <v-list-item-title>Single-line item</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>

            </v-tab-item>
            <v-tab-item>
              werwerwexcv
            </v-tab-item>
          </v-tabs-items>

        </v-tabs>
      </v-card-text>
    </v-card>
  </v-container>
</div>
</template>

<script>
export default {
name: "PatientTabs",
  data () {
    return {
      currentItem: 'tab-pregledi',
      tabItems: [
        {
          alias: 'visits',
          text: 'Прегледи',
          activeClass: '',
          icon: 'mdi-doctor'
        },
        {
          alias: 'alergies',
          text: 'Алергии',
          activeClass: 'cyan darken-4',
          icon: 'mdi-bug'
        },
      ],
      text: 'lorem ',
      tabs: '',
      model: 'tab-1',
      medicalRecrodsHeader: [
        {
          text: 'Дата',
          value: 'date',
          sortable: true
        },
        {
          text: 'Водеща диагноза',
          value: 'leading_mkb',
          sortable: false
        },
        {
          text: 'Тип на листа',
          value: 'type_of_visit',
          sortable: true
        },
        {
          text: 'Основна диагноза',
          value: 'main_diagnosys',
          sortable: false
        },
        {
          text: 'Статус',
          value: 'status',
          sortable: false
        },
      ],
    }
  }
}
</script>

<style scoped>

</style>