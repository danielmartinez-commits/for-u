(() => {
  "use strict";
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const iris = $("#irisAudio"), fatherAudio = $("#fatherAudio");
  const enter = $("#enterButton"), sound = $("#musicToggle");
  let audioOn = false;

  const play = a => a ? a.play().catch(() => false) : Promise.resolve(false);
  const go = id => document.getElementById(id)?.scrollIntoView({behavior:"smooth",block:"start"});

  // Opening is independent of audio: a blocked music promise can never block entry.
  enter.addEventListener("click", async () => {
    enter.disabled = true;
    audioOn = await play(iris);
    sound.classList.toggle("playing", audioOn);
    go("future");
    setTimeout(() => enter.disabled = false, 900);
  });

  sound.addEventListener("click", async () => {
    if (!iris) return;
    if (iris.paused) {
      audioOn = await play(iris);
    } else {
      iris.pause(); audioOn = false;
    }
    sound.classList.toggle("playing", audioOn);
  });

  // Reveal only content that is meant to appear; no layout-changing animation.
  const revealTargets = $$(".scene:not(.opening) .eyebrow, .scene:not(.opening) h2, .scene:not(.opening) h3, .scene:not(.opening) > p, .scene:not(.opening) .letter-copy p");
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add("seen"); revealObserver.unobserve(e.target); }});
  }, {threshold:.12, rootMargin:"0px 0px -7% 0px"});
  revealTargets.forEach(e => revealObserver.observe(e));

  // Opening entrance reveal.
  requestAnimationFrame(() => setTimeout(() => $$(".opening .reveal").forEach(e=>e.classList.add("show")), 180));

  // Possibility details.
  const modal = $("#modal"), modalNo=$("#modalNo"), modalTitle=$("#modalTitle"), modalText=$("#modalText");
  function openPossibility(card){
    modalNo.textContent = card.dataset.no;
    modalTitle.textContent = card.dataset.title;
    modalText.textContent = card.dataset.text;
    modal.classList.add("open"); modal.setAttribute("aria-hidden","false");
    document.body.style.overflow="hidden";
  }
  function closeModal(){ modal.classList.remove("open"); modal.setAttribute("aria-hidden","true"); document.body.style.overflow=""; }
  $$(".possibility").forEach(c => {
    c.addEventListener("click",()=>openPossibility(c));
    c.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();openPossibility(c)}});
  });
  $("#modalClose").addEventListener("click",closeModal);
  $(".modal-bg").addEventListener("click",closeModal);
  document.addEventListener("keydown",e=>{if(e.key==="Escape") closeModal()});

  // Stars.
  const messages = [
    "El próximo logro que vamos a celebrar.",
    "Un lugar donde todavía no hemos estado.",
    "Una foto que todavía no existe.",
    "Una versión de ti que todavía no conozco.",
    "Una versión de nosotros que todavía no imaginamos.",
    "Un día que algún día recordaremos.",
    "Una historia que todavía no hemos vivido."
  ];
  const field=$("#starsField"), message=$("#starMessage"), starsSection=$("#stars");
  const placements=[
    [18,30],[31,22],[47,34],[62,19],[78,31],[88,53],[24,64],
    [42,73],[58,59],[71,77],[91,72],[10,82],[36,46],[82,17]
  ];
  placements.forEach((p,i)=>{
    const s=document.createElement("button"); s.className="star"; s.type="button";
    s.style.left=p[0]+"%"; s.style.top=p[1]+"%"; s.style.setProperty("--t",(2.4+(i%4)*.55)+"s");
    s.setAttribute("aria-label","Descubrir"); s.dataset.i=i%messages.length;
    s.addEventListener("click",()=>{
      $$(".star.hit",field).forEach(x=>x.classList.remove("hit"));
      s.classList.add("hit"); message.textContent=messages[+s.dataset.i]; starsSection.classList.add("message");
      clearTimeout(s._timer); s._timer=setTimeout(()=>starsSection.classList.remove("message"),5000);
    });
    field.appendChild(s);
  });

  // Father interruption.
  $("#hearFather").addEventListener("click",()=>{
    if(iris) iris.pause();
    audioOn=false; sound.classList.remove("playing");
    go("father");
  });
  $("#skipFather").addEventListener("click",()=>{
    go("doors");
  });
  $("#continueFather").addEventListener("click",async()=>{
    if(fatherAudio){fatherAudio.pause();fatherAudio.currentTime=0;}
    audioOn=await play(iris); sound.classList.toggle("playing",audioOn);
    go("doors");
  });

  // If user reaches father manually, Iris pauses. If they leave it, resume only through continue.
  const fatherObserver=new IntersectionObserver(es=>{
    es.forEach(e=>{if(e.isIntersecting && iris && !iris.paused){iris.pause();audioOn=false;sound.classList.remove("playing")}});
  },{threshold:.45});
  fatherObserver.observe($("#father"));

  // Doors.
  const answer=$("#doorAnswer");
  $$(".door").forEach(d=>d.addEventListener("click",()=>{
    answer.textContent=d.dataset.answer; answer.classList.remove("show");
    requestAnimationFrame(()=>requestAnimationFrame(()=>answer.classList.add("show")));
  }));

  // Scroll progress + gentle ambient movement.
  window.addEventListener("scroll",()=>{
    const max=document.documentElement.scrollHeight-window.innerHeight;
    $("#progress span").style.width=(max>0?(scrollY/max)*100:0)+"%";
    ambient.style.transform=`translate(${(scrollY*.006)%18}px,${(scrollY*.003)%12}px)`;
  },{passive:true});

  // Pointer light on desktop; intentionally subtle.
  window.addEventListener("pointermove",e=>{
    if(matchMedia("(pointer:fine)").matches){
      ambient.style.background=`radial-gradient(circle at ${e.clientX/window.innerWidth*100}% ${e.clientY/window.innerHeight*100}%,rgba(190,153,96,.075),transparent 24%),radial-gradient(circle at 15% 80%,rgba(255,255,255,.025),transparent 20%)`;
    }
  },{passive:true});
})();