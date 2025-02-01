export function makeSkeleton(k, initialPos) {
    return k.make([
        k.pos(initialPos),
        k.sprite("skeletonIdle"),
        k.area({
            shape: new k.Rect(k.vec2(0, 18), 24, 74),
        }),
        k.anchor("center"),
        k.body(),
        k.opacity(1),
        k.health(2),
        k.state("patrol-right", ["patrol-right", "patrol-left", "alert", "chase", "attack", "death"]),
        "skeleton",
        {
            speed: 50,
            direction: 1,
            range: 150,
            attackRange: 40,
            pursuitSpeed: 200,
            attackCooldown: false,

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
                if (!this.attackCooldown) {
                    this.attackCooldown = true;
                    this.add([
                        k.pos(this.flipX ? -25 : 0,10),
                        k.area({ 
                            shape: new k.Rect(k.vec2(0), 40, 60),
                         }),
                        "skeletonHitbox",
                    ])
                    this.setSprite("skeletonAttack", "attack");
                    this.onAnimEnd((anim) => {
                        if (anim === "attack") {
                            const hitbox = k.get("skeletonHitbox", { recursive: true })[0];
                            if (hitbox) k.destroy(hitbox);
                        }
                    })
                    k.wait(1, () => {
                        this.attackCooldown = false;
                    });
                }
            },

            death() {
                this.setSprite("skeletonDeath", "death");               
                this.onAnimEnd((anim) => {
                    if (anim === "death")
                    k.destroy(this);
                });
                
            },

            setAI() {
                const player = k.get("player", { recursive: true })[0];

                this.onStateEnter("patrol-right", async () => {
                    await k.wait(3);
                    if (this.state === "patrol-right") this.enterState("patrol-left");
                });

                this.onStateUpdate("patrol-right", () => {
                    if (this.pos.dist(player.pos) < this.range) {
                        this.enterState("alert");
                        return;
                    }
                    this.move(this.speed, 0);
                    this.setDirection(1);
                    this.setSprite("skeletonWalk", "move");
                });

                this.onStateEnter("patrol-left", async () => {
                    await k.wait(3);
                    if (this.state === "patrol-left") this.enterState("patrol-right");
                });

                this.onStateUpdate("patrol-left", () => {
                    if (this.pos.dist(player.pos) < this.range) {
                        this.enterState("alert");
                        return;
                    }
                    this.move(-this.speed, 0);
                    this.setDirection(-1);
                    this.setSprite("skeletonWalk", "move");
                });

                this.onStateEnter("alert", async () => {
                    this.setSprite("skeletonIdle", "idle");
                    await k.wait(1);
                    if (this.pos.dist(player.pos) < this.range) {
                        this.enterState("chase");
                    } else {
                        this.enterState("patrol-right");
                    }
                });

                this.onStateEnter("chase", () => {
                    this.setSprite("skeletonRun", "run");
                });

                this.onStateUpdate("chase", () => {
                    if (this.pos.dist(player.pos) < this.attackRange) {
                        this.enterState("attack");
                        return;
                    } else if (this.pos.dist(player.pos) > this.range * 1.5) {
                        this.enterState("patrol-right");
                        return;
                    }

                    this.moveTo(player.pos, this.pursuitSpeed);
                    this.setDirection(this.pos.x < player.pos.x ? 1 : -1);
                });

                this.onStateEnter("attack", () => {
                    this.setSprite("skeletonAttack", "attack");
                });

                this.onStateUpdate("attack", () => {
                    if (this.pos.dist(player.pos) > this.attackRange) {
                        this.enterState("chase");
                        return;
                    }

                    this.attack();
                });

                this.on("hurt", () => {
                    console.log("Hurt");
                    if (this.hp() <= 0 && this.state !== "death") {
                        this.death()
                    }
                });
            },

            setEvents() {
                this.onCollide("swordHitbox", () => {
                    this.hurt(1);
                });
            }
        }
    ])
}
