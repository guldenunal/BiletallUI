<template>
    <div>
        <section class="main">
            <div class="container">
                <div class="main-journeys">
                    <div class="card" v-for="(sefer, index) in responseData" :key="index">
                        <table>
                            <tr>
                                <th class="firma">{{ sefer.firmaAdi }}</th>
                                <th><img class="clock-img" src="../components/icons/icons8-clock.svg">{{
                                    formatTime(sefer.saat) }}</th>
                                <th><img class="img" src="../components/icons/a.svg"> {{ sefer.otobusKoltukYerlesimTipi }}
                                </th>
                                <th>{{ sefer.biletFiyatiInternet }} TL</th>
                                <th>
                                    <button type="button" class="btn btn-success mt-3" @click="getBusInfo(index)">Koltuk
                                        Seç</button>
                                </th>
                            </tr>

                            <tr id="alt-bilgi">
                                <td></td>
                                <td>{{ durationTime(sefer.seyahatSuresi) }}</td>
                                <td>{{ sefer.kalkisNokta }} -> {{ sefer.varisNokta }}</td>
                                <td></td>

                            </tr>
                        </table>
                        <seatDropdown v-if="isMenuOpen[index]"></seatDropdown>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import seatDropdown from '../components/BusComponents/seatDropdown.vue';
import {
    storeToRefs
} from 'pinia';
import {
    storeResponseData
} from '../store/journeystore';
import axios, {
    formToJSON
} from 'axios';
export default {
    components: {
        seatDropdown
    },
    data() {
        return {
            responseData: [],
            isMenuOpen: {},
            selectedBus: []
        }
    },
    methods: {

        formatTime(saat) {
            // Parse the input time string into a Date object
            const date = new Date(saat);

            // Get the local time in HH:MM format
            const hours = date.getUTCHours()+3;
            const minutes = date.getUTCMinutes();

           
                return `${hours}:${minutes}`;

            
        },
        durationTime(time) {
            const date = new Date(time);
            const hours =  date.getUTCHours()+3;
            const minutes =date.getUTCMinutes();

           if(minutes===0) 
           return `${hours} Saat ${minutes} Dakika`;
            else
                return `${hours} Saat`;
        },
        getBusInfo(n) {

            const store = storeResponseData();

            let axiosConfig = {
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    "Access-Control-Allow-Origin": "*",
                }
            };
            axios.post('https://localhost:44379/api/Bus/BusInfo', JSON.stringify(this.responseData[n]), axiosConfig)
                .then((res) => {
                    const busInfo = res.data;
                    store.$patch({
                        busData: busInfo
                    });
                    this.selectedBus = this.responseData[n];
                    store.$patch({
                        selectedBusData: this.selectedBus
                    });
                    // Toggle the menu for the clicked card
                    this.isMenuOpen = {
                        ...this.isMenuOpen,
                        [n]: !this.isMenuOpen[n]
                    };
                })
                .catch((error) => {
                    console.log(error)
                }).finally(() => {
                    //always
                });

        },
    },
    created() {
        const store = storeResponseData();
        const {
            journeyData,
        } = storeToRefs(store);
        this.responseData = journeyData;
    },
}
</script>

<style>
.main {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    margin: auto;
    position: inherit;
    padding: 20px;
    width: 100%;
}

.container {
    width: 90vhx;
}

.main-journeys {
    display: inline;
    margin-top: 20px;
    padding: 25px;
}

.main-journeys .card {
    width: 92%;
    margin-bottom: 20px;
    background: #fff;
    text-align: center;
    border-radius: 20px;
    padding: 20px;
}

.main-journeys .card .img {
    width: 1em;
    height: 1em;
    transform: rotate(-90deg);
}

.main-journeys .card .clock-img {
    width: 1em;
    height: 1em;
    margin-bottom: 3px;
    margin-right: 2px;

}

.main-journeys .card .th {
    margin: 10px;
    position: absolute;
    margin: 0.6em 0;
}

.main-journeys .card #alt-bilgi {
    font-size: small;
}

.main-journeys .card .firma {
    position: static;
    margin: auto;

}

.open {
    background: #22293f;
    color: #fff;
    margin: 0.5em 0 0;
    padding: 0.7em 1em;
    min-width: 8em;
    font-size: .8em;
    letter-spacing: .04em;
    text-transform: uppercase;
    border-radius: 0.4em;
}
</style>
