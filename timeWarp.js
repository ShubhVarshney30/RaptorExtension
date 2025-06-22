let scrollStartTIME=null;
let scrollStartTIMEout=null;
let isslowedDown=false;
let slowFactor=1;

function slowScroll(e){
const currentFactor=Maths.min(slowFactor,5);
window.scrollBy({
    top:e.deltaY/currentFactor,
    left:0,
    behaviour:"smooth"
});

function applyvisualEffects(factor){
const blur=Math.min(factor,5);
const grayscale=Math.min(factor*10,100);
document.body.style.transition="filter 0.5s ease-in-out";
  document.body.style.filter=`blur(${blur}px)grayscale(${grayscale}%)`;
}
function applySlowEffect(){
    if(!isSlowedDown){
        console.log("⏳ Time-Warp Activated ");
        isslowedDown=true;
        effectAppliedTime=Date.now();
        window.addEventListener("wheel",slowScroll,{passive:false});
        showNudge();
    }
    const duration=Date.now()-effectAppliedTime;
    slowFactor=1+duration/5000;
    applyvisualEffects(slowFactor);
}
function showNudge(){

    

}


}1