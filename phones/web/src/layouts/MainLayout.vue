<template>
  <q-layout>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>


</template>

<script>
import { defineComponent, ref } from 'vue'

import NoSleep from 'nosleep.js'
const noSleep = new NoSleep()

export default defineComponent({
  name: 'MainLayout',


  setup () {

    return {
    }
  }
})

document.addEventListener('touchmove', function (event) {
    event.preventDefault();
    // if (event.scale !== 1) { event.preventDefault(); }
  }, { passive: false });
  var lastTouchEnd = 0;
/* document.addEventListener('touchend', function (event) {
    var now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, false);
*/
document.addEventListener('dblclick', function(event) {
  event.stopPropagation();
  return false;

}, false);

document.addEventListener('click', function(event) {
  if(!noSleep.enabled) noSleep.enable()
  return false;

}, false);

</script>

<style lang="scss">
 
</style>
