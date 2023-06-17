<template>
  <div class="outer">
    <div class="signal" :style="{ opacity: Math.abs(Math.sin(impStore.activeStream)) }"></div>{{ impStore.activeStream }}
   
      <div class="button">
      </div>
  

    <div class="status" @click="exit()">{{ impStore.status }}</div>

  </div>
</template>

<script>
 

import WS from '../services/ws'
import { useImpStore } from '../stores/imp-store.js'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { watch, defineComponent } from 'vue'


import sensorData from '../services/getSensorData'


export default defineComponent({
  name: 'IndexPage',
  mounted() {
    // console.log(WS)

  },
  setup() {

    const impStore = useImpStore()
    
    const r = useRoute().query
    const $q = useQuasar()

    const allowAccess = function() {
      $q.dialog({
        title: 'Welcome to The Remyxtory',
        message: 'Please tap OK and allow sensor access to begin!',
        cancel: true,
        persistent: true
      }).onOk(() => {
        // console.log('>>>> OK')
        requestSensorData()

      }).onCancel(() => {
        // console.log('>>>> Cancel')
        location.href="thanks.html"
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    }

    allowAccess()

    const confirmReplay  = function() {
      $q.dialog({
        title: 'Confirm',
        message: 'Would you like to join again? Please check that nobody is currently playing in this spot!',
        cancel: true,
        persistent: true
      }).onOk(() => {
        // console.log('>>>> OK')
        $q.cookies.remove('already_played')
        WS.connect()

      }).onCancel(() => {
        // console.log('>>>> Cancel')
        location.href="thanks.html"
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    }

    document.addEventListener('touchstart', function(e) {
      if(e.target.classList.contains('button')) {
        btnState(1)
      }
    })
    
    document.addEventListener('touchend', function(e) {
      btnState(0)
    })
    

    console.log(r)
    if(!r.pid || !r.phash || 5 + r.pid * 7611 != r.phash) {
      console.log('error handling here')
      impStore.pid = 1;
      impStore.phash = 7616;
    } else {

      impStore.pid = r.pid;
      impStore.phash = r.phash;
    }

    if($q.cookies.has('already_played')) {
      confirmReplay()
    } else {
      WS.connect()
    }

    sensorData.init(WS);


    const requestSensorData = function() {
      sensorData.captureMotion($q.platform.is.mobile)
    }

    const btnState = function(val) {
      impStore.btn = val;
      console.log('sending button', impStore.btn);
      WS.wsm({ btn: impStore.btn });
      
    }
    const exit = function() {
      $q.cookies.set('already_played', 1)
      location.href = "thanks.html"
    }
    
    return { confirmReplay, r, exit, impStore, requestSensorData, btnState }
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
