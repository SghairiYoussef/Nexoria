import { PLAYER_SPEED } from "../kaboomLoader.js";

export function makePlayer(k, initialPos) {
    return k.make([
        k.pos(initialPos),
        k.sprite("playerIdle"),
        k.area({
            shape: new k.Rect(k.vec2(0, 18), 24, 82),
        }),
        k.anchor("center"),
        k.body({
            mass: 100,
            jumpForce: 320,
        }),
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
                console.log("setSprite", this.curAnim())
            },
            setControls() {
                this.controlHandlers = [];

                this.controlHandlers.push(
                    k.onKeyPress((key) => {
                        if (key === "space") {
                            if (true /*TODO*/) {
                                this.jump(this.jumpForce);
                                this.setSprite("playerJump", "jump");
                            }
                        }

                        if (key === "w") {
                            if (!this.isAttacking && !this.isShielding) {
                                this.isAttacking = true;
                                this.setSprite("playerAttack", "attack");
                                console.log("attack", this.curAnim())
                                this.isAttacking = false;
                            }
                        }

                        if (key === "x") {
                            if (!this.isAttacking && !this.isShielding) {
                                this.isShielding = true;
                                this.setSprite("playerShield", "shield");
                            }
                        }
                    })
                );

                this.controlHandlers.push(
                    k.onKeyDown((key) => {
                    if (key === "left") {
                        this.move(-this.speed, 0);
                        this.flipX = true;
                        if (true /*TODO*/&& !this.isAttacking && this.isGrounded) {
                            this.setSprite("playerWalk", "walk");
                        }
                    } else if (key === "right") {
                        this.move(this.speed, 0);
                        this.flipX = false;
                        if (true /*TODO*/ && !this.isAttacking && this.isGrounded) {
                            this.setSprite("playerWalk", "walk");
                        }
                    }
                    })
                );
                this.controlHandlers.push(
                    k.onKeyRelease(() => {
                        if (this.curAnim() === "walk") {
                            this.setSprite("playerIdle", "idle");
                        }
                    })
                )
            },

            disablleControls() {
                for (const handler of this.controlHandlers) {
                    handler.cancel();
                }
            }
        }
    ]);
}
