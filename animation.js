const $win=$(window),
			$el=$('.dashes'),
			nx=$el.css('--w'),
			ny=$el.css('--h'),
			n=nx*ny,
			PI=Math.PI, PI2=PI/2, PIx2=PI*2, PI52=PI*10000.5;

for (let i=0; i<n; i++) {
	$el.append('<div/>')
};

const $dash=$el.children().prop({_f:0, _a:0});
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
				hw=h0*w0/2;

	for (let j=0; j<ny; j++) {
	 const y=y0+h0*(j+.5);

	 for (let i=0; i<nx; i++) {
		const x=x0+w0*(i+.5),
					dash=$dash[j*nx+i],
					a0=dash._a;
	
		let f=angleTo(a0, .17)*.8;

		t0=t;

	 	touches.forEach(touch=>{
			const dx=touch.clientX - x,
						dy=touch.clientY - y,
						r2=Math.abs(dx*dx+dy*dy-hw)/hw/200,

					 a1=Math.atan(1/r2)*2,//f=10*w0*h0/(dx*dx+dy*dy),
					 //a1=Math.min(f, PI2)+.16,
					 a2=-Math.atan(dx/dy),
					 da=angleTo(a0, a2),
					 //targ=dash._angle=a1+da*(Math.cos(da))*(1-f*r2),
					 //targ=-Math.atan(dx/dy)*(1-f*r2),
					 targ0=dash._trg||0;
			f+=da*(1-Math.cos(da+da))/r2*2+angleTo(a0, a1);//
	 	})
	 	dash._f*=Math.pow(.8, dt);
	 	dash._f+=(f-dash._f)*dt*.3;
	 	dash._f=Math.atan(dash._f);
		dash.style.transform=`rotate(${dash._a=a0+dash._f*dt}rad)`
	 }
	}
	touches.length = 0;
})
function angleTo(a1, a2) {//a1 to a2
	return (a2-a1+PI52)%PI-PI2;
	//return a<-PI2 ? a+PI : a>PI2? a-PI : a;
}