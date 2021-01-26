function darken(ctx, x, y, w, h, darkenColor) {
    ctx.fillStyle = darkenColor;
    ctx.fillRect(x, y, w, h);
}

function lighten(ctx, x, y, radius, color) {
	ctx.save();
	var rnd = 0.03 * Math.sin(1.25 * Date.now() / 1000);
	radius = radius * (1 + rnd);

	let gradient = ctx.createRadialGradient(x,y,radius-10, x,y,radius);
	gradient.addColorStop(0, "rgb(255,255,255,0.1)");
	gradient.addColorStop(0.5, color);

	ctx.globalCompositeOperation = 'lighter';
	ctx.fillStyle = gradient;

	ctx.beginPath();
	ctx.arc(x, y, radius * 0.4+rnd, 0, 2 * Math.PI);
	ctx.fill();
	ctx.restore();
}

function out(ctx, x, y, radius) {
	ctx.save();
	var rnd = 0.1 * Math.sin(1.25 * Date.now() / 750);
	radius = radius * (1 + rnd);
	ctx.globalCompositeOperation = 'destination-out';
	ctx.fillStyle = "rgba(0,255,255,0.9)";
	ctx.beginPath();
	ctx.arc(x, y, radius * 0.4+rnd, 0, 2 * Math.PI);
	ctx.fill();
	ctx.restore();
}