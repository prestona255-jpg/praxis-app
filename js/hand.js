/* ============================================================================
   THE LENS HAND — hand.js, L4 edition (8 Nov 2026, Fable 5.1, design chat)
   One engine for the mockup "Praxis Lens Sky" and for the L4 build. ES3 style
   (var/function, string concat, no arrows, no template strings), no deps.

   Lineage: lens-hand/hand.js (Oct 11) → v16/hand.js (walk) → the Day Three
   copy (25 Oct, two hands) → THIS (Garden only, ruling 82; the sky at 0 · 1 ·
   many; threads and names toggles, seventh r6; size = book count).

   Exposes ONE global, PraxisHand. Nothing else leaks.
     PraxisHand.makeLook(name, otherLooks)   -> look (STORE IT; never re-derive)
     PraxisHand.formSvg(look, seed, box, offered) -> svg string, one lens
     PraxisHand.bloom(looks, seed)           -> svg inner, the flower / the seed
     PraxisHand.yumiSeed()                   -> svg string, Yumi painted
     PraxisHand.bloomSvg()                   -> svg string, the live Bloom (tokens)
     PraxisHand.Sky(host, opts)              -> a sky; .set(items, shares, keptLooks)
                                                .toggles({threads, names}) .build() .tick()
     PraxisHand.YumiSky(host)                -> the current behind her seed only
     PraxisHand.startSkies()                 -> one rAF loop for every sky
     PraxisHand.GARDEN, .gardenColour(i)     -> the palette and its clamped values
     PraxisHand.stats()                      -> {frames, seconds, fps, worst1s} for the motion gate
     PraxisHand.contrast(a, b), .sizeFor(books, n, wide, compact)

   Colour law (contract §3 of the L4 design): a lens's Garden colour is picked
   by the hash of its lower-cased name, stepping to the next colour not already
   in the same sky, then CLAMPED toward the light (#FFF1D2) in .05 steps until
   it measures >= 3:1 as a flat mark on BOTH skies (night #1C120A, day #2B1E12).
   The result is stored on the lens as `look` (lens-contract.md §1) and is never
   re-derived, so a rename, a regeneration or a re-ordering keeps the colour.

   Motion law (seventh r9): the sky is never still, paper is. Everything here
   is transform/opacity CSS keyframes plus one canvas (the current) driven by
   one requestAnimationFrame loop that runs only for skies on screen and stops
   when the tab is hidden. prefers-reduced-motion stills the canvas and the
   loop; the CSS side is stilled by the host page's reduced-motion rule.
   ============================================================================ */
