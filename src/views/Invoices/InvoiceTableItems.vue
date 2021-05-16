<template>
  <div>
    <v-row>
      <v-col cols="12">
        <h2 class="display-1 elevation-1" style=" padding: 33px">
          <v-icon x-large>
            mdi-account-arrow-left
          </v-icon>
          Избор на процедури
        </h2>
      </v-col>
    </v-row>

    <v-simple-table>
      <thead class="cyan darken-3 white-text">
        <tr>
          <th class="text--white">
            <v-icon class="text--white">
              mdi-arrow-split-horizontal
            </v-icon>
          </th>
          <th style="color: white; font-size: 19px">№</th>
          <th style="color: white; font-size: 19px">Код</th>
          <th style="color: white; width: 60%; font-size: 19px">Наименование</th>
          <th style="color: white; font-size: 19px">Мярка</th>
          <th style="color: white; font-size: 19px">Кол.</th>
          <th style="color: white; font-size: 19px">Ед. Цена</th>
          <th style="color: white; font-size: 19px">Общо</th>
          <th style="color: white; font-size: 19px"></th>
        </tr>
      </thead>
      <tr v-if="itemsToInvoice.length <=0">
        <td colspan="10"><br>
          <v-alert type="info" border="left">
            Няма добавени процедури към този преглед.
            За да добавите процедура, използвайте формата по-долу.
          </v-alert>
        </td>
      </tr>
      <draggable v-model="itemsToInvoice"
                 tag='tbody'
                 @start="drag = true"
                 @end="drag = false"
                 v-bind="dragOptions"
                 handle=".handle">

        <tr v-for="(item, index) in itemsToInvoice" :key="index">
          <td class="handle grey lighten-3">
            <v-icon>
              mdi-menu
            </v-icon>
          </td>
          <td style="border-bottom: 1px solid #212020">
            {{ index += 1}}
          </td>
          <td style="border-bottom: 1px solid #212020">
            {{ item.code }}
          </td>
          <td style="border-bottom: 1px solid #212020">
            {{ item.title }}
          </td>
          <td style="border-bottom: 1px solid #212020">
            {{ item.measure.text }}
            <v-btn x-small
                   rounded
                   color="red"
                   :key="index"
                   v-if="editingItem"
                   @click="changeItemMeasure(item)">
              <v-icon x-small>
                mdi-pen
              </v-icon>
            </v-btn>
          </td>
          <td style="border-bottom: 1px solid #212020">
<!--            <v-text-field v-model="item.qty" :suffix="item.measure.text ? item.measure.text : 'бр.'"></v-text-field>-->
            <v-text-field v-model="item.qty"
                          class="align-center justify-center"
                          :suffix="item.measure.text">
            </v-text-field>
          </td>
          <td style="border-bottom: 1px solid #212020">
            <v-text-field v-model="item.unitPrice" :suffix="item.currency ? item.currency : 'лв.'">

            </v-text-field>
          </td>
          <td style="border-bottom: 1px solid #212020">
            {{ (item.qty * parseFloat(item.unitPrice)).toFixed(2)}}
          </td>
          <td style="border-bottom: 1px solid #212020">
            <v-btn
                shaped
                @click="removeItemFromInvoice(item)"
                color="red"
                class="white--text">
              <v-icon>
                mdi-delete
              </v-icon>
            </v-btn>
          </td>
        </tr>
      </draggable>
    </v-simple-table>
    <v-container>
      <v-row>
        <v-col cols="10"></v-col>
        <v-col cols="1">Сума:</v-col>
        <v-col cols="1">
          {{ totals.subTotal.toFixed(2)}}
        </v-col>
<!--        <v-col cols="10"></v-col>-->
<!--        <v-col cols="1">ДДС (20 %):</v-col>-->
<!--        <v-col cols="1">-->
<!--          {{ totals.vatAmount.toFixed(2)}}-->
<!--        </v-col>-->
        <v-col cols="10"></v-col>
        <v-col cols="1">Тотал:</v-col>
        <v-col cols="1">
          {{ totals.totalWithVAT.toFixed(2)}}
        </v-col>
      </v-row>
    </v-container>
    <hr>
    <v-container fluid>
      <v-form v-model="formValidity">
        <v-row class="lighten-5 rounded outlined elevation-4">
          <v-col cols="6">
            <v-autocomplete
                label="Наименование"
                v-model="entity.title"
                :item-text="itemText"
                :item-value="itemValue"
                :items="services"
                @input="setItemText"
                @keydown.enter="$refs.qty.focus()"
                @mousedown.left="$refs.qty.focus()"
                :rules="rules.required"
                validate-on-blur>
              <template #item="{item}">
                {{ item.code }} - {{ item.title }} |
                <strong>
                  <i>
                    <u>{{ item.category }}</u>
                  </i>
                </strong>
              </template>
            </v-autocomplete>
          </v-col>
          <v-col cols="1">
            <v-select
                v-model="entity.measure"
                label="Мярка"
                :items="measures"
                :disabled="disableIfEmptyOrNull('title')">

            </v-select>
          </v-col>
          <v-col>
            <v-text-field ref="qty"
                          label="Кол."
                          :rules="rules.required"
                          v-model="entity.qty"
                          :disabled="disableIfEmptyOrNull('title')">

            </v-text-field>
          </v-col>
          <v-col>
            <v-text-field label="Ед. Цена"
                          v-model="entity.unitPrice"
                          :disabled="disableIfEmptyOrNull('title')">

            </v-text-field>
          </v-col>
          <v-col align-self="center" justify="center">
            {{ calculateLineTotalWODiscount() }} лв.
          </v-col>
          <v-col>
            <v-btn :disabled="!entity.title"
                   color="green"
                   block
                   height="70"
                   class="white--text"
                   @click="addItemToInvoiceItems()">
              <v-icon>
                mdi-plus
              </v-icon>
              Добави
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-container>

    <br>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
// import services from './services.json';
export default {
  props: {
    Items: Array,
    setItems: Array
  },
  name: 'InvoiceTableItems',
  components: {
    'draggable': draggable
  },
  data() {
    return {
      drag: false,
      option: {
        animation: 1,
        ghostClass: 'elementDrag'
      },
      services: [],
      formValidity: false,
      entity: {
        title: null,
        measure: null,
        unitPrice:null,
        qty: 1,
      },
      rules: {
        required: [value => !!value || 'Това поле е задължително!'],
      },
      editingItem: false,
      itemsToInvoice: []
    }
  },
  mounted() {
    this.getServices()
  },
  methods: {
    setItemText(val) {
      console.log(val)
      this.services.find((item) => {
        if (item.title.toLocaleLowerCase() === val.toLocaleLowerCase()) {
            this.entity.title = item.title
              // console.log(item.measure)
          console.log(',item , ',item)
              this.entity.measure = {
                value: `${item.measure}.`,
                text: `${item.measure}.`
              },
              this.entity.unitPrice = item.unit_price,
              this.entity.measure = item.measure,
              this.entity.qty = 1
        }
      })
      // this.entity = val
    },
    itemValue(val) {
      return `${val.title}`
    },
    itemText(val) {
      return `${val.code} - ${val.title}`
    },
    getServices() {
     this.$http.get(`/api/procedures`)
      .then(
          (data) => {
            this.services = data.data
          }
      )
    },
    currency(value) {

      // let toBGN = (value) => {

        let under10 = (value, currency = false) => {
          let index = Math.floor(value)
          if(index > 10) {
            index = 10;
          }
          let resultArray =
              [
                "нула", "един", "два", "три", "четири", "пет", "шест",
                "седем", "осем", "девет", "десет"
              ]


          if(currency) {

            let currenciesArrray =
                [
                  "лева", "лев"
                ]
            // let i = (index === 1 ? 1 : 0)
            return resultArray[index] + " " + currenciesArrray[0]

          }

          return resultArray[index]
        }

        let under10BGN = (value) => under10(value, true)

        let under20 = (value) => {
          if (value <= 10) return under10(value, true)
          let index = value - 10
          let resultArray =
              [
                "десет","единадесет", "дванадесет", "тринадесет",
                "четиринадесет", "петнадесет", "шестнадесет",
                "седемнадесет", "осемнадесет", "деветнадесет",
                "двадесет"
              ]
          return resultArray[index] + " " + "лева"
        }

        let under100 = (value) => {
          let intValue = Math.floor(value)
          let h = Math.floor(intValue / 10)
          let t = intValue % 10

          let resultArray =
              [
                "", "десет", "двадесет", "тридесет",
                "четиридесет", "петдесет", "шестдесет",
                "седемдесет", "осемдесет", "деветдесет",
                "сто"
              ]

          if(intValue <= 10) {
            return under10(intValue, true)
          } else if(intValue <= 20) {
            return under20(intValue)
          }
          let head = ""
          head = resultArray[h]
          if(t != 0) {
            head += " и " + under10(t, true)
          } else{
            head += " лева"
          }

          return head
        }

        let under1000 = (value) => {
          let intValue = Math.floor(value)
          let h =  Math.floor(intValue / 100)
          let t = intValue % 100

          let resultArray =
              [
                "", "сто", "двеста", "триста",
                "четиристотин", "петстотин", "шестстотин",
                "седемстотин", "осемстотин", "деветстотин",
                "хиляда"
              ]

          let head = ""
          head = resultArray[h]

          if(intValue <= 100) {
            return under100(intValue, true)
          }
          if(t == 0) {
            head += " лева"
          } else if(t <= 20) {
            head += " и " + under20(t)
          } else if(Math.floor(t/10) == 0) {
            head += " и " + under100(t, true)
          } else {
            head += " " + under100(t)
          }

          return head
        }

        let under20000 = (value) => {
          let intValue = Math.floor(value)
          let h =  Math.floor(intValue / 1000)
          let t = intValue % 1000

          let resultArray =
              [
                "", "хиляда", "две", "три",
                "четири", "пет", "шест",
                "седем", "осем", "девет",
                "десет", 'prazno' ,"единадесет", "дванадесет", "тринадесет",
                "четиринадесет", "петнадесет", "шестнадесет",
                "седемнадесет", "осемнадесет", "деветнадесет",
                "двадесет"
              ]

          let head = ""
          head = resultArray[h]
          if(h > 1) {
            head += " " + "хиляди"
          }

          if(t === 0) {
            head += " лева"
            return head
          }

          if (t< 100) {
            head += " и " + under1000(t)
          } else if(t % 100 == 0 && Math.floor(t / 100) > 0) {
            head += " и " + under1000(t)
          } else {
            head += " " + under1000(t)
          }

          return head
        }

        let round = Math.floor(value)
        let tail =  Math.round(((value - round) + Number.EPSILON) * 100)

        let max = [10, 20, 100, 1000, 20000]
        let functions = [under10BGN, under20, under100, under1000, under20000]

        let i = 0
        while (max[i]< round) {
          i++
        }

        let t = functions[i](round)
        let c = "стотинк" + (tail === 1? "а" : "и")
        if(tail > 0) {
          return t + " и " + tail + " " + c
        }

        return t
    },
    addItemToInvoiceItems() {
      //TODO VALIDATION!!!!!!!
      this.itemsToInvoice.push(this.entity)
      this.entity = {
        title: null,
        measure: null,
        unitPrice: 0.00,
        qty: 1,
      }
      this.$store.commit('setItems', this.itemsToInvoice);
    },
    removeItemFromInvoice(item) {
      let elementToRemove = this.itemsToInvoice.indexOf(item)
      if (elementToRemove !== -1) {
        this.itemsToInvoice.splice(elementToRemove, 1);
      }
    },
    changeItemMeasure(item) {
      this.editingItem = true
      this.$set(item, 'measure', item.measure)
    },
    disableIfEmptyOrNull(property) {
      return this.entity[property] === null || this.entity[property] === '';
    },
    calculateLineTotalWODiscount() {
      return (this.entity.qty * parseFloat(this.entity.unitPrice)).toFixed(2) || 0.00
    },
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'elementDrag'
      }
    },
    totals() {
      let subTotal = 0
      let vatAmount = 0
      let totalWithVAT = 0

      this.itemsToInvoice.forEach(item => {
        subTotal += (item.qty * parseFloat(item.unitPrice));
      });

      totalWithVAT = subTotal * 1.2;
      vatAmount = totalWithVAT - subTotal;

      return {
        subTotal, vatAmount, totalWithVAT
      }
    },
    measures() {
      const items = ['бр.', 'ч.', 'мин.', 'оп.'];
      let result = [];
      let measure = {};
      items.forEach(item => {
        this.$set(measure, 'title', item)
        result.push(item)
      })
      return result;
    },
  },
  watch: {
    'entity.qty': function () {
      return (this.entity.qty * parseFloat(this.entity.unitPrice))
    },
    'entity.unitPrice': function () {
      return (this.entity.qty * parseFloat(this.entity.unitPrice))
    }
  }
}
</script>
<style>
</style>
