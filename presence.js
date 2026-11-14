(()=>{
const VISITS='nbufinanc_demo_visits',TABS='nbufinanc_demo_tabs',STALE=26000;let timer=null,tabId='';
function read(key,fallback){try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback))}catch{return fallback}}
function emit(){window.dispatchEvent(new CustomEvent('presencechange', {detail:get()}))}
function get(){const now=Date.now(),tabs=read(TABS,[]).filter(x=>now-x.at<STALE),users=new Set(tabs.map(x=>x.user));return{visits:read(VISITS,0)||0,online:users.size}}
function beat(){if(!tabId)return;const now=Date.now(),user=window.Auth?.current()?.email?.toLowerCase()||('guest:'+tabId),tabs=read(TABS,[]).filter(x=>now-x.at<STALE&&x.id!==tabId);tabs.push({id:tabId,user,at:now});try{localStorage.setItem(TABS,JSON.stringify(tabs))}catch{}emit()}
function start(){try{tabId=sessionStorage.getItem('nbufinanc_presence_tab')||('tab-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2));sessionStorage.setItem('nbufinanc_presence_tab',tabId);const n=read(VISITS,0)||0;localStorage.setItem(VISITS,JSON.stringify(n+1))}catch{tabId='tab-'+Math.random().toString(36).slice(2)}beat();if(timer)clearInterval(timer);timer=setInterval(beat,8000);window.addEventListener('focus',beat);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')beat()});window.addEventListener('storage',e=>{if(e.key===TABS||e.key===VISITS)emit()});window.addEventListener('beforeunload',()=>{const tabs=read(TABS,[]).filter(x=>x.id!==tabId);try{localStorage.setItem(TABS,JSON.stringify(tabs))}catch{}})}
window.Presence={start,get};
})();