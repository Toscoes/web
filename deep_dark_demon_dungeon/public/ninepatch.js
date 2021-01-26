export function drawBackgroundUi(ctx, x, y, width, height, data, center) {
    
    let bg = data.sprite
    let top = data.top
    let left = data.left
    let bottom = data.bottom
    let right = data.right

    // draw TOP LEFT CORNER
	ctx.drawImage(
		bg,
		0, // x in sprite
		0, // y in sprite
		left, // width in sprite,
		top, // height in sprite
		x + (center? -width/2 : 0), // x in canvas
		y + (center? -height/2 : 0), // y in canvas
		left, // width in canvas
		top // height in canvas
	);
    
	// draw TOP BORDER
	ctx.drawImage(
		bg,
		left,
		0,
		left,
		top,
		(x + left) + (center? -width/2 : 0),
		y + (center? -height/2 : 0),
		width - (left * 2), // subtract width of 2 corners assuming top left and right corners are equal width
		top
	);

	// draw TOP RIGHT CORNER
	ctx.drawImage(
		bg,
		right,
		0,
		left,
		top,
		x + width - left + (center? -width/2 : 0),
		y + (center? -height/2 : 0),
		left,
		top
	);

	// draw LEFT BORDER
	ctx.drawImage(
		bg,
		0,
        top,
		left,
		top,
		x + (center? -width/2 : 0),
		y + top + (center? -height/2 : 0),
		left,
		height - (top * 2)
    );

    
	// draw BODY
	// already implemented to work with varying grid sizes
	ctx.drawImage(
		bg,
		left,
		top,
		right - left,
		bottom - top,
		x + left + (center? -width/2 : 0),
		y + top + (center? -height/2 : 0),
		width - right,
		height - bottom
	);

	// draw RIGHT BORDER 
	ctx.drawImage(
		bg,
		right,
		top,
		left,
		top,
		x + width - left + (center? -width/2 : 0),
		y + top + (center? -height/2 : 0),
		left,
		height - (top * 2)
    );

	// draw BOTTOM LEFT corner
	ctx.drawImage(
		bg,
		0,
		bottom,
		left,
		top,
		x + (center? -width/2 : 0),
		y + height - top + (center? -height/2 : 0),
		left,
		top
	);

	// draw BOTTOM BORDER
	ctx.drawImage(
		bg,
		left,
		bottom,
		left,
		top,
		x + left + (center? -width/2 : 0),
		y + height - top + (center? -height/2 : 0),
		width - (left * 2),
		top
	);

	// draw BOTTOM RIGHT CORNER
	ctx.drawImage(
		bg,
		right,
		bottom,
		left,
		top,
		x + width - left + (center? -width/2 : 0),
		y + height - top  + (center? -height/2 : 0),
		left,
		top
    )
}