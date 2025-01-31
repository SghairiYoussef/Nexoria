export function setBackgroundColor (k, hexColorCode) {
    k.add([
        k.rect(k.width(), k.height()),
        k.color(k.Color.fromHex(hexColorCode)),
        k.fixed(),
    ]);
}

export function setMapColliders (k, map, colliders) {
    for (const collider of colliders) {
        map.add([
            k.pos(collider.x, collider.y),
            k.area({
                shape: new k.Rect(k.vec2(0), collider.width, collider.height),
                collisionIgnore: ["collider"],
            }),
            k.body({ isStatic: true }),
            "collider",
            collider.type,
        ]);
    }
}
