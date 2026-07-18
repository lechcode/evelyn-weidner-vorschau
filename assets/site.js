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

  try{ (function buildWheel(){
    var spokes=document.getElementById('wheelSpokes'), nodes=document.getElementById('wheelNodes');
    var seasonNodes=document.getElementById('seasonNodes');
    // aktuelle Station IMMER bestimmen (auch ohne Rad — für die Karten-Texte)
    var now=new Date();
    var frac=now.getMonth()+ (now.getDate()-1)/31; // 0..11.x
    var best=0; for(var k=0;k<8;k++){ if(FEASTS[k].month<=frac) best=k; }
    var f=FEASTS[best];
    var bs=document.getElementById('badgeSeason'), bf=document.getElementById('badgeFeast');
    if(bs)bs.textContent=f.season; if(bf)bf.textContent=f.name;
    var sn=document.getElementById('seasonNow'),st=document.getElementById('seasonTitle'),sx=document.getElementById('seasonText');
    if(sn)sn.textContent='Gerade jetzt · '+f.season;
    if(st)st.textContent=f.title;
    if(sx)sx.textContent=f.text;
    if(!nodes && !seasonNodes) return;   // kein Rad auf dieser Seite -> Texte sind gesetzt, fertig
    var NS="http://www.w3.org/2000/svg";
    function mk(tag,a){var e=document.createElementNS(NS,tag);for(var k in a)e.setAttribute(k,a[k]);return e;}
    function anchorFor(deg){return (deg===-90||deg===90)?'middle':(Math.cos(deg*Math.PI/180)<0?'end':'start');}
    for(var i=0;i<8;i++){
      var cur=(i===best);
      // Hero-Rad (optional — Legacy, nur wenn vorhanden)
      if(nodes && spokes){
        var pn=polar(150,150,120,ANGLES[i]);
        spokes.appendChild(mk('line',{'class':'spoke',x1:150,y1:150,x2:pn[0],y2:pn[1],style:'--dash:130'}));
        var g=mk('g',{'class':cur?'feast-node season-now':'feast-node','data-i':i});
        g.appendChild(mk('circle',{'class':'node',cx:pn[0],cy:pn[1],r:3.6}));
        var lo=polar(150,150,131,ANGLES[i]);
        var t=mk('text',{'class':'node-label',x:lo[0],y:lo[1]+2,'text-anchor':anchorFor(ANGLES[i])});
        t.textContent=FEASTS[i].name; g.appendChild(t);
        nodes.appendChild(g);
      }
      // Jahresrad-Sektion (premium, viewBox 400) — Knoten auf dem Farb-Band + Fest-Label
      if(seasonNodes){
        var p2=polar(200,200,136,ANGLES[i]);
        if(cur) seasonNodes.appendChild(mk('circle',{cx:p2[0],cy:p2[1],r:16,fill:'#C0532F',opacity:'.16'}));
        seasonNodes.appendChild(mk('circle',{cx:p2[0],cy:p2[1],r:cur?9:6.5,fill:cur?'#C0532F':'#F5EFE2',stroke:cur?'#C0532F':'#3B4023','stroke-width':1.4}));
        var lo2=polar(200,200,174,ANGLES[i]);
        var t2=mk('text',{x:lo2[0],y:lo2[1]+3.5,'font-family':'Mulish, sans-serif','font-size':cur?12:11,'font-weight':cur?800:700,'letter-spacing':'.03em',fill:cur?'#8A3418':'#4E5344','text-anchor':anchorFor(ANGLES[i])});
        t2.textContent=FEASTS[i].name;
        seasonNodes.appendChild(t2);
      }
    }
    // Hero-Rad Marker (Legacy, guarded)
    if(nodes){
      var mp=polar(150,150,120,ANGLES[best]);
      var mkr=document.getElementById('wheelMarker');
      if(mkr){mkr.setAttribute('cx',mp[0]);mkr.setAttribute('cy',mp[1]);}
    }
  })(); }catch(_ew){ if(window.console&&console.warn)console.warn('Jahresrad übersprungen:',_ew); }

  /* ---- Reveals ---- */
  try{ (function(){
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
  })(); }catch(_er){ /* Reveals fehlgeschlagen -> Inhalte trotzdem zeigen */ document.querySelectorAll('.reveal').forEach(function(e){e.classList.add('in');}); }

  /* ---- Nav scrolled + Burger (läuft IMMER, unabhängig vom obigen) ---- */
  (function(){
    var nav=document.getElementById('nav'), tog=document.getElementById('navToggle'), menu=document.getElementById('mobileMenu');
    if(!tog||!menu) return;
    if(nav)addEventListener('scroll',function(){nav.classList.toggle('scrolled',scrollY>12);},{passive:true});
    function close(){menu.classList.remove('open');tog.setAttribute('aria-expanded','false');tog.setAttribute('aria-label','Menü öffnen');document.body.style.overflow='';}
    function open(){menu.classList.add('open');tog.setAttribute('aria-expanded','true');tog.setAttribute('aria-label','Menü schließen');document.body.style.overflow='hidden';}
    tog.addEventListener('click',function(){menu.classList.contains('open')?close():open();});
    menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',close);});
    addEventListener('keydown',function(e){if(e.key==='Escape'&&menu.classList.contains('open'))close();});
  })();

  /* ---- Formulare (Demo) ---- */
  function fakeSubmit(form,msg,okText){
    if(!form) return;
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
  var _yr=document.getElementById('year'); if(_yr)_yr.textContent=new Date().getFullYear();
