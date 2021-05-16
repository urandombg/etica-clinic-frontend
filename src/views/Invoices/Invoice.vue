<template>
    <v-card>
      <v-container fluid>
        <h1>
          Фактура
        </h1>
        <br>
        <v-container fluid>
          <form>
            <invoice-header></invoice-header>
            <br>
            <invoice-table-items v-on:update-items="pushToStore"></invoice-table-items>
            <br>
            <v-container fluid>
              <v-row>
<!--                <v-btn-group size="lg">-->
                  <v-btn variant="success" @click="pdfFaktura">
                    <i class="fa fa-check-circle"></i>
                    Завърши
                  </v-btn>
                  <v-btn variant="info" @click="iwantu">
                    <i class="fa fa-envelope"></i>
                    Изпрати по имейл
                  </v-btn>
                  <v-btn variant="danger" @click="logx">
                    <i class="fa fa-window-close"></i>
                    Отказ
                  </v-btn>
<!--                </v-btn-group>-->
              </v-row>
            </v-container>
          </form>
        </v-container>
      </v-container>
    </v-card>
</template>

<script>
import InvoiceTableItems from './InvoiceTableItems'
import InvoiceHeader from './InvoiceHeader'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import axios from 'axios';

export default {
  name: 'Invoice',
  mixins: [validationMixin],
  components: {
    InvoiceHeader,
    InvoiceTableItems
  },
  data () {
    return {
      itemsToInvoice: [],
      invoiceToPrivateIndividual: false,
      customer: {},
      customers: [],
      // customers: [
      //   {
      //     firstname: 'Рангел',
      //     middlename: '',
      //     lastname: 'Проданов',
      //     city: 'Пловдив',
      //     address: 'PLOX',
      //     phone: '12387123',
      //     invoiceDetails: {
      //       company: 'Дентакон ЕТ',
      //       city: 'Пловдив',
      //       address: 'Пловдив',
      //       strNum: '92',
      //       mol: 'Константин Думанов',
      //       bulstat: '115324992',
      //       hasVATRegistered: true,
      //       fullBulstat: 'BG115324991'
      //     }
      //   },
      //   {
      //     id: 941,
      //     firstname: 'Mariana',
      //     middlename: 'Bass',
      //     lastname: 'Guthrie',
      //     city: 'Northridge',
      //     address: 'Shale Street',
      //     phone: '(935) 568-3411',
      //     invoiceDetails: {
      //       company: 'Orbixtar',
      //       city: 'Colton',
      //       address: 'Mill Road',
      //       strNum: 389,
      //       mol: 'Taylor Knapp',
      //       bulstat: 239366367,
      //       hasVATRegistered: true
      //     }
      //   },
      //   {
      //     id: 757,
      //     firstname: 'Trudy',
      //     middlename: 'Robinson',
      //     lastname: 'Ferrell',
      //     city: 'Tryon',
      //     address: 'Bushwick Avenue',
      //     phone: '(836) 483-2818',
      //     invoiceDetails: {
      //       company: 'Comfirm',
      //       city: 'Smeltertown',
      //       address: 'School Lane',
      //       strNum: 771,
      //       mol: 'Bauer Lester',
      //       bulstat: 695345104,
      //       hasVATRegistered: true
      //     }
      //   },
      //   {
      //     id: 926,
      //     firstname: 'Short',
      //     middlename: 'Hill',
      //     lastname: 'Rocha',
      //     city: 'Hendersonville',
      //     address: 'Beekman Place',
      //     phone: '(972) 538-2700',
      //     invoiceDetails: {
      //       company: 'Biohab',
      //       city: 'Fontanelle',
      //       address: 'Oakland Place',
      //       strNum: 171,
      //       mol: 'Figueroa Whitfield',
      //       bulstat: 56293331,
      //       hasVATRegistered: false
      //     }
      //   },
      //   {
      //     id: 888,
      //     firstname: 'Santana',
      //     middlename: 'Sparks',
      //     lastname: 'Bentley',
      //     city: 'Taycheedah',
      //     address: 'Little Street',
      //     phone: '(924) 540-2503',
      //     invoiceDetails: {
      //       company: 'Sarasonic',
      //       city: 'Comptche',
      //       address: 'Legion Street',
      //       strNum: 723,
      //       mol: 'Suzanne William',
      //       bulstat: 962839797,
      //       hasVATRegistered: false
      //     }
      //   },
      //   {
      //     id: 21,
      //     firstname: 'Pauline',
      //     middlename: 'Berger',
      //     lastname: 'Kemp',
      //     city: 'Cotopaxi',
      //     address: 'Llama Court',
      //     phone: '(850) 543-2521',
      //     invoiceDetails: {
      //       company: 'Quordate',
      //       city: 'Kempton',
      //       address: 'Strauss Street',
      //       strNum: 34,
      //       mol: 'Luna Jennings',
      //       bulstat: 882974534,
      //       hasVATRegistered: true
      //     }
      //   },
      //   {
      //     id: 752,
      //     firstname: 'Gabrielle',
      //     middlename: 'Clay',
      //     lastname: 'Holden',
      //     city: 'Sabillasville',
      //     address: 'Dover Street',
      //     phone: '(843) 432-2219',
      //     invoiceDetails: {
      //       company: 'Digirang',
      //       city: 'Oneida',
      //       address: 'Hegeman Avenue',
      //       strNum: 204,
      //       mol: 'Olive Valentine',
      //       bulstat: 217352163,
      //       hasVATRegistered: false
      //     }
      //   },
      //   {
      //     id: 394,
      //     firstname: 'Lauren',
      //     middlename: 'Ellison',
      //     lastname: 'Landry',
      //     city: 'Gardiner',
      //     address: 'Seagate Avenue',
      //     phone: '(993) 552-2733',
      //     invoiceDetails: {
      //       company: 'Jimbies',
      //       city: 'Wyoming',
      //       address: 'Clarendon Road',
      //       strNum: 449,
      //       mol: 'Mccall Oconnor',
      //       bulstat: 68902633,
      //       hasVATRegistered: false
      //     }
      //   },
      //   {
      //     id: 896,
      //     firstname: 'Florence',
      //     middlename: 'Tran',
      //     lastname: 'Perry',
      //     city: 'Takilma',
      //     address: 'Dwight Street',
      //     phone: '(922) 583-3186',
      //     invoiceDetails: {
      //       company: 'Frosnex',
      //       city: 'Ironton',
      //       address: 'Colby Court',
      //       strNum: 840,
      //       mol: 'Jackie Schmidt',
      //       bulstat: 721992642,
      //       hasVATRegistered: true
      //     }
      //   },
      //   {
      //     id: 1046,
      //     firstname: 'Vazquez',
      //     middlename: 'Cummings',
      //     lastname: 'Carrillo',
      //     city: 'Bancroft',
      //     address: 'Arlington Avenue',
      //     phone: '(833) 453-3394',
      //     invoiceDetails: {
      //       company: 'Magneato',
      //       city: 'Marbury',
      //       address: 'Jamaica Avenue',
      //       strNum: 550,
      //       mol: 'Hart Washington',
      //       bulstat: 288747407,
      //       hasVATRegistered: true
      //     }
      //   },
      //   {
      //     id: 841,
      //     firstname: 'Barr',
      //     middlename: 'Velez',
      //     lastname: 'Grimes',
      //     city: 'Richford',
      //     address: 'Beard Street',
      //     phone: '(855) 471-2797',
      //     invoiceDetails: {
      //       company: 'Hyplex',
      //       city: 'Groveville',
      //       address: 'Irwin Street',
      //       strNum: 434,
      //       mol: 'Virginia Schroeder',
      //       bulstat: 839543245,
      //       hasVATRegistered: false
      //     }
      //   },
      //   {
      //     id: 684,
      //     firstname: 'Ruth',
      //     middlename: 'Smith',
      //     lastname: 'Vargas',
      //     city: 'Carbonville',
      //     address: 'Wilson Avenue',
      //     phone: '(848) 560-2359',
      //     invoiceDetails: {
      //       company: 'Zentury',
      //       city: 'Holcombe',
      //       address: 'Gem Street',
      //       strNum: 369,
      //       mol: 'Larson Haley',
      //       bulstat: 806617381,
      //       hasVATRegistered: false
      //     }
      //   },
      //   {
      //     id: 610,
      //     firstname: 'Shauna',
      //     middlename: 'Petty',
      //     lastname: 'Mcfadden',
      //     city: 'Stollings',
      //     address: 'Pierrepont Street',
      //     phone: '(924) 587-3528',
      //     invoiceDetails: {
      //       company: 'Geeketron',
      //       city: 'Hemlock',
      //       address: 'Myrtle Avenue',
      //       strNum: 284,
      //       mol: 'Riggs Sutton',
      //       bulstat: 341028659,
      //       hasVATRegistered: false
      //     }
      //   },
      //   {
      //     id: 1033,
      //     firstname: 'Lawson',
      //     middlename: 'Sharpe',
      //     lastname: 'Barr',
      //     city: 'Faxon',
      //     address: 'Ridgewood Avenue',
      //     phone: '(848) 461-3153',
      //     invoiceDetails: {
      //       company: 'Velity',
      //       city: 'Cannondale',
      //       address: 'Adelphi Street',
      //       strNum: 751,
      //       mol: 'Sampson Mcclain',
      //       bulstat: 773774751,
      //       hasVATRegistered: false
      //     }
      //   },
      //   {
      //     id: 411,
      //     firstname: 'Bridgette',
      //     middlename: 'Macdonald',
      //     lastname: 'Paul',
      //     city: 'Westboro',
      //     address: 'Veterans Avenue',
      //     phone: '(885) 545-3573',
      //     invoiceDetails: {
      //       company: 'Tropolis',
      //       city: 'Coldiron',
      //       address: 'Indiana Place',
      //       strNum: 388,
      //       mol: 'Rosario West',
      //       bulstat: 388824801,
      //       hasVATRegistered: false
      //     }
      //   },
      //   {
      //     id: 441,
      //     firstname: 'Nguyen',
      //     middlename: 'Larson',
      //     lastname: 'Dotson',
      //     city: 'Needmore',
      //     address: 'Vine Street',
      //     phone: '(867) 449-3738',
      //     invoiceDetails: {
      //       company: 'Mixers',
      //       city: 'Delshire',
      //       address: 'Classon Avenue',
      //       strNum: 212,
      //       mol: 'Guzman Vega',
      //       bulstat: 329896952,
      //       hasVATRegistered: true
      //     }
      //   },
      //   {
      //     id: 238,
      //     firstname: 'Nita',
      //     middlename: 'Daniels',
      //     lastname: 'Powers',
      //     city: 'Deputy',
      //     address: 'Battery Avenue',
      //     phone: '(912) 536-2468',
      //     invoiceDetails: {
      //       company: 'Conjurica',
      //       city: 'Waterford',
      //       address: 'Powers Street',
      //       strNum: 778,
      //       mol: 'Soto Eaton',
      //       bulstat: 571070132,
      //       hasVATRegistered: true
      //     }
      //   },
      //   {
      //     id: 388,
      //     firstname: 'Mendez',
      //     middlename: 'Martinez',
      //     lastname: 'Dejesus',
      //     city: 'Bowden',
      //     address: 'Hausman Street',
      //     phone: '(912) 553-2510',
      //     invoiceDetails: {
      //       company: 'Sultraxin',
      //       city: 'Goochland',
      //       address: 'Rockwell Place',
      //       strNum: 239,
      //       mol: 'Travis Miranda',
      //       bulstat: 6156586,
      //       hasVATRegistered: false
      //     }
      //   },
      //   {
      //     id: 976,
      //     firstname: 'Mitzi',
      //     middlename: 'Curtis',
      //     lastname: 'Contreras',
      //     city: 'Gadsden',
      //     address: 'Clarkson Avenue',
      //     phone: '(959) 544-3203',
      //     invoiceDetails: {
      //       company: 'Voratak',
      //       city: 'Stockwell',
      //       address: 'Dean Street',
      //       strNum: 374,
      //       mol: 'Lakisha Lara',
      //       bulstat: 18946729,
      //       hasVATRegistered: true
      //     }
      //   },
      //   {
      //     id: 1153,
      //     firstname: 'Rice',
      //     middlename: 'Brady',
      //     lastname: 'Torres',
      //     city: 'Chical',
      //     address: 'Vanderveer Place',
      //     phone: '(888) 437-2063',
      //     invoiceDetails: {
      //       company: 'Imant',
      //       city: 'Thornport',
      //       address: 'Pulaski Street',
      //       strNum: 182,
      //       mol: 'Clarke Lang',
      //       bulstat: 907714479,
      //       hasVATRegistered: false
      //     }
      //   },
      //   {
      //     id: 614,
      //     firstname: 'Vinson',
      //     middlename: 'Tate',
      //     lastname: 'Wolfe',
      //     city: 'Hamilton',
      //     address: 'Lewis Avenue',
      //     phone: '(969) 544-3985',
      //     invoiceDetails: {
      //       company: 'Tripsch',
      //       city: 'Cucumber',
      //       address: 'Mill Street',
      //       strNum: 255,
      //       mol: 'Holland Coffey',
      //       bulstat: 317168706,
      //       hasVATRegistered: true
      //     }
      //   },
      //   {
      //     id: 40,
      //     firstname: 'Etta',
      //     middlename: 'Ratliff',
      //     lastname: 'Erickson',
      //     city: 'Stonybrook',
      //     address: 'Devon Avenue',
      //     phone: '(882) 526-2533',
      //     invoiceDetails: {
      //       company: 'Kog',
      //       city: 'Charco',
      //       address: 'Brooklyn Road',
      //       strNum: 539,
      //       mol: 'Leonor Reyes',
      //       bulstat: 706589234,
      //       hasVATRegistered: true
      //     }
      //   },
      //   {
      //     id: 958,
      //     firstname: 'Bentley',
      //     middlename: 'Potter',
      //     lastname: 'Collier',
      //     city: 'Savage',
      //     address: 'Albemarle Road',
      //     phone: '(823) 427-3147',
      //     invoiceDetails: {
      //       company: 'Bleeko',
      //       city: 'Shindler',
      //       address: 'Conway Street',
      //       strNum: 199,
      //       mol: 'Becker Boone',
      //       bulstat: 925828277,
      //       hasVATRegistered: true
      //     }
      //   },
      //   {
      //     id: 594,
      //     firstname: 'Concetta',
      //     middlename: 'Hess',
      //     lastname: 'Winters',
      //     city: 'Lawrence',
      //     address: 'Coleman Street',
      //     phone: '(825) 593-2204',
      //     invoiceDetails: {
      //       company: 'Genekom',
      //       city: 'Fruitdale',
      //       address: 'Reeve Place',
      //       strNum: 597,
      //       mol: 'Tricia Parker',
      //       bulstat: 814514685,
      //       hasVATRegistered: false
      //     }
      //   },
      //   {
      //     id: 1013,
      //     firstname: 'Maryann',
      //     middlename: 'Travis',
      //     lastname: 'Puckett',
      //     city: 'Zeba',
      //     address: 'Billings Place',
      //     phone: '(915) 510-2565',
      //     invoiceDetails: {
      //       company: 'Zensus',
      //       city: 'Dalton',
      //       address: 'Montauk Avenue',
      //       strNum: 83,
      //       mol: 'Contreras Mccall',
      //       bulstat: 245368914,
      //       hasVATRegistered: true
      //     }
      //   },
      //   {
      //     id: 777,
      //     firstname: 'Rhea',
      //     middlename: 'Cruz',
      //     lastname: 'Dawson',
      //     city: 'Harviell',
      //     address: 'Berkeley Place',
      //     phone: '(913) 575-3966',
      //     invoiceDetails: {
      //       company: 'Overplex',
      //       city: 'Sattley',
      //       address: 'Colin Place',
      //       strNum: 596,
      //       mol: 'Jewel Huffman',
      //       bulstat: 746266562,
      //       hasVATRegistered: false
      //     }
      //   },
      //   {
      //     id: 725,
      //     firstname: 'Ochoa',
      //     middlename: 'Fisher',
      //     lastname: 'Burgess',
      //     city: 'Logan',
      //     address: 'Seigel Street',
      //     phone: '(962) 488-3438',
      //     invoiceDetails: {
      //       company: 'Zinca',
      //       city: 'Loveland',
      //       address: 'Senator Street',
      //       strNum: 882,
      //       mol: 'Wright Schwartz',
      //       bulstat: 45518392,
      //       hasVATRegistered: true
      //     }
      //   },
      //   {
      //     id: 743,
      //     firstname: 'Muriel',
      //     middlename: 'Miller',
      //     lastname: 'Robbins',
      //     city: 'Fingerville',
      //     address: 'Bowne Street',
      //     phone: '(900) 568-3642',
      //     invoiceDetails: {
      //       company: 'Songlines',
      //       city: 'Carrsville',
      //       address: 'Fillmore Avenue',
      //       strNum: 169,
      //       mol: 'Deleon Henson',
      //       bulstat: 534360843,
      //       hasVATRegistered: true
      //     }
      //   },
      //   {
      //     id: 1145,
      //     firstname: 'Susanna',
      //     middlename: 'Boyer',
      //     lastname: 'Keller',
      //     city: 'Brazos',
      //     address: 'Empire Boulevard',
      //     phone: '(812) 555-2250',
      //     invoiceDetails: {
      //       company: 'Aquoavo',
      //       city: 'Hasty',
      //       address: 'Hoyts Lane',
      //       strNum: 698,
      //       mol: 'Jewell Howell',
      //       bulstat: 216355665,
      //       hasVATRegistered: true
      //     }
      //   },
      //   {
      //     id: 207,
      //     firstname: 'Wood',
      //     middlename: 'Harding',
      //     lastname: 'Pittman',
      //     city: 'Ola',
      //     address: 'Willow Street',
      //     phone: '(987) 600-3738',
      //     invoiceDetails: {
      //       company: 'Oceanica',
      //       city: 'Marshall',
      //       address: 'Navy Street',
      //       strNum: 619,
      //       mol: 'Riley Moss',
      //       bulstat: 49572283,
      //       hasVATRegistered: false
      //     }
      //   },
      //   {
      //     id: 2,
      //     firstname: 'Coleen',
      //     middlename: 'Key',
      //     lastname: 'Hoffman',
      //     city: 'Graball',
      //     address: 'Bedell Lane',
      //     phone: '(807) 410-2523',
      //     invoiceDetails: {
      //       company: 'Geofarm',
      //       city: 'Dubois',
      //       address: 'Bogart Street',
      //       strNum: 479,
      //       mol: 'Hancock Randall',
      //       bulstat: 759382134,
      //       hasVATRegistered: false
      //     }
      //   },
      //   {
      //     id: 411,
      //     firstname: 'Wallace',
      //     middlename: 'Dorsey',
      //     lastname: 'Mcgee',
      //     city: 'Eastmont',
      //     address: 'Lenox Road',
      //     phone: '(856) 476-2847',
      //     invoiceDetails: {
      //       company: 'Megall',
      //       city: 'Seymour',
      //       address: 'Seacoast Terrace',
      //       strNum: 47,
      //       mol: 'Bernadine Tyler',
      //       bulstat: 671267603,
      //       hasVATRegistered: false
      //     }
      //   },
      //   {
      //     id: 1094,
      //     firstname: 'Garner',
      //     middlename: 'Rose',
      //     lastname: 'Ellis',
      //     city: 'Northchase',
      //     address: 'Sumner Place',
      //     phone: '(828) 575-3554',
      //     invoiceDetails: {
      //       company: 'Autograte',
      //       city: 'Movico',
      //       address: 'Olive Street',
      //       strNum: 100,
      //       mol: 'Sonya Mcpherson',
      //       bulstat: 36551896,
      //       hasVATRegistered: false
      //     }
      //   },
      //   {
      //     id: 516,
      //     firstname: 'Janis',
      //     middlename: 'Santana',
      //     lastname: 'Branch',
      //     city: 'Urie',
      //     address: 'Jewel Street',
      //     phone: '(838) 459-3140',
      //     invoiceDetails: {
      //       company: 'Zanilla',
      //       city: 'Rosburg',
      //       address: 'Jodie Court',
      //       strNum: 714,
      //       mol: 'York Lane',
      //       bulstat: 471558461,
      //       hasVATRegistered: false
      //     }
      //   },
      //   {
      //     id: 157,
      //     firstname: 'Lourdes',
      //     middlename: 'Leonard',
      //     lastname: 'Stevenson',
      //     city: 'Gorst',
      //     address: 'Manor Court',
      //     phone: '(824) 502-2531',
      //     invoiceDetails: {
      //       company: 'Besto',
      //       city: 'Davenport',
      //       address: 'Crosby Avenue',
      //       strNum: 812,
      //       mol: 'Payne Patrick',
      //       bulstat: 39456942,
      //       hasVATRegistered: true
      //     }
      //   },
      //   {
      //     id: 190,
      //     firstname: 'Maddox',
      //     middlename: 'Burton',
      //     lastname: 'Klein',
      //     city: 'Ruffin',
      //     address: 'Cadman Plaza',
      //     phone: '(843) 553-2069',
      //     invoiceDetails: {
      //       company: 'Fuelton',
      //       city: 'Allendale',
      //       address: 'Willoughby Avenue',
      //       strNum: 169,
      //       mol: 'Stokes Levy',
      //       bulstat: 303598375,
      //       hasVATRegistered: false
      //     }
      //   },
      //   {
      //     id: 1081,
      //     firstname: 'Hogan',
      //     middlename: 'Gould',
      //     lastname: 'Hopkins',
      //     city: 'Riegelwood',
      //     address: 'Paerdegat Avenue',
      //     phone: '(926) 450-3924',
      //     invoiceDetails: {
      //       company: 'Petigems',
      //       city: 'Sultana',
      //       address: 'Varanda Place',
      //       strNum: 147,
      //       mol: 'Melinda Gentry',
      //       bulstat: 254071213,
      //       hasVATRegistered: false
      //     }
      //   },
      //   {
      //     id: 1122,
      //     firstname: 'Pollard',
      //     middlename: 'Chambers',
      //     lastname: 'Miles',
      //     city: 'Libertytown',
      //     address: 'Herkimer Street',
      //     phone: '(849) 551-2703',
      //     invoiceDetails: {
      //       company: 'Menbrain',
      //       city: 'Choctaw',
      //       address: 'Lott Street',
      //       strNum: 654,
      //       mol: 'Rush Schneider',
      //       bulstat: 987523904,
      //       hasVATRegistered: true
      //     }
      //   },
      //   {
      //     id: 962,
      //     firstname: 'Leona',
      //     middlename: 'Tyson',
      //     lastname: 'Wilkins',
      //     city: 'Geyserville',
      //     address: 'Porter Avenue',
      //     phone: '(924) 400-2452',
      //     invoiceDetails: {
      //       company: 'Zogak',
      //       city: 'Crisman',
      //       address: 'Burnett Street',
      //       strNum: 941,
      //       mol: 'Berta Bartlett',
      //       bulstat: 608173986,
      //       hasVATRegistered: false
      //     }
      //   },
      //   {
      //     id: 33,
      //     firstname: 'Luella',
      //     middlename: 'Page',
      //     lastname: 'Bishop',
      //     city: 'Eden',
      //     address: 'Lincoln Avenue',
      //     phone: '(861) 482-2015',
      //     invoiceDetails: {
      //       company: 'Gynko',
      //       city: 'Osmond',
      //       address: 'Atkins Avenue',
      //       strNum: 321,
      //       mol: 'Bailey Bernard',
      //       bulstat: 503095175,
      //       hasVATRegistered: true
      //     }
      //   },
      //   {
      //     id: 809,
      //     firstname: 'Summers',
      //     middlename: 'Bell',
      //     lastname: 'Bond',
      //     city: 'Hickory',
      //     address: 'Colonial Court',
      //     phone: '(911) 442-3771',
      //     invoiceDetails: {
      //       company: 'Interodeo',
      //       city: 'Woodburn',
      //       address: 'Taaffe Place',
      //       strNum: 887,
      //       mol: 'Lacey Hopper',
      //       bulstat: 567448167,
      //       hasVATRegistered: true
      //     }
      //   },
      //   {
      //     id: 39,
      //     firstname: 'Graciela',
      //     middlename: 'Vazquez',
      //     lastname: 'Mack',
      //     city: 'Westwood',
      //     address: 'Cass Place',
      //     phone: '(809) 493-3583',
      //     invoiceDetails: {
      //       company: 'Ovium',
      //       city: 'Moquino',
      //       address: 'Turner Place',
      //       strNum: 234,
      //       mol: 'Fields Clark',
      //       bulstat: 188353707,
      //       hasVATRegistered: true
      //     }
      //   },
      //   {
      //     id: 891,
      //     firstname: 'Brady',
      //     middlename: 'House',
      //     lastname: 'Cunningham',
      //     city: 'Fidelis',
      //     address: 'Exeter Street',
      //     phone: '(891) 536-2723',
      //     invoiceDetails: {
      //       company: 'Stucco',
      //       city: 'Cumminsville',
      //       address: 'Perry Place',
      //       strNum: 499,
      //       mol: 'Jeanine Stuart',
      //       bulstat: 627348731,
      //       hasVATRegistered: true
      //     }
      //   },
      //   {
      //     id: 382,
      //     firstname: 'Glenn',
      //     middlename: 'Sims',
      //     lastname: 'Sexton',
      //     city: 'Cleary',
      //     address: 'Hamilton Avenue',
      //     phone: '(944) 436-3055',
      //     invoiceDetails: {
      //       company: 'Pharmex',
      //       city: 'Cedarville',
      //       address: 'Coyle Street',
      //       strNum: 864,
      //       mol: 'Erickson Reeves',
      //       bulstat: 7082175,
      //       hasVATRegistered: false
      //     }
      //   },
      //   {
      //     id: 738,
      //     firstname: 'Stevenson',
      //     middlename: 'Pope',
      //     lastname: 'Carlson',
      //     city: 'Mammoth',
      //     address: 'Overbaugh Place',
      //     phone: '(923) 446-2208',
      //     invoiceDetails: {
      //       company: 'Hairport',
      //       city: 'Hannasville',
      //       address: 'Tennis Court',
      //       strNum: 718,
      //       mol: 'Ester Prince',
      //       bulstat: 643897547,
      //       hasVATRegistered: false
      //     }
      //   },
      //   {
      //     id: 298,
      //     firstname: 'Thomas',
      //     middlename: 'Best',
      //     lastname: 'Hall',
      //     city: 'Gratton',
      //     address: 'Vermont Court',
      //     phone: '(865) 590-2813',
      //     invoiceDetails: {
      //       company: 'Navir',
      //       city: 'Temperanceville',
      //       address: 'Plymouth Street',
      //       strNum: 149,
      //       mol: 'Roach Morton',
      //       bulstat: 457263419,
      //       hasVATRegistered: true
      //     }
      //   },
      //   {
      //     id: 51,
      //     firstname: 'Downs',
      //     middlename: 'Williams',
      //     lastname: 'Vinson',
      //     city: 'Smock',
      //     address: 'Debevoise Avenue',
      //     phone: '(850) 461-3366',
      //     invoiceDetails: {
      //       company: 'Zolavo',
      //       city: 'Callaghan',
      //       address: 'Driggs Avenue',
      //       strNum: 181,
      //       mol: 'Nola Hutchinson',
      //       bulstat: 694997164,
      //       hasVATRegistered: false
      //     }
      //   },
      //   {
      //     id: 487,
      //     firstname: 'Owens',
      //     middlename: 'Walter',
      //     lastname: 'Durham',
      //     city: 'Orin',
      //     address: 'Delevan Street',
      //     phone: '(944) 480-3445',
      //     invoiceDetails: {
      //       company: 'Prosely',
      //       city: 'Columbus',
      //       address: 'Hendrickson Place',
      //       strNum: 270,
      //       mol: 'Kellie Barker',
      //       bulstat: 85583438,
      //       hasVATRegistered: true
      //     }
      //   },
      //   {
      //     id: 1202,
      //     firstname: 'Zelma',
      //     middlename: 'Austin',
      //     lastname: 'Bush',
      //     city: 'Vicksburg',
      //     address: 'Boerum Place',
      //     phone: '(814) 570-3936',
      //     invoiceDetails: {
      //       company: 'Grainspot',
      //       city: 'Taft',
      //       address: 'Lancaster Avenue',
      //       strNum: 2,
      //       mol: 'Gallagher Mercado',
      //       bulstat: 301659948,
      //       hasVATRegistered: false
      //     }
      //   },
      //   {
      //     id: 711,
      //     firstname: 'Essie',
      //     middlename: 'Yates',
      //     lastname: 'Chavez',
      //     city: 'Tyro',
      //     address: 'Ferry Place',
      //     phone: '(986) 407-2357',
      //     invoiceDetails: {
      //       company: 'Cosmosis',
      //       city: 'Gerton',
      //       address: 'Montague Street',
      //       strNum: 197,
      //       mol: 'Wynn Lindsay',
      //       bulstat: 634766566,
      //       hasVATRegistered: false
      //     }
      //   },
      //   {
      //     id: 578,
      //     firstname: 'Richard',
      //     middlename: 'Weaver',
      //     lastname: 'Mcmillan',
      //     city: 'Springdale',
      //     address: 'Halleck Street',
      //     phone: '(954) 493-3786',
      //     invoiceDetails: {
      //       company: 'Qaboos',
      //       city: 'Ezel',
      //       address: 'Havemeyer Street',
      //       strNum: 523,
      //       mol: 'Lynn Small',
      //       bulstat: 365849736,
      //       hasVATRegistered: false
      //     }
      //   },
      //   {
      //     id: 735,
      //     firstname: 'Prince',
      //     middlename: 'Meadows',
      //     lastname: 'Hinton',
      //     city: 'Belfair',
      //     address: 'Hanson Place',
      //     phone: '(882) 489-2715',
      //     invoiceDetails: {
      //       company: 'Medalert',
      //       city: 'Jamestown',
      //       address: 'Radde Place',
      //       strNum: 293,
      //       mol: 'Acevedo Justice',
      //       bulstat: 394365135,
      //       hasVATRegistered: true
      //     }
      //   },
      //   {
      //     id: 840,
      //     firstname: 'Lydia',
      //     middlename: 'Cortez',
      //     lastname: 'Noble',
      //     city: 'Rossmore',
      //     address: 'Knight Court',
      //     phone: '(993) 488-2461',
      //     invoiceDetails: {
      //       company: 'Pyramia',
      //       city: 'Rosedale',
      //       address: 'Vandervoort Place',
      //       strNum: 775,
      //       mol: 'Bonita Estrada',
      //       bulstat: 904492873,
      //       hasVATRegistered: false
      //     }
      //   },
      //   {
      //     id: 955,
      //     firstname: 'Kirk',
      //     middlename: 'Cameron',
      //     lastname: 'Melton',
      //     city: 'Darlington',
      //     address: 'Saratoga Avenue',
      //     phone: '(856) 402-3212',
      //     invoiceDetails: {
      //       company: 'Bolax',
      //       city: 'Tibbie',
      //       address: 'Grant Avenue',
      //       strNum: 917,
      //       mol: 'Drake Peters',
      //       bulstat: 59927643,
      //       hasVATRegistered: false
      //     }
      //   },
      //   {
      //     id: 606,
      //     firstname: 'Best',
      //     middlename: 'Foley',
      //     lastname: 'Spears',
      //     city: 'Eagletown',
      //     address: 'Gerald Court',
      //     phone: '(993) 491-2854',
      //     invoiceDetails: {
      //       company: 'Vetron',
      //       city: 'Germanton',
      //       address: 'Ira Court',
      //       strNum: 800,
      //       mol: 'Nadia Coleman',
      //       bulstat: 24928285,
      //       hasVATRegistered: true
      //     }
      //   },
      //   {
      //     id: 1073,
      //     firstname: 'Moore',
      //     middlename: 'Cain',
      //     lastname: 'Stewart',
      //     city: 'Shaft',
      //     address: 'Williams Avenue',
      //     phone: '(974) 561-3231',
      //     invoiceDetails: {
      //       company: 'Snorus',
      //       city: 'Avoca',
      //       address: 'Broadway ',
      //       strNum: 355,
      //       mol: 'Cummings Haney',
      //       bulstat: 859963976,
      //       hasVATRegistered: true
      //     }
      //   },
      //   {
      //     id: 197,
      //     firstname: 'Schwartz',
      //     middlename: 'Cleveland',
      //     lastname: 'Aguirre',
      //     city: 'Lafferty',
      //     address: 'Wogan Terrace',
      //     phone: '(904) 591-3550',
      //     invoiceDetails: {
      //       company: 'Acruex',
      //       city: 'Rehrersburg',
      //       address: 'Folsom Place',
      //       strNum: 353,
      //       mol: 'Greer Cooke',
      //       bulstat: 262851714,
      //       hasVATRegistered: false
      //     }
      //   },
      //   {
      //     id: 1229,
      //     firstname: 'Shaw',
      //     middlename: 'Ross',
      //     lastname: 'Macias',
      //     city: 'Stewart',
      //     address: 'Riverdale Avenue',
      //     phone: '(928) 406-3538',
      //     invoiceDetails: {
      //       company: 'Ecrater',
      //       city: 'Beaulieu',
      //       address: 'Dahill Road',
      //       strNum: 59,
      //       mol: 'Marquita Carter',
      //       bulstat: 57511432,
      //       hasVATRegistered: true
      //     }
      //   },
      //   {
      //     id: 261,
      //     firstname: 'Jamie',
      //     middlename: 'Baker',
      //     lastname: 'Frost',
      //     city: 'Leola',
      //     address: 'Moultrie Street',
      //     phone: '(874) 440-3421',
      //     invoiceDetails: {
      //       company: 'Kneedles',
      //       city: 'Harleigh',
      //       address: 'Pooles Lane',
      //       strNum: 627,
      //       mol: 'Lorie Ingram',
      //       bulstat: 813944335,
      //       hasVATRegistered: true
      //     }
      //   },
      //   {
      //     id: 101,
      //     firstname: 'Esperanza',
      //     middlename: 'Orr',
      //     lastname: 'Kerr',
      //     city: 'Fairlee',
      //     address: 'Strickland Avenue',
      //     phone: '(881) 593-3257',
      //     invoiceDetails: {
      //       company: 'Singavera',
      //       city: 'Bentley',
      //       address: 'Conklin Avenue',
      //       strNum: 868,
      //       mol: 'Osborne Shaw',
      //       bulstat: 578647326,
      //       hasVATRegistered: true
      //     }
      //   },
      //   {
      //     id: 62,
      //     firstname: 'Barrera',
      //     middlename: 'Hickman',
      //     lastname: 'Fox',
      //     city: 'Bartley',
      //     address: 'Monument Walk',
      //     phone: '(834) 405-3080',
      //     invoiceDetails: {
      //       company: 'Freakin',
      //       city: 'Bellamy',
      //       address: 'Nelson Street',
      //       strNum: 594,
      //       mol: 'Simone Wallace',
      //       bulstat: 10436817,
      //       hasVATRegistered: false
      //     }
      //   },
      //   {
      //     id: 809,
      //     firstname: 'Sylvia',
      //     middlename: 'Brewer',
      //     lastname: 'Randolph',
      //     city: 'Lacomb',
      //     address: 'Interborough Parkway',
      //     phone: '(900) 584-3763',
      //     invoiceDetails: {
      //       company: 'Zolarex',
      //       city: 'Tivoli',
      //       address: 'Tompkins Avenue',
      //       strNum: 934,
      //       mol: 'Meagan Duffy',
      //       bulstat: 247813439,
      //       hasVATRegistered: true
      //     }
      //   },
      //   {
      //     id: 623,
      //     firstname: 'Dollie',
      //     middlename: 'Glover',
      //     lastname: 'Buckner',
      //     city: 'Swartzville',
      //     address: 'Lester Court',
      //     phone: '(800) 415-2946',
      //     invoiceDetails: {
      //       company: 'Indexia',
      //       city: 'Veguita',
      //       address: 'Kansas Place',
      //       strNum: 208,
      //       mol: 'Richardson Knowles',
      //       bulstat: 18521196,
      //       hasVATRegistered: true
      //     }
      //   },
      //   {
      //     id: 20,
      //     firstname: 'Celia',
      //     middlename: 'Hale',
      //     lastname: 'Short',
      //     city: 'Crenshaw',
      //     address: 'Rutland Road',
      //     phone: '(855) 447-3984',
      //     invoiceDetails: {
      //       company: 'Zillar',
      //       city: 'Eureka',
      //       address: 'Montieth Street',
      //       strNum: 148,
      //       mol: 'Garza Benton',
      //       bulstat: 206277998,
      //       hasVATRegistered: false
      //     }
      //   },
      //   {
      //     id: 739,
      //     firstname: 'Newman',
      //     middlename: 'Roman',
      //     lastname: 'Baird',
      //     city: 'Sylvanite',
      //     address: 'Lloyd Street',
      //     phone: '(828) 490-2740',
      //     invoiceDetails: {
      //       company: 'Exotechno',
      //       city: 'Chestnut',
      //       address: 'Melba Court',
      //       strNum: 688,
      //       mol: 'Fulton Merrill',
      //       bulstat: 20256288,
      //       hasVATRegistered: true
      //     }
      //   },
      //   {
      //     id: 805,
      //     firstname: 'Franks',
      //     middlename: 'Finley',
      //     lastname: 'Butler',
      //     city: 'Hailesboro',
      //     address: 'Kingsway Place',
      //     phone: '(868) 477-2540',
      //     invoiceDetails: {
      //       company: 'Hivedom',
      //       city: 'Stevens',
      //       address: 'Boynton Place',
      //       strNum: 73,
      //       mol: 'Dorsey Hodges',
      //       bulstat: 496949687,
      //       hasVATRegistered: false
      //     }
      //   },
      //   {
      //     id: 408,
      //     firstname: 'Clare',
      //     middlename: 'King',
      //     lastname: 'Lewis',
      //     city: 'Orviston',
      //     address: 'Terrace Place',
      //     phone: '(845) 454-3604',
      //     invoiceDetails: {
      //       company: 'Deepends',
      //       city: 'Centerville',
      //       address: 'Woodpoint Road',
      //       strNum: 660,
      //       mol: 'Howard Gonzalez',
      //       bulstat: 965792539,
      //       hasVATRegistered: false
      //     }
      //   }
      //
      // ],
      selectedService: '',
      total: 0.00,
      paymentMethod: null
    }
  },
  validations: {
    invoice: {
      invoiceDetails: {
        invoiceDate: {
          required
        }
      }
    }
  },
  mounted() {
    this.getPatientsAsCustomers()
  },
  methods: {
    getPatientsAsCustomers() {
      axios.get(`/api/patients`)
      .then(
          (data) => {
            this.customers = data.data
          }
      )
    },
    logx() {
      axios.post(`/api/invoices/create`, this.$store.state.invoice)
      .then(
          (data) => {
            console.log(data)
          }
      )
    },
    iwantu () {
      this.$root.$emit('update-items')
      // console.log(this.$store.state.items)
    },
    pushToStore (payload) {
      console.log('payload', payload)
    },
    pdfFaktura () {
      if (this.$store.state.invoice.paymentMethod) {
          console.log('maika ti')
      } else {
        this.$swal('sfs')
      }
    },
    removeItemFromItemsToInvoice (item) {
      // console.log(this.itemsToInvoice.indexOf(item))
      const itemPosition = this.itemsToInvoice.indexOf(item)
      if (itemPosition !== -1) {
        this.itemsToInvoice.splice(itemPosition, 1)
      }
    },
    pushToServices (item) {
      if (item !== null) {
        item.discount = ''
        item.lineTotal = 0
        item.uid = this.$uuid.v4()
        this.itemsToInvoice.push(item)
      }
      this.selectedService = null
    }
  },
  computed: {
    calculateTotal () {
      let total = 0
      this.itemsToInvoice.forEach(item => {
        // {{ parseFloat(invoiceItem.price * invoiceItem.qty) - ((invoiceItem.discount / 100) * parseFloat(invoiceItem.price * invoiceItem.qty)) }} лв.
        total += parseFloat(item.price) * item.qty - parseFloat(item.discount / 100) * parseFloat(item.price * item.qty)
      })
      return total
    }
  }
}
</script>

<style scoped>
@import "~vue-multiselect/dist/vue-multiselect.min.css";
</style>
