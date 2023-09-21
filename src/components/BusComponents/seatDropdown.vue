<template>
    <div id="app">
      <div class="container">
        <div class="row">
          <div class="col-8 py-5">
            <div>
              <table class="mx-auto">
                <tbody>
                  <tr v-for="idxr in rows">
                    <td v-for="idxc in cols" class="pl-2" style="width: 40px;">
                      <div
  @click="onSeatSelected(idxr, idxc)" 
  v-if="!isAisle(idxr, idxc)" 
  :class="classifier(idxr, idxc)"
  :style="{'pointer-events': isSeatClickable(idxr, idxc) ? 'auto' : 'none'}"
  style="width: 30px; height: 30px; border: 1px solid black;"
>
<span class="seat-number">{{ getSeatNo(idxr, idxc) }}</span>
</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="col-4 pt-3">
    <div class="card" v-show="selectedSeat !== null" style="display: none;">
      <div class="card-body">
        <!-- Display selected seat and gender -->
        <p v-if="selectedSeat">Selected Seat: {{ getSeatNo(selectedSeat.position.r, selectedSeat.position.c) }}</p>
        <p v-if="selectedGender">Selected Gender: {{ selectedGender }}</p>

        <!-- Seat selection buttons -->
        <ul class="list-group">
          <li @click="selectSeatAndGender('female')" class="list-group-item" >
            <div class="float-left" style="width: 25px;">
              <div class="cls-fa" style="width: 30px; height: 30px; border: 1px solid black;"></div>
            </div>
            <span class="px-3">Reserve for Female</span>
          </li>
          <li @click="selectSeatAndGender('male')" class="list-group-item" >
            <div class="float-left" style="width: 25px;">
              <div class="cls-ma" style="width: 30px; height: 30px; border: 1px solid black;"></div>
            </div>
            <span class="px-3">Reserve for Male</span>
          </li>
        </ul>

        <!-- Clear selection button -->
        <button class="btn btn-danger mt-3" @click="clearSelection" style="margin: 7px;">seçimi sil</button>
        <button class="btn btn-warning mt-3" @click="rezerve" style="margin: 7px;">rezervasyon</button>
        <button class="btn btn-info mt-3" @click="satis" style="margin: 7px;">satın al</button>

</div></div>
    </div>      
  </div></div>
  </div></template>
    
    <script> 
import { storeToRefs } from 'pinia';
import { storeResponseData } from '../../store/journeystore';

