const {chromium}=require('C:/Users/QW201/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
 try {
  const page=await browser.newPage({viewport:{width:1100,height:1000}});
  const errors=[];
  page.on('pageerror',e=>{errors.push(e.message);console.log('PAGE ERROR',e.message)}); page.on('console',m=>{if(m.type()==='error')console.log('CONSOLE',m.text())});
  const html=[
    '<!doctype html><html><body><div id="test"></div><script type="module">',
    "import '/src/index.css';",
    "import {createApp,h} from '/node_modules/.vite/deps/vue.js?v=dc6decb3';",
    "import {createRouter,createMemoryHistory} from '/node_modules/.vite/deps/vue-router.js?v=dc6decb3';",
    "import Navbar from '/src/components/Navbar.vue';",
    "import {initDemoAuth} from '/src/mock/isDemo.js';",
    "localStorage.setItem('labhub_force_demo','1');initDemoAuth();",
    "const paths=['/','/notices','/arxiv','/seminars','/mailbox','/library','/resources','/favorites','/assistant','/style','/account'];",
    "const router=createRouter({history:createMemoryHistory(),routes:paths.map(path=>({path,component:{render:()=>null}}))});",
    "const app=createApp({render:()=>h(Navbar,{pinned:true})});",
    "app.use(router);await router.push('/');await router.isReady();app.mount('#test');",
    '</script></body></html>'
  ].join('\n');
  await page.route('**/__button-test',route=>route.fulfill({contentType:'text/html',body:html}));
  await page.goto('http://localhost:5173/__button-test',{waitUntil:'networkidle'});
  const button=page.locator('#tour-nav-notices');
  const home=page.locator('#tour-nav-home');
  await button.waitFor({state:'visible',timeout:10000});
  const state=locator=>locator.evaluate(el=>{
    const style=n=>{const s=getComputedStyle(n);return {background:s.backgroundColor,transform:s.transform,opacity:s.opacity,shadow:s.boxShadow,color:s.color,fill:s.fill,stroke:s.stroke,border:s.borderColor};};
    return {button:style(el),icon:style(el.querySelector('.iso-icon')),svg:style(el.querySelector('.iso-icon svg')),layers:Array.from(el.querySelectorAll('.iso-layer')).map(style)};
  });
  const results=[];
  for(const [theme,scheme] of [['earth-orbit','classic-cyan'],['vanta-fog','classic-cyan'],['vanta-fog','custom'],['galaxy','nebula-purple']]){
    await page.evaluate(([theme,scheme])=>{document.documentElement.setAttribute('data-theme-style',theme);document.documentElement.setAttribute('data-color-scheme',scheme)},[theme,scheme]);
    await page.mouse.move(500,500);await page.waitForTimeout(500);
    const initial=await state(button);
    await button.hover();await page.mouse.down();await page.waitForTimeout(500);
    const pressed=await state(button);
    await button.screenshot({path:__dirname+'/pressed.png'});
    await page.mouse.up();await page.waitForTimeout(700);
    if(!await button.evaluate(e=>e.classList.contains('router-link-exact-active')))throw Error('Button not selected');
    const selected=await state(button);
    await button.screenshot({path:__dirname+'/selected.png'});
    if(JSON.stringify(pressed)!==JSON.stringify(selected))throw Error('Pressed and selected differ '+JSON.stringify({theme,scheme,pressed,selected}));
    await page.mouse.move(500,500);await page.waitForTimeout(500);
    if(JSON.stringify(await state(button))!==JSON.stringify(selected))throw Error('Selected changes when pointer leaves '+JSON.stringify({theme,scheme,selected,idle:await state(button)}));
    if(!selected.layers[2].shadow.includes('inset'))throw Error('Missing inset shadow');
    await home.click();await page.mouse.move(500,500);await page.waitForTimeout(500);
    if(JSON.stringify(await state(button))!==JSON.stringify(initial))throw Error('Previous button not restored');
    results.push({theme,scheme,passed:true,pressed,selected});
  }
  if(errors.length)throw Error('Browser errors: '+JSON.stringify(errors));
  fs.writeFileSync(__dirname+'/browser-result.json',JSON.stringify({passed:true,results},null,2));
  console.log('PASS: live Navbar.vue; four theme combinations; pressed=selected; selection persists; previous button restores; no browser errors');
 } finally {await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});