var PraxisHand = (function(){
  var SKYD='#1C120A', SKYDAY='#2B1E12', LITE='#FFF1D2', GOLD='#CFA64A', UID=0, TAU=6.2832, PI=Math.PI;
  function hash(s){var h=2166136261,i;for(i=0;i<s.length;i++){h^=s.charCodeAt(i);h=((h<<5)+(h<<3)+(h<<1)+h+(h<<24))>>>0;}return h>>>0;}
  function rng(seed){var a=(seed>>>0)||1;return function(){a=(a*1664525+1013904223)%4294967296;return a/4294967296;};}
  function h2(n){var s=Math.max(0,Math.min(255,Math.round(n))).toString(16);return s.length<2?'0'+s:s;}
  function rgb(h){return [parseInt(h.substr(1,2),16),parseInt(h.substr(3,2),16),parseInt(h.substr(5,2),16)];}
  function mix(a,b,t){var x=rgb(a),y=rgb(b);return '#'+h2(x[0]+(y[0]-x[0])*t)+h2(x[1]+(y[1]-x[1])*t)+h2(x[2]+(y[2]-x[2])*t);}
  function rgba(h,a){var c=rgb(h);return 'rgba('+c[0]+','+c[1]+','+c[2]+','+(Math.round(a*1000)/1000)+')';}
  /* WCAG relative luminance and contrast, so a lens colour can be clamped to read on the sky (seventh r10) */
  function lum(h){var c=rgb(h),i,v,o=[];for(i=0;i<3;i++){v=c[i]/255;o.push(v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4));}return 0.2126*o[0]+0.7152*o[1]+0.0722*o[2];}
  function contrast(a,b){var x=lum(a),y=lum(b),hi=Math.max(x,y),lo=Math.min(x,y);return (hi+0.05)/(lo+0.05);}
  function c01(x){return x<0?0:(x>1?1:x);}
  function sstep(a,b,x){var t=c01((x-a)/(b-a));return t*t*(3-2*t);}
  function f(n){return String(Math.round(n*10)/10);}
  function f2(n){return String(Math.round(n*100)/100);}
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function smooth(p){
    var n=p.length,i,d='M'+f(p[0][0])+' '+f(p[0][1]),p0,p1,p2,p3;
    for(i=0;i<n;i++){ p0=p[(i-1+n)%n];p1=p[i];p2=p[(i+1)%n];p3=p[(i+2)%n];
      d+='C'+f(p1[0]+(p2[0]-p0[0])/6)+' '+f(p1[1]+(p2[1]-p0[1])/6)+' '+f(p2[0]-(p3[0]-p1[0])/6)+' '+f(p2[1]-(p3[1]-p1[1])/6)+' '+f(p2[0])+' '+f(p2[1]); }
    return d+'Z';
  }
  function lobe(len,wid,ang,r,scale,wob){
    var N=11,i,t,pts=[],a=ang*Math.PI/180,ca=Math.cos(a),sa=Math.sin(a),u,vv,rad,p1=r()*6.28,p2=r()*6.28,W=(wob===undefined)?.2:wob;
    for(i=0;i<N;i++){
      t=i/N*TAU; rad=1+W*Math.sin(2*t+p1)+W*.6*Math.sin(3*t+p2)+(r()-.5)*W*.5;
      u=(.5+.5*Math.cos(t)*rad)*len*scale+len*(1-scale)*.5;
      vv=Math.sin(t)*rad*wid*.5*scale*(.55+.45*(.5-.5*Math.cos(t+3.1416)));
      pts.push([u*ca-vv*sa,u*sa+vv*ca]);
    }
    return smooth(pts);
  }
  function soft(R,n,amp,ph,r,wob){
    var N=30,i,t,p=[],k,a=r()*6.28,b=r()*6.28;
    for(i=0;i<N;i++){ t=i/N*TAU; k=1+(n?amp*Math.cos(n*t+ph):0)+wob*Math.sin(2*t+a)+wob*.6*Math.sin(3*t+b); p.push([R*k*Math.cos(t),R*k*Math.sin(t)]); }
    return smooth(p);
  }
  function lay(d,col,a,tf){return '<path d="'+d+'" fill="'+col+'" fill-opacity="'+a+'"'+(tf?' transform="'+tf+'"':'')+'/>';}
  function halo(R,col,a){
    var id='h'+(++UID);
    return '<radialGradient id="'+id+'"><stop offset="0" stop-color="'+col+'" stop-opacity="'+f2(a)+'"/><stop offset=".45" stop-color="'+col+'" stop-opacity="'+f2(a*.4)+'"/><stop offset="1" stop-color="'+col+'" stop-opacity="0"/></radialGradient><circle r="'+f(R)+'" fill="url(#'+id+')"/>';
  }
  function at(x,y,inner){return '<g transform="translate('+f(x)+' '+f(y)+')">'+inner+'</g>';}
  function clipTo(d,inner){var id='c'+(++UID);return '<clipPath id="'+id+'"><path d="'+d+'"/></clipPath><g clip-path="url(#'+id+')">'+inner+'</g>';}
  function st(x,y,ang,len,wd,col,al,ridge,r){
    var ux=Math.cos(ang),uy=Math.sin(ang),bx=-uy,by=ux,kk=(r()-.5)*len*.34,x0=x-ux*len/2,y0=y-uy*len/2,x1=x+ux*len/2,y1=y+uy*len/2,o=wd*.24;
    return '<path d="M'+f(x0)+' '+f(y0)+'Q'+f(x+bx*kk)+' '+f(y+by*kk)+' '+f(x1)+' '+f(y1)+'" fill="none" stroke="'+col+'" stroke-opacity="'+f2(al)+'" stroke-width="'+f(wd)+'" stroke-linecap="round"/>'
      +'<path d="M'+f(x0+bx*o)+' '+f(y0+by*o)+'Q'+f(x+bx*(kk+o))+' '+f(y+by*(kk+o))+' '+f(x1+bx*o)+' '+f(y1+by*o)+'" fill="none" stroke="'+mix(col,LITE,.3)+'" stroke-opacity="'+f2(al*ridge)+'" stroke-width="'+f(wd*.28)+'" stroke-linecap="round"/>';
  }
  function goldArc(R,a0,a1,w){
    return '<path d="M'+f(R*Math.cos(a0))+' '+f(R*Math.sin(a0))+'A'+f(R)+' '+f(R)+' 0 '+((a1-a0>Math.PI)?1:0)+' 1 '+f(R*Math.cos(a1))+' '+f(R*Math.sin(a1))+'" fill="none" stroke="'+GOLD+'" stroke-opacity=".9" stroke-width="'+(w||.9)+'" stroke-linecap="round"/>';
  }
  function goldEdge(d,a){
    return '<path d="'+d+'" fill="none" stroke="#160E06" stroke-opacity="'+f2(a*.55)+'" stroke-width="1.6"/><path d="'+d+'" fill="none" stroke="'+GOLD+'" stroke-opacity="'+f2(a)+'" stroke-width=".7"/>';
  }
  function line(d,col,a,w,extra){return '<path d="'+d+'" fill="none" stroke="'+col+'" stroke-opacity="'+a+'" stroke-width="'+w+'" stroke-linecap="round" stroke-linejoin="round"'+(extra||'')+'/>';}
  function swy(inner,deg,sc,d,dl){return '<g class="sw" style="--sw:'+f(deg)+'deg;--sc:'+sc+';--d:'+f(d)+'s;--dl:-'+f(dl||0)+'s">'+inner+'</g>';}

  /* outlines: plain geometric shapes, sampled and eased */
  var EXT=0;
  function polyPts(n,R,rot,sx,sy){
    var N=n*10,i,t,a,seg=TAU/n,k,p=[],norm=(1+Math.cos(PI/n))/2;
    for(i=0;i<N;i++){ t=i/N*TAU; a=(((t-rot+seg/2)%seg)+seg)%seg-seg/2; k=Math.cos(PI/n)/Math.cos(PI/n-Math.abs(a))/norm; p.push([R*k*Math.cos(t)*(sx||1),R*k*Math.sin(t)*(sy||1)]); }
    return p;
  }
  function edgePts(V,R,per){
    var p=[],i,j,a,b,t;
    for(i=0;i<V.length;i++){ a=V[i];b=V[(i+1)%V.length]; for(j=0;j<per;j++){ t=(j+.5)/per; p.push([R*(a[0]+(b[0]-a[0])*t),R*(a[1]+(b[1]-a[1])*t)]); } }
    return p;
  }
  function pts(kind,R){
    var p=[],i,t,N=48,x,w,rho,d;
    if(kind==='tri'){p=polyPts(3,R*.96,-PI/2);for(i=0;i<p.length;i++){p[i][1]+=R*.14;}return p;}
    if(kind==='tridn'){p=polyPts(3,R*.96,PI/2);for(i=0;i<p.length;i++){p[i][1]-=R*.14;}return p;}
    if(kind==='sq'){return polyPts(4,R*.98,PI/4);}
    if(kind==='dia'){return polyPts(4,R*1.04,0,.74,1);}
    if(kind==='pent'){return polyPts(5,R,-PI/2);}
    if(kind==='hex'){return polyPts(6,R,0);}
    if(kind==='hept'){return polyPts(7,R,-PI/2);}
    if(kind==='oct'){return polyPts(8,R,PI/8);}
    if(kind==='trap'){p=polyPts(4,R,PI/4);for(i=0;i<p.length;i++){p[i][0]*=1+.24*(p[i][1]/R);p[i][1]*=.9;}return p;}
    if(kind==='kite'){return edgePts([[0,-.99],[.68,-.31],[0,.99],[-.68,-.31]],R,9);}
    if(kind==='para'){return edgePts([[-.5,-.74],[.98,-.74],[.5,.74],[-.98,.74]],R,9);}
    if(kind==='oval'){for(i=0;i<N;i++){t=i/N*TAU;p.push([R*.78*Math.cos(t),R*1.05*Math.sin(t)]);}return p;}
    if(kind==='lens'){rho=1.2*R;d=.66*R;w=Math.sqrt(rho*rho-d*d);
      for(i=0;i<=20;i++){x=-w+2*w*i/20;p.push([x,-(Math.sqrt(rho*rho-x*x)-d)]);}
      for(i=1;i<20;i++){x=w-2*w*i/20;p.push([x,Math.sqrt(rho*rho-x*x)-d]);}
      return p;}
    if(kind==='half'){
      for(i=1;i<26;i++){t=-PI*i/26;p.push([R*.96*Math.cos(t),R*1.2*Math.sin(t)+R*.6]);}
      for(i=1;i<8;i++){p.push([-R*.96+1.92*R*i/8,R*.6]);}
      return p;}
    if(kind==='pill'){
      for(i=0;i<=14;i++){t=-PI/2+PI*i/14;p.push([R*(.44+.58*Math.cos(t)),R*.58*Math.sin(t)]);} p.push([0,R*.58]);
      for(i=0;i<=14;i++){t=PI/2+PI*i/14;p.push([R*(-.44+.58*Math.cos(t)),R*.58*Math.sin(t)]);} p.push([0,-R*.58]);
      return p;}
    for(i=0;i<N;i++){t=i/N*TAU;p.push([R*.94*Math.cos(t),R*.94*Math.sin(t)]);}
    return p;
  }
  function shape(kind,R,r,wob,rot){
    var p=pts(kind,R),i,k,a=r()*6.28,W=(wob===undefined)?.014:wob,t,q=(rot||0)*PI/180,ca=Math.cos(q),sa=Math.sin(q),x,y,e=0;
    for(i=0;i<p.length;i++){ t=i/p.length*TAU;k=1+W*Math.sin(2*t+a)+(r()-.5)*W; x=p[i][0]*k;y=p[i][1]*k; p[i]=[x*ca-y*sa,x*sa+y*ca]; e=Math.max(e,Math.sqrt(x*x+y*y)); }
    EXT=e; return smooth(p);
  }
  var MC={tri:[0,.14],tridn:[0,-.14],kite:[0,-.1],half:[0,.08]};
  /* one fine-line design per lens, in ink and gold, always moving */
  function motif(kind,R,c,T,d0,m,ay){
    var ink=mix(c[0],'#000000',.6),g='',i,a,p,rr,x,y,k,s,mx=m[0],my=m[1],here='translate('+f(mx)+' '+f(my)+')';
    if(kind==='spiral'){p='';for(i=0;i<=90;i++){a=i/90*TAU*2.6;rr=1.5+(R*.9)*i/90;p+=(i?'L':'M')+f(rr*Math.cos(a))+' '+f(rr*Math.sin(a));}
      return '<g transform="'+here+'"><g class="tn" style="--d:'+f(40*T)+'s">'+line(p,ink,.6,.9)+line(p,GOLD,.5,.5,' transform="rotate(180)"')+'</g></g>';}
    if(kind==='rays'){for(i=0;i<11;i++){a=(-164+i*14.8)*PI/180;g+=line('M0 '+f(ay)+'L'+f(R*1.8*Math.cos(a))+' '+f(ay+R*1.8*Math.sin(a)),(i%2)?GOLD:ink,.55,(i%2)?.6:.9);}
      return '<g class="pu" style="--d:'+f(6*T)+'s;transform-origin:0 '+f(ay)+'px">'+g+'</g>';}
    if(kind==='lattice'){for(i=-7;i<=7;i++){g+=line('M'+f(i*7)+' -60L'+f(i*7)+' 60',ink,.5,.7)+line('M-60 '+f(i*7)+'L60 '+f(i*7),(i%2)?GOLD:ink,.45,.6);}
      return '<g transform="rotate(45)"><g class="gr" style="--d:'+f(9*T)+'s">'+g+'</g></g>';}
    if(kind==='arcs'){
      for(i=1;i<=3;i++){g+='<circle cx="0" cy="'+f(ay)+'" r="'+f(R*.38*i)+'" fill="none" stroke="'+ink+'" stroke-opacity=".3" stroke-width=".7"/>';}
      for(i=0;i<5;i++){g+='<circle class="rp" style="--d:'+f(8*T)+'s;--dl:-'+f(8*T*i/5)+'s;--ro:.7;transform-origin:0 '+f(ay)+'px" cx="0" cy="'+f(ay)+'" r="'+f(R*1.6)+'" fill="none" stroke="'+((i%2)?GOLD:ink)+'" stroke-width=".9"/>';}
      return g+'<circle cx="0" cy="'+f(ay)+'" r="'+f(R*.2)+'" fill="'+mix(c[1],LITE,.4)+'" fill-opacity=".7"/>';}
    if(kind==='strata'){k=[-.62,-.36,-.16,.06,.22,.44,.66];for(i=0;i<k.length;i++){g+=line('M-60 '+f(R*k[i])+'q15 '+f((i%2)?2:-2)+' 30 0t30 0t30 0t30 0',(i%3===1)?GOLD:ink,.6,(i%2)?1.6:.8);}
      return '<g transform="rotate(-10)">'+swy(g,2.5,1.03,8*T)+'</g>';}
    if(kind==='cross'){g=line('M0 '+f(-R*1.4)+'L0 '+f(R*1.4),ink,.55,.8)+line('M'+f(-R*1.4)+' 0L'+f(R*1.4)+' 0',ink,.55,.8)+'<circle r="'+f(R*.4)+'" fill="none" stroke="'+GOLD+'" stroke-opacity=".7" stroke-width=".9"/><circle r="'+f(R*.62)+'" fill="none" stroke="'+ink+'" stroke-opacity=".45" stroke-width=".6" stroke-dasharray="1.5 3"/>';
      return '<g transform="'+here+'"><g class="tn" style="--d:'+f(50*T)+'s">'+g+'</g></g>';}
    if(kind==='veins'){for(i=0;i<6;i++){a=i/6*TAU+.3;x=Math.cos(a);y=Math.sin(a);
        g+=line('M0 0Q'+f(R*.5*x-R*.18*y)+' '+f(R*.5*y+R*.18*x)+' '+f(R*1.1*x)+' '+f(R*1.1*y),(i%2)?GOLD:ink,.6,.8)
          +line('M'+f(R*.45*x-R*.07*y)+' '+f(R*.45*y+R*.07*x)+'L'+f(R*.74*x-R*.3*y)+' '+f(R*.74*y+R*.3*x),ink,.45,.6)
          +line('M'+f(R*.52*x-R*.04*y)+' '+f(R*.52*y+R*.04*x)+'L'+f(R*.8*x+R*.26*y)+' '+f(R*.8*y-R*.26*x),ink,.45,.6);}
      return '<g transform="'+here+'">'+swy(g,7,1.04,9*T)+'</g>';}
    if(kind==='eccentric'){for(i=1;i<=5;i++){g+='<circle cx="'+f(mx-R*.48+i*R*.1)+'" cy="'+f(my+i*R*.02)+'" r="'+f(i*R*.2)+'" fill="none" stroke="'+((i%2)?ink:GOLD)+'" stroke-opacity=".6" stroke-width=".8"/>';}
      return '<g class="pu" style="--d:'+f(7*T)+'s;transform-origin:'+f(mx-R*.48)+'px '+f(my)+'px">'+g+'</g>';}
    if(kind==='links'){for(i=0;i<4;i++){a=i/4*TAU;g+='<circle cx="'+f(R*.32*Math.cos(a))+'" cy="'+f(R*.32*Math.sin(a))+'" r="'+f(R*.3)+'" fill="none" stroke="'+((i%2)?GOLD:ink)+'" stroke-opacity=".65" stroke-width=".9"/>';}
      return '<g transform="'+here+'"><g class="tn" style="--d:'+f(44*T)+'s">'+g+'</g></g>';}
    for(i=0;i<3;i++){ s=.78-i*.22; g+='<g transform="'+here+'">'+swy('<g transform="scale('+f2(s)+') translate('+f(-mx)+' '+f(-my)+')">'+line(d0,(i%2)?ink:GOLD,.65,f2(.8/s))+'</g>',(i%2)?-8:8,1.03,(9+i*3)*T,i*2)+'</g>'; }
    return g;
  }
  /* one lens: an outline painted in three washes that sway against each other, colour pooled inside, see-through strokes, one design cut to the outline, a bead, a halo that breathes, a hairline of gold that circles */
  function form(c,r,o){
    var R=o.R,T=o.t,rot=o.rot||0,d=shape(o.kind,R,r,undefined,rot),ext=EXT,m=MC[o.kind]||[0,0],mx=m[0]*R,my=m[1]*R,ay=((o.ay===undefined)?.5:o.ay)*R,h='',g='',gs='',i,a,dd,bx,by,q=rot*PI/180,ca=Math.cos(q),sa=Math.sin(q),X,Y;
    h+='<g class="pu" style="--d:'+f(5.5*T)+'s">'+halo(R*1.75,c[0],.38)+'</g>';
    h+=swy(lay(d,mix(c[0],SKYD,.36),.95),3,1.03,13*T);
    for(i=0;i<6;i++){ g+=at((r()-.5)*R*1.2,(r()-.5)*R*1.2,halo(4+r()*R*.4,(i%2)?c[1]:mix(c[0],'#000000',.6),.36)); }
    h+=swy('<g transform="scale(.9)">'+lay(d,c[0],.5)+'</g>'+clipTo(d,g),-4,.97,9*T,3*T);
    for(i=0;i<5;i++){ a=r()*TAU;dd=R*(.3+r()*.3);gs+=st(dd*Math.cos(a),dd*Math.sin(a),a+1.5708,9+r()*6,3.4,mix(c[0],c[1],.3+r()*.6),.32,.45,r); }
    h+=swy('<g transform="translate('+f(-R*.07)+' '+f(-R*.07)+') scale(.74)">'+lay(d,mix(c[0],c[1],.45),.42)+'</g>'+clipTo(d,gs),5,1.05,7*T,2*T);
    h+=clipTo(shape(o.kind,R*.9,r,0,rot),'<g transform="rotate('+f(rot)+')">'+motif(o.motif,R,c,T,shape(o.kind,R,r,0,0),[mx,my],ay)+'</g>');
    if(o.motif==='rays'||o.motif==='arcs'){bx=0;by=ay;}else if(o.motif==='eccentric'){bx=mx-R*.48;by=my;}else{bx=mx;by=my;}
    X=bx*ca-by*sa;Y=bx*sa+by*ca;
    h+='<g class="pu fb" style="--d:'+f(3.4*T)+'s"><circle cx="'+f(X)+'" cy="'+f(Y)+'" r="4.2" fill="'+mix(c[0],'#000000',.64)+'"/><circle cx="'+f(X-1.3)+'" cy="'+f(Y-1.4)+'" r="1.4" fill="'+LITE+'" fill-opacity=".85"/></g>';
    h+='<g class="tn'+(o.rev?' rev':'')+'" style="--d:'+f(46*T)+'s">'+goldArc(ext+2.6,3.5,5.5,.8)+'<circle cx="'+f((ext+2.6)*Math.cos(1.2))+'" cy="'+f((ext+2.6)*Math.sin(1.2))+'" r=".9" fill="#E2B954"/></g>';
    return h;
  }
  /* the centre: part flower, part sunflower galaxy, never at rest. Petals seated by the golden angle take the colours of the lenses taken up, in order. With no lens it is a seed. */
  function bloom(looks,seed){
    var n=looks.length,r=rng(seed),rot0=r()*360,dir=(r()<.5)?-1:1,lean=dir*-(11+r()*12),P,k,j,c,q,len,wid,A,Rg,h='',items=[],core='',g,rs=rng(seed+9),d,dd,arms='',off,nn,x,y,rr,a,pool,rip='',lk;
    function armAt(kk,R){return rot0+kk*180+dir*137.5*Math.log(R/8);}
    core+='<g class="pu" style="--d:4.6s">'+halo(n?24:18,'#F2C460',n?.75:.5)+'</g>';
    for(j=0;j<34;j++){rr=10.5*Math.sqrt((j+.5)/34);a=j*2.39996+rot0;x=rr*Math.cos(a);y=rr*Math.sin(a);
      core+='<circle cx="'+f(x+.5)+'" cy="'+f(y+.6)+'" r="1.9" fill="#3A2408" fill-opacity=".7"/><circle cx="'+f(x)+'" cy="'+f(y)+'" r="1.8" fill="'+(n?'#D9A93E':'#8A6A2E')+'"/><circle cx="'+f(x-.5)+'" cy="'+f(y-.5)+'" r=".7" fill="#FBEBB8" fill-opacity="'+(n?1:.6)+'"/>'; }
    core='<g class="tn" style="--d:90s">'+core+'</g>';
    for(j=0;j<3;j++){ rip+='<circle class="rp" style="--d:9s;--dl:-'+(j*3)+'s;--ro:'+(n?.42:.5)+'" r="'+(n?62:40)+'" fill="none" stroke="'+GOLD+'" stroke-width=".7"/>'; }
    if(!n){ return rip+core; }
    P=Math.min(30,6+4*n);
    for(k=0;k<P;k++){
      lk=looks[k%n];c=lk.c;q=Math.sqrt((k+1)/P);
      len=(22+46*q)*(.82+.34*r());wid=len*(.3+.42*lk.pw)*(.85+.3*r());
      A=rot0+k*137.508+(r()-.5)*20;Rg=12+50*q;
      dd=((armAt(k%2,Rg)+(r()-.5)*14-A)*dir)%360;if(dd<0){dd+=360;}if(dd<70){dd+=360;}
      d=lobe(len,wid,0,rs,1,.16);
      g=lay(d,c[0],.34)+lay(lobe(len,wid,(rs()-.5)*7,rs,.9,.2),mix(c[0],c[1],.3),.34);
      pool='';for(j=0;j<3;j++){rr=len*(.2+.7*rs());pool+=at(rr,(rs()-.5)*wid*.5,halo(4+rs()*len*.2,(j%2)?mix(c[1],c[0],.25):mix(c[0],'#0E0A06',.55),.3));}
      g+=clipTo(d,pool);
      for(j=0;j<4;j++){off=((j-1.5)/1.5)*wid*.28;nn=len*(.8+.14*(1-Math.abs(j-1.5)/1.5));g+=st(6+nn*.5,off*.85,off*.014,nn*.88,Math.max(3.4,wid*.2),mix(c[0],c[1],c01(.14+j/4+(rs()-.5)*.3)),.46,.45,rs);}
      g+=goldEdge(d,.62)+'<path d="M8 0L'+f(len*.66)+' 0" fill="none" stroke="'+GOLD+'" stroke-opacity=".38" stroke-width=".5"/>';
      items.push('<g class="pt" style="--tf:rotate('+f(A)+'deg) translate(4px,0px) rotate(0deg) scale(1,1);--tg:rotate('+f(A+dir*dd)+'deg) translate('+f(Rg)+'px,0px) rotate('+f(dir*(70+r()*10))+'deg) scale('+f2(.62+.36*r())+','+f2(.3+.12*r())+')"><g class="sw" style="--sw:'+f(2.5+r()*3.5)+'deg;--sc:'+f2(1.02+r()*.05)+';--d:'+f(5+r()*6)+'s;--dl:-'+f(r()*8)+'s">'+g+'</g></g>');
    }
    for(k=P-1;k>=0;k--){ h+=items[k]; }
    for(k=0;k<2;k++){ d='';
      for(j=0;j<=24;j++){ q=8+58*j/24; A=armAt(k,q)*Math.PI/180; d+=(j?'L':'M')+f(q*Math.cos(A))+' '+f(q*Math.sin(A)); }
      arms+='<path d="'+d+'" fill="none" stroke="#B8742A" stroke-opacity=".3" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"/><path d="'+d+'" fill="none" stroke="#F2C460" stroke-opacity=".3" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>'; }
    arms='<g class="pt" style="--tf:scale(.1);--tg:scale(1)">'+arms+'</g>';
    return '<g class="tiltg" style="--tl:'+f(lean)+'deg"><g class="pu" style="--d:7s">'+halo(84,'#B8742A',.26)+'</g><g class="sping'+(dir<0?' rev':'')+'">'+arms+h+'</g>'+rip+core+'</g>';
  }
  function svgEl(inner,box){return '<svg viewBox="'+box+'" aria-hidden="true">'+inner+'</svg>';}

  /* ---- THE GARDEN (ruling 82: the beta's one palette). Amendment 1.3 §1: ten preset colours, then seven more, taken in turn. ---- */
  var GARDEN=['#EDB52F','#D4472F','#9A6CC9','#5F9AE0','#E58AA6','#7FBFAE','#E67E3A','#9C4A6E','#86B25B','#F3E6C8','#F2A07B','#C3A6E8','#9CC7F0','#B7C24A','#C65BCF','#2F7F9E','#C9A66B'];
  var GARDEN_NAMES=['Liberation','Power, named','Dignity','Solidarity','Care','Doubt','Praxis','Inheritance','Hope','Craft','own 1','own 2','own 3','own 4','own 5','own 6','own 7'];
  /* the clamp: toward the light in .05 steps until the flat mark reads >= 3:1 on both skies. Returns {c, t, night, day}. */
  function gardenColour(i){
    var base=GARDEN[i%GARDEN.length],t=0,col=base;
    while(t<.6 && Math.min(contrast(col,SKYD),contrast(col,SKYDAY))<3){ t+=.05; col=mix(base,LITE,t); }
    return {c:col,base:base,t:Math.round(t*100)/100,night:Math.round(contrast(col,SKYD)*100)/100,day:Math.round(contrast(col,SKYDAY)*100)/100};
  }
  var KALL=['hex','kite','sq','oval','tri','pent','lens','trap','hept','dia','half','oct','para','circle','tridn','pill'], AY={kite:.56,half:.38,tri:.42};
  var MN=['nest','spiral','cross','veins','lattice','links','strata','rays','arcs','eccentric'];
  /* a lens's look comes from the letters of its name: a Garden colour (the hash picks a start, the sky's other lenses push it to the next free one),
     one outline, one inner design — each kept distinct from the sky's other lenses while there are kinds and motifs to spare.
     STORE the result on the lens (contract §1 `look`); never re-derive it. */
  function makeLook(name,others){
    var h=hash(String(name).toLowerCase()),k=(h>>>6)%KALL.length,m=(h>>>19)%MN.length,i,tries,usedK={},usedM={},usedP={},pi=h%GARDEN.length,gc;
    others=others||[];
    for(i=0;i<others.length;i++){ if(others[i]&&others[i].form){usedK[others[i].form.kind]=1;usedM[others[i].form.motif]=1;} if(others[i]&&typeof others[i].pi==='number'){usedP[others[i].pi]=(usedP[others[i].pi]||0)+1;} }
    tries=0;while(usedP[pi]&&tries<GARDEN.length){pi=(pi+1)%GARDEN.length;tries++;}
    if(tries>=GARDEN.length){ /* more than 17 lenses: take the least-used colour from the hash onward */ var best=h%GARDEN.length,bn=1e9,j,c; for(j=0;j<GARDEN.length;j++){ c=(h+j)%GARDEN.length; if((usedP[c]||0)<bn){bn=usedP[c]||0;best=c;} } pi=best; }
    tries=0;while(usedK[KALL[k]]&&tries<KALL.length){k=(k+1)%KALL.length;tries++;}
    tries=0;while(usedM[MN[m]]&&tries<MN.length){m=(m+1)%MN.length;tries++;}
    gc=gardenColour(pi);
    return {pi:pi,c:[gc.c,mix(gc.c,LITE,.35)],pw:.3+((h>>>9)%40)/100,
      form:{R:27,t:.75+((h>>>14)%60)/100,rev:(h>>>20)&1,kind:KALL[k],motif:MN[m],rot:[-16,-8,0,8,16][(h>>>23)%5],ay:AY[KALL[k]]||.34}};
  }
  function formSvg(look,seed,box,offered){
    return svgEl('<g class="body">'+form(look.c,rng(seed+5),look.form)+'</g>'+(offered?'<circle class="offr" r="44" fill="none" stroke="#F3D98B" stroke-opacity=".6" stroke-width="1" stroke-dasharray="3 5"/>':''),box||'-50 -50 100 100');
  }
  /* Yumi: the seed, painted. Terracotta washes and a halo, an open ring, one off-centre dot. Never a fill behind her. */
  function yumiSeed(){
    var Y='#C8552E',r=rng(31),h='',i;
    h+='<g class="pu" style="--d:5.2s">'+halo(44,Y,.42)+'</g>';
    for(i=0;i<3;i++){ h+=swy('<path d="'+soft(23+i*1.2,0,0,0,r,.05)+'" fill="none" stroke="'+(i===1?mix(Y,LITE,.35):Y)+'" stroke-opacity="'+(i===1?.5:.42)+'" stroke-width="'+(i===2?2.2:3.4)+'" stroke-linecap="round"/>',(i%2?-4:4),1.03,(9+i*2),i*2); }
    h+='<path d="'+soft(26,0,0,0,r,.03)+'" fill="none" stroke="#160E06" stroke-opacity=".35" stroke-width="5"/><path d="'+soft(26,0,0,0,r,.03)+'" fill="none" stroke="'+Y+'" stroke-opacity=".9" stroke-width="1.4" stroke-dasharray="118 30" stroke-linecap="round"/>';
    h+='<g class="pu fb" style="--d:3.6s"><circle cx="9.5" cy="-9" r="5.2" fill="'+Y+'"/><circle cx="7.8" cy="-10.8" r="1.6" fill="'+LITE+'" fill-opacity=".85"/></g>';
    return svgEl(h,'-50 -50 100 100');
  }

  /* the current: a canvas of slow strokes that circles the centre and whatever lenses are in the sky, taking a little of each colour as it passes */
  function Flow(canvas,host){
    var F={L:[],P:[],ctx:null,W:0,H:0,ft:0,al:.3,gal:.8,rnd:rng(23)};
    function vec(x,y){
      var L=F.L,i,vx=.011,vy=.004*Math.sin(x/34)+.003*Math.cos(y/26),dx,dy,d,near=9,t=0,m;
      for(i=0;i<L.length;i++){dx=x-L[i][0];dy=y-L[i][1];d=Math.sqrt(dx*dx+dy*dy)+.01;vx+=(-dy/d)*L[i][2]/Math.pow(d,1.25);vy+=(dx/d)*L[i][2]/Math.pow(d,1.25);if(d/L[i][3]<near){near=d/L[i][3];t=i;}}
      m=Math.sqrt(vx*vx+vy*vy)||1;return [vx/m,vy/m,near,t];
    }
    function spawn(p){
      var r=F.rnd,j=r();
      p.x=r()*F.W;p.y=r()*F.H;p.life=50+r()*120;p.g=(r()<.09);
      p.w=p.g?(.8+r()*.7):(2+r()*1.8);
      p.c=(j<.3)?'#34241A':((j<.58)?'#402C1C':((j<.8)?'#4E3620':((j<.92)?'#3A2630':'#2A1D12')));
      return p;
    }
    F.step=function(k){
      var c=F.ctx,P=F.P,L=F.L,i,p,v,sp,nx,ny,col,al;
      if(!c){return;}
      c.globalCompositeOperation='destination-out';c.fillStyle='rgba(0,0,0,'+f2(Math.min(.12,.03*k))+')';c.fillRect(0,0,F.W,F.H);
      c.globalCompositeOperation='source-over';c.lineCap='round';
      for(i=0;i<P.length;i++){ p=P[i];v=vec(p.x,p.y);
        if((L.length&&v[2]<((v[3]===0)?.56:.72))||p.life<0||p.x<-6||p.y<-6||p.x>F.W+6||p.y>F.H+6){spawn(p);continue;}
        sp=(.34+.3*c01(1.7-v[2]))*k*(p.g?1.6:1);nx=p.x+v[0]*sp;ny=p.y+v[1]*sp;
        if(p.g){col='#E8C25C';al=(p.y<F.ft)?.16:F.gal;}else{col=(L.length&&v[2]<1.8)?mix(p.c,L[v[3]][4],sstep(1.8,.9,v[2])*.6):p.c;al=(p.y<F.ft)?F.al*.45:F.al;}
        c.strokeStyle=rgba(col,al);c.lineWidth=p.w;c.beginPath();c.moveTo(p.x,p.y);c.lineTo(nx,ny);c.stroke();
        p.x=nx;p.y=ny;p.life-=k;
      }
    };
    F.init=function(){
      var W=host.clientWidth,H=host.clientHeight,d=Math.min(2,window.devicePixelRatio||1),i,n;
      if(!W||!H){return false;}
      canvas.width=Math.round(W*d);canvas.height=Math.round(H*d);F.ctx=canvas.getContext('2d');F.ctx.setTransform(d,0,0,d,0,0);
      F.W=W;F.H=H;n=Math.round(W*H/760);F.P=[];for(i=0;i<n;i++){F.P.push(spawn({}));}
      for(i=0;i<150;i++){F.step(1.4);}
      return true;
    };
    return F;
  }

  /* LENS SIZE = BOOK COUNT (L4 design §1). 36 + 13·√books, then a density scale so a full sky still fits a phone;
     never under 44px (the tap target). wide = the 1360 column (×1.25). */
  function sizeFor(books,n,wide,compact){
    var b=Math.max(2,books||2),s=36+13*Math.sqrt(b),k=wide?1.25:1;
    if(compact){ k*=(n>3)?.74:.86; }
    else if(n>8){ k*=.72; } else if(n>5){ k*=.86; }
    return Math.max(44,Math.round(s*k));
  }

  /* a sky: lenses orbit the flower on a slow ring (two rings past eight), the current runs underneath, threads join lenses that share books.
     items = [{name, look, books, state, size?, aria?}] where state is kept · own · offer · deciding · later · cat · book; size (optional) drives the drawn size instead of books; aria (optional) replaces the built label. The list may change at any time (S.set). */
  var SKIES=[], REDUCE=!!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  function Sky(host,opts){
    var S={host:host,field:host.querySelector('[data-field]'),cv:host.querySelector('canvas.paint'),orbs:[],th:0,last:0,period:300,ready:false,items:[],shares:[],keptLooks:[],sig:'',compact:!!(opts&&opts.compact),threads:true,names:true,many:false};
    S.flow=Flow(S.cv,host);
    function geo(){var W=S.field.clientWidth,H=S.field.clientHeight,g,many=(S.items.length>((W>=560)?12:8)),tight=(!many&&W<560&&S.items.length>=7);g=Math.round(Math.min(S.compact?118:(many?((W<460)?108:150):(tight?120:((W<460)?136:176))),W*.36,H*.5));return {W:W,H:H,cx:W/2,cy:H/2,g:g,ft:S.field.offsetTop,wide:W>=560};}
    S.set=function(items,shares,keptLooks){ S.items=items||[]; S.shares=shares||[]; S.keptLooks=keptLooks||[]; };
    S.toggles=function(o){ if(o&&typeof o.threads==='boolean'){S.threads=o.threads;} if(o&&typeof o.names==='boolean'){S.names=o.names;} S.sig=''; };
    function ovl(a,b,pad){ return a.left<b.right+pad && a.right>b.left-pad && a.top<b.bottom+pad && a.bottom>b.top-pad; }
    function cls(el,name,on){ var c=el.className.replace(new RegExp(' '+name+'\\b','g'),''); el.className=on?(c+' '+name):c; }
    S.build=function(){
      var i,l,b,k,o,G,stars='',r=rng(5),n=0,tries=0,x,y,a,tg='',sig,bl,st,old={},j,changed,order,ring,N=S.items.length,outer,inner,ci=0,co=0,minShare;
      /* classes first: .many grows the field, so the geometry is read after it lands */
      S.many=(N>((S.field.clientWidth>=560)?12:8)); S.tight=(!S.many&&S.field.clientWidth<560&&N>=7);
      cls(S.field,'many',S.many); cls(S.field,'tight',S.tight); cls(S.field,'nonames',!S.names); cls(S.field,'one',N===1); cls(S.field,'none',N===0);
      G=geo();
      if(!G.W){return;}
      S.G=G;
      sig=N+':';for(i=0;i<N;i++){sig+=S.items[i].name+'|'+S.items[i].state+'|'+S.items[i].books+';';}
      sig+='K'+S.keptLooks.length+'/'+G.W+'x'+G.H+'/'+(S.threads?'t':'-')+(S.names?'n':'-');
      changed=(sig!==S.sig); S.sig=sig;
      bl=S.field.querySelector('[data-bloom]');
      if(bl){ bl.style.width=G.g+'px';bl.style.height=G.g+'px'; if(bl.getAttribute('data-n')!==String(S.keptLooks.length)+'/'+G.g){ bl.setAttribute('data-n',String(S.keptLooks.length)+'/'+G.g); bl.innerHTML=bloom(S.keptLooks,11); } }
      st=S.field.querySelector('[data-stars]');
      if(st && !st.innerHTML){
        while(n<(S.compact?9:(G.wide?22:14))&&tries<300){tries++;x=r()*G.W;y=r()*G.H;if(Math.abs(x-G.cx)<G.g*.6&&Math.abs(y-G.cy)<G.g*.6){continue;}
          a=.5+r()*.5;stars+='<g transform="translate('+f(x)+' '+f(y)+')"><g class="pu" style="--d:'+f(2.6+r()*4)+'s;--dl:-'+f(r()*5)+'s">'+halo(5.5*a,'#F5E8C4',.5)+'<circle r="'+f(.9*a)+'" fill="#F3D98B"/></g></g>';n++;}
        st.innerHTML=stars;
      }
      S.field.querySelector('svg.bg').setAttribute('viewBox','0 0 '+G.W+' '+G.H);
      if(changed){
        for(i=0;i<S.orbs.length;i++){ old[S.orbs[i].name]=S.orbs[i]; S.field.removeChild(S.orbs[i].el); }
        S.orbs=[];
        /* past eight, two rings: the fuller lenses (more books) on the outer ring, the rest inside, turning the other way */
        order=[];for(i=0;i<N;i++){order.push(i);}
        if(S.many){ order.sort(function(p,q){ return (S.items[q].size||S.items[q].books||0)-(S.items[p].size||S.items[p].books||0); }); outer=Math.ceil(N*.58); }
        for(j=0;j<N;j++){
          i=order[j];l=S.items[i];k=hash(l.name);o=l.look;ring=S.many?((j<outer)?0:1):0;
          b=document.createElement('button');b.type='button';b.className='orb '+l.state+(ring?' inner':'');b.setAttribute('data-orb',String(i));
          b.setAttribute('aria-label',l.aria||(l.name+'. '+(l.books?(l.books+' book'+(l.books===1?'':'s')+'. '):'')+(l.state==='kept'||l.state==='own'?'Your lens. Open it.':(l.state==='deciding'?'Yumi’s offer, being decided.':(l.state==='later'?'Set aside for later.':'Yumi’s offer. Not yours until you take it up.')))));
          b.innerHTML='<span class="art" style="--ax:'+(((k%9)-4)*1.5)+'px;--ay:'+(4+(k>>>3)%5)+'px;--dur:'+(9+(k>>>5)%7)+'s;--del:-'+((k>>>8)%13)+'s"><span class="br" style="--bd:'+(5+(k>>>11)%5)+'s;--bdl:-'+((k>>>14)%9)+'s">'+formSvg(o,k,null,l.state==='offer'||l.state==='deciding'||l.state==='later')+'</span></span><span class="l">'+esc(l.name)+'</span>';
          S.field.appendChild(b);
          S.orbs.push({el:b,lab:b.lastChild,i:i,name:l.name,ring:ring,a:0,x:0,y:0,sz:0,up:null});
        }
        /* even spacing on each ring; the inner ring starts half a step round so it never sits under the outer */
        for(i=0;i<S.orbs.length;i++){ if(S.orbs[i].ring){inner=(inner||0)+1;} }
        inner=inner||0; outer=S.orbs.length-inner;
        for(i=0;i<S.orbs.length;i++){ o=S.orbs[i];
          if(o.ring){ o.a=(-90+180/Math.max(1,inner)+360*ci/Math.max(1,inner))*PI/180; ci++; }
          else { o.a=(-90+360*co/Math.max(1,outer)+(((co*37)%11)-5)*.9)*PI/180; co++; } }
        /* the largest three keep their names when the sky is full; the rest show theirs on touch (seventh r6 names toggle hides all) */
        if(S.many||S.tight){ order=S.orbs.slice(0); order.sort(function(p,q){ return (S.items[q.i].size||S.items[q.i].books||0)-(S.items[p.i].size||S.items[p.i].books||0); }); for(i=0;i<order.length;i++){ cls(order[i].el,'named',i<(S.many?3:4)||S.items[order[i].i].state==='offer'||S.items[order[i].i].state==='deciding'); } }
        tg='';
        if(S.threads){ minShare=S.many?2:1; for(i=0;i<S.shares.length;i++){ if(S.shares[i][2]<minShare){continue;} tg+='<g data-a="'+S.shares[i][0]+'" data-b="'+S.shares[i][1]+'"><path class="thread" stroke="#E2B954" stroke-opacity=".5" stroke-width="'+f(.5+.24*S.shares[i][2])+'"/></g>'; } }
        S.field.querySelector('[data-threads]').innerHTML=tg;
      }
      for(i=0;i<S.orbs.length;i++){o=S.orbs[i];l=S.items[o.i];o.sz=Math.max(44,Math.round(sizeFor(l.size||l.books,N,G.wide,S.compact)*(l.state==='deciding'?1.18:1)*(o.ring?.84:1)));
        o.el.firstChild.style.width=o.sz+'px';o.el.firstChild.style.height=o.sz+'px';o.lh=o.lab.offsetHeight||16;}
      S.rx=Math.min(G.W/2-72,G.wide?230:((G.W<460)?124:190));S.ry=Math.min(G.H/2-(S.compact?70:74),G.wide?176:((G.W<460)?(S.compact?54:(S.tight?112:94)):150));
      if(S.many){ S.rx=Math.min(G.W/2-46,G.wide?250:160); S.ry=Math.min(G.H/2-48,G.wide?190:136); S.rx2=S.rx*.56; S.ry2=S.ry*.52; }
      S.ready=true;S.place(true);
      S.flow.ft=G.ft; if(!S.flowOn || S.flow.W!==S.host.clientWidth || S.flow.H!==S.host.clientHeight){ S.flowOn=S.flow.init(); }
      if(REDUCE){ S.flow.al=.26; }
    };
    S.place=function(snap){
      var i,o,ang,G=S.G,L=[],l,up,rx,ry;
      for(i=0;i<S.orbs.length;i++){o=S.orbs[i];l=S.items[o.i];
        if(o.ring){ ang=o.a-S.th*.8; rx=S.rx2; ry=S.ry2; } else { ang=o.a+S.th; rx=S.rx; ry=S.ry; }
        if(S.orbs.length===1){ o.x=G.cx+rx*.62*Math.cos(ang);o.y=G.cy+ry*Math.sin(ang); } else { o.x=G.cx+rx*Math.cos(ang);o.y=G.cy+ry*Math.sin(ang); }
        var cx=Math.cos(ang),side=(G.W>=900&&S.orbs.length>=5&&!S.many)?((cx<-.5)?'lft':((cx>.5)?'rgt':'')):'',lr,dx;
        up=(o.y<G.cy-8);if(up!==o.up||side!==o.side){o.up=up;o.side=side;o.flip=false;cls(o.el,'up',up&&!side);cls(o.el,'lft',side==='lft');cls(o.el,'rgt',side==='rgt');o.w=o.el.offsetWidth;o.lh=o.lab.offsetHeight||16;}
        if(side==='rgt'){ o.el.style.left=f(o.x-o.sz/2)+'px';o.el.style.top=f(o.y-o.el.offsetHeight/2)+'px'; }
        else if(side==='lft'){ o.el.style.left=f(o.x+o.sz/2-o.w)+'px';o.el.style.top=f(o.y-o.el.offsetHeight/2)+'px'; }
        else { o.el.style.left=f(o.x-70)+'px';o.el.style.top=f(o.y-o.sz/2-(up?o.lh:0))+'px';
          lr=o.lab.offsetWidth||0; dx=0; if(o.x-lr/2<8){dx=8-(o.x-lr/2);} else if(o.x+lr/2>G.W-8){dx=(G.W-8)-(o.x+lr/2);} if(dx!==o.dx){o.dx=dx;o.lab.style.transform=dx?('translateX('+f(dx)+'px)'):'';} }
        L.push([o.x,G.ft+o.y,(l.state==='kept'||l.state==='own'||l.state==='deciding')?.42:.2,o.sz*.5,mix(l.look.c[0],'#4A3220',.4)]);}
      S.flow.L=[[G.cx,G.ft+G.cy,1.3,G.g*.52,'#8A6226']].concat(L);
      /* a name that would run over a neighbour's form, or another name, first flips to the other side of its lens; if that is no better it steps back until the sky has moved on (it is still there on touch). Offers keep their names over kept lenses' names. */
      var rects=[],lr2,ar,k2,hit,pri,pass;
      function measure(){ rects=[]; for(i=0;i<S.orbs.length;i++){ o=S.orbs[i]; ar=o.el.firstChild.getBoundingClientRect(); rects.push({a:ar,l:(o.lab.offsetParent&&getComputedStyle(o.lab).display!=='none')?o.lab.getBoundingClientRect():null}); } }
      function collides(i){ var k; lr2=rects[i].l; if(!lr2){return false;}
        for(k=0;k<S.orbs.length;k++){ if(k===i){continue;} if(ovl(lr2,rects[k].a,2)){return true;}
          if(rects[k].l&&!S.orbs[k].hid){ pri=(S.items[S.orbs[k].i].state==='offer'||S.items[S.orbs[k].i].state==='deciding')&&!(S.items[S.orbs[i].i].state==='offer'||S.items[S.orbs[i].i].state==='deciding'); if((k<i||pri)&&ovl(lr2,rects[k].l,2)){return true;} } }
        return false; }
      function setFlip(o,on){ if(!!o.flip===on){return;} o.flip=on; cls(o.el,'up',on?!o.up:o.up); o.el.style.top=f(o.y-o.sz/2-((on?!o.up:o.up)?o.lh:0))+'px'; }
      measure();
      for(pass=0;pass<2;pass++){ if(pass){measure();}
      for(i=0;i<S.orbs.length;i++){ o=S.orbs[i]; if(!rects[i].l||o.side){continue;}
        hit=collides(i);
        if(hit&&!o.flip){ setFlip(o,true); rects[i].l=o.lab.getBoundingClientRect(); hit=collides(i); if(hit){ setFlip(o,false); rects[i].l=o.lab.getBoundingClientRect(); } }
        else if(!hit&&o.flip){ setFlip(o,false); rects[i].l=o.lab.getBoundingClientRect(); if(collides(i)){ setFlip(o,true); rects[i].l=o.lab.getBoundingClientRect(); hit=false; } }
        if(hit!==!!o.hid){ o.hid=hit; cls(o.lab,'hid',hit); } } }
      var tg=S.field.querySelector('[data-threads]'),el,p,q,dx,dy,d,ux,uy,x0,y0,x1,y1,mx,my,j;
      for(j=0;j<tg.children.length;j++){
        el=tg.children[j];p=null;q=null;
        for(i=0;i<S.orbs.length;i++){ if(S.orbs[i].i===+el.getAttribute('data-a')){p=S.orbs[i];} if(S.orbs[i].i===+el.getAttribute('data-b')){q=S.orbs[i];} }
        if(!p||!q){continue;}
        dx=q.x-p.x;dy=q.y-p.y;d=Math.sqrt(dx*dx+dy*dy)||1;ux=dx/d;uy=dy/d;
        x0=p.x+ux*p.sz*.34;y0=p.y+uy*p.sz*.34;x1=q.x-ux*q.sz*.34;y1=q.y-uy*q.sz*.34;mx=(x0+x1)/2;my=(y0+y1)/2;
        el.firstChild.setAttribute('d','M'+f(x0)+' '+f(y0)+'Q'+f(mx+(G.cx-mx)*.3)+' '+f(my+(G.cy-my)*.3)+' '+f(x1)+' '+f(y1));
      }
    };
    S.tick=function(now){
      var dt=S.last?Math.min(.05,(now-S.last)/1000):.016;S.last=now;
      if(REDUCE||!S.ready){return;}
      S.th+=dt*TAU/S.period;S.place(false);
      if(S.flowOn){S.flow.step(1);}
    };
    S.visible=function(){ var r; if(!S.host.offsetWidth){return false;} r=S.host.getBoundingClientRect(); return r.bottom>0 && r.top<window.innerHeight; };
    SKIES.push(S);
    return S;
  }
  /* Yumi's panel: the current runs in a soft disc behind her seed only (eighth r22; eleventh, panel A). The canvas is 180x180, masked in CSS. */
  function YumiSky(host){
    var S={host:host,cv:host.querySelector('canvas.paint'),last:0,ready:false};
    S.flow=Flow(S.cv,{clientWidth:180,clientHeight:180});
    S.build=function(){if(S.ready){return;}S.flowOn=S.flow.init();if(S.flowOn){S.flow.L=[[90,90,1.1,26,'#B0502A']];S.flow.P.length=Math.round(S.flow.P.length*.4);S.flow.al=.22;S.flow.gal=.5;for(var j=0;j<120;j++){S.flow.step(1.2);}S.ready=true;}};
    S.tick=function(now){S.last=now;if(REDUCE){return;}if(S.flowOn){S.flow.step(1.1);}};
    S.visible=function(){ return !!S.host.offsetWidth; };
    SKIES.push(S);return S;
  }
  var LOOPING=false, TICKS=0, FT=[], FT0=0;
  /* the motion gate's own instrument (contract §6): frames and seconds since the loop started, mean fps, and the worst one-second window */
  function stats(){
    var n=FT.length,i,j,worst=1e9,secs,fps,c;
    if(n<2){ return {frames:n,seconds:0,fps:0,worst1s:0}; }
    secs=(FT[n-1]-FT0)/1000; fps=Math.round(n/Math.max(.001,secs)*10)/10;
    for(i=0;i<n;i++){ c=0; for(j=i;j<n&&FT[j]-FT[i]<1000;j++){ c++; } if(j<n||FT[n-1]-FT[i]>=1000){ if(c<worst){worst=c;} } }
    return {frames:n,seconds:Math.round(secs*10)/10,fps:fps,worst1s:(worst===1e9)?fps:worst};
  }
  function skyLoop(now){
    var i,S;
    window.requestAnimationFrame(skyLoop);
    if(document.hidden){return;}
    TICKS++; if(!FT0){FT0=now;} FT.push(now); if(FT.length>36000){ FT.splice(0,18000); FT0=FT[0]; }
    for(i=0;i<SKIES.length;i++){S=SKIES[i];if(S.ready&&S.visible()){S.tick(now);}}
  }
  function startSkies(){ if(LOOPING||REDUCE){return;} LOOPING=true; window.requestAnimationFrame(skyLoop); }
  /* THE BLOOM: Yumi's live presence (buildYumiBloom, yumi-ui.js), carried over as is. Colours are tokens on the screen (--bl-*). */
  var BLN=0;
  function bloomSvg(){
    var p='',a,id='bl'+(++BLN);
    for(a=0;a<360;a+=45){ p+='<ellipse cx="32" cy="15" rx="3.4" ry="9.6" transform="rotate('+a+' 32 32)"/>'; }
    return '<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><defs>'+
      '<radialGradient id="'+id+'c" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="var(--bl-core)"/><stop offset="42%" stop-color="var(--bl-light)"/><stop offset="100%" stop-color="var(--bl-gold)"/></radialGradient>'+
      '<radialGradient id="'+id+'p" cx="50%" cy="28%" r="72%"><stop offset="0%" stop-color="var(--bl-wisdom)"/><stop offset="58%" stop-color="var(--bl-light)"/><stop offset="100%" stop-color="var(--bl-gold)"/></radialGradient>'+
      '<radialGradient id="'+id+'h" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="var(--bl-theory)" stop-opacity=".55"/><stop offset="55%" stop-color="var(--bl-emp)" stop-opacity=".2"/><stop offset="100%" stop-color="var(--bl-emp)" stop-opacity="0"/></radialGradient>'+
      '</defs><circle class="bl-halo" cx="32" cy="32" r="31" fill="url(#'+id+'h)"/>'+
      '<g class="bl-petals" fill="url(#'+id+'p)" opacity=".95" stroke="var(--bl-edge)" stroke-width=".7">'+p+'</g>'+
      '<g class="bl-core"><circle cx="32" cy="32" r="9" fill="url(#'+id+'c)" stroke="var(--bl-edge)" stroke-width=".7"/><circle cx="32" cy="32" r="3.4" fill="var(--bl-core)" opacity=".92"/></g>'+
      '<circle class="bl-ember bl-ember-a" cx="49" cy="17" r="1.7" fill="var(--bl-light)"/><circle class="bl-ember bl-ember-b" cx="15" cy="47" r="1.4" fill="var(--bl-light)"/></svg>';
  }
  return {
    VERSION:'hand.js L4 · 2026-11-08 · Fable 5.1',
    SKY_NIGHT:SKYD, SKY_DAY:SKYDAY, LIGHT:LITE, GARDEN:GARDEN, GARDEN_NAMES:GARDEN_NAMES,
    hash:hash, rng:rng, mix:mix, contrast:contrast, gardenColour:gardenColour, sizeFor:sizeFor,
    makeLook:makeLook, formSvg:formSvg, bloom:bloom, svgEl:svgEl, yumiSeed:yumiSeed, bloomSvg:bloomSvg,
    Sky:Sky, YumiSky:YumiSky, startSkies:startSkies, skies:SKIES, reduced:REDUCE,
    ticks:function(){ return TICKS; }, stats:stats, esc:esc
  };
})();
