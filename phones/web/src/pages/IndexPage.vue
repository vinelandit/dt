<template>
  <div class="outer">
    <div class="signal" :style="{ opacity: Math.abs(Math.sin(impStore.streamPhase)) }"></div>
   
      <div class="button">
      </div>
  

    <div class="status" @click="exit()">{{ impStore.status }}</div>

  </div>
</template>

<script>
 

import WS from '../services/ws'
import { useImpStore } from '../stores/imp-store.js'
import { useQuasar } from 'quasar'
import { useRouter, useRoute } from 'vue-router'
import { watch, defineComponent } from 'vue'


import sensorData from '../services/getSensorData'


export default defineComponent({
  name: 'IndexPage',
  mounted() {
    // console.log(WS)

  },
  setup() {

    const impStore = useImpStore()
    
    const r = useRouter()
    const rq = useRoute().query
    const $q = useQuasar()

    const exit = function() {
      
      $q.cookies.set('already_played', 1)
      WS.socket.close()
      r.replace('/thanks')
      
    }

    // watch for exit call
    watch(() => impStore.isDone, function() {
      exit()
    })

    const allowAccess = function() {
      $q.dialog({
        title: 'Welcome to Remyxtory',
        message: 'Please tap OK and allow sensor access to begin!',
        cancel: true,
        persistent: true
      }).onOk(() => {
        // console.log('>>>> OK')
        requestSensorData()

      }).onCancel(() => {
        // console.log('>>>> Cancel')
        exit()
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
      if(e.target.classList.contains('button') && impStore.streamActive) {
        btnState(1)
      }
    })
    
    document.addEventListener('touchend', function(e) {
      btnState(0)
    })
    

    console.log(r)
    if(!rq.pid || !rq.phash || 5 + rq.pid * 7611 != rq.phash) {
      location.href = "error.html"
      return false
    } else {

      impStore.pid = rq.pid
      impStore.phash = rq.phash
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
    
    
    return { confirmReplay, exit, r, impStore, requestSensorData, btnState }
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
