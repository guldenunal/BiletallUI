<template>
    <div class="container p-3">
            <div class="row pb-5" id="rezervasyonkart">
                <div class="col-lg-6 my-auto pt-5">
                 
           <form v-on:submit.prevent="makeReservation">
            <h5 style="margin-bottom: 20px;"><strong>satış bilgileri</strong></h5>
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
                            <h5 style="margin-top: 40px;"><strong>kart bilgileri</strong></h5>    
                            <div class="col pt-5" id="kartbilgi"> 
                            <div class="form-group" >
                                <label for="ad">Ad Soyad</label>
                                <input id="ad" class="form-control" v-model="model.krediKartSahip">
                                <p></p>
                            </div>
                            <div class="form-group">
                                <label for="kkNo">Kredi Kartı No</label>
                                <input id="kkNo" class="form-control" v-model="model.krediKartNo">
                                <p></p>
                            </div>
                            <div class="form-group">
                                <label for="kkST">Geçerlilik Tarihi</label>
                                <input id="kkST" class="form-control" v-model="model.krediKartGecerlilikTarihi">
                                <p></p>
                            </div>
                            <div class="form-group">
                                <label for="ccv">CCV</label>
                                <input id="ccv" class="form-control" v-model="model.krediKartCCV2">
                                <p></p>
                            </div>
                        </div>
                            <button type="submit" class="btn btn-success mt-3" @click="buyTicket()">satın al</button>

           </form>
         </div>  <div class="col pt-5" style="margin-left: 40px;"> <h5 style="margin-bottom: 50px;"><strong>otobüs bilgileri</strong></h5>
         <div class="card" id="bilgikarti">
          <p style="margin-left: 40px;"><strong>firma: </strong> {{busData.firmaAdi}}</p>
           <p style="margin-left: 40px;"><strong>saat: </strong>{{saat}} </p>
           <p style="margin-left: 40px;"><strong> {{busData.kalkisNokta}}  -> {{ busData.varisNokta}} </strong></p>
           <p style="margin-left: 40px;"><strong>koltuk no: </strong>  {{busData.koltukNo1}} </p>
           <p style="margin-left: 40px;"><strong>fiyat: </strong>{{busData.biletFiyatiInternet}}  TL</p>
           <p style="margin-left: 40px;"><strong>cinsiyet: </strong> {{gender}}</p> </div>
   </div></div></div>
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
                krediKartNo:"",
                krediKartSahip:"",
                krediKartGecerlilikTarihi:"",
                krediKartCCV2: "",
                

            },
            busData: null,        
            selectedBus: null, 
            selectedSeat: null, 
            errors: {},
            saat:"",
            gender:""
        }
    },
methods:{
buyTicket(){
       const satisData ={
            ...this.model,
            ...this.busData
        };
        
        let axiosConfig = {
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    "Access-Control-Allow-Origin": "*",
                }
            };
            axios.post('https://localhost:44379/api/Bus/Sell', JSON.stringify(satisData), axiosConfig)
                .then((res) => {
                    const store = storeResponseData();
                    const responseData = res.data;
                
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
const { satisData } = storeToRefs(store);
this.busData = satisData;

},
mounted(){
    const date = new Date(this.busData.saat);

    const hour =date.getUTCHours()+3;
    const minute =date.getUTCMinutes();
    this.saat = `${hour}:${minute}`;

    const yolcu = this.busData.cinsiyet;
    if(yolcu == 1)
        this.gender = "kadın";
    else if(yolcu == 2)
        this.gender = "erkek"
    
},}
   </script>
   <style>
#bilgikarti{
    margin: auto;
   
}
#kartbilgi{
    display:-webkit-box;
}
</style>