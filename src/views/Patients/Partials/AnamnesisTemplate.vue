<template>
<v-card>
  <v-toolbar color="grey lighten-3" tile>
    <v-toolbar-title>
      <h1>
        <v-icon x-large>
          mdi-clipboard-outline
        </v-icon>
         Шаблони "Анамнеза", диагноза ф
      </h1>
      <v-spacer></v-spacer>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items>
      <v-btn color="red" class="white--text" @click="closeAnamnesisModalDialog">
        Затвори
        <v-icon>
          mdi-close
        </v-icon>
      </v-btn>
    </v-toolbar-items>
  </v-toolbar>
  <v-card-text>
    <br>
    <v-text-field label="Диагноза"
                  flat
                  v-model="search"
                  filled
                  color="green"
                  placeholder="Ключува дума или диагноза">
    </v-text-field>
    <v-row>
      <v-col>
        <v-list>
          <v-list-item-group>
            <v-list-item v-for="(template, key) in filteredItems"
                         :key="key"
                         style="border-bottom: 1px #343232 solid"
                         active-class="green elevation-15 white--text"
                         :class="selectedMkbTemplate === template.mkbCode ? 'green' : ''"
                         @click="selectMkbTemplate(template)">
              <v-col>
                {{ template.mkbCode }}
              </v-col>
              <v-col class="text-right">
                <v-icon v-if="selectedMkbTemplate.mkbCode === template.mkbCode">
                  mdi-check
                </v-icon>
              </v-col>

            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-col>
      <v-divider
          vertical
          inset
          class="elevation-2"
      ></v-divider>
      <v-col>
        <v-textarea outlined
                    readonly
                    background-color="light-blue lighten-4"
                    rounded
                    filled
                    height="320"
                    label="Анамнеза"
                    v-model="selectedMkbTemplate.anamnesis">
        </v-textarea>

      </v-col>
      <v-col>
        <v-textarea outlined
                    background-color="grey lighten-4"
                    rounded
                    filled
                    readonly
                    height="320"
                    label="Обективно състояние"
                    v-model="selectedMkbTemplate.obj_condition">
        </v-textarea>

      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-btn color="green"
               block
               class="white--text"
               @click="selectAndChooseTemplate(selectedMkbTemplate)"
               :disabled="!selectedMkbTemplate">
          Избери и постави
          <v-icon size="xl">
            mdi-check
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-card-text>
</v-card>
</template>

<script>
export default {
  props: ['mkbCode', 'keyWord'],
  name: "AnamnesisTemplate",
  data () {
    return {
      search: '',
      selectedMkbTemplate: '',
      anamnesis: [
        {
          mkbCode: 'M51.1',
          anamnesis: 'Пациентът е с оплаквания от силни болки в кръста. Ирадииращи към ляв крак. Придружени с изтръпване на лява подбедрица и ходило. Напоследък болките се засилили до нетърпимост. Лекуван с НСПВС с незадоволителен ефект, поради което се насочва за амбулаторна физиотерапия.',
          obj_condition: 'Статус ОДА:Вертебрален синдром за лумбален дял на гр. стълб. Ригидна паравертебрална мускулатура. Болезнени и ограничени движения в лумбален дял на гр. стълб. Изгладена лумбална лордоза. Коренчев синдром: СНР- отслабени, Тна Вале + в двустранно. Хипестезия по Л5 ЕС 1 дерматоми. Анталгична походка.'
        },
        {
          mkbCode: 'G54.1',
          anamnesis: 'Пациентката е с оплаквания от силни болки в кръста. Ирадииращи към ляв крак. Придружени с изтръпване на лява подбедрица и ходило. Напоследък болките се засилили до нетърпимост. Лекуван с НСПВС с незадоволителен ефект, поради което се насочва за амбулаторна физиотерапия.',
          obj_condition: 'Статус ОДА:Вертебрален синдром за лумбален дял на гр. стълб. Ригидна паравертебрална мускулатура. Болезнени и ограничени движения в лумбален дял на гр. стълб. Изгладена лумбална лордоза. Коренчев синдром: СНР- отслабени, Тна Вале + в двустранно.Ласег + на 45гр.  Хипестезия по Л5 Ес 1 дерматоми. Анталгична походка.'
        },
        {
        mkbCode: 'M5GG.1',
        anamnesis: 'Пациентът е с оплаквания от силни болки в кръста. Ирадииращи към ляв крак. Придружени с изтръпване на лява подбедрица и ходило. Напоследък болките се засилили до нетърпимост. Лекуван с НСПВС с незадоволителен ефект, поради което се насочва за амбулаторна физиотерапия.',
        obj_condition: 'Статус ОДА:Вертебрален синдром за лумбален дял на гр. стълб. Ригидна паравертебрална мускулатура. Болезнени и ограничени движения в лумбален дял на гр. стълб. Изгладена лумбална лордоза. Коренчев синдром: СНР- отслабени, Тна Вале + в двустранно. Хипестезия по Л5 ЕС 1 дерматоми. Анталгична походка.'
      },

      ]
    }
  },
  methods: {
    selectMkbTemplate(item) {
      this.selectedMkbTemplate = item
    },
    closeAnamnesisModalDialog() {
      this.$root.$emit('closeAnamnesisModalDialog', true)
    },
    selectAndChooseTemplate(template) {
      this.$root.$emit('selectAndChooseTemplate', template)
    }
  },
  computed: {
    filteredItems() {
      return this.anamnesis.filter(item => {
        if (!item) {
          return ['nqma'];
        }
        else {
          return item.mkbCode.toLowerCase().indexOf(this.search.toLowerCase()) > -1;
        }
      })
    }
  }
}
</script>

<style scoped>

</style>