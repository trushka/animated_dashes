const $win=$(window),
			$el=$('.dashes').html('<path/>'),
			PI=Math.PI, PI2=PI/2, PIx2=PI*2, PI52=PI*10000.5;


const $path=$('path', $el);
let touches=[], t0=performance.now(),
	dashes=[], nx, ny, n, size;

$win.on('resize', e=>{
	nx=$el.css('--w');
	ny=$el.css('--h');

	if (!nx || !ny) return;

	const width=$el[0].clientWidth;
	$el.attr({width: width, height: width/nx*ny});
	size=$el.css('--size')||.9;

	if (n==(n=nx*ny)) return;

	for (let i=0; i<n; i++) {
		dashes[i]={a:0, v:0}
	};
}).resize()

$win.on('mousemove touchstart touchmove', function setTarg(e){
	if (!e.touches) touches=[e]
	else touches=Array.from(e.touches);
//	console.log(e.touches)
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
				hw=h0*w0/2,
				r0=w0/2*size;

	let path='';				

	for (let j=0; j<ny; j++) {
	 const y=y0+h0*(j+.5);

	 for (let i=0; i<nx; i++) {
		const x=x0+w0*(i+.5),
					dash=dashes[j*nx+i];
	
		let a0=dash.a;
				f=angleTo(a0, .17)*.8;

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
	 	dash.v*=Math.pow(.8, dt);
	 	dash.v+=(f-dash.v)*dt*.3;
	 	dash.v=Math.atan(dash.v);
	 	dash.a=a0+=dash.v*dt;
		//dash.style.transform=`rotate(${}rad)`;
		dash.dx=-r0*Math.sin(a0);
		dash.dy=r0*Math.cos(a0);
		path+=`M${x-x0-dash.dx} ${y-y0-dash.dy} L${x-x0+dash.dx} ${y-y0+dash.dy}, `
	 }
	}
	$path.attr('d', path+'z');
	touches.length = 0;
})
function angleTo(a1, a2) {//a1 to a2
	return (a2-a1+PI52)%PI-PI2;
	//return a<-PI2 ? a+PI : a>PI2? a-PI : a;
}