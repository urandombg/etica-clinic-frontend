<template>
<v-container fluid>
  <v-card>
    <v-card-title>
      <h1 class="display-1">
        Табло
      </h1>
    </v-card-title>
  </v-card>
  <v-container fluid>
    <v-card>
      <v-card-title>
        <h2>
          Графици
        </h2>
      </v-card-title>
      <v-row justify="center" sm no-gutters>
        <v-col cols="12" md="4" sm="4">
          <v-card @click="$router.push('/schedules/physiotherapists')" hover rounded>
            <v-card-title class="cyan white--text">

              <strong>
                Физиотерапия (консултация със специалист)
              </strong>
            </v-card-title>
            <v-card-text>
              <v-img src="https://www.physioandphysique.com/img/2.png" contain eager height="150"></v-img>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4" sm="4">
          <v-card @click="$router.push('/schedules/dental')" hover>
            <v-card-title  class="blue accent-3 white--text">
              <span> </span> <strong> Стоматология</strong>
            </v-card-title>
            <v-card-text>
              <v-img src="https://img.icons8.com/color/452/dentist.png" contain eager height="150"></v-img>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4" sm="4">
          <v-card hover>
            <v-card-title  class="purple white--text">
              Дерматология
            </v-card-title>
            <v-card-text>
              <v-img src="https://cdn2.iconfinder.com/data/icons/beauty-salon-innovicons-color/128/Skin-care-face-dermatology-512.png" contain eager height="150"></v-img>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4" sm="4">
          <v-card hover @click="$router.push(`/schedules/cardio`)">
            <v-card-title  class="red accent-4 white--text">
              Кардиология
            </v-card-title>
            <v-card-text>
              <v-img src="https://w7.pngwing.com/pngs/688/716/png-transparent-cardiology-medicine-health-computer-icons-business-preventive-medicine-love-text-hand.png" contain eager height="150"></v-img>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4" sm="4">
          <v-card hover @click="$router.push(`/schedules/endocrinology`)">
            <v-card-title  class="blue-grey white--text">
              Ендокринология
            </v-card-title>
            <v-card-text>
              <v-img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTt6-bXfJ-7ZnSqrB5lMjnop5YhJhGkLwrmsA&usqp=CAU" contain eager height="150"></v-img>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4" sm="4">
          <v-card hover @click="$router.push(`/schedules/neuro`)">
            <v-card-title  class="indigo white--text">
              Неврология
            </v-card-title>
            <v-card-text>
              <v-img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4zJCL9OC1n6p5_CViE55LmQcSudG_z4d2qA&usqp=CAU" contain eager height="150"></v-img>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4" sm="4">
          <v-card hover @click="$router.push('/schedules/ortho')">
            <v-card-title  class="indigo accent-2 white--text">
              Ортопедия
            </v-card-title>
            <v-card-text>
              <v-img src="https://www.monroeclinic.org/sites/default/files/blog-images/knee%20joint%20icon_0.png" contain eager height="150"></v-img>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4" sm="4">
          <v-card hover @click="$router.push(`/schedules/rheumatology`)">
            <v-card-title  class="indigo accent white--text">
              Ревматология
            </v-card-title>
            <v-card-text>
              <v-img src="https://www.monroeclinic.org/sites/default/files/blog-images/knee%20joint%20icon_0.png" contain eager height="150"></v-img>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4" sm="4">
          <v-card hover @click="$router.push(`/schedules/neurosurgery`)">
            <v-card-title  class="indigo accent-4 white--text">
              Съдова хирургия
            </v-card-title>
            <v-card-text>
              <v-img src="https://png.pngtree.com/png-vector/20190630/ourlarge/pngtree-vascular-icon-for-your-project-png-image_1532185.jpg" contain eager height="150"></v-img>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4" sm="4">
          <v-card hover @click="$router.push(`/schedules/pediatrics`)">
            <v-card-title  class="pink white--text">
              Педиатрия
            </v-card-title>
            <v-card-text>
              <v-img src="https://thumbs.dreamstime.com/b/pediatrics-concept-icon-pediatrics-concept-icon-pediatric-health-care-center-pediatrician-stethoscope-kid-clinic-childcare-178648761.jpg" contain eager height="150"></v-img>
            </v-card-text>
          </v-card>
        </v-col>

      </v-row>
    </v-card>
  </v-container>
</v-container>
</template>

<script>
export default {
  name: "Dashboard",
}
</script>

<style scoped>

</style>
