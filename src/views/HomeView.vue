<template>
<div class="container-fluid m-0 p-0">
    <div style="" v-if="loading"><img style="margin-top: 5%; margin-left:40%;" src="../components/icons/loading-bus.gif" alt=""></div>
    <div id="sefer-bul" class="full-height p-4" v-if="!loading">
        <div class="container pt-3">
            <div class="row pb-5">

                <div class="col-lg-6 my-auto pt-5">
                    <div class="text-center mb-3">
                        <h3 style="color: white;">Otobüs Bileti Bul</h3>
                    </div>

                    <div id="search-box" class="border p-3 p-md bg-white rounded shadow">
                        <form v-on:submit.prevent="submitForm">

                            <div class="form-group">
                                <label for="kalkisNokta">Nereden</label>
                                <select class="js-example-basic-single" id="kalkisNokta" v-model="model.KalkisNoktaID">
                                    <option v-for="bus in busPoints" :key=bus.id :value=bus.id> {{bus.ad}} </option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label for="varisNokta">Nereye</label>
                                <select class="js-example-basic-single" id="varisNokta" v-model="model.VarisNoktaID">
                                    <option v-for="bus in busPoints" :key=bus.id :value=bus.id> {{ bus.ad }} </option>
                                </select>
                            </div>

                            <div class="time-picker-overlay">
                                <label>Gidiş Tarihi</label>
                                <VueDatePicker id="date" v-model="model.Tarih" :enable-time-picker="false" />
                            </div>

                            <div class="form-group">
                                <label for="yolcuSayisi">Yolcu Sayısı</label>
                                <input id="yolcuSayisi" placeholder="Yolcu sayısı" class="form-control" v-model="model.YolcuSayisi">
                                <p></p>
                            </div>

                            <div class="custom-control custom-checkbox">
                                <input type="checkbox" class="custom-control-input" id="araNoktaGelsin" v-model="model.AraNoktaGelsin" v-on:click="model.AraNoktaGelsin=1">
                                <label class="custom-control-label journey-class" for="araNoktaGelsin">Farklı kalkış noktasından başlayan seferleri göster</label>
                            </div>

                            <button type="submit" class="btn btn-success mt-3">Otobüs Bileti Bul</button>

                        </form>
                    </div>
                </div>
                <div class="col-lg-6"></div>

            </div>
        </div>
    </div>
</div>
</template>

<script>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import axios, {
    formToJSON
} from 'axios';
import {
    storeResponseData
} from '../store/journeystore'

export default {
    name: 'PostFromAxios',
    components: {
        VueDatePicker,
    },
    data() {

        return {
            model: {
                KalkisNoktaID: 0,
                VarisNoktaID: 0,
                Tarih: '',
                IslemTipi: 0,
                YolcuSayisi: 1,
                AraNoktaGelsin: 0,

            },

            busPoints: [],
            loading: false,

        };
    },
    methods: {
      async  submitForm() {
this.loading =true;
            let axiosConfig = {
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    "Access-Control-Allow-Origin": "*",
                }
            };
           await axios.post('https://localhost:44379/api/Bus/BusJourney', JSON.stringify(this.model), axiosConfig)
                .then((res) => {
                    const store = storeResponseData();
                    const responseData = res.data;
                    console.log(responseData);
                    store.$patch({
                        journeyData: responseData
                    });
                    this.$router.push({
                        name: 'JourneysView'
                    });
                })
                .catch((error) => {
                    console.log(error)
                }).finally(() => {
                    //always
                });
this.loading = false;
        },
        getBusPoints() {
            axios.get('https://localhost:44379/api/Bus')
                .then(res => {
                    this.busPoints = res.data
                })
                .catch(err => {
                    if (err.response) {
                        console.log("err.response")
                    } else if (err.request) {
                        console.log("err.request")
                    } else {
                        console.log("else")
                    }
                })
        },
        initializeSelect2() {
            $(document).ready(function () {
                $('.js-example-basic-single').select2({
                    dropdownParent: $('#search-box')

                });
            });

        }
    },
    created() {
        this.getBusPoints();
    },
}
</script>

<style>
#sefer-bul {
    background-color: #22293f;
    /*background: url('https://s3.eu-central-1.amazonaws.com/static.obilet.com/images/page-banner/spring-background-2020.png');
*/
}

.journey-class {
    margin-left: 5px;
}

.js-example-basic-single {
    display: block;
    width: 100%;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: var(--bs-body-color);
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-color: var(--bs-body-bg);
    background-clip: padding-box;
    border: var(--bs-border-width) solid var(--bs-border-color);
    border-radius: var(--bs-border-radius);
}

label {

    display: inline-block;
    position: relative;
    margin-bottom: 0.3em;
    font-weight: 500;
    background: #fff;
    color: #9d9d9c;
    z-index: 1;
}
</style>
