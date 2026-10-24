const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert=require('node:assert/strict');
(async()=>{
 const b=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 const p=await b.newPage({viewport:{width:390,height:844},hasTouch:true});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('file://'+require('node:path').resolve(__dirname,'../index.html'));
 await p.locator('#unlock').click();assert.equal(await p.locator('.pin-dot').count(),4);
 await p.screenshot({path:require('node:path').resolve(__dirname,'../../pin-preview.png')});
 await p.keyboard.type('021');assert.equal(await p.locator('.filled').count(),3);assert.equal(await p.locator('#pin').isVisible(),true);
 await p.locator('#cancelPin').click();assert.equal(await p.locator('.filled').count(),2);
 await p.keyboard.press('Backspace');await p.keyboard.press('Backspace');await p.keyboard.type('9999');assert.equal(await p.locator('#pinError').innerText(),'密码错误，请重试');await p.waitForTimeout(250);assert.equal(await p.locator('.filled').count(),0);
 await p.keyboard.type('0214');assert.equal(await p.locator('#home').isVisible(),true);
 assert.equal(await p.locator('.appicon img').count(),7);assert.ok(await p.locator('.appicon img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0)));
 await p.screenshot({path:require('node:path').resolve(__dirname,'../../home-preview.png')});
 for(const name of ['微信','照片','网易云音乐','电话','T-FAMILY','抖音']){await p.getByRole('button',{name,exact:true}).click();assert.equal(await p.locator('#appTitle').innerText(),name);if(name==='T-FAMILY')await p.locator('#homebar').click();else await p.locator('#backHome').click();}
 await p.getByRole('button',{name:'相机（仅展示）',exact:true}).click();assert.equal(await p.locator('#home').isVisible(),true);
 await p.reload();await p.locator('#homebar').click();await p.keyboard.type('02');await p.locator('#homebar').click();await p.locator('#unlock').click();assert.equal(await p.locator('.filled').count(),0);await p.locator('#cancelPin').click();assert.equal(await p.locator('#lock').isVisible(),true);
 await p.locator('#lock').evaluate(el=>{for(const [type,y] of [['touchstart',500],['touchend',400]]){const t=new Touch({identifier:1,target:el,clientY:y});el.dispatchEvent(new TouchEvent(type,{touches:type==='touchstart'?[t]:[],changedTouches:[t],bubbles:true}));}});assert.equal(await p.locator('#pin').isVisible(),true);
 for(const [w,h] of [[320,568],[375,667],[390,844],[430,932],[1280,900]]){
  await p.setViewportSize({width:w,height:h});
  const layout=await p.evaluate(()=>{const k=document.querySelector('#keypad').getBoundingClientRect(),a=document.querySelector('.pin-actions').getBoundingClientRect(),ph=document.querySelector('.phone').getBoundingClientRect();return {circle:[...document.querySelectorAll('#keypad button:not(:disabled)')].every(b=>{let r=b.getBoundingClientRect();return Math.abs(r.width-r.height)<1}),fits:k.bottom<=a.top&&a.bottom<=ph.bottom,overflow:document.documentElement.scrollWidth>innerWidth}});
  assert.ok(layout.circle,`circular keys ${w}`);assert.ok(layout.fits,`keypad fits ${w}: ${JSON.stringify(layout)}`);assert.equal(layout.overflow,false);
 }
 assert.deepEqual(errors,[]);console.log('PASS: four dots; 0214; incorrect PIN; deletion; cancel/re-entry; swipe; seven images; six app navigation/return; camera display; 5 viewport layouts; no page errors.');await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
