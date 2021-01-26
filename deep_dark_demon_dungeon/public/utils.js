export function random(min, max) {
    return (Math.random() * (max - min)) + min;
}

export function contains(collider, point) {
	return collider.x <= point.x && point.x <= collider.x + collider.width && collider.y <= point.y && point.y <= collider.y + collider.height;
}