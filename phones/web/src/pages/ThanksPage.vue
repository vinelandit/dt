<template>
  <div class="outer">
    
   <h2 style="color:yellow; text-align:center">THANKS!</h2>
   <div class="status" @click="WS.send('text')">{{ impStore.status }}</div>

  </div>
</template>

<script>


import WS from '../services/ws'
import { useImpStore } from '../stores/imp-store.js'
import { watch, defineComponent } from 'vue'
export default defineComponent({
  name: 'ThanksPage',
  
  setup() {

    const impStore = useImpStore()
    // TURN OFF WAKE LOCK ETC
    return { WS, impStore }
  }
})




</script>

<style lang="scss">
  
  .signal {
    position: fixed;
    top:0;
    left:0;
    right:0;
    height: 4px;
    background-color:red;
  }
  .outer {
    position: fixed;
    left:0;
    right:0;
    top:0;
    bottom:0;
    background-color:black;
  }
  .button {

    position: relative;
    top: 50%;
    transform: translateY(-50%);
    width:90%;
    height:0;
    padding-bottom:90%;
    background-color:purple;

    border-radius: 50%;
    margin: 0 auto;
  }
  .status {

    position:absolute;
    bottom:0;
    width:100%;
    color:white;
    font-size:20px;
    display:block;
    padding-bottom: 20px;
    text-align: center;
  }
  .start {
    position:absolute;
    top:0;
    width:100%;
    color:white;
    font-size:30px;
    display:block;
    padding-top: 30px;
    text-align: center;

  }
</style>
