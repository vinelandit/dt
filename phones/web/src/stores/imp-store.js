import { defineStore } from 'pinia';
import WS from '../services/ws'

import { useQuasar } from 'quasar'
import { useRoute } from 'vue-router'

export const useImpStore = defineStore('impStore', {
  state: () => ({
    pid: -1,
    phash: -1,
    btn: 0,
    done: false,
    asInc: 0.05,
    streamPhase: 0,
    streamActive: false,
    status: 'Awaiting connection'
  }),

  getters: {
    isDone(state) {
      return state.done
    }
  },

  actions: {
    newData() {

      if(!this.streamActive) {

        const _this = this
        this.streamActive = true
        console.log('sending button ready')
        this.btn = -1
        WS.wsm({ btn: this.btn });
        window.setTimeout(function() {
          _this.btn = 0
          console.log('sending button off')
          WS.wsm({ btn: _this.btn });
        }, 500)
      }
      this.streamPhase += this.asInc
      this.streamPhase = this.streamPhase % (Math.PI * 2)


    }

    
  }
  
});
