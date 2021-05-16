<template>
<div>
  <h1>
    Tooth chart
  </h1>
  <img src="" alt="">
  <table class="table">
    <thead>
      <tr>
        <th style="background-color: #00acc1; color: white" colspan="8">
          Горен десен квадрант
        </th>
        <th style="background-color: #00acc1; color: white" colspan="8">
          Горен ляв квадрант
        </th>
      </tr>
    </thead>
    <tbody style="height: 100px">
    <tr class="text-center">
      <td v-for="(tooth, key) in teeth['upperRightQuadrant']" :key="key">
        <v-btn block>
          {{ tooth.toothNumber}}
        </v-btn>
        <img :src="`UpperJaw/rightQuadrant/${tooth.toothNumber}.png`" :alt="`${tooth.toothNumber}-${tooth.group}`" style="min-height: 280px;" class="text-right">
      </td>
      <td v-for="(tooth) in teeth['upperLeftQuadrant']" :key="tooth.toothNumber">
        <v-btn block>
          {{ tooth.toothNumber}}
        </v-btn>
        <img :src="`UpperJaw/rightQuadrant/${tooth.toothNumber}.png`" :alt="`${tooth.toothNumber}-${tooth.group}`"  style="min-height: 280px">
      </td>
    </tr>
    <tr class="text-center">
      <td v-for="(tooth, key) in teeth['lowerRightQuadrant']" :key="key">
        <img :src="`LowerJaw/${tooth.toothNumber}.png`" :alt="`${tooth.toothNumber}-${tooth.group}`" style="min-height: 280px">
      </td>
      <td v-for="(tooth) in teeth['lowerLeftQuadrant']" :key="tooth.toothNumber">
        <img :src="`LowerJaw/${tooth.toothNumber}.png`" :alt="`${tooth.toothNumber}-${tooth.group}`"  style="min-height: 280px">
      </td>
    </tr>
<!--      <tr>-->
<!--        <td class="text-center">-->
<!--          <img src="UpperJaw/tooth_0000_Layer-1.png" alt="tteh1" style="height: 100px"><br>-->
<!--        </td>-->
<!--      </tr>-->
    </tbody>
    <tfoot>
      <tr>

        <th style="background-color: #00acc1; color: white" colspan="8">
          Долен десен квадрант
        </th>
        <th style="background-color: #00acc1; color: white" colspan="8">
          Долен ляв квадрант
        </th>
      </tr>
    </tfoot>
  </table>
<!--  <img src="tooths.png" alt="">-->
</div>
</template>

<script>
export default {
name: "ToothChart",
  data () {
    return {
      selectedTooth: null,
      teeth: {
        upperRightQuadrant: [
          {
            toothNumber: 18,
            image: '',
            group: 'molars'
          },
          {
            toothNumber: 17,
            image: '',
            group: 'molars'
          },
          {
            toothNumber: 16,
            image: '',
            group: 'molars'
          },
          {
            toothNumber: 15,
            image: '',
            group: 'premolars'
          },
          {
            toothNumber: 14,
            image: '',
            group: 'premolars'
          },
          {
            toothNumber: 13,
            image: '',
            group: 'canine'
          },
          {
            toothNumber: 12,
            image: '',
            group: 'incisors'
          },
          {
            toothNumber: 11,
            image: '',
            group: 'incisors'
          },
        ],
        upperLeftQuadrant: [
          {
            toothNumber: 21,
            image: '',
            group: 'incisors'
          },
          {
            toothNumber: 22,
            image: '',
            group: 'incisors'
          },
          {
            toothNumber: 23,
            image: '',
            group: 'canine'
          },
          {
            toothNumber: 24,
            image: '',
            group: 'premolars'
          },
          {
            toothNumber: 25,
            image: '',
            group: 'premolars'
          },
          {
            toothNumber: 26,
            image: '',
            group: 'molars'
          },
          {
            toothNumber: 27,
            image: '',
            group: 'molars'
          },
          {
            toothNumber: 28,
            image: '',
            group: 'molars'
          }
        ],
        lowerRightQuadrant: [
          {
            toothNumber: 48,
            image: '',
            group: 'molars'
          },
          {
            toothNumber: 47,
            image: '',
            group: 'molars'
          },
          {
            toothNumber: 46,
            image: '',
            group: 'molars'
          },
          {
            toothNumber: 45,
            image: '',
            group: 'premolars'
          },
          {
            toothNumber: 44,
            image: '',
            group: 'premolars'
          },
          {
            toothNumber: 43,
            image: '',
            group: 'canine'
          },
          {
            toothNumber: 42,
            image: '',
            group: 'incisors'
          },
          {
            toothNumber: 41,
            image: '',
            group: 'incisors'
          },
        ],
        lowerLeftQuadrant: [
          {
            toothNumber: 31,
            image: '',
            group: 'incisors'
          },
          {
            toothNumber: 32,
            image: '',
            group: 'incisors'
          },
          {
            toothNumber: 33,
            image: '',
            group: 'canine'
          },
          {
            toothNumber: 34,
            image: '',
            group: 'premolars'
          },
          {
            toothNumber: 35,
            image: '',
            group: 'premolars'
          },
          {
            toothNumber: 36,
            image: '',
            group: 'molars'
          },
          {
            toothNumber: 37,
            image: '',
            group: 'molars'
          },
          {
            toothNumber: 38,
            image: '',
            group: 'molars'
          },
        ],
      }
    }
  }
}
</script>

<style scoped>
tbody {
  /*background-color: #a1b7d9;*/

}
.table {
  background-color: #ffb3b3;
}
</style>