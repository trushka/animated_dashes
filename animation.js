const $win=$(window),
			$el=$('.dashes'),
			ctx=$el[0].getContext('2d'),
			PI=Math.PI, PI2=PI/2, PIx2=PI*2, PI52=PI*10000.5, deg=PI/180;


let touches=[], lastTouches=[], t0=0, lastCSS='',
	rot=[], nx, ny, n, size0, size, thickness, dpr, box;

function resize() {
	const css = $el.css(['fontSize', 'lineHeight', '--size', 'color']);

	size0 = parseFloat(css.fontSize);
	box = $el[0].getBoundingClientRect();

	let {width, height} = box;

	dpr=devicePixelRatio;

	nx=Math.ceil(width/size0);
	ny=Math.ceil(height/size0);

	$el[0].width = width*dpr;
	$el[0].height = height*dpr;
	ctx.setTransform(dpr*nx*size0/width, 0, 0, dpr*ny*size0/height, 0, 0)

	size = (+css['--size'] || .9)*size0;
	ctx.lineWidth = parseFloat(css.lineHeight) || 1.5;
	ctx.strokeStyle = css.color;


	if (n==(n=nx*ny)) return;

	for (let i=0; i<n; i++) {
		rot[i]=45*deg;
	};
}
//$win.on('resize', resize);

function chTouches(e, del) {
	const id = e.identifier || e.pointerId || 0;

	if (del || e.type=='pointerleave') delete touches[id]
	else touches[id]={x: e.clientX, y: e.clientY};
}
$win.on('pointerleave pointermove', chTouches)
.on('touchmove touchcancel touchend', e=>{
	Array.from(e.changedTouches).forEach(touch=>{
		chTouches(touch, e.type!='touchmove')
	})
})

requestAnimationFrame(function anim(t){
	requestAnimationFrame(anim);

	resize()
	if (!n) return;

	let dt=Math.min(50, t-t0);
	const advance=93/dt,
		x0=box.left, y0=box.top,
		inView=y0<innerHeight && box.bottom>0 ;

	t0=t;
	dt*=.01;

	if (inView) {
		ctx.clearRect(0,0, box.width, box.height)
		ctx.beginPath();
	}

	for (let iy=0; iy<ny; iy++) {
	 const y=y0+size0*(iy+1);

	 for (let ix=0; ix<nx; ix++) {
		const x=x0+size0*ix,
        	i = iy*nx+ix;

		let f = 0;
	
	 	if (inView) touches.forEach((touch, j)=>{
			const dx=touch.x - x,
				dy=touch.y - y;

        	f += Math.atan(12*size0*size0/(dx*dx+dy*dy))/3*5;
	 	})
	 	const targ=Math.min(45+f*90, 270)*deg;

        rot[i] += (targ - rot[i])*dt*Math.max(f*f/3, .5);

		if (!inView) continue;

		ctx.moveTo(x-x0, y-y0);
		ctx.lineTo(x-x0+Math.sin(rot[i])*size, y-y0-Math.cos(rot[i])*size);
	 }
	}
	if (inView) ctx.stroke();
})
function angleTo(a1, a2) {//a1 to a2
	return (a2-a1+PI52)%PI-PI2;
	//return a<-PI2 ? a+PI : a>PI2? a-PI : a;
}