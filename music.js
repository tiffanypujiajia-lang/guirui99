'use strict';
// Screens and labels are defined by the user's six references. Only one audio was supplied.
const musicAudio=new Audio('assets/audio/sun-earth.mp3');
musicAudio.preload='metadata';
window.addEventListener('phone:leave-music',()=>musicAudio.pause());
let musicTab='音乐',musicPage='profile';
function mEl(tag,cls,text){const e=document.createElement(tag);e.className=cls;if(text!==undefined)e.textContent=text;return e;}
function mButton(label,cls,action,text=label){const b=mEl('button',cls,text);b.type='button';b.setAttribute('aria-label',label);b.addEventListener('click',action);return b;}
function mArt(ref,x,y,size,cls=''){const s=mEl('span','m-art '+cls),im=document.createElement('img');im.alt='';im.draggable=false;im.src=`assets/originals/music-reference-${ref}.png`;const [w,h]=ref===6?[851,1848]:[1320,2868];im.style.cssText=`width:${w/size*100}%;height:${h/size*100}%;left:${-x/size*100}%;top:${-y/size*100}%`;s.append(im);return s;}
function syncMusicPlayer(){document.querySelectorAll('.m-toggle').forEach(b=>{b.textContent=musicAudio.paused?'▷':'Ⅱ';b.setAttribute('aria-label',musicAudio.paused?'播放太阳与地球':'暂停太阳与地球');b.setAttribute('aria-pressed',String(!musicAudio.paused));});}
function playMusic(){
 const promise=musicAudio.play();
 if(promise)promise.then(()=>{if(!document.querySelector('.phone').classList.contains('music-active')||$('app').classList.contains('hidden'))musicAudio.pause();const s=document.querySelector('.m-audio-status');if(s)s.textContent='';syncMusicPlayer();}).catch(()=>{const s=document.querySelector('.m-audio-status');if(s)s.textContent='点击播放继续收听';syncMusicPlayer();});
}
for(const type of ['play','pause','ended','error'])musicAudio.addEventListener(type,()=>{syncMusicPlayer();if(type==='error'){const s=document.querySelector('.m-audio-status');if(s)s.textContent='音频加载失败，请点击播放重试';}});
function openMusic(){musicTab='音乐';musicPage='profile';playMusic();renderMusic();}
function musicGo(page){musicPage=page;renderMusic();}
function musicBack(){if(musicPage==='episodes')musicTab='播客';else musicTab='音乐';musicPage='profile';renderMusic();}
function mPlayer(){
 const player=mEl('div','m-player');player.append(mArt(1,62,2490,112,'m-disc'));
 const title=mEl('span','m-track','太阳与地球 (Sun & Earth) - 卢广仲');title.title=title.textContent;player.append(title);
 player.append(mButton('暂停太阳与地球','m-toggle',()=>{if(musicAudio.paused)playMusic();else musicAudio.pause();},'Ⅱ'),mEl('span','m-queue','☷'));
 const status=mEl('span','m-audio-status');status.setAttribute('role','status');player.append(status);return player;
}
function mProfile(){
 const wrap=mEl('div','m-profile');
 const tools=mEl('div','m-tools');tools.append(mEl('span','','☰'),mEl('small','','+ 添加状态'),mEl('span','','＋　⌕　⋮'));wrap.append(tools);
 const user=mEl('div','m-user');user.append(mArt(1,540,350,240,'m-user-avatar'));
 const name=mEl('div','m-user-name');name.append(mEl('strong','','太阳追地球_'),mEl('small','m-vip','◉ VIP | ¥1续费 ›'));user.append(name,mEl('div','m-badges','♧ 0 枚徽章'),mEl('div','m-stats','0 关注　 0 粉丝　 Lv.0'));wrap.append(user);
 const quick=mEl('div','m-quick');for(const t of ['◷ 最近','▣ 本地','ᴠɪᴘ 会员','♜ 装扮','▦'])quick.append(mEl('span','',t));wrap.append(quick);
 if(musicTab==='笔记')wrap.append(mEl('div','m-promotion','◉ VIP·壹　 双11送金片！全年底价　 ›'));
 const panel=mEl('section','m-panel');const tabs=mEl('div','m-tabs');tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label','我的内容');
 for(const t of ['音乐','播客','笔记']){const b=mButton(t,'m-tab'+(t===musicTab?' selected':''),()=>{musicTab=t;renderMusic();});b.setAttribute('role','tab');b.setAttribute('aria-selected',String(t===musicTab));tabs.append(b);}
 panel.append(tabs);
 function profileRow(title,sub,art,action,extra=''){
  const row=action?mButton(title,'m-profile-row',action,''):mEl('div','m-profile-row');row.append(art);
  const copy=mEl('span','m-row-copy');copy.append(mEl('span','m-row-title',title));if(sub)copy.append(mEl('small','m-muted',sub));row.append(copy);if(extra)row.append(mEl('small','m-row-extra',extra));panel.append(row);
 }
 if(musicTab==='音乐'){
  panel.append(mEl('div','m-filters','♙ 近期　　创建¹　　　　　　　　　⋮'));
  profileRow('我喜欢的音乐','7首 · 1次播放',mArt(5,60,336,376),()=>musicGo('liked'),'♡ 心动模式');
  profileRow('听歌排行','累计听歌7首',mArt(1,48,1632,156),()=>musicGo('ranking'),'↟ 置顶');
  profileRow('新建歌单','',mEl('span','m-placeholder-art','＋'),null,'NEW');
  profileRow('导入外部歌单','轻松导入其他APP里的歌单',mEl('span','m-placeholder-art','⇥'));
  panel.append(mEl('p','m-footnote','展示创建/收藏的30条内容,该列表仅自己可见'));
 }else if(musicTab==='播客'){
  panel.append(mEl('div','m-filters','全部⁰　　播客⁰　　有声书⁰　　　　　　⋮'));
  profileRow('点赞的单集','共3个',mArt(3,48,468,180),()=>musicGo('episodes'),'⋮');
  profileRow('添加播客和有声书','',mEl('span','m-placeholder-art','＋'));
  panel.append(mEl('h2','m-section-title','近期收听'));
  profileRow('TF家族四代','上次播放：2025十一月考核｜《言不由衷》—张函瑞',mArt(2,48,2020,156),null,'⊞ 订阅');
  panel.append(mEl('h2','m-section-title','为你推荐'));
  profileRow('抖音热门情绪铺 (臻品质)','',mArt(2,48,2400,156),null,'⊞ 订阅');
 }else{
  const play=mEl('div','m-note-play');play.append(mEl('span','m-red-play','▶'),mEl('div','','播放全部'));play.append(mEl('small','m-muted','1篇笔记 · 1首歌'));panel.append(play);
  const note=mEl('article','m-note');const author=mEl('div','m-note-author');author.append(mArt(1,540,350,240),mEl('div','','太阳追地球_　◉ VIP·壹'));note.append(author,mEl('small','m-muted','刚刚'),mEl('p','','刚才吻了我一下我也喜欢对呀'));
  const card=mEl('div','m-note-song');card.append(mArt(5,48,1962,132),mEl('span','','慢慢喜欢你'),mEl('small','m-muted','莫文蔚'));note.append(card,mEl('div','m-note-actions','◯ 分享　　　 ▤ 评论　　 ♧ 赞　　⋮'));panel.append(note,mEl('p','m-footnote','已经刷到底啦'));
 }
 wrap.append(panel);return wrap;
}
const M_SONGS=[
 ['言不由衷','徐佳莹 - 心里学',5,48,1218],
 ['눈, 코, 입 (眼,鼻,嘴)','TAEYANG - RISE',5,48,1404],
 ['BACK SEAT','JYJ - JUST US',5,48,1590],
 ['于是','郑润泽 - 于是',5,48,1776],
 ['慢慢喜欢你','莫文蔚 - 我们在中场相遇',5,48,1962],
 ['太阳与地球 (Sun & Earth)','卢广仲 - HeartBreakFast 伤心早餐店',5,48,2148],
 ['Can You Feel the Love Tonight','Anson Seabra - Can You Feel the Love Tonight',5,48,2334]
];
function mDetailHeader(title){const h=mEl('header','m-detail-header');h.append(mButton('返回','m-back',musicBack,'‹'),mEl('h1','',title),mEl('span','','⋮'));return h;}
function mLiked(){
 const content=mEl('section','m-liked');content.append(mDetailHeader(''));
 const intro=mEl('div','m-liked-intro');intro.append(mArt(5,60,336,376));const text=mEl('div','');text.append(mEl('h2','','我喜欢的音乐'),mEl('small','m-muted','太阳追地球_'));intro.append(text);content.append(intro,mEl('div','m-liked-actions','➦ 分享　　　 ▤ 评论　　　 ▣ 收藏'));
 const list=mEl('div','m-song-list');const play=mButton('播放全部喜欢的音乐','m-play-all',playMusic,'▶　播放全部');play.append(mEl('small','m-gold','7首 · 含6首VIP歌曲,去续费 ›'));list.append(play);
 M_SONGS.forEach(([title,sub,ref,x,y],i)=>{
  const row=i===5?mButton('播放太阳与地球歌曲','m-song playable',playMusic,''):mEl('div','m-song');
  row.append(mArt(ref,x,y,132));const copy=mEl('span','m-row-copy');copy.append(mEl('span','m-row-title'+(i===5?' m-current':''),title));const details=mEl('small','m-muted');details.append(mEl('span','m-tag','VIP'),mEl('span','m-gold-tag','超清母带'),document.createTextNode(' '+sub));copy.append(details);row.append(copy,mEl('span','m-dots','⋮'));list.append(row);
 });content.append(list);return content;
}
function mRanking(){
 const section=mEl('section','m-ranking');section.append(mDetailHeader('太阳追地球_的听歌排行'));
 const tabs=mEl('div','m-ranking-tabs');tabs.append(mEl('span','m-muted','最近一周'),mEl('span','selected','所有时间'));section.append(tabs);
 const rows=[['光亮 (TF家族2023新年音乐会瞬间现场)','TF家族-张函瑞',169],['太阳与地球 (Sun & Earth)','卢广仲 - HeartBreakFast 伤心早餐店',100],['眼鼻嘴','TAEYANG - RISE',45],['于是','郑润泽 - 于是',34],['言不由衷','徐佳莹 - 心里学',25]];
 rows.forEach(([title,sub,count],i)=>{const row=i===1?mButton('播放排行榜太阳与地球','m-rank-row',playMusic,''):mEl('div','m-rank-row');row.append(mEl('span','m-rank-number',String(i+1)));const copy=mEl('span','m-row-copy');copy.append(mEl('span','m-row-title',title));const small=mEl('small','m-muted');small.append(mEl('span','m-gold-tag','超清母带'),document.createTextNode(' '+sub));copy.append(small);row.append(copy,mEl('small','m-count','▷ '+count+'次'),mEl('span','m-dots','⋮'));section.append(row);});return section;
}
function mEpisodes(){
 const section=mEl('section','m-episodes');section.append(mDetailHeader('点赞的单集'));const all=mEl('div','m-episode-play');all.append(mEl('span','m-red-play','▶'),mEl('span','','播放全部 (3)'));section.append(all);
 const items=[['2025十月考核｜《Sorry would go a long way》—张函瑞','03:09',468],['TEARS（张函瑞原创单曲）','01:06',704],['2025十一月考核｜《言不由衷》—张函瑞','03:55',939]];
 items.forEach(([title,duration,y])=>{const row=mEl('div','m-episode');row.append(mArt(3,48,y,180));const copy=mEl('span','m-row-copy');copy.append(mEl('span','m-row-title',title),mEl('small','m-muted','◷ '+duration));row.append(copy,mEl('span','m-dots','⋮'));section.append(row);});return section;
}
function installMusicSwipe(root){
 let start=null;
 root.addEventListener('touchstart',e=>{if(e.touches.length===1)start={x:e.touches[0].clientX,y:e.touches[0].clientY};else start=null;},{passive:true});
 root.addEventListener('touchend',e=>{if(!start)return;const t=e.changedTouches[0],dx=t.clientX-start.x,dy=t.clientY-start.y;start=null;if(musicPage!=='profile'&&dx>65&&dx>Math.abs(dy)*1.5)musicBack();},{passive:true});
 root.addEventListener('touchcancel',()=>start=null,{passive:true});
}
function renderMusic(){
 $('app').classList.add('music-app');$('app').dataset.musicPage=musicPage;document.querySelector('.phone').classList.add('music-active');
 const root=mEl('div','m-view '+(musicPage==='profile'?'m-root':'m-detail')+' m-page-'+musicPage);root.dataset.page=musicPage;
 const scroll=mEl('div','m-scroll');scroll.append(musicPage==='profile'?mProfile():musicPage==='liked'?mLiked():musicPage==='ranking'?mRanking():mEpisodes());root.append(scroll,mPlayer());
 if(musicPage==='profile'){const nav=mEl('nav','m-bottom-nav');nav.setAttribute('aria-label','网易云底部导航');nav.append(mEl('span','','首页'),mEl('span','','搜索'),mButton('底部笔记','',()=>{musicTab='笔记';renderMusic();},'笔记•'),mButton('我的','selected',()=>{musicTab='音乐';renderMusic();}));root.append(nav);}
 installMusicSwipe(root);$('appContent').replaceChildren(root);show('app');syncMusicPlayer();
}
