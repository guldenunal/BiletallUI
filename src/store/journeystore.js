import { defineStore } from "pinia";

export const storeResponseData = defineStore('responseData',{

    state: () => ({ journeyData: [], busData: [], reservData: [], selectedBusData:null, satisData: []}),


})