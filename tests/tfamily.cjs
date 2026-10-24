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
  await p.locator('.tf-conversation').click();assert.equal(await p.locator('.tf-message').count(),43);assert.equal(await p.locator('.tf-voice').count(),8);assert.equal(await p.locator('.tf-timestamp').count(),6);assert.equal(await p.locator('.tf-photo').count(),5);
  assert.equal(await p.locator('.tf-self').count(),18);assert.equal(await p.locator('.tf-self').last().innerText(),'小宝宝的小宝宝');
  assert.equal(await p.locator('.tf-send').isEnabled(),true);assert.equal(await p.locator('.tf-composer input').getAttribute('readonly'),null);
  assert.equal(await p.locator('.tf-history').evaluate(el=>el.scrollTop),0);
  await p.waitForFunction(()=>[...document.querySelectorAll('.tf-avatar img,.tf-photo img')].every(i=>i.complete&&i.naturalWidth>0));
  assert.deepEqual(await p.locator('.tf-chat-section').evaluateAll(els=>els.map(e=>e.dataset.reference)),['1','2','3','4','5','6']);
  assert.deepEqual(await p.locator('.tf-timestamp').allTextContents(),['10月2日 18:47','10月13日 19:05','10月16日 22:12','10月18日 21:02','10月18日 22:19','10月18日 22:50']);
  assert.deepEqual(await p.locator('.tf-voice').evaluateAll(els=>els.map(e=>parseInt(e.getAttribute('aria-label')))),[5,58,11,22,16,3,3,12]);
  assert.ok((await p.locator('.tf-message').first().innerText()).includes('奶龙是'));
  for(const [index,anchor] of [[1,'完全有点不晓得中'],[2,'看看脸'],[3,'猜出它是谁了吗'],[4,'Cino'],[5,'小宝宝的小宝宝']])assert.ok((await p.locator('.tf-chat-section').nth(index).innerText()).includes(anchor));
  if(w===390){for(let n=0;n<6;n++){await p.locator('.tf-chat-section').nth(n).evaluate(el=>{const h=el.closest('.tf-history');h.scrollTop=el.offsetTop-h.offsetTop;});await p.screenshot({path:path.resolve(__dirname,'../../tfamily-history-'+(n+1)+'-preview.png')});}}
  await p.locator('.tf-history').evaluate(el=>el.scrollTop=0);
  if(w===390)await p.screenshot({path:path.resolve(__dirname,'../../tfamily-chat-preview.png')});
  assert.ok(await p.locator('.tf-avatar img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0)));
  const layout=await p.evaluate(()=>{let h=document.querySelector('.tf-history'),c=document.querySelector('.tf-composer').getBoundingClientRect(),ph=document.querySelector('.phone').getBoundingClientRect();return {fits:c.bottom<=ph.bottom,overflow:h.scrollWidth>h.clientWidth,scroll:h.scrollHeight>h.clientHeight,status:getComputedStyle(document.querySelector('.status')).color}});
  assert.ok(layout.scroll);assert.ok(layout.fits);assert.equal(layout.overflow,false);assert.equal(layout.status,'rgb(17, 17, 17)');
  await p.locator('.tf-history').evaluate(el=>el.scrollTop=el.scrollHeight);
  assert.ok(await p.locator('.tf-self').last().isVisible());assert.ok(await p.locator('.tf-self').last().evaluate(el=>{const a=el.getBoundingClientRect(),h=el.closest('.tf-history').getBoundingClientRect();return a.bottom<=h.bottom&&a.top>=h.top;}));
  assert.ok((await p.locator('.tf-history').innerText()).includes('为什么不来找我和幺幺三玩'));
  const input=p.getByRole('textbox',{name:'输入消息',exact:true});await input.fill('玩家测试文字');await p.getByRole('button',{name:'发送',exact:true}).click();
  await p.getByRole('alert').waitFor({state:'visible'});assert.equal(await p.getByRole('alert').innerText(),'你已经留言了3条消息，请待他回复后再继续发送');
  assert.equal(await p.locator('.tf-message').count(),43);assert.equal(await input.inputValue(),'玩家测试文字');
  const centered=await p.getByRole('alert').evaluate(el=>{const a=el.getBoundingClientRect(),v=el.closest('.tf-view').getBoundingClientRect();return Math.abs(a.x+a.width/2-v.x-v.width/2)<1&&Math.abs(a.y+a.height/2-v.y-v.height/2)<1;});assert.ok(centered);
  await input.press('Enter');assert.equal(await p.locator('.tf-message').count(),43);assert.equal(await p.getByRole('alert').isVisible(),true);
  if(w===390)await p.screenshot({path:path.resolve(__dirname,'../../tfamily-send-notice-preview.png')});
  await p.waitForTimeout(3100);assert.equal(await p.getByRole('alert').isVisible(),false);
  await p.getByRole('button',{name:'返回我的泡泡',exact:true}).click();assert.equal(await p.locator('.tf-header h1').innerText(),'我的泡泡');
  await p.locator('#homebar').focus();await p.keyboard.press('Enter');assert.equal(await p.locator('#home').isVisible(),true);
  assert.equal(await p.locator('.phone').evaluate(el=>el.classList.contains('tf-active')),false);
 }
 await p.getByRole('button',{name:'微信',exact:true}).click();assert.equal(await p.locator('.placeholder').isVisible(),true);assert.equal(await p.locator('#backHome').isVisible(),true);assert.equal(await p.locator('#app').evaluate(el=>el.classList.contains('tf-app')),false);
 assert.deepEqual(errors,[]);console.log('PASS T-FAMILY: list → chat → list → home; 43 ordered screenshot messages across 6 sections; 8 voice durations; 6 timestamps; 18 outgoing bubbles; 5 photo windows; scroll from first to last; new avatars; editable composer; send/Enter blocked with centered notice; no new messages; 幺幺三; 4 viewports; other app unchanged; no script errors.');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)});
