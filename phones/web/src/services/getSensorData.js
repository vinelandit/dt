'use strict';
import { useImpStore } from '../stores/imp-store'
const impStore = useImpStore()
const sensorData = {

    isMobile: function() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    isIOS: function() {
        return /iPhone|iPad|iPod/i.test(navigator.userAgent);    
    },

    mapr: function(value, low1, high1, low2, high2) {
        return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
    },

    getUTCTime: function(timeStamp) {
        var cDate = new Date(timeStamp);
        var offSetMilSecs = (-1) * (cDate.getTimezoneOffset()) * (60 * 1000);
        var uDateTimeStamp = timeStamp - offSetMilSecs;
        return uDateTimeStamp;
    },

    tilt: null,
    alphaRel: null,
    alphaOffset: null,
    betaRel: null,
    betaOffset: null,
    gammaRel: null,
    gammaOffset: null,
    lastBearing: null,
    lastAlpha: -10000,
    lastBeta: -10000,
    lastGamma: -10000,



    state: {
        alpha: null,
        beta: null,
        gamma: null,
        accelX: 0,
        accelY: 0,
        accelZ: 0,
        btn: null
    },

    lastSend: 0,

    frequency: 0.01 * 1000, // milliseconds

    init: function(ws) {
        
        const ua = navigator.userAgent.toLowerCase();
        this.isCA =  ua.indexOf("chrome") > -1 && ua.indexOf("android") > -1;
        this.ws = ws;

    },


    captureMotion: function(hasSensors) {


        var _this = this;

        if(!hasSensors) {
            console.log('starting dummy stream');
            // create dummy stream for desktop test clients
            window.setInterval(function() {
                _this.orientationHandler({
                    alpha: Math.random() * 5,
                    beta: Math.random() * 5,
                    gamma: Math.random() * 5
                });

                _this.motionHandler({
                    acceleration: {
                        x: Math.random() * 3,
                        y: Math.random() * 3,
                        z: Math.random() * 3,
                    }
                });
            }, 16);
        }


        console.log('Registering motion- and orientation-capturing event handlers...');
            

        if (DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === "function") {
            console.log('requesting device orientation permission');
            DeviceOrientationEvent.requestPermission().then( response => {
                

                console.log('in then block with response '+response);

                if ( response == "granted" ) {
                    console.log('granted');
                    
                    console.log('device orientation permission granted');
                    
                    window.addEventListener('deviceorientation', _this.orientationHandler.bind(_this), false);
                    

                } else {
                    console.log('not granted');
                    if(!_this.orientationWarningShown) {
                        _this.orientationWarningShown = true;  
                        
                    }
            
                }
            });

        } else {

            console.log('permissions absent');
            if (window.DeviceOrientationEvent) {
                window.addEventListener('deviceorientation', _this.orientationHandler.bind(_this), false);
                
            } else {
                // none available; continue anyway.
                
            }
            
        }

        if (DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === "function") {
            console.log('requesting device motion permission');
            DeviceMotionEvent.requestPermission().then( response => {
                

                console.log('in then block with response '+response);

                if ( response == "granted" ) {
                    console.log('granted');
                    
                    console.log('device motion permission granted');
                    
                    window.addEventListener('devicemotion', _this.motionHandler.bind(_this), false);
                    
                } else {
                    console.log('not granted');
                    if(!_this.orientationWarningShown) {
                        _this.orientationWarningShown = true;  
                        
                    }             
                }
            });
            
        } else {
            console.log('permissions absent');
            if (window.DeviceMotionEvent) {
                window.addEventListener('devicemotion', _this.motionHandler.bind(_this), false);
                
            } else {
                // None available; continue anyway
            }
            
        }
        
    
    },

    sendIfReady: function() {
        const t = Date.now();
        if(t - this.lastSend > this.frequency) {
            this.state.btn = impStore.btn;

            this.ws.wsm( this.state );
            this.lastSend = t;

            impStore.newData();
        }
    },
        
    motionHandler: function(event) {
        
        
        if(this.isCA) {
            event.acceleration.z = -event.acceleration.z;
        } 

        this.state.accelX = event.acceleration.x.toFixed(3);
        this.state.accelY = event.acceleration.y.toFixed(3);
        this.state.accelZ = event.acceleration.z.toFixed(3);
        
        this.sendIfReady();
        
    },
 

    orientationHandler: function(event) {


        var _this = this;
        const t = Date.now();

        var alpha = event.alpha;
        var beta = event.beta;
        var gamma = event.gamma;


        if (alpha > 180) alpha = alpha - 360;
        if (beta > 180) beta = beta - 360;
        if (gamma > 180) gamma = gamma - 360;
        
        /* 
        if (_this.alphaOffset === null) {
            _this.alphaOffset = alpha;
            _this.alphaBearing = alpha;
        }
        _this.alphaRel = (alpha - _this.alphaOffset);

        if (_this.betaOffset === null) {
            _this.betaOffset = beta;
            _this.betaBearing = beta;
        }
        _this.betaRel = (beta - _this.betaOffset);
       
        if (_this.gammaOffset === null) {
            _this.gammaOffset = gamma;
            _this.gammaBearing = gamma;
        }
        _this.gammaRel = (gamma - _this.gammaOffset);
        */

        
        
       

        /* if(Math.abs(this.lastAlpha - this.alphaRel) > 0.01 || Math.abs(this.lastBeta - this.betaRel) > 0.01 || Math.abs(this.lastGamma - this.gammaRel) > 0.01) {
            
            this.lastAlpha = _this.alphaRel;
            this.lastBeta = _this.betaRel;
            this.lastGamma = _this.gammaRel;
            this.ws.wsm({ alpha: this.alphaRel.toFixed(2), beta: this.betaRel.toFixed(2), gamma: this.gammaRel.toFixed(2), btn: impStore.btn });
        } */
        this.state.alpha = alpha.toFixed(3);
        this.state.beta = beta.toFixed(3);
        this.state.gamma = gamma.toFixed(3);
            

        this.sendIfReady();
            
        

    }

}

export default sensorData;