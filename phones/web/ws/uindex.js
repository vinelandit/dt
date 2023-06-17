
const fs = require('fs');

const { DISABLED } = require('uWebSockets.js');

const keyfile = './ssl/keys/' + fs.readdirSync('./ssl/keys').filter(fn => fn.endsWith('.key'))[0];
const certfile = './ssl/certs/' + fs.readdirSync('./ssl/certs').filter(fn => fn.endsWith('.crt'))[0];



/* Non-SSL is simply App() */


var lastMsg = null;
var maxInterval = 0;

require('uWebSockets.js').App({

  /* There are more SSL options, cut for brevity */
  key_file_name: keyfile,
  cert_file_name: certfile,
  
}).ws('/*', {

  /* There are many common helper features */
  idleTimeout: 32,
  maxBackpressure: 10000,
  maxPayloadLength: 512,
  compression: DISABLED,

  /* For brevity we skip the other events (upgrade, open, ping, pong, close) */
  message: (ws, message, isBinary) => {
    /* You can do app.publish('sensors/home/temperature', '22C') kind of pub/sub as well */

    const now = Date.now();
    if(lastMsg == null) {
      lastMsg = now;
    }
    const interval = now - lastMsg;

    if(interval > maxInterval) {
      maxInterval = interval;
    }


    /* Here we echo the message back, using compression if available */
    // let ok = ws.send(message, isBinary, true);
    console.log(interval);
    ws.send('', false);

    lastMsg = now;
  }
  
}).get('/*', (res, req) => {

  /* It does Http as well */
  res.writeStatus('200 OK').writeHeader('IsExample', 'Yes').end(`
    <html>
    <head><title>Test</title></head>
    <body>
    WS test...
        <script>


            const ws = new WebSocket("ws://imp.ray.scot:9001/");
          

            ws.onopen =
            () => {
                
                console.log("Connected to the server");

                
                ws.send(Math.random());
                window.setInterval(function(){
                  ws.send(Math.random());
                }, 33);

                ws.onclose = (event) => {
                    console.log('websocket connection closed.');
                }


            }

        </script>
    </body>
</html>

  `);
  
}).listen(9001, (listenSocket) => {

  if (listenSocket) {
    console.log('Listening to port 9001');
  }
  
});