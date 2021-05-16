<template>
<div>
  <v-autocomplete :items="cities.cities"
                  v-model="selectedCity"
                  :item-value="itemValue"
                  :item-text="cityName">

  </v-autocomplete>
</div>
</template>

<script>
// import Autocomplete from "@trevoreyre/autocomplete-vue";
import cities from '../../../assets/cities.json';

export default {
  name: "CityAutocompletePartial",
  components: {
  },
  data() {
    return {
      selectedCity: null,
      cities: cities
    };
  },

  methods: {
    cityName(val) {
      return `${val.name}, ${val.regionName}`
    },
    itemValue(val) {
      return val
    },
  }
}
</script>

<style scoped>

</style>