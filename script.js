'use strict';
// Fictional fan-made interface. No real accounts, messaging, or calls.
const PIN='0214';
const PIN_LENGTH=PIN.length;
const APPS=[
{id:'wechat',name:'微信',icon:'wechat.jpg',crop:[328,276,62,32,192],dock:true},
{id:'camera',name:'相机',icon:'camera-photos.jpg',crop:[558,318,33,41,192],dock:true,disabled:true},
{id:'photos',name:'照片',icon:'camera-photos.jpg',crop:[558,318,329,41,192],dock:true},
{id:'music',name:'网易云音乐',icon:'music.jpg',crop:[296,283,43,23,192]},
{id:'phone',name:'电话',icon:'phone.png',crop:[942,2048,9,568,914]},
{id:'tfamily',name:'T-FAMILY',icon:'tfamily.jpg',crop:[219,280,12,14,192]},
{id:'douyin',name:'抖音',icon:'douyin.jpg',crop:[1328,1206,61,0,1206]}
];
const $=id=>document.getElementById(id);
const show=id=>['lock','pin','home','app'].forEach(k=>$(k).classList.toggle('hidden',k!==id));
function clock(){const d=new Date();const t=d.toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit',hour12:false});$('bigTime').textContent=t;$('statusTime').textContent=t;$('dateText').textContent=new Intl.DateTimeFormat('zh-CN',{month:'long',day:'numeric',weekday:'long'}).format(d)}
clock();setInterval(clock,30000);
let entered='', errorTimer;
function dots(){
  $('dots').replaceChildren(...Array.from({length:PIN_LENGTH},(_,i)=>{
    const d=document.createElement('span');d.className='pin-dot'+(i<entered.length?' filled':'');d.setAttribute('aria-hidden','true');return d;
  }));
  $('dots').setAttribute('aria-label',`已输入${entered.length}位，共${PIN_LENGTH}位`);
}
function resetPin(){clearTimeout(errorTimer);entered='';dots();$('pinError').textContent='';$('cancelPin').textContent='取消';}
function beginPin(){resetPin();show('pin');}
function key(n){
 clearTimeout(errorTimer);
 if(n==='⌫')entered=entered.slice(0,-1);else if(/^\d$/.test(n)&&entered.length<PIN_LENGTH)entered+=n;
 dots();$('pinError').textContent='';
 if(entered.length===PIN_LENGTH){if(entered===PIN){resetPin();show('home')}else{entered='';$('pinError').textContent='密码错误，请重试';errorTimer=setTimeout(dots,200)}}
 $('cancelPin').textContent=entered.length?'删除':'取消';
}
const letters={'2':'ABC','3':'DEF','4':'GHI','5':'JKL','6':'MNO','7':'PQRS','8':'TUV','9':'WXYZ'};
for(const n of ['1','2','3','4','5','6','7','8','9','','0','']){
 const b=document.createElement('button');b.disabled=!n;b.style.visibility=n?'visible':'hidden';
 if(n){b.setAttribute('aria-label',n);const digit=document.createElement('span');digit.className='key-digit';digit.textContent=n;const sub=document.createElement('span');sub.className='key-letters';sub.textContent=letters[n]||'\u00a0';b.append(digit,sub);b.addEventListener('click',()=>key(n))}else b.setAttribute('aria-hidden','true');
 $('keypad').appendChild(b);
}
function appButton(a){
 const b=document.createElement('button');b.className='appicon';b.setAttribute('aria-label',a.name+(a.disabled?'（仅展示）':''));
 const glyph=document.createElement('span');glyph.className='glyph';const img=document.createElement('img');img.src='assets/originals/'+a.icon;img.alt='';img.draggable=false;
 const [w,h,x,y,size]=a.crop;img.style.cssText=`width:${w/size*100}%;height:${h/size*100}%;left:${-x/size*100}%;top:${-y/size*100}%`;
 glyph.append(img);const label=document.createElement('span');label.textContent=a.name;b.append(glyph,label);b.addEventListener('click',()=>{if(!a.disabled)openApp(a)});return b;
}
dots();
APPS.forEach(a=>$(a.dock?'dock':'appgrid').appendChild(appButton(a)));
function openApp(a){$('appTitle').textContent=a.name;const descriptions={wechat:'聊天列表、预设发送选项和对方回复：等待你提供剧本。',photos:'相册照片及排列顺序：等待你上传。',music:'最近播放、歌单、动态及音乐素材：等待你提供。',phone:'通话记录、来电触发条件和接听内容：等待你提供。',tfamily:'泡泡消息和预设回复选项：等待你提供剧本。',douyin:'私聊界面及内容：等待你提供。'};$('appContent').replaceChildren();const box=document.createElement('div');box.className='placeholder';const title=document.createElement('b');title.textContent=a.name+' · 待完善';const p=document.createElement('p');p.textContent=descriptions[a.id];box.append(title,p);$('appContent').append(box);show('app')}
$('unlock').addEventListener('click',beginPin);$('cancelPin').addEventListener('click',()=>{if(entered.length)key('⌫');else{resetPin();show('lock')}});$('backHome').addEventListener('click',()=>show('home'));$('homebar').addEventListener('click',()=>{if(!$('lock').classList.contains('hidden'))beginPin();else if(!$('pin').classList.contains('hidden')){resetPin();show('lock');}else show('home')});
let touchY=null;$('lock').addEventListener('touchstart',e=>touchY=e.touches[0].clientY,{passive:true});$('lock').addEventListener('touchend',e=>{if(touchY!==null&&touchY-e.changedTouches[0].clientY>45){beginPin()}touchY=null},{passive:true});
window.addEventListener('keydown',e=>{if(!$('pin').classList.contains('hidden')){if(/^\d$/.test(e.key))key(e.key);if(e.key==='Backspace'){e.preventDefault();key('⌫')}}});
