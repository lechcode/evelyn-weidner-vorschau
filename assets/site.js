/* Evelyn Weidner — gemeinsames JS: Jahresrad, Reveals, Nav/Burger, Formulare.
   Alle Zugriffe mit Null-Guards, damit es auf jeder Seite läuft. */
  /* ---- Jahresrad-Daten: 8 Stationen ---- */
  var FEASTS = [
    {name:"Julfest", sub:"Wintersonnwende", season:"Tiefwinter", title:"Die Stille des Winters", month:11.83,
     text:"Die längste Nacht ist überwunden, das Licht kehrt zurück. Eine Zeit der Einkehr, der Träume und der leisen Hoffnung — nach innen lauschen, bevor draußen wieder alles erwacht."},
    {name:"Lichtmess", sub:"Imbolc", season:"Vorfrühling", title:"Das erste Regen", month:1.0,
     text:"Unter dem Schnee regt sich das Leben. Schneeglöckchen wagen sich hervor, die ersten Kräfte kehren zurück. Zeit, Absichten zu säen und dem Frühling entgegenzuträumen."},
    {name:"Ostara", sub:"Frühlings-T.u.G.", season:"Frühling", title:"Das Erwachen", month:2.7,
     text:"Tag und Nacht sind im Gleichgewicht, alles drängt ans Licht. Die Wildkräuter sind jetzt zart und voller Kraft — die beste Zeit für frisches Grün und neue Anfänge."},
    {name:"Beltane", sub:"Maifeuer", season:"Wonnemonat", title:"Die volle Blüte", month:4.0,
     text:"Die Natur steht in überschwänglicher Blüte, alles summt und leuchtet. Eine Zeit der Lebensfreude, der Sinnlichkeit und der Feste unter freiem Himmel."},
    {name:"Litha", sub:"Sommersonnwende", season:"Hochsommer", title:"Die Fülle des Sommers", month:5.7,
     text:"Die Wiesen stehen in voller Kraft, Johanniskraut und Schafgarbe blühen, die Sonne hat ihren höchsten Stand. Eine Zeit zu ernten, zu trocknen und dankbar zu sein für das, was wächst."},
    {name:"Schnitterfest", sub:"Lughnasadh", season:"Spätsommer", title:"Die erste Ernte", month:7.0,
     text:"Das Korn reift, die ersten Früchte werden geerntet. Eine Zeit der Dankbarkeit für die Fülle — und der Besinnung darauf, was wir das Jahr über gesät haben."},
    {name:"Mabon", sub:"Herbst-T.u.G.", season:"Herbst", title:"Das Gleichgewicht", month:8.7,
     text:"Wieder halten sich Tag und Nacht die Waage, doch nun neigt sich das Licht. Erntedank, Wurzeln und Beeren, das Einkochen der Vorräte — und der Blick nach innen beginnt."},
    {name:"Samhain", sub:"Ahnenfest", season:"Novembernächte", title:"Der Schleier wird dünn", month:10.0,
     text:"Das Jahr geht zur Ruhe, die Natur zieht sich zurück. Eine Zeit, der Ahnen zu gedenken, loszulassen und im Dunkeln dem neuen Zyklus entgegenzuruhen."}
  ];
  var ANGLES = [-90,-45,0,45,90,135,180,225]; // Julfest oben, im Uhrzeigersinn
  function polar(cx,cy,r,deg){var a=deg*Math.PI/180;return [cx+r*Math.cos(a), cy+r*Math.sin(a)];}

  (function buildWheel(){
    var spokes=document.getElementById('wheelSpokes'), nodes=document.getElementById('wheelNodes');
    var seasonNodes=document.getElementById('seasonNodes');
    if(!nodes && !seasonNodes) return;   // keins der Räder auf dieser Seite -> raus (Texte trotzdem unten guarded)
    var NS="http://www.w3.org/2000/svg";
    for(var i=0;i<8;i++){
      var pn=polar(150,150,120,ANGLES[i]);
      // Hero-Rad (optional — nur wenn vorhanden)
      if(nodes && spokes){
        var ln=document.createElementNS(NS,'line');
        ln.setAttribute('class','spoke');ln.setAttribute('x1',150);ln.setAttribute('y1',150);
        ln.setAttribute('x2',pn[0]);ln.setAttribute('y2',pn[1]);ln.setAttribute('style','--dash:130');
        spokes.appendChild(ln);
        var g=document.createElementNS(NS,'g');g.setAttribute('class','feast-node');g.setAttribute('data-i',i);
        var c=document.createElementNS(NS,'circle');c.setAttribute('class','node');
        c.setAttribute('cx',pn[0]);c.setAttribute('cy',pn[1]);c.setAttribute('r',3.6);
        g.appendChild(c);
        var t=document.createElementNS(NS,'text');t.setAttribute('class','node-label');
        var lo=polar(150,150,131,ANGLES[i]);
        t.setAttribute('x',lo[0]);t.setAttribute('y',lo[1]+2);
        t.setAttribute('text-anchor', ANGLES[i]===-90||ANGLES[i]===90?'middle':(Math.cos(ANGLES[i]*Math.PI/180)<0?'end':'start'));
        t.textContent=FEASTS[i].name;
        g.appendChild(t);
        nodes.appendChild(g);
      }
      // Jahreskreis-Sektion-Rad — Knoten mit Fest-Namen
      if(seasonNodes){
        var p2=polar(150,150,96,ANGLES[i]);
        var c2=document.createElementNS(NS,'circle');
        c2.setAttribute('cx',p2[0]);c2.setAttribute('cy',p2[1]);c2.setAttribute('r',4);
        c2.setAttribute('fill','#F5EFE2');c2.setAttribute('stroke','#3B4023');c2.setAttribute('stroke-width','1.2');
        c2.setAttribute('data-si',i);
        seasonNodes.appendChild(c2);
        var lo2=polar(150,150,116,ANGLES[i]);
        var t2=document.createElementNS(NS,'text');
        t2.setAttribute('x',lo2[0]);t2.setAttribute('y',lo2[1]+2.5);
        t2.setAttribute('font-family','Mulish, sans-serif');t2.setAttribute('font-size','7.2');
        t2.setAttribute('font-weight','700');t2.setAttribute('letter-spacing','.04em');
        t2.setAttribute('fill','#4E5344');
        t2.setAttribute('text-anchor', ANGLES[i]===-90||ANGLES[i]===90?'middle':(Math.cos(ANGLES[i]*Math.PI/180)<0?'end':'start'));
        t2.textContent=FEASTS[i].sub;
        seasonNodes.appendChild(t2);
      }
    }
    // aktuelle Jahreszeit = die zuletzt BEGONNENE Station (Phase, in der wir stehen — nicht die nächstliegende)
    var now=new Date();
    var frac=now.getMonth()+ (now.getDate()-1)/31; // 0..11.x
    var best=0; // Julfest (month 11.83) trägt die Tiefwinter-Phase Ende Dez–Lichtmess
    for(var k=0;k<8;k++){ if(FEASTS[k].month<=frac) best=k; }
    // Hero-Rad Marker + Hervorhebung (nur wenn Hero-Rad vorhanden)
    if(nodes){
      var mAngle=ANGLES[best];
      var mp=polar(150,150,120,mAngle);
      var mk=document.getElementById('wheelMarker');
      if(mk){mk.setAttribute('cx',mp[0]);mk.setAttribute('cy',mp[1]);}
      var gs=nodes.querySelectorAll('.feast-node');
      if(gs[best])gs[best].setAttribute('class','feast-node season-now');
    }
    if(seasonNodes){
      var sc=seasonNodes.querySelector('[data-si="'+best+'"]');
      if(sc){sc.setAttribute('fill','#C0532F');sc.setAttribute('stroke','#C0532F');sc.setAttribute('r','6');}
    }
    // Texte setzen
    var f=FEASTS[best];
    var bs=document.getElementById('badgeSeason'), bf=document.getElementById('badgeFeast');
    if(bs)bs.textContent=f.season; if(bf)bf.textContent=f.name;
    var sn=document.getElementById('seasonNow'),st=document.getElementById('seasonTitle'),sx=document.getElementById('seasonText');
    if(sn)sn.textContent='Gerade jetzt · '+f.season;
    if(st)st.textContent=f.title;
    if(sx)sx.textContent=f.text;
  })();

  /* ---- Reveals ---- */
  (function(){
    var els=[].slice.call(document.querySelectorAll('.reveal'));
    if(!('IntersectionObserver' in window)||window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      els.forEach(function(e){e.classList.add('in');});
      var w=document.getElementById('wheel'); if(w)w.classList.add('drawn');
      return;
    }
    var io=new IntersectionObserver(function(ents){
      ents.forEach(function(en){ if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);} });
    },{threshold:.12,rootMargin:'0px 0px -8% 0px'});
    els.forEach(function(e){io.observe(e);});
    var w=document.getElementById('wheel');
    if(w){var io2=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){w.classList.add('drawn');io2.disconnect();}});},{threshold:.2});io2.observe(w);}
  })();

  /* ---- Nav scrolled + Burger ---- */
  (function(){
    var nav=document.getElementById('nav'), tog=document.getElementById('navToggle'), menu=document.getElementById('mobileMenu');
    addEventListener('scroll',function(){nav.classList.toggle('scrolled',scrollY>12);},{passive:true});
    function close(){menu.classList.remove('open');tog.setAttribute('aria-expanded','false');tog.setAttribute('aria-label','Menü öffnen');document.body.style.overflow='';}
    function open(){menu.classList.add('open');tog.setAttribute('aria-expanded','true');tog.setAttribute('aria-label','Menü schließen');document.body.style.overflow='hidden';}
    tog.addEventListener('click',function(){menu.classList.contains('open')?close():open();});
    menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',close);});
    addEventListener('keydown',function(e){if(e.key==='Escape'&&menu.classList.contains('open'))close();});
  })();

  /* ---- Formulare (Demo) ---- */
  function fakeSubmit(form,msg,okText){
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var m=document.getElementById(msg);
      if(form.querySelector('[name=botcheck]')&&form.querySelector('[name=botcheck]').value){return;}
      var invalid=false;
      form.querySelectorAll('[required]').forEach(function(f){if(!f.value.trim()){invalid=true;f.style.borderColor='#B06A3C';}});
      if(invalid){m.style.color='#B06A3C';m.textContent='Bitte fülle die markierten Felder aus.';return;}
      m.style.color='';m.textContent=okText;
      form.reset();
    });
  }
  fakeSubmit(document.getElementById('contactForm'),'contactMsg','Deine Nachricht ist unterwegs — bis wir uns hören, hör mal, was draußen wächst. 🌿 (Demo: es wird noch nichts versendet.)');
  fakeSubmit(document.getElementById('newsForm'),'newsMsg','Schön, dass du dabei bist! Im Live-Betrieb bekommst du jetzt eine Bestätigungs-Mail. 🌾');
  document.getElementById('year').textContent=new Date().getFullYear();
