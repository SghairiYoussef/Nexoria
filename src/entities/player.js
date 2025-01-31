import { PLAYER_SPEED } from "../kaboomLoader.js";

export function makePlayer(k, initialPos) {
    return k.make([
        k.pos(initialPos),
        k.sprite("playerIdle"),
        k.area({
            shape: new k.Rect(k.vec2(0, 18), 12, 12),
        }),
        k.anchor("center"),
        k.body({
            mass: 100,
            jumpForce: 320,
        }),
        k.opacity(1),
        k.health(3),
        "player",
        {
            speed: PLAYER_SPEED,
            isAttacking: false,
            isShielding: false,
            isRunning: false,
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
                    k.onKeyPress((key) => {
                        if (key === "space") {
                            if (this.isGrounded) {
                                this.jump(this.jumpForce);
                                setSprite("playerJump", "jump");
                            }
                        }

                        if (key === "w") {
                            if (!isAttacking && !isShielding) {
                                isAttacking = true;
                                setSprite("playerAttack", "attack");
                                player.onAnimEnd("attack", () => {
                                    isAttacking = false;
                                    setSprite("playerIdle", "idle");
                                });
                            }
                        }

                        if (key === "x") {
                            if (!isAttacking && !isShielding) {
                                isShielding = true;
                                setSprite("playerShield", "shield");
                                player.onAnimEnd("shield", () => {
                                    isShielding = false;
                                    setSprite("playerIdle", "idle");
                                });
                            }
                        }
                    })
                );

                this.controlHandlers.push((key) => {
                    if (key === "left") {
                        this.move(-this.speed, 0);
                        this.flipX = true;
                        if (this.isGrounded) {
                            setSprite("playerWalk", "walk");
                        }
                    } else if (key === "right") {
                        this.move(this.speed, 0);
                        this.flipX = false;
                        if (this.isGrounded) {
                            setSprite("playerWalk", "walk");
                        }
                    } else if (this.isGrounded) {
                        setSprite("playerIdle", "idle");
                    }
                })
            }
        }
    ]);
}
