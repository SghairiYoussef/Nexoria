import { PLAYER_SPEED } from "../kaboomLoader.js";

export function makePlayer(k, initialPos) {
    return k.make([
        k.pos(initialPos),
        k.sprite("playerIdle"),
        k.area({
            shape: new k.Rect(k.vec2(0, 18), 24, 82),
        }),
        k.anchor("center"),
        k.body(), // No need to define mass & jumpForce here
        k.opacity(1),
        k.health(3),
        k.scale(0.75),
        "player",
        {
            speed: PLAYER_SPEED,
            isAttacking: false,
            isShielding: false,

            setPosition(x, y) {
                this.pos.x = x;
                this.pos.y = y;
            },

            setSprite(spriteName, animName) {
                if (this.curAnim() === animName) return;
                this.use(k.sprite(spriteName));
                this.play(animName);
                console.log("setSprite", this.curAnim());
            },

            setControls() {
                this.controlHandlers = [];

                // Jump Fix: Check `this.isGrounded()` instead of `this.isGrounded`
                this.controlHandlers.push(
                    k.onKeyPress("space", () => {
                        if (this.isGrounded()) {
                            this.jump(320); // Use actual jump force
                            this.setSprite("playerJump", "jump");

                            // Ensure that jump animation does not reset too soon
                            k.wait(0.2, () => {
                                if (!this.isGrounded()) {
                                    this.setSprite("playerJump", "jump");
                                }
                            });
                        }
                    })
                );

                this.controlHandlers.push(
                    k.onKeyPress("w", () => {
                        if (!this.isAttacking && !this.isShielding) {
                            this.isAttacking = true;
                            this.setSprite("playerAttack", "attack");
                            console.log("attack", this.curAnim());

                            // Delay before resetting isAttacking
                            k.wait(0.5, () => {
                                this.isAttacking = false;
                                if (this.isGrounded()) this.setSprite("playerIdle", "idle");
                            });
                        }
                    })
                );

                this.controlHandlers.push(
                    k.onKeyPress("x", () => {
                        if (!this.isAttacking && !this.isShielding) {
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
                        if (key === "left") {
                            this.move(-this.speed, 0);
                            this.flipX = true;
                            if (!this.isAttacking && this.isGrounded()) {
                                this.setSprite("playerWalk", "walk");
                            }
                        } else if (key === "right") {
                            this.move(this.speed, 0);
                            this.flipX = false;
                            if (!this.isAttacking && this.isGrounded()) {
                                this.setSprite("playerWalk", "walk");
                            }
                        }
                    })
                );

                this.controlHandlers.push(
                    k.onKeyRelease(() => {
                        if (this.isGrounded() && this.curAnim() === "walk") {
                            this.setSprite("playerIdle", "idle");
                        }
                    })
                );

                // Ensure sprite resets after landing
                this.controlHandlers.push(
                    k.onUpdate(() => {
                        if (this.isGrounded() && this.curAnim() === "jump") {
                            this.setSprite("playerIdle", "idle");
                        }
                    })
                );
            },

            disableControls() {
                for (const handler of this.controlHandlers) {
                    handler.cancel();
                }
            },
        }
    ]);
}
