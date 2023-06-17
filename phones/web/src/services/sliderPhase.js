import WS from '.ws'
const sliderPhase = function(phase) {
    console.log(phase)  
    WS.wsm('filterState',{
      'state': phase // start or end
    })
}
export default sliderPhase