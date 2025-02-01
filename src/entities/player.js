import { PLAYER_SPEED } from "../kaboomLoader.js";

export function makePlayer(k, initialPos) {
    return k.make([
        k.pos(initialPos),
        k.sprite("playerIdle"),
        k.area({
            shape: new k.Rect(k.vec2(0, 18), 24, 82),
        }),
        k.anchor("center"),
        k.body(),
        k.opacity(1),
        k.health(10),
        k.scale(0.75),
        "player",
        {
            speed: PLAYER_SPEED,
            isRunning: false,
            isAttacking: false,
            isShielding: false,
            isMoving: false,
            isDead: false,  // Prevents multiple death triggers
            jumpCount: 0,
            direction: 1,

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

            setControls() {
                this.controlHandlers = [];

                this.controlHandlers.push(
                    k.onKeyDown("shift", () => {
                        this.isRunning = true;
                        this.speed = PLAYER_SPEED * 1.8;
                        if (this.isGrounded() && this.isMoving) {
                            this.setSprite("playerRun", "run");
                        }
                    })
                );

                this.controlHandlers.push(
                    k.onKeyRelease("shift", () => {
                        this.isRunning = false;
                        this.speed = PLAYER_SPEED;
                        if (this.isGrounded() && this.isMoving) {
                            this.setSprite("playerWalk", "move");
                        }
                    })
                );

                this.controlHandlers.push(
                    k.onKeyPress("space", () => {
                        if (this.isGrounded()) {
                            this.jumpCount = 1;
                            this.jump(this.isRunning ? 380 : 320);
                            this.setSprite("playerJump", "jump");
                        } else if (this.jumpCount === 1) {
                            this.jumpCount = 2;
                            this.jump(320);
                            this.setSprite("playerJump", "jump");
                        }
                    })
                );

                // Attack only when not moving
                this.controlHandlers.push(
                    k.onKeyPress("w", () => {
                        if (!this.isAttacking && !this.isShielding && !this.isMoving) {
                            this.isAttacking = true;
                            this.add([
                                k.pos(this.flipX ? -50 : 0, 10),
                                k.area({
                                    shape: new k.Rect(k.vec2(0), 50, 10),
                                }),
                                "swordHitbox",
                            ]);
                            this.setSprite("playerAttack", "attack");
                        }
                    })
                );

                // Shield only when not moving
                this.controlHandlers.push(
                    k.onKeyPress("x", () => {
                        if (!this.isAttacking && !this.isShielding && !this.isMoving) {
                            this.isShielding = true;
                            this.setSprite("playerShield", "shield");
                            k.wait(0.5, () => {
                                this.isShielding = false;
                                if (this.isGrounded()) this.setSprite("playerIdle", "idle");
                            });
                        }
                    })
                );

                this.controlHandlers.push(
                    k.onKeyDown((key) => {
                        if (key === "left" && !this.isAttacking) {
                            this.move(-this.speed, 0);
                            this.direction = -1;
                            this.isMoving = true;
                            if (this.isGrounded()) {
                                this.setSprite(this.isRunning ? "playerRun" : "playerWalk", this.isRunning ? "run" : "move");
                            }
                        } else if (key === "right" && !this.isAttacking) {
                            this.move(this.speed, 0);
                            this.direction = 1;
                            this.isMoving = true;
                            if (this.isGrounded()) {
                                this.setSprite(this.isRunning ? "playerRun" : "playerWalk", this.isRunning ? "run" : "move");
                            }
                        }
                    })
                );

                this.controlHandlers.push(
                    k.onKeyRelease((key) => {
                        if ((key === "left" || key === "right") && this.isGrounded()) {
                            this.isMoving = false;
                            this.setSprite("playerIdle", "idle");
                        }
                    })
                );

                this.controlHandlers.push(
                    k.onUpdate(() => {
                        if (this.isGrounded()) {
                            this.jumpCount = 0;
                        }
                        if (this.isGrounded() && this.curAnim() === "jump") {
                            this.setSprite("playerIdle", "idle");
                        }
                    })
                );

                this.controlHandlers.push(
                    k.onUpdate(() => {
                        if (this.isRunning && this.isGrounded() && this.isMoving) {
                            this.setSprite("playerRun", "run");
                        } else if (!this.isRunning && this.isGrounded() && this.isMoving) {
                            this.setSprite("playerWalk", "move");
                        }
                    })
                );

                this.controlHandlers.push(
                    k.onUpdate(() => {
                        const minX = 100, maxX = 2000;
                        const minY = 100, maxY = 1000;

                        const camX = Math.max(minX, Math.min(this.pos.x, maxX));
                        const camY = Math.max(minY, Math.min(this.pos.y, maxY));

                        k.camPos(camX, camY);
                    })
                );
            },

            disableControls() {
                for (const handler of this.controlHandlers) {
                    handler.cancel();
                }
            },

            setEvents() {
                this.onFall(() => {
                    this.setSprite("playerJump", "jump");
                });

                this.onGround(() => {
                    if (this.curAnim() === "jump") {
                        this.setSprite("playerIdle", "idle");
                    }
                });

                this.on("hurt", () => {
                    if (this.hp() <= 0 && !this.isDead) {
                        this.isDead = true;
                        this.trigger("death");
                    }
                });

                this.on("death", () => {
                    this.disableControls();
                    this.setSprite("playerDeath", "death");
                });

                this.onCollide("skeletonHitbox", () => {
                    if (this.isShielding) return;
                    this.hurt(1);
                });

                this.onAnimEnd((anim) => {
                    if (anim === "attack" && this.isAttacking) {
                        const swordHitbox = k.get("swordHitbox", { recursive: true })[0];
                        if (swordHitbox) k.destroy(swordHitbox);
                        this.isAttacking = false;
                        if (this.isGrounded()) this.setSprite("playerIdle", "idle");
                    }

                    if (anim === "death" && this.isDead) {
                        k.go("gameover");
                    }
                });
            }
        }
    ]);
}
