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
    var S={host:host,field:host.querySelector('[data-field]'),cv:host.querySelector('canvas.paint'),orbs:[],th:0,last:0,period:300,ready:false,items:[],shares:[],keptLooks:[],sig:'',compact:!!(opts&&opts.compact),threads:true,names:true,many:false,fixed:false,auto:false,dri:false,stems:false};
    S.flow=Flow(S.cv,host);
    function geo(){var W=S.field.clientWidth,H=S.field.clientHeight,g,many=(S.items.length>((W>=560)?12:8)),tight=(!many&&W<560&&S.items.length>=7);g=Math.round(Math.min(S.compact?118:(many?((W<460)?108:150):(tight?120:((W<460)?136:176))),W*.36,H*.5));return {W:W,H:H,cx:W/2,cy:H/2,g:g,ft:S.field.offsetTop,wide:W>=560};}
    S.set=function(items,shares,keptLooks){ S.items=items||[]; S.shares=shares||[]; S.keptLooks=keptLooks||[]; };
    S.toggles=function(o){ if(o&&typeof o.threads==='boolean'){S.threads=o.threads;} if(o&&typeof o.names==='boolean'){S.names=o.names;} if(o&&typeof o.fixed==='boolean'){S.fixed=o.fixed;} if(o&&typeof o.auto==='boolean'){S.auto=o.auto;} if(o&&typeof o.drift==='boolean'){S.dri=o.drift;} if(o&&typeof o.stems==='boolean'){S.stems=o.stems;} S.sig=''; };
    function ovl(a,b,pad){ return a.left<b.right+pad && a.right>b.left-pad && a.top<b.bottom+pad && a.bottom>b.top-pad; }
    function cls(el,name,on){ var c=el.className.replace(new RegExp(' '+name+'\\b','g'),''); el.className=on?(c+' '+name):c; }
    S.build=function(){
      var i,l,b,k,o,G,stars='',r=rng(5),n=0,tries=0,x,y,a,tg='',sig,bl,st,old={},j,changed,order,ring,N=S.items.length,outer,inner,ci=0,co=0,minShare;
      /* classes first: .many grows the field, so the geometry is read after it lands */
      S.many=(N>((S.field.clientWidth>=560)?12:8)); S.tight=(!S.many&&S.field.clientWidth<560&&N>=7);
      cls(S.field,'many',S.many); cls(S.field,'tight',S.tight); cls(S.field,'nonames',!S.names); cls(S.field,'one',N===1); cls(S.field,'none',N===0);
      /* L4d: a still sky (By the orbs). Every lens keeps a fixed place in rows about the flower with its name under it; the field grows to hold them. */
      S.fx=!!((S.fixed||(S.auto&&(S.many||S.tight)))&&S.names&&N>1); S.fl=!!(S.fx&&S.dri&&!REDUCE); cls(S.field,'fixed',S.fx); cls(S.field,'flow',S.fl);
      if(S.fx&&S.fxH){ S.field.style.height=S.fxH+'px'; } else if(!S.fx&&S.field.style.height){ S.field.style.height=''; S.fxH=0; }
      G=geo(); if(S.fx){ G.g=gFix(G.W); }
      if(!G.W){return;}
      S.G=G;
      sig=N+':';for(i=0;i<N;i++){sig+=S.items[i].name+'|'+S.items[i].state+'|'+S.items[i].books+';';}
      sig+='K'+S.keptLooks.length+'/'+G.W+'x'+(S.fx?'f':G.H)+'/'+(S.threads?'t':'-')+(S.names?'n':'-')+(S.stems?'s':'-')+(S.fl?'w':'-');
      changed=(sig!==S.sig); S.sig=sig;
      bl=S.field.querySelector('[data-bloom]');
      if(bl){ bl.style.width=G.g+'px';bl.style.height=G.g+'px'; k=String(S.keptLooks.length)+'/'+G.g; for(i=0;i<S.keptLooks.length;i++){ k+=S.keptLooks[i].c[0]; } if(bl.getAttribute('data-n')!==k){ bl.setAttribute('data-n',k); bl.innerHTML=bloom(S.keptLooks,11); } }
      st=S.field.querySelector('[data-stars]');
      if(st && !st.innerHTML && !S.fx){ st.setAttribute('data-h',String(G.H));
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
          if(S.fl){ o=S.orbs[S.orbs.length-1]; if(old[l.name]&&old[l.name].px!==undefined&&S.fxN===N&&S.fxW===G.W){ o.px=old[l.name].px; o.py=old[l.name].py; o.vx=old[l.name].vx; o.vy=old[l.name].vy; old[l.name]=null; } }
        }
        /* a drifting sky keeps its places across a rebuild only when every lens has one to keep; otherwise all start from their cells and fade in */
        if(S.fl){ k=0; for(i=0;i<S.orbs.length;i++){ if(S.orbs[i].px!==undefined){k++;} } if(k!==S.orbs.length){ for(i=0;i<S.orbs.length;i++){ S.orbs[i].px=undefined; cls(S.orbs[i].el,'rise',true); S.orbs[i].el.style.animationDelay=(i*45)+'ms'; } } }
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
        if(S.stems){ for(i=0;i<S.orbs.length;i++){ l=S.items[S.orbs[i].i]; tg+='<g data-s="'+S.orbs[i].i+'"><path class="stem" stroke="'+mix((l.look&&l.look.c&&l.look.c[0])||'#E2B954','#E2B954',.4)+'" stroke-opacity=".3" stroke-width="'+f(.7+Math.min(1,(l.size||l.books||0)*.03))+'"/></g>'; } }
        S.field.querySelector('[data-threads]').innerHTML=tg;
      }
      for(i=0;i<S.orbs.length;i++){o=S.orbs[i];l=S.items[o.i];o.sz=Math.max(44,Math.round(sizeFor(l.size||l.books,N,G.wide,S.compact)*(l.state==='deciding'?1.18:1)*(o.ring?.84:1)));
        o.el.firstChild.style.width=o.sz+'px';o.el.firstChild.style.height=o.sz+'px';o.lh=o.lab.offsetHeight||16;}
      if(S.fx){ G=fixedRows(G); S.G=G; S.field.querySelector('svg.bg').setAttribute('viewBox','0 0 '+G.W+' '+G.H); }
      else { for(i=0;i<S.orbs.length;i++){ if(S.orbs[i].lab.style.maxWidth){ S.orbs[i].lab.style.maxWidth=''; S.orbs[i].el.style.width=''; } } S.cells=null; S.hw=70; }
      /* the stars are strewn over the field as it stands now, and strewn again when its height changes */
      if(st && st.getAttribute('data-h')!==String(G.H) && (S.fx||st.getAttribute('data-h')===null||S.fxWas)){ st.setAttribute('data-h',String(G.H)); r=rng(5); stars=''; n=0; tries=0; k=Math.round((S.compact?9:(G.wide?22:14))*Math.max(1,G.H/360));
        while(n<k&&tries<900){tries++;x=r()*G.W;y=r()*G.H;if(Math.abs(x-G.cx)<G.g*.6&&Math.abs(y-G.cy)<G.g*.6){continue;}
          a=.5+r()*.5;stars+='<g transform="translate('+f(x)+' '+f(y)+')"><g class="pu" style="--d:'+f(2.6+r()*4)+'s;--dl:-'+f(r()*5)+'s">'+halo(5.5*a,'#F5E8C4',.5)+'<circle r="'+f(.9*a)+'" fill="#F3D98B"/></g></g>';n++;}
        st.innerHTML=stars; }
      S.fxWas=S.fx;
      S.rx=Math.min(G.W/2-72,G.wide?230:((G.W<460)?124:190));S.ry=Math.min(G.H/2-(S.compact?70:74),G.wide?176:((G.W<460)?(S.compact?54:(S.tight?112:94)):150));
      if(S.many){ S.rx=Math.min(G.W/2-46,G.wide?250:160); S.ry=Math.min(G.H/2-48,G.wide?190:136); S.rx2=S.rx*.56; S.ry2=S.ry*.52; }
      S.ready=true;S.place(true);
      S.flow.ft=G.ft; if(!S.flowOn || S.flow.W!==S.host.clientWidth || S.flow.H!==S.host.clientHeight){ S.flowOn=S.flow.init(); }
      if(REDUCE){ S.flow.al=.26; }
    };
    /* L4d (19 Nov 2026): the sky reads no layout while it moves. A name's box is worked out from its orb and its own measured size; sizes are read once, at the top of a frame, only for a name whose side has just changed (and for all of them now and then, for late fonts). A name that would run over a neighbour's form or another name tries the other side of its lens, then (in a full sky) beside it, before it steps back. Offers keep their names over kept lenses' names. */
    function dimOf(o,pos){ var s=(pos==='lft'||pos==='rgt'),d=s?o.ds:o.dc,w; if(d){return d;} if(s&&o.dc&&o.dc[0]){ w=Math.min(o.dc[0],104); return [w,o.dc[1]*Math.max(1,Math.ceil(o.dc[0]/104))]; } return [0,0]; }
    function labRect(o,pos,G){ var d=dimOf(o,pos),w=d[0],h=d[1],x,dx=0;
      if(!w){return null;}
      if(pos==='rgt'){ x=o.x+o.sz/2+6; return {left:x,right:x+w,top:o.y-h/2,bottom:o.y+h/2,dx:0,w:w,h:h}; }
      if(pos==='lft'){ x=o.x-o.sz/2-6; return {left:x-w,right:x,top:o.y-h/2,bottom:o.y+h/2,dx:0,w:w,h:h}; }
      if(pos.length>2){ dx=(pos.charAt(2)==='l'?-1:1)*Math.max(0,w/2-o.sz*.3); }
      if(o.x+dx-w/2<8){dx=8-(o.x-w/2);} else if(o.x+dx+w/2>G.W-8){dx=(G.W-8)-(o.x+w/2);}
      if(pos.charAt(0)==='u'){ return {left:o.x+dx-w/2,right:o.x+dx+w/2,top:o.y-o.sz/2-h,bottom:o.y-o.sz/2,dx:dx,w:w,h:h}; }
      return {left:o.x+dx-w/2,right:o.x+dx+w/2,top:o.y+o.sz/2,bottom:o.y+o.sz/2+h,dx:dx,w:w,h:h}; }
    /* the still sky's flower takes its size from the width alone: the field's height there is made from the rows, and must not feed back into the flower */
    function gFix(W){ return Math.round(Math.min(S.compact?118:(S.many?((W<460)?108:150):(S.tight?120:((W<460)?136:176))),W*.36)); }
    function fixedRows(G){
      var n=S.orbs.length,W=G.W,cols=(W<460)?4:((W<900)?5:7),cw=Math.min(W/cols,150),cm,mid,M,R,cnt=[],i,j,k,r,c,base,extra,ord=[],sl=[],mh,rh,lhm=0,szm=0,H,y,x,o,q=0,cells=[],cap=cw-14,lm=cw-14,ar=0,Hd;
      if(S.fl&&W<460){ cap=Math.min(cap,66); lm=Math.min(lm,76); }
      for(k=0;k<cols;k++){ if((cols%2)?(k!==(cols-1)/2):(k!==cols/2-1&&k!==cols/2)){ x=(k-(cols-1)/2)*cw; y=Math.max(0,G.g/2+cw/2-8-((cols%2)?cw:1.5*cw)); x=G.cx+x+((x<0)?-y:y); if(x-cw/2>=-.5&&x+cw/2<=W+.5){ sl.push(x); } } }
      cm=sl.length; mid=Math.min(n,cm); M=n-mid; R=Math.ceil(M/(2*cols));
      S.hw=Math.min(140,cw)/2; for(i=0;i<n;i++){ o=S.orbs[i]; o.lab.style.maxWidth=f(lm)+'px'; o.el.style.width=f(S.hw*2)+'px'; if(o.sz>cap){ o.sz=Math.max(44,Math.floor(cap)); o.el.firstChild.style.width=o.sz+'px'; o.el.firstChild.style.height=o.sz+'px'; } }
      for(i=0;i<n;i++){ o=S.orbs[i]; lhm=Math.max(lhm,o.lab.offsetHeight||0); szm=Math.max(szm,o.sz); ar+=(Math.max(o.sz,o.lab.offsetWidth||0)+4)*(o.sz+(o.lab.offsetHeight||0)+6); }
      rh=szm+lhm+16; mh=Math.max(rh,G.g+20); H=2*R*rh+mh;
      /* a drifting sky is given room to move: its lenses and their names fill a little over a third of it */
      if(S.fl){ Hd=gFix(W); Hd=Math.max(360,Math.round((ar+Hd*Hd*.64)/(W*.36))); if(Hd>H){ if(R){ rh=(Hd-mh)/(2*R); } else { mh=Hd; } H=Hd; } }
      if(S.fxH!==H){ S.fxH=H; S.field.style.height=H+'px'; G=geo(); G.g=gFix(G.W); }
      /* the height is the one just set, not the one read back: with Reduce Motion on, every property is given a 0.01 ms transition (L1.2b), so a height read in the same breath is still the old one, and the rows were laid about a middle that was not there */
      G.H=H; G.cy=H/2;
      if(R){ base=Math.floor(M/(2*R)); extra=M-base*2*R; for(r=0;r<2*R;r++){cnt.push(base);} for(k=0;k<2*R;k++){ ord.push((k%2)?(R+(k>>1)):(R-1-(k>>1))); } for(k=0;k<extra;k++){ cnt[ord[k]]++; } }
      sl.sort(function(a,b){ return Math.abs(a-G.cx)-Math.abs(b-G.cx)||a-b; }); sl=sl.slice(0,mid); sl.sort(function(a,b){ return a-b; });
      for(r=0;r<=2*R;r++){
        if(r===R){ for(j=0;j<mid;j++){ cells[q++]=[sl[j],G.cy-lhm/2]; } continue; }
        c=cnt[(r<R)?r:(r-1)]; y=(r<R)?(G.cy-mh/2-(R-r-.5)*rh):(G.cy+mh/2+(r-R-.5)*rh);
        for(j=0;j<c;j++){ x=G.cx+(j-(c-1)/2)*cw; cells[q++]=[x,y-lhm/2]; } }
      for(i=0;i<n;i++){ o=S.orbs[i]; if(S.fl&&(o.px===undefined||S.fxW!==W||S.fxN!==n)){ o.px=cells[i][0]; o.py=cells[i][1]; o.vx=0; o.vy=0; } } S.fxW=W; S.fxN=n;
      S.cells=cells; return G; }
    function readDims(all){ var i,o,w,h;
      for(i=0;i<S.orbs.length;i++){ o=S.orbs[i]; if(!all&&!o.dirty){continue;} o.dirty=false;
        w=o.lab.offsetWidth||0; h=o.lab.offsetHeight||0;
        if(o.cur==='lft'||o.cur==='rgt'){ o.ds=[w,h]; } else { o.dc=[w,h]; } } }
    function solve(snap){
      var i,o,G=S.G,n=S.orbs.length,arts=[],labs=[],ord=[],st,c,k,r,rr,nat,opp,out,cand,pos,d,h,ay;
      function free(i,r,pad){ var k; for(k=0;k<arts.length;k++){ if(k!==i&&ovl(r,arts[k],pad)){return false;} if(labs[k]&&ovl(r,labs[k],pad)){return false;} } return true; }
      function inb(r,pos){ return (pos==='lft'||pos==='rgt')?(r.left>=4&&r.right<=G.W-4):true; }
      for(i=0;i<n;i++){ o=S.orbs[i]; d=o.dc||[0,0];
        ay=o.y-((o.up&&!o.side&&!d[0])?16:0);
        arts.push({left:o.x-o.sz/2,right:o.x+o.sz/2,top:ay-o.sz/2,bottom:ay+o.sz/2}); labs.push(null);
        if(o.side){ o.pos=o.side; labs[i]=labRect(o,o.side,G); o.hidNext=false; } }
      if(S.many){ arts.push({left:G.cx-G.g*.3,right:G.cx+G.g*.3,top:G.cy-G.g*.3,bottom:G.cy+G.g*.3}); }
      for(i=0;i<n;i++){ st=S.items[S.orbs[i].i].state; if(st==='offer'||st==='deciding'){ord.push(i);} }
      for(i=0;i<n;i++){ st=S.items[S.orbs[i].i].state; if(!(st==='offer'||st==='deciding')){ord.push(i);} }
      for(k=0;k<n;k++){ i=ord[k]; o=S.orbs[i]; if(o.side){continue;}
        nat=o.up?'up':'dn'; opp=o.up?'dn':'up';
        if(!(o.dc&&o.dc[0])){ o.pos=nat; o.hidNext=false; continue; }
        if(S.fx){ o.pos='dn'; o.hidNext=false; labs[i]=labRect(o,'dn',G); continue; }
        cand=[nat,opp]; if(S.many){ out=(o.x>=G.cx)?'rgt':'lft'; cand.push(out); cand.push(out==='rgt'?'lft':'rgt'); cand.push(nat+'l'); cand.push(nat+'r'); cand.push(opp+'l'); cand.push(opp+'r'); }
        r=null; pos=null;
        if(o.pos&&!o.hid&&cand.indexOf(o.pos)>=0){ rr=labRect(o,o.pos,G); if(rr&&inb(rr,o.pos)&&free(i,rr,2)){ r=rr; pos=o.pos; } }
        for(c=0;!r&&c<cand.length;c++){ rr=labRect(o,cand[c],G); if(rr&&inb(rr,cand[c])&&free(i,rr,2)){ r=rr; pos=cand[c]; } }
        if(r){ labs[i]=r; o.pos=pos; o.hidNext=false; } else { o.pos=nat; o.hidNext=true; } }
      for(i=0;i<n;i++){ o=S.orbs[i]; pos=o.pos; rr=labs[i]||labRect(o,pos,G);
        if(pos!==o.cur){ o.cur=pos; o.dirty=true; cls(o.el,'up',pos.charAt(0)==='u'); cls(o.el,'lft',pos==='lft'); cls(o.el,'rgt',pos==='rgt'); }
        if(pos==='rgt'||pos==='lft'){ d=dimOf(o,pos); h=Math.max(o.sz,d[1]);
          o.el.style.left=f(pos==='rgt'?(o.x-o.sz/2):(o.x+o.sz/2-(o.sz+6+d[0])))+'px'; o.el.style.top=f(o.y-h/2)+'px';
          if(o.dx){ o.dx=0; o.lab.style.transform=''; } }
        else { d=o.dc||[0,0]; if(S.fl){ if(!o.tf){ o.tf=1; o.el.style.left='0px'; o.el.style.top='0px'; } o.el.style.transform='translate3d('+f2(o.x-(S.hw||70))+'px,'+f2(o.y-o.sz/2)+'px,0)'; } else { o.el.style.left=f(o.x-(S.hw||70))+'px'; o.el.style.top=f(o.y-o.sz/2-(pos.charAt(0)==='u'?(d[1]||16):0))+'px'; }
          c=rr?rr.dx:0; if(c!==o.dx){ o.dx=c; o.lab.style.transform=c?('translateX('+f(c)+'px)'):''; } }
        if(!!o.hidNext!==!!o.hid){ o.hid=!!o.hidNext; cls(o.lab,'hid',o.hid); } } }
    /* L4e (19 Nov 2026): a still sky may drift. Every lens rides one slow current: a few wide turns of water that swell, fade and change places, bent round the flower, with a small turn of each lens's own so none ever rests. A lens carries weight, so it gathers and sheds speed gradually and is never faster than 26 px a second. A lens and its name keep one clear box; boxes that near each other, the flower or an edge are eased apart by a push that grows smoothly from nothing, so no name meets another and nothing snaps. Pure arithmetic: no layout is read. A slow frame is taken in two half-steps. */
    function drift(dtAll){
      var G=S.G,n=S.orbs.length,i,j,o,q,t,m,w,nx,ny,d,gx,gy,gl,D0=1.1,Z=.3,R=95,fl=G.g*.4,zone=22,fx,fy,sp,ph,tall=G.H>=G.W,L=tall?G.H:G.W,Sh=tall?G.W:G.H,kk=Math.max(1,Math.round(L/Sh)),K=13.3*Sh,st=(dtAll>.02)?2:1,dt=dtAll/st,s,px,py;
      function pf(x,y){ var p=(tall?y:x)/L,qq=(tall?x:y)/Sh,dx=x-G.cx,dy=y-G.cy,mm=(Math.sqrt(dx*dx+dy*dy)-G.g*.4)/(G.g*.6); mm=mm<0?0:(mm>1?1:mm*mm*(3-2*mm));
        return mm*(Math.sin(PI*qq)*(.9*Math.sin(.05*t)*Math.sin(PI*p)+.6*Math.sin(PI*p)*Math.sin(kk*PI*p+1.2*Math.sin(.037*t))+.35*Math.cos(.061*t+1)*Math.sin((kk+1)*PI*p))+.15*Math.sin(.045*t+2)*Math.sin(TAU*qq)*Math.sin(kk*PI*p))*(tall?1:-1); }
      function push(a,b,dx,dy,hw,hh){ nx=Math.abs(dx/hw); ny=Math.abs(dy/hh); if(nx>=D0+Z||ny>=D0+Z){return;} gx=nx*nx; gy=ny*ny; d=Math.pow(gx*gx*gx+gy*gy*gy,1/6); if(d>=D0+Z){return;} if(d<.001){nx=.01;ny=.01;gx=gy=.0001;d=.012;}
        m=(D0+Z-d)/Z; m=m*m*R*(d<D0?1+20*(D0-d)/D0:1); gx=gx*gx*nx/hw*(dx<0?-1:1); gy=gy*gy*ny/hh*(dy<0?-1:1); gl=Math.sqrt(gx*gx+gy*gy)||1; gx=gx/gl*m; gy=gy/gl*m; if(b){ a.ux-=gx/2; a.uy-=gy/2; b.ux+=gx/2; b.uy+=gy/2; } else { a.ux-=gx; a.uy-=gy; } }
      for(i=0;i<n;i++){ o=S.orbs[i]; q=o.dc||[0,0]; o.bw=Math.max(o.sz,q[0])/2+2; o.bh=(o.sz+q[1])/2+3; o.oy=q[1]/2; }
      for(s=0;s<st;s++){ t=(S.tm||0)-(st-1-s)*dt;
        for(i=0;i<n;i++){ S.orbs[i].ux=0; S.orbs[i].uy=0; }
        for(i=0;i<n;i++){ o=S.orbs[i];
          for(j=i+1;j<n;j++){ q=S.orbs[j]; push(o,q,q.px-o.px,(q.py+q.oy)-(o.py+o.oy),o.bw+q.bw,o.bh+q.bh); }
          push(o,null,G.cx-o.px,G.cy-(o.py+o.oy),o.bw+fl,o.bh+fl);
          w=o.px-o.bw-4; if(w<zone){ m=1-w/zone; o.ux+=m*m*R; } w=G.W-4-(o.px+o.bw); if(w<zone){ m=1-w/zone; o.ux-=m*m*R; }
          w=o.py-o.sz/2-8; if(w<zone){ m=1-w/zone; o.uy+=m*m*R; } w=G.H-8-(o.py+o.sz/2+2*o.oy); if(w<zone){ m=1-w/zone; o.uy-=m*m*R; } }
        for(i=0;i<n;i++){ o=S.orbs[i]; px=o.px; py=o.py+o.oy; ph=i*2.39996+t*(.16+.05*((i*7)%5));
          fx=(pf(px,py+1)-pf(px,py-1))/2*K+7*Math.cos(ph); fy=-(pf(px+1,py)-pf(px-1,py))/2*K+7*Math.sin(ph);
          o.vx=(o.vx||0)+((fx-(o.vx||0))*1.2+o.ux*2.2)*dt; o.vy=(o.vy||0)+((fy-(o.vy||0))*1.2+o.uy*2.2)*dt; sp=Math.sqrt(o.vx*o.vx+o.vy*o.vy); if(sp>26){ o.vx*=26/sp; o.vy*=26/sp; } o.px+=o.vx*dt; o.py+=o.vy*dt;
          w=o.bw+2; if(o.px<w){ o.px=w; if(o.vx<0){o.vx=0;} } else if(o.px>G.W-w){ o.px=G.W-w; if(o.vx>0){o.vx=0;} }
          w=o.sz/2+4; if(o.py<w){ o.py=w; if(o.vy<0){o.vy=0;} } w=G.H-4-o.sz/2-2*o.oy; if(o.py>w){ o.py=w; if(o.vy>0){o.vy=0;} } } } }
    S.place=function(snap){
      var i,o,ang,G=S.G,L=[],l,up,rx,ry,cx,side;
      S.fr=(S.fr||0)+1;
      if(snap){ for(i=0;i<S.orbs.length;i++){ S.orbs[i].dirty=true; } }
      readDims(snap||S.fr%90===0);
      if(S.fl&&S.cells&&!snap){ drift(S.dt||.016); }
      for(i=0;i<S.orbs.length;i++){o=S.orbs[i];l=S.items[o.i];
        if(o.ring){ ang=o.a-S.th*.8; rx=S.rx2; ry=S.ry2; } else { ang=o.a+S.th; rx=S.rx; ry=S.ry; }
        if(S.orbs.length===1){ o.x=G.cx+rx*.62*Math.cos(ang);o.y=G.cy+ry*Math.sin(ang); } else { o.x=G.cx+rx*Math.cos(ang);o.y=G.cy+ry*Math.sin(ang); }
        if(S.fx&&S.cells&&S.cells[i]){ o.x=S.cells[i][0]; o.y=S.cells[i][1]; ang=PI/2; if(S.fl&&o.px!==undefined){ o.x=o.px; o.y=o.py; } }
        cx=Math.cos(ang);side=(S.fx)?'':(G.W>=900&&S.orbs.length>=5&&!S.many)?((cx<-.5)?'lft':((cx>.5)?'rgt':'')):'';
        up=(!S.fx&&o.y<G.cy-8);
        if(up!==o.up||side!==o.side){ o.up=up;o.side=side; if(!side&&(!o.pos||o.pos.charAt(0)==='u'||o.pos.charAt(0)==='d'||o.pos===o.wasSide)){ o.pos=up?'up':'dn'; } o.wasSide=side; }
        L.push([o.x,G.ft+o.y,(l.state==='kept'||l.state==='own'||l.state==='deciding'||l.state==='cat'||l.state==='book')?.42:.2,o.sz*.5,mix(l.look.c[0],'#4A3220',.4)]);}
      S.flow.L=[[G.cx,G.ft+G.cy,1.3,G.g*.52,'#8A6226']].concat(L);
      solve(snap);
      if(snap){ readDims(true); solve(true); readDims(true); solve(true); }
      var tg=S.field.querySelector('[data-threads]'),el,p,q,dx,dy,d,ux,uy,x0,y0,x1,y1,mx,my,j;
      for(j=0;j<tg.children.length;j++){
        el=tg.children[j];p=null;q=null;
        if(el.hasAttribute('data-s')){ for(i=0;i<S.orbs.length;i++){ if(S.orbs[i].i===+el.getAttribute('data-s')){p=S.orbs[i];} } if(!p){continue;}
          dx=p.x-G.cx;dy=p.y-G.cy;d=Math.sqrt(dx*dx+dy*dy)||1;ux=dx/d;uy=dy/d;x0=G.cx+ux*G.g*.3;y0=G.cy+uy*G.g*.3;x1=p.x-ux*p.sz*.42;y1=p.y-uy*p.sz*.42;
          mx=d*.14*((j%2)?1:-1)*(1+.3*Math.sin((S.tm||0)*.35+j)); my=(y0+y1)/2+ux*mx; mx=(x0+x1)/2-uy*mx;
          el.firstChild.setAttribute('d','M'+f(x0)+' '+f(y0)+'Q'+f(mx)+' '+f(my)+' '+f(x1)+' '+f(y1)); continue; }
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
      S.th+=dt*TAU/S.period;S.dt=dt;S.tm=(S.tm||0)+dt;S.place(false);
      if(S.flowOn){S.flow.step(1);}
    };
    S.visible=function(){ var r; if(!S.host.offsetWidth){return false;} r=S.host.getBoundingClientRect(); return r.bottom>0 && r.top<window.innerHeight; };
    if(document.fonts&&document.fonts.addEventListener){ document.fonts.addEventListener('loadingdone',function(){ if(S.fx&&S.ready){ S.sig=''; S.build(); } }); }
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
  /* L4e: a sky lays itself out again when its width changes (a turned phone, a resized window) */
  var RZT=0;
  function onResize(){ if(RZT){window.clearTimeout(RZT);} RZT=window.setTimeout(function(){ var i,S; RZT=0; for(i=0;i<SKIES.length;i++){ S=SKIES[i]; if(S.place&&S.ready&&S.G&&S.host.offsetWidth&&S.field.clientWidth!==S.G.W){ S.sig=''; S.build(); } } },180); }
  if(window.addEventListener){ window.addEventListener('resize',onResize); window.addEventListener('orientationchange',onResize); }
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
    VERSION:'hand.js L4e · 2026-11-19 · Fable 5.2',
    SKY_NIGHT:SKYD, SKY_DAY:SKYDAY, LIGHT:LITE, GARDEN:GARDEN, GARDEN_NAMES:GARDEN_NAMES,
    hash:hash, rng:rng, mix:mix, contrast:contrast, gardenColour:gardenColour, sizeFor:sizeFor,
    makeLook:makeLook, formSvg:formSvg, bloom:bloom, svgEl:svgEl, yumiSeed:yumiSeed, bloomSvg:bloomSvg,
    Sky:Sky, YumiSky:YumiSky, startSkies:startSkies, skies:SKIES, reduced:REDUCE,
    ticks:function(){ return TICKS; }, stats:stats, esc:esc
  };
})();
