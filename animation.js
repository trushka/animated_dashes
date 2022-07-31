const $win=$(window),
			$el=$('.dashes'),
			nx=$el.css('--w'),
			ny=$el.css('--h'),
			n=nx*ny,
			PI=Math.PI, PI2=PI/2, PIx2=PI*2, PI32=PI*1.5;
for (let i=0; i<n; i++) {
	$el.append('<div/>')
};
const $dash=$el.children(),
			targets=[];
$win.on('mousemove touchstart touchmove', function setTarg(e){
	if (!e.touches) targets.push({x: e.clientX, y: e.clientY})
	else for(let i=0; i<e.touches.length; i++) {setTarg(e.touches[i])};
})
requestAnimationFrame(function anim(){
	requestAnimationFrame(anim);
	if (!targets[0]) return;
	const box=$el[0].getBoundingClientRect(),
				x0=box.left, y0=box.top,
				w0=box.width/nx,
				h0=box.height/ny;
	for (let j=0; j<ny; j++) {
	 const y=y0+h0*(j+.5);
	 for (let i=0; i<nx; i++) {
		 const x=x0+w0*(i+.5),
					 dash=$dash[j*nx+i],
					 a0=dash._angle||0,
					 dx=targets[0].x - x,
					 dy=targets[0].y - y,
					 r2=(dx*dx+dy*dy)/h0/w0/15;
					 f=Math.atan(1/r2),//f=10*w0*h0/(dx*dx+dy*dy),
					 a1=f*2,
					 a2=-Math.atan(dx/dy),
					 da=angleTo(a1, a2)
					 targ=dash._angle=a1+da*(1-f*r2)*(Math.cos(da)),
					 //targ=-Math.atan(dx/dy)*(1-f*r2),
					 targ0=dash._trg||0;
		 dash.style.transform=`rotate(${targ}rad)`
	 }
	}
	targets.length = 0;
})
function angleTo(a1, a2) {//a1 to a2
	return (a2-a1+PI32)%PI-PI2;
	//return a<-PI2 ? a+PI : a>PI2? a-PI : a;
}