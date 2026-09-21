const music=document.getElementById('music');
const opening=document.getElementById('opening');
const experience=document.getElementById('experience');
const enterBtn=document.getElementById('enterBtn');
const musicBtn=document.getElementById('musicBtn');
const father=document.getElementById('father');
const fatherAudio=document.getElementById('fatherAudio');
let started=false;

// Capas atmosféricas: profundidad + cursor + progreso
const ambient=document.createElement('div');ambient.className='ambient';document.body.prepend(ambient);
const glow=document.createElement('div');glow.className='cursor-glow';document.body.appendChild(glow);
const scrollBar=document.createElement('div');scrollBar.className='scroll-progress';scrollBar.style.cssText='position:fixed;left:0;top:0;width:0;height:2px;background:#c8ae78;z-index:110;pointer-events:none;transition:width .12s linear';document.body.appendChild(scrollBar);

document.addEventListener('pointermove',e=>{document.documentElement.style.setProperty('--mx',`${(e.clientX/innerWidth)*100}%`);document.documentElement.style.setProperty('--my',`${(e.clientY/innerHeight)*100}%`);glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px';});
window.addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-innerHeight;scrollBar.style.width=(max?scrollY/max*100:0)+'%';ambient.style.transform=`translateY(${scrollY*.018}px)`},{passive:true});

// Entrada: la música sólo arranca tras una interacción real.
enterBtn.addEventListener('click',async()=>{
  try{await music.play();started=true;musicBtn.classList.add('playing')}catch(e){}
  opening.classList.add('hidden');experience.classList.add('visible');experience.setAttribute('aria-hidden','false');
  setTimeout(()=>document.querySelector('.hero-scene')?.scrollIntoView({behavior:'smooth',block:'start'}),550);
});

musicBtn.addEventListener('click',async()=>{if(music.paused){try{await music.play();started=true;musicBtn.classList.add('playing')}catch(e){}}else{music.pause();musicBtn.classList.remove('playing')}});

// Revelados con stagger cuando una escena entra en pantalla.
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible')}}),{threshold:.12,rootMargin:'0px 0px -8% 0px'});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

// Efecto magnético suave en tarjetas.
document.querySelectorAll('.possibility-card,.door').forEach(card=>{card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();card.style.setProperty('--mx',`${((e.clientX-r.left)/r.width)*100}%`);card.style.setProperty('--my',`${((e.clientY-r.top)/r.height)*100}%`)});card.addEventListener('pointerleave',()=>{card.style.removeProperty('--mx');card.style.removeProperty('--my')})});

// Modales
const modal=document.getElementById('modal');const starModal=document.getElementById('starModal');
const openModal=el=>{el.classList.add('open');el.setAttribute('aria-hidden','false');document.body.classList.add('modal-open')};
const closeModal=el=>{el.classList.remove('open');el.setAttribute('aria-hidden','true');if(!document.querySelector('.modal.open'))document.body.classList.remove('modal-open')};
const modalNumber=document.getElementById('modalNumber'),modalTitle=document.getElementById('modalTitle'),modalText=document.getElementById('modalText');
document.querySelectorAll('.possibility-card').forEach((card,i)=>card.addEventListener('click',()=>{modalNumber.textContent=`02 · posibilidad 0${i+1}`;modalTitle.textContent=card.dataset.title;modalText.textContent=card.dataset.text;openModal(modal)}));
document.getElementById('modalClose').addEventListener('click',()=>closeModal(modal));modal.querySelector('.modal-backdrop').addEventListener('click',()=>closeModal(modal));

// Estrellas: se generan con pequeñas variaciones para que cada visita tenga sensación orgánica.
const starMessages=['El próximo logro que vamos a celebrar.','Un lugar donde todavía no hemos estado.','Una foto que todavía no existe.','Una versión de ti que todavía no conozco.','Una versión de nosotros que todavía no imaginamos.','Un día que algún día recordaremos.','Una historia que todavía no hemos vivido.'];
const stars=document.getElementById('stars'),starText=document.getElementById('starText');
const positions=[[12,25],[25,70],[37,20],[48,78],[61,32],[73,65],[87,25]];
positions.forEach(([x,y],i)=>{const s=document.createElement('button');s.className='star';s.style.left=x+'%';s.style.top=y+'%';s.style.animationDelay=(i*.35)+'s';s.setAttribute('aria-label','Descubrir una posibilidad futura');s.addEventListener('click',()=>{starText.textContent=starMessages[i];openModal(starModal)});stars.appendChild(s)});
document.getElementById('starClose').addEventListener('click',()=>closeModal(starModal));starModal.querySelector('.modal-backdrop').addEventListener('click',()=>closeModal(starModal));

// Momento del papá: Iris se retira por completo. El audio real nunca se reproduce solo.
const fatherIntro=document.querySelector('.father-intro');const hearFather=document.getElementById('hearFather');const skipFather=document.getElementById('skipFather');const continueAfterFather=document.getElementById('continueAfterFather');
hearFather.addEventListener('click',()=>{if(!music.paused){music.pause();musicBtn.classList.remove('playing')}father.classList.add('active');father.setAttribute('aria-hidden','false');setTimeout(()=>father.scrollIntoView({behavior:'smooth',block:'start'}),100)});
skipFather.addEventListener('click',()=>document.querySelector('.question')?.scrollIntoView({behavior:'smooth',block:'start'}));
continueAfterFather.addEventListener('click',async()=>{fatherAudio.pause();fatherAudio.currentTime=0;try{await music.play();musicBtn.classList.add('playing')}catch(e){}document.querySelector('.question')?.scrollIntoView({behavior:'smooth',block:'start'});});

// Puertas: sólo una puede quedar activa; la respuesta aparece como una revelación.
const doors=document.querySelectorAll('.door'),doorAnswer=document.getElementById('doorAnswer');
doors.forEach(door=>door.addEventListener('click',()=>{doors.forEach(d=>d.classList.remove('selected'));door.classList.add('selected');doorAnswer.classList.remove('show');setTimeout(()=>{doorAnswer.textContent=door.dataset.answer;doorAnswer.classList.add('show')},120)}));

document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal(modal);closeModal(starModal)}});

// Numeración visual discreta en escenas.
document.querySelectorAll('.scene').forEach((s,i)=>s.dataset.scene=String(i).padStart(2,'0'));

// Pequeño detalle final: la firma aparece después de una pausa visual.
const finale=document.querySelector('.finale');const finaleInner=finale?.querySelector('.reveal');if(finale&&finaleInner){new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){setTimeout(()=>finaleInner.classList.add('visible'),250)}}),{threshold:.3}).observe(finale)}
