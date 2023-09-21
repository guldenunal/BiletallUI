<template>
    <div class="container p-3">
            <div class="row pb-5" id="rezervasyonkart">
                <div class="col-lg-6 my-auto pt-5">
                 
           <form v-on:submit.prevent="makeReservation">
            <h5><strong>rezervasyon bilgileri</strong></h5>
            <div class="form-group">
                                <label for="ad">Ad</label>
                                <input id="ad" class="form-control" v-model="model.adi">
                                <p></p>
                            </div>
                            <div class="form-group">
                                <label for="soyad">Soyad</label>
                                <input id="soyad" class="form-control" v-model="model.soyadi">
                                <p></p>
                            </div>
                            <div class="form-group">
                                <label for="tc">TC</label>
                                <input id="tc"  class="form-control" v-model="model.tcKimlikNo">
                                <p></p>
                            </div>
                            <div class="form-group">
                                <label for="telefon">Telefon</label>
                                <input id="telefon"  class="form-control" v-model="model.telefonNo">
                                <p></p>
                            </div>
                            <div class="form-group">
                                <label for="email">Email</label>
                                <input id="email"  class="form-control" v-model="model.eMail">
                                <p></p>
                            </div>
                            <button type="submit" class="btn btn-success mt-3" @click="makeReservation()">rezervasyon</button>

           </form>
         </div> <div class="col pt-5"> <h5><strong>otobüs bilgileri</strong></h5>
         <div class="card" id="bilgikarti">
            <p><strong>firma: </strong>{{ busData.firmaAdi }}</p>
           <p><strong>saat: </strong>{{ saat }}</p>
           <p><strong>{{ busData.kalkisNokta }} -> {{ busData.varisNokta }}</strong></p>
           <p><strong>koltuk no: </strong> {{ busData.koltukNo1 }}</p>
           <p><strong>fiyat: </strong>{{ busData.biletFiyatiInternet }} TL</p>
           <p><strong>cinsiyet: </strong>{{ busData.cinsiyet }}</p>
         </div></div>
   </div></div>
   </template>

   <script>
   import "bootstrap/dist/css/bootstrap.min.css";
   import "bootstrap/dist/js/bootstrap.min.js";
    import { storeResponseData } from '../store/journeystore';
    import { storeToRefs } from 'pinia';
    import axios from 'axios';
import Swal from 'sweetalert2';

   export default {
    components:{},
    data(){
        return{
            model: { 
                adi: "",
                soyadi: "",
                tcKimlikNo: "",
                telefonNo: "",
                eMail: "",
            },
            busData: null,        
            selectedBus: null, 
            selectedSeat: null, 
            errors: {},
            saat :""
        }
    },
methods:{
makeReservation(){
        const resvData ={
            ...this.model,
            ...this.busData
        };
        
        console.log(resvData);
        let axiosConfig = {
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    "Access-Control-Allow-Origin": "*",
                }
            };
            axios.post('https://localhost:44379/api/Bus/Reservation', JSON.stringify(resvData), axiosConfig)
                .then((res) => {
                    const store = storeResponseData();
                    const responseData = res.data;
                 /*   store.$patch({
                        reservData: responseData
                    }); */
                    if(res===null)
                    this.successPopup(responseData.pnr);
                    else
                    this.errorPopup();


                })
                .catch((error) => {
                    this.errorPopup();

                }).finally(() => {
                    //always
                });

},
checkForm:function(e) {
      this.errors = [];
      if(!this.ad) this.errors.push("name required.");      
      if(!this.soyad) this.errors.push("surname required.");
      if(!this.email) {
        this.errors.push("Email required.");
      } else if(!this.validEmail(this.email)) {
        this.errors.push("Valid email required.");        
      }
      if(this.tc<11) this.errors.push("tc not valid.");      
      if(!this.telefon) this.errors.push("phone number required.");      
      if(!this.errors.length) return true;
      e.preventDefault();
    },
validEmail: function (email) {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
    errorPopup(){
        Swal.fire({
    title: 'Error!',
    text: 'an error accured!',
    icon: 'error',
    confirmButtonText: 'ok'
});
    },
    successPopup(pnr){
        Swal.fire({
    title: 'PNR:',
    text: pnr,
    icon: 'success',
    confirmButtonText: 'ok'
    });
}
},
beforeMount(){
const store = storeResponseData();
const { reservData } = storeToRefs(store);
this.busData = reservData;
var gender = this.busData.cinsiyet;
if( gender==1 )
        this.busData.cinsiyet = "female";
    
    else if(gender == 2 )
        this.busData.cinsiyet = "male";
},
mounted(){
    const date = new Date(this.busData.saat);

// Get the local time in HH:MM format
const hours = date.getUTCHours()+3;
const minutes = date.getUTCMinutes();


    this.saat = `${hours}:${minutes}`;
}
}
   </script>
   <style>
#bilgikarti{
    margin: auto;
   
}
</style>