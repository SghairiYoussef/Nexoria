export function makeSkeleton(k) {
    return k.make([
        k.pos(),
        k.sprite("skeletonIdle"),
        k.area({
            shape: new k.Rect(k.vec2(0, 18), 24, 74),
        }),
        k.anchor("center"),
        k.body(),
        k.opacity(1),
        k.health(2),
        "skeleton",
        {
            speed: 50,
            direction: 1, // 1 = facing right, -1 = facing left

            setPosition(x, y) {
                this.pos.x = x;
                this.pos.y = y;
            },

            setSprite(spriteName, animName) {
                if (this.curAnim() === animName) return;
                this.use(k.sprite(spriteName));
                this.play(animName);
                this.flipX = this.direction === -1;
            },

            setDirection(direction) {
                this.direction = direction;
                this.flipX = direction === -1;
            },

            attack() {
                this.setSprite("skeletonAttack", "attack");
            },

            death() {
                this.setSprite("skeletonDeath", "death");
                this.action(() => {
                    if (this.curAnim().isEnded()) {
                        this.destroy();
                    }
                });
            }
        }
    ])
}