const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert=require('node:assert/strict');const path=require('node:path');
(async()=>{
 const b=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
 const p=await b.newPage({viewport:{width:390,height:844}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('file://'+path.resolve(__dirname,'../index.html'));await p.locator('#unlock').click();await p.keyboard.type('0214');
 for(const [w,h] of [[390,844],[320,568],[430,932],[1280,900]]){
  await p.setViewportSize({width:w,height:h});await p.getByRole('button',{name:'T-FAMILY',exact:true}).click();
  assert.equal(await p.locator('.tf-header h1').innerText(),'我的泡泡');assert.equal(await p.locator('.tf-conversation').count(),1);
  if(w===390)await p.screenshot({path:path.resolve(__dirname,'../../tfamily-list-preview.png')});
  await p.locator('.tf-conversation').click();assert.equal(await p.locator('.tf-message').count(),8);assert.equal(await p.locator('.tf-voice').count(),2);assert.equal(await p.locator('.tf-timestamp').count(),2);
  assert.equal(await p.locator('.tf-self').count(),4);assert.equal(await p.locator('.tf-self').last().innerText(),'小宝宝的小宝宝');
  assert.equal(await p.locator('.tf-send').isDisabled(),true);assert.equal(await p.locator('.tf-composer input').getAttribute('readonly'),'');
  await p.locator('.tf-history').evaluate(el=>el.scrollTop=0);
  if(w===390)await p.screenshot({path:path.resolve(__dirname,'../../tfamily-chat-preview.png')});
  assert.ok(await p.locator('.tf-avatar img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0)));
  const layout=await p.evaluate(()=>{let h=document.querySelector('.tf-history'),c=document.querySelector('.tf-composer').getBoundingClientRect(),ph=document.querySelector('.phone').getBoundingClientRect();return {fits:c.bottom<=ph.bottom,overflow:h.scrollWidth>h.clientWidth,scroll:h.scrollHeight>h.clientHeight,status:getComputedStyle(document.querySelector('.status')).color}});
  assert.ok(layout.fits);assert.equal(layout.overflow,false);assert.equal(layout.status,'rgb(17, 17, 17)');
  await p.locator('.tf-history').evaluate(el=>el.scrollTop=el.scrollHeight);
  assert.ok(await p.locator('.tf-self').last().isVisible());
  await p.getByRole('button',{name:'返回我的泡泡',exact:true}).click();assert.equal(await p.locator('.tf-header h1').innerText(),'我的泡泡');
  await p.locator('#homebar').focus();await p.keyboard.press('Enter');assert.equal(await p.locator('#home').isVisible(),true);
  assert.equal(await p.locator('.phone').evaluate(el=>el.classList.contains('tf-active')),false);
 }
 await p.getByRole('button',{name:'微信',exact:true}).click();assert.equal(await p.locator('.placeholder').isVisible(),true);assert.equal(await p.locator('#backHome').isVisible(),true);assert.equal(await p.locator('#app').evaluate(el=>el.classList.contains('tf-app')),false);
 assert.deepEqual(errors,[]);console.log('PASS T-FAMILY: list → chat → list → home; 8 screenshot messages, 2 voice durations, 2 timestamps, 4 outgoing bubbles; avatars; read-only composer; 4 viewports; other app unchanged; no script errors.');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)});
