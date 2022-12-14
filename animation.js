const $win=$(window),
			$el=$('.dashes').html('<path/>'),
			ctx=$el[0].getContext('2d'),
			PI=Math.PI, PI2=PI/2, PIx2=PI*2, PI52=PI*10000.5;


const $path=$('path', $el);
let touches=[], lastTouches=[], t0=performance.now(),
	dashes=[], nx, ny, n, size, thickness;

$win.on('resize', e=>{
	nx=$el.css('--w');
	ny=$el.css('--h');

	if (!nx || !ny) return;

	$el[0].width = $el[0].clientWidth*devicePixelRatio;
	$el[0].height = $el[0].width/nx*ny;
	size=$el.css('--size')||.9;
	ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
	ctx.lineWidth=$el.css('--thickness');
	ctx.strokeStyle = $el.css('color');

	if (n==(n=nx*ny)) return;

	for (let i=0; i<n; i++) {
		dashes[i]={a:0, v:0}
	};
}).resize()

$win.on('mousemove touchstart touchmove', (e)=>{
	const et=e.touches||[e];
	e.identifier=-1
	for (var i = 0; i < et.length; i++) {
		const id=+et[i].identifier+1;
	console.log(et[i])

		touches[id]={x:et[i].clientX, y:et[i].clientY};
		if (!lastTouches[id]) lastTouches[id]=touches[id];
	}
})

requestAnimationFrame(function anim(){
	requestAnimationFrame(anim);

	if (!n) return;

	const t=performance.now(),
		dt=Math.min(50, t-t0)*.003,

		box=$el[0].getBoundingClientRect(),
		x0=box.left, y0=box.top,
		w0=box.width/nx,
		h0=box.height/ny,
		hw=h0*w0/3,
		r0=w0/2*size,
		scale=hw*500,
		inView=y0<innerHeight && box.bottom>0 ;

	if (inView) {
		ctx.clearRect(0,0, box.width, box.height)
		ctx.beginPath();
	}
	lastTouches.forEach((touch0, i)=>{
		const touch=touches[i], size=w0*10, advance=.28/dt;
		if (touch) {
			lastTouches[i]={x:touch.x, y:touch.y};
			touch.x+=Math.atan((touch.x-touch0.x)/size*advance)*size;
			touch.y+=Math.atan((touch.y-touch0.y)/size*advance)*size;
		} else {
			//touches[i]=touch0;
			delete lastTouches[i]
		}
	})			

	for (let j=0; j<ny; j++) {
	 const y=y0+h0*(j+.5);

	 for (let i=0; i<nx; i++) {
		const x=x0+w0*(i+.5),
					dash=dashes[j*nx+i];
	
		let a0=dash.a;
			f=angleTo(a0, .17)*.6;

		t0=t;

	 	if (inView) touches.forEach((touch, i)=>{
			const dx=touch.x - x,
				dy=touch.y - y,
				dy2=dy*dy,
				r02=dx*dx+dy2,
				r2=Math.abs(r02+hw)/scale,

				a1=Math.atan(1.5/r2)*.9,////f=10*w0*h0/(dx*dx+dy*dy),
				//a1=Math.min(f, PI2)+.16,
				a2=-Math.atan(dx/dy),
				da=angleTo(a0, a2),//),
				//targ=dash._angle=a1+da*(Math.cos(da))*(1-f*r2),
				//targ=-Math.atan(dx/dy)*(1-f*r2),
				targ0=dash._trg||0;
			f+=da/r2+angleTo(a0, a1*a1)*8;//*(1-Math.cos(da+da))
			//delete touches[i]
	 	})
	 	dash.v*=Math.pow(.8, dt);
	 	dash.v+=(f-dash.v)*dt*.3;
	 	dash.v=Math.atan(dash.v);
	 	dash.a=a0+=dash.v*dt;
		//dash.style.transform=`rotate(${}rad)`;
		dash.dx=-r0*Math.sin(a0);
		dash.dy=r0*Math.cos(a0);

		if (!inView) continue;

		ctx.moveTo(x-x0-dash.dx, y-y0-dash.dy);
		ctx.lineTo(x-x0+dash.dx, y-y0+dash.dy);
	 }
	}
	if (inView) ctx.stroke();
	touches.length = 0;
})
function angleTo(a1, a2) {//a1 to a2
	return (a2-a1+PI52)%PI-PI2;
	//return a<-PI2 ? a+PI : a>PI2? a-PI : a;
}