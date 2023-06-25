import { ReconnectingWebSocket } from './reconnectingWS'
import { useImpStore } from '../stores/imp-store'
const impStore = useImpStore()

import { useRoute } from 'vue-router'


const WS = {

  socket: null,
  lastSend: 0,
  url: location.host.indexOf('imp-') > -1 ? 'wss://'+location.host.split(':')[0]+':443' : 'wss://dtws.herokuapp.com',

  connect: function() {


    if(!this.socket || this.socket.readyState>1) {
      
      console.log('WS connecting')
      
      var _this = this
    
      const myUrl = this.url + '/?pid=' + impStore.pid + '&phash=' + impStore.phash

      this.socket = new ReconnectingWebSocket(myUrl)

      this.socket.onerror = (event) => {
        console.log('caught websocket error',event)
      }

      this.socket.onopen = (event) => {
        console.log('Websocket open for business')
        _this.wsm({ btn: 0 }); // lift button in case stuck
      }

      this.socket.onclose = (event) => {
        console.log('websocket close',event)

      }

      this.socket.onmessage = (event) => {
        // console.log(event.data)
        event = JSON.parse(event.data)
        if(event.command == 'SIGTERM_ET_ALL') {
          impStore.done = true
        }
        
      }
    }
    
  },
  
  send: function(msg) {
    this.socket.send(msg)
  },


  wsm: function(payload) {
    
    payload.pid = impStore.pid
    
    this.socket.send(JSON.stringify(payload))
    this.lastSend = Date.now()
  }

}
export default WS