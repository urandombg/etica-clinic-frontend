<template>
<div>
 <v-container fluid>
   <h1 class="cyan accent-4 white--text" style="padding: 15px">
     Списък с процедури
   </h1>
   <v-container fluid>
     <v-col>
       <v-btn dark @click="$router.push('/procedures/create')">
         Създаване на нова процедура
       </v-btn>
     </v-col>
     <v-data-table :items="procedures"
                   :loading="dataLoading"
                   calculate-widths
                   item-class=".red"
                   :headers="tableHeaderColumns">
       <template v-slot:item.actions="{item}">
         <v-btn color="warning" @click="editProcedure(item.id)">
           Редакция
         </v-btn>
         <v-btn color="red" class="white--text" @click="deleteProcedure(item.id)">
           Изтрии
         </v-btn>
       </template>
     </v-data-table>
   </v-container>
 </v-container>
</div>
</template>

<script>
export default {
  name: "ProcedureList",
  data () {
    return { 
      procedures: [],
      tableHeaderColumns: [
        {
          text: 'Код',
          value: 'code'
        },
        {
          text: 'Наименование на процедурата',
          value: 'title'
        },
        {
          text: 'Мярка',
          value: 'measure'
        },
        {
          text: 'Категория',
          value: 'category'
        },
        {
          text: 'Цена',
          value: 'unit_price'
        },
        {
          text: '',
          value: 'actions'
        },
      ],
      dataLoading: false
    }
  },
  mounted() {
    this.$http.get(`api/procedures`)
    .then(
        (data) => {
          console.log(data.data)
          this.procedures = data.data
        }
    )
  },
  methods: {
    getAllProcedures() {
      this.dataLoading = true
      this.$http.get(`api/procedures`)
          .then(
              (data) => {
                this.procedures = data.data
              }
          )
      .catch(
          (error) => {
            console.log(error)
          }
      )
      .finally(() => {
        this.dataLoading = false
      })
    },
    editProcedure(id) {
      this.$router.push(`/procedures/edit/${id}`);
    },
    deleteProcedure(id) {
      this.$http.delete(`/api/procedures/${id}`)
      .then(
          (data) => {
            console.log(data)
            if (data.status === 200 && data.data.message === 'Record deleted!') {
              this.getAllProcedures();
            }
            else {
              alert("Something went wrong L90!")
            }
          }
      )
      .catch(
          (error) => {
            console.log(error)
          }
      )
    }
  }
}
</script>

<style scoped>

</style>