export default{
      data(){
    return{ 
        errors: [],
        selectedSeat: null,
        rows: 5,
        cols: 14,
        seats: [],
        seatNo: [],
        seatInfo:[],
        seatStat: [],
        selectedGender: null,
        selectedBus: [],
        seatNum: 0
      };
    },
      computed: {},
      methods: {
        numOfrc(){
            const num = this.seatNum;
            var col;
            if(this.selectedBus.otobusKoltukYerlesimTipi == "2+1")
                col = Math.ceil((num+1)/3);

            if(this.selectedBus.otobusKoltukYerlesimTipi == "2+2")
                col = Math.ceil((num+1)/4);

            this.cols = col;
        },
        getSeat(r, c) {
          for (let i = 0; i < this.seats.length; ++i) {
            if (this.seats[i].position.r == r && this.seats[i].position.c == c) {
              return this.seats[i];
            }
          }
          return null;
        },
        isSeatClickable(r, c) {
    const seat = this.getSeat(r, c);
    if (seat) {
      return seat.status !== 1 && seat.status !== 3;
    }
    return true; // Default to clickable if seat information is not found
  },
 async rezerve() {
           
           const no =this.selectedSeat.no;
           const gender = this.selectedSeat.gender;
          let b= this.selectedBus;
          let a = ({koltukNo1: no, 
          cinsiyet: gender});

          const dataforR = {
            ...b,
            ...a
          }

           const store = storeResponseData();
           store.$patch({reservData: dataforR});
         await  this.$router.push({
                        name: 'ReservationView'
                    });
       },
       async satis() {
           
           const no =this.selectedSeat.no;
           const gender = this.selectedSeat.gender;
          let b= this.selectedBus;
          let a = ({koltukNo1: no, 
          cinsiyet: gender});

          const dataforR = {
            ...b,
            ...a
          }

           const store = storeResponseData();
           store.$patch({satisData: dataforR});
         await  this.$router.push({
                        name: 'PaymentView'
                    });
       },
  selectSeatAndGender(gender) {
      if (this.selectedSeat !== null) {
        this.selectedSeat.gender = gender === 'female' ? 1 : gender === 'male' ? 2 : 'RB';
        this.selectedGender = gender; // Set the selected gender
      }
    },

    clearSelection() {
      if (this.selectedSeat !== null) {
        // Clear the selected seat and gender
        this.selectedSeat.status = '0'; // Set back to available
        this.selectedGender = null;
        this.selectedSeat = null;
      }
    },
        generateSeats() {
 var n =0;
 
           for (let x = 1; x <= this.cols; ++x) {            
             
          for (var y=5; y >0; y--) {
              if (!this.isAisle(y, x) ) {
                let status = this.seatStat[n];
          let gender = status === 1 ? 1 : status === 3 ? 2 : null; 
          this.seats.push({
                  position: { r: y, c: x },
                  status: this.seatStat[n],
                  no: this.seatNo[n],
                  gender: gender, 
                });
                n+=1;
              }
            }
          }
        },
        getSeatNo(r,c){
            for (let i = 0; i < this.seats.length; ++i) {
                var row = this.seats[i].position.r;
                var col = this.seats[i].position.c;
               if(!((row == 4 ||row ==3)&& col == this.cols)){
              if (row == r && col == c) {
                return this.seatNo[i];}
               }
         
        }},
        classifier(r, c) {
          let seat = this.getSeat(r, c);
          if (seat != null) {
            if (this.selectedSeat != seat) {
              switch (seat.status) {
                case 0:
                  return "cls-ra";
                case 1:
                  return "cls-fb";
                case 3:
                  return "cls-mb";
                default:
                  return "cls-ra";
              }
            } else {
              return "cls-selected";
            }
          }
        },
        isAisle(r, c) {
        var col = this.cols;
           if(this.selectedBus.otobusKoltukYerlesimTipi == "2+1"){
            
             if (r == 3 || r==4) {
        if ( c != col) {
          return true;
        }
      }
      if(r==2 || r==1){
        if(c==(Math.ceil(col/2))){
          return true;
        }
      }}
      else if(this.selectedBus.otobusKoltukYerlesimTipi == "2+2"){
      
        if (r == 3) {
        if ( c != col) 
          return true;
      }
      if(r==2 || r==1){
        if(c==(Math.ceil(col/2)))
          return true;
      }
      }
     else
      return false;
        },
        onSeatSelected(r, c) {
          if (this.selectedSeat == this.getSeat(r, c)) {
            this.selectedSeat = null;
          } else {
            this.selectedSeat = this.getSeat(r, c);
          }
        },
         stats(){
            for (let i = 0; i < this.seatStat.length; ++i) {

              if(this.seatStat[i] === 0 ){
                     this.seatStatus(0)}
                     
              else if(this.seatStat[i] === 1 ){
                     this.seatStatus(1)

                }
                else if(this.seatStat[i] === 3){
                this.seatStatus(3)
                 }
                 
                 }
        },
        seatStatus(status) {
          if (this.selectedSeat != null) {
            if (this.selectedSeat.status == status) return "active";
          }
          return "";
        },
        changeSeatStatus(status) {
          if (this.selectedSeat != null) {
            for (let i = 0; i < this.seats.length; ++i) {
              if (this.seats[i].position.r == this.selectedSeat.position.r && this.seats[i].position.c == this.selectedSeat.position.c) {
                this.seats[i].status = this.seatStat[i];
                this.selectedSeat = null;
                break;
              }
            }
          }
        },
      },
      beforeMount(){
        
        const store = storeResponseData();
        const { busData, selectedBusData } = storeToRefs(store);
        this.seatInfo = busData;
        this.selectedBus = selectedBusData;

      },
      mounted() {
        for(let n = 0; n<this.seatInfo.length; n++){
       if(this.seatInfo[n].koltukNo !== -1 && this.seatInfo[n].koltukNo !== -3){
         this.seatStat.push(this.seatInfo[n].durum);
        this.seatNo.push(this.seatInfo[n].koltukNo)
        this.seatNum++;}
  }
    this.numOfrc();
    this.generateSeats();
    this.stats();
     },
    }</script>
    
    
<style>
.cls-selected {background-color:rgb(199, 199, 199);}
.cls-ra {background-color:#fff;}
.cls-rb {background-color:gray;}
.cls-fa {background-color:#fff; border: 5px solid #ff86f3 !important;}
.cls-fb {background-color:pink;}
.cls-ma {background-color:#fff;border: 5px solid rgb(72, 118, 255) !important;}
.cls-mb {background-color:rgb(118, 151, 250);} 
</style>