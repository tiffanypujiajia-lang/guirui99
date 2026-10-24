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
const show=id=>{['lock','pin','home','app'].forEach(k=>$(k).classList.toggle('hidden',k!==id));if(id!=='app')document.querySelector('.phone').classList.remove('tf-active','music-active');};
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
function openApp(a){$('app').classList.remove('tf-app','music-app');document.querySelector('.phone').classList.remove('tf-active','music-active');$('appTitle').textContent=a.name;if(a.id==='tfamily'){openTFamily();return;}if(a.id==='music'){openMusic();return;}const descriptions={wechat:'聊天列表、预设发送选项和对方回复：等待你提供剧本。',photos:'相册照片及排列顺序：等待你上传。',music:'最近播放、歌单、动态及音乐素材：等待你提供。',phone:'通话记录、来电触发条件和接听内容：等待你提供。',tfamily:'泡泡消息和预设回复选项：等待你提供剧本。',douyin:'私聊界面及内容：等待你提供。'};$('appContent').replaceChildren();const box=document.createElement('div');box.className='placeholder';const title=document.createElement('b');title.textContent=a.name+' · 待完善';const p=document.createElement('p');p.textContent=descriptions[a.id];box.append(title,p);$('appContent').append(box);show('app')}
$('unlock').addEventListener('click',beginPin);$('cancelPin').addEventListener('click',()=>{if(entered.length)key('⌫');else{resetPin();show('lock')}});$('backHome').addEventListener('click',()=>show('home'));$('homebar').addEventListener('click',()=>{if(!$('lock').classList.contains('hidden'))beginPin();else if(!$('pin').classList.contains('hidden')){resetPin();show('lock');}else show('home')});
let touchY=null;$('lock').addEventListener('touchstart',e=>touchY=e.touches[0].clientY,{passive:true});$('lock').addEventListener('touchend',e=>{if(touchY!==null&&touchY-e.changedTouches[0].clientY>45){beginPin()}touchY=null},{passive:true});
window.addEventListener('keydown',e=>{if(!$('pin').classList.contains('hidden')){if(/^\d$/.test(e.key))key(e.key);if(e.key==='Backspace'){e.preventDefault();key('⌫')}}});

// Only the supplied screenshots define this conversation. No generated replies.
const TF_NAME='zhang憨螨';
function tfElement(tag,className,text){const e=document.createElement(tag);e.className=className;if(text!==undefined)e.textContent=text;return e;}
function tfAvatar(kind){
 const avatar=tfElement('span','tf-avatar');const img=document.createElement('img');img.alt='';img.draggable=false;
 const list=kind==='list';img.src='assets/originals/tfamily-'+(list?'list':'chat')+'-reference.jpg';
 // CSS windows preserve every byte of both reference uploads.
 const [w,h,x,y,size]=list?[851,1847,31,260,119]:kind==='self'?[1320,2522,1162,465,126]:[1320,2522,33,288,126];
 img.style.cssText=`width:${w/size*100}%;height:${h/size*100}%;left:${-x/size*100}%;top:${-y/size*100}%`;
 avatar.append(img);return avatar;
}
function tfHeader(chat){
 const h=tfElement('header','tf-header');
 if(chat){const back=tfElement('button','tf-back','‹');back.type='button';back.setAttribute('aria-label','返回我的泡泡');back.addEventListener('click',openTFamily);h.append(back);}
 else {const add=tfElement('span','tf-add');add.setAttribute('aria-hidden','true');add.innerHTML='<svg viewBox="0 0 24 28" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="10" cy="7" r="4.3"/><path d="M2 25v-4a8 8 0 0 1 12-7M18 14v10m-5-5h10"/></svg>';h.append(add);}
 h.append(tfElement('h1','',chat?TF_NAME:'我的泡泡'));
 const right=tfElement('span','tf-menu',chat?'':'⋯');right.setAttribute('aria-hidden','true');h.append(right);return h;
}
function openTFamily(){
 $('app').classList.add('tf-app');document.querySelector('.phone').classList.add('tf-active');
 const view=tfElement('div','tf-view tf-list');view.append(tfHeader(false));
 const row=tfElement('button','tf-conversation');row.type='button';row.setAttribute('aria-label','打开与'+TF_NAME+'的对话');row.append(tfAvatar('list'));
 const copy=tfElement('span','tf-conversation-copy');copy.append(tfElement('span','tf-name',TF_NAME),tfElement('span','tf-preview','小宝宝的小宝宝'));
 row.append(copy,tfElement('span','tf-time','25分钟前'));row.addEventListener('click',openTFChat);view.append(row);
 $('appContent').replaceChildren(view);show('app');
}
function openTFChat(){
 const view=tfElement('div','tf-view tf-chat');view.append(tfHeader(true));
 const history=tfElement('div','tf-history');history.setAttribute('role','log');history.setAttribute('aria-label','与'+TF_NAME+'的聊天记录');
 const timestamp=text=>history.append(tfElement('div','tf-timestamp',text));
 function message(text,self=false,seconds=0){
  const row=tfElement('div','tf-message'+(self?' tf-self':''));
  const bubble=tfElement('div','tf-bubble'+(seconds?' tf-voice':''));
  if(seconds){bubble.setAttribute('aria-label',seconds+'秒语音，尚未提供音频');bubble.title='尚未提供音频';const wave=tfElement('span','tf-wave','◖))');wave.setAttribute('aria-hidden','true');bubble.append(wave,tfElement('span','',seconds+'″'));}
  else bubble.textContent=text;
  row.append(tfAvatar(self?'self':'other'),bubble);history.append(row);
 }
 timestamp('10月18日 22:19');message('',false,3);message('喜欢。很好听。',true);
 timestamp('10月18日 22:50');message('',false,12);
 message('这首歌是我一点点含辛茹苦在突围中挤出时间制作的😭😭😭😭真的是全程本人手搓糊来的😭😭😭😭😭我是手艺人😭😭😭😭😭匠心制作的😭😭😭😭😭😭😭');
 message('这是我的第一个小宝宝😭😭😭😭😭😭');
 message('是啊，我看着你做出来的',true);message('张函瑞厉害！👍🏻',true);message('小宝宝的小宝宝',true);
 view.append(history);
 const composer=tfElement('div','tf-composer');const input=tfElement('input','');input.placeholder='输入消息...';input.readOnly=true;input.setAttribute('aria-label','输入消息（展示，尚未设置发送规则）');
 const send=tfElement('button','tf-send');send.type='button';send.disabled=true;send.setAttribute('aria-label','发送（尚未设置发送规则）');send.innerHTML='<svg viewBox="0 0 30 30" fill="none" stroke="white" stroke-width="1.6"><path d="m5 14 19-9-4 21-6-8-9-4Z M14 18 24 5"/></svg>';
 composer.append(input,send);view.append(composer);$('appContent').replaceChildren(view);
}

$('homebar').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();$('homebar').click();}});
