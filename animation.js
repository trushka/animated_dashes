const $win=$(window),
			$el=$('.dashes'),
			nx=$el.css('--w'),
			ny=$el.css('--h'),
			n=nx*ny,
			PI=Math.PI, PI2=PI/2, PIx2=PI*2, PI32=PI*1.5;

for (let i=0; i<n; i++) {
	$el.append('<div/>')
};

const $dash=$el.children();
let touches=[], t0=performance.now();

$win.on('mousemove touchstart touchmove', function setTarg(e){
	if (!e.touches) touches=[e]
	else touches=Array.from(e.touches);
//	console.log(e.touches)
})

requestAnimationFrame(function anim(){
	requestAnimationFrame(anim);

	//if (!targets[0]) return;

	const t=performance.now(),
				dt=Math.min(50, t-t0)*.003,

				box=$el[0].getBoundingClientRect(),
				x0=box.left, y0=box.top,
				w0=box.width/nx,
				h0=box.height/ny,
				hw=h0*w0/4;

	for (let j=0; j<ny; j++) {
	 const y=y0+h0*(j+.5);

	 for (let i=0; i<nx; i++) {
		const x=x0+w0*(i+.5),
					dash=$dash[j*nx+i],
					a0=dash._angle||0;
	
		let f=angleTo(a0, .16)*.05;

		t0=t;

	 	touches.forEach(touch=>{
			const dx=touch.clientX - x,
						dy=touch.clientY - y,
						r2=(dx*dx+dy*dy)/hw/100,

					 a1=Math.atan(1/r2)*1.2,//f=10*w0*h0/(dx*dx+dy*dy),
					 //a1=Math.min(f, PI2)+.16,
					 a2=-Math.atan(dx/dy),
					 da=angleTo(a1, a2)
					 //targ=dash._angle=a1+da*(Math.cos(da))*(1-f*r2),
					 //targ=-Math.atan(dx/dy)*(1-f*r2),
					 targ0=dash._trg||0;
			f+=angleTo(a0, a1);
	 	})
		dash.style.transform=`rotate(${dash._angle=a0+f*dt}rad)`
	 }
	}
	touches.length = 0;
})
function angleTo(a1, a2) {//a1 to a2
	return (a2-a1+PI32)%PI-PI2;
	//return a<-PI2 ? a+PI : a>PI2? a-PI : a;
}