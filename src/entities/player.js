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
        k.health(3),
        k.scale(0.75),
        "player",
        {
            speed: PLAYER_SPEED,
            isRunning: false,
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
            },

            setControls() {
                this.controlHandlers = [];

                this.controlHandlers.push(
                    k.onKeyDown("shift", () => {
                        this.isRunning = true;
                        this.speed = PLAYER_SPEED * 1.5;
                    })
                );

                this.controlHandlers.push(
                    k.onKeyRelease("shift", () => {
                        this.isRunning = false;
                        this.speed = PLAYER_SPEED;
                    })
                );

                this.controlHandlers.push(
                    k.onKeyPress("space", () => {
                        if (this.isGrounded()) {
                            this.jump(320);
                            this.setSprite("playerJump", "jump");
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
                                this.setSprite(this.isRunning ? "playerRun" : "playerWalk", "move");
                            }
                        } else if (key === "right") {
                            this.move(this.speed, 0);
                            this.flipX = false;
                            if (!this.isAttacking && this.isGrounded()) {
                                this.setSprite(this.isRunning ? "playerRun" : "playerWalk", "move");
                            }
                        }
                    })
                );

                this.controlHandlers.push(
                    k.onKeyRelease(() => {
                        if (this.isGrounded() && (this.curAnim() === "move" || this.curAnim() === "run")) {
                            this.setSprite("playerIdle", "idle");
                        }
                    })
                );

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
