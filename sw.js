const C='study-timer-v1';
self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(C).then(c=>c.addAll(['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'])).catch(()=>{}));
});
self.addEventListener('activate',e=>e.waitUntil(clients.claim()));
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET')return;
  const same=new URL(r.url).origin===location.origin;
  e.respondWith((async()=>{
    const c=await caches.open(C);
    // 모델·라이브러리(외부 파일)는 한 번 받으면 캐시에서 바로 사용 → 이후 오프라인 가능
    if(!same){const hit=await c.match(r);if(hit)return hit}
    try{
      const res=await fetch(r);
      if(res.ok&&res.status===200)c.put(r,res.clone());
      return res;
    }catch(err){
      const hit=await c.match(r);
      if(hit)return hit;
      throw err;
    }
  })());
});
