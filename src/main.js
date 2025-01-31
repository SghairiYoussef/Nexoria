import { makePlayer } from "./entities/player.js";
import { k } from "./kaboomLoader.js";

async function main() {

}

main();

k.scene("intro", () => {
    k.add([
        k.text("Hello, Kaboom!", 24),
        k.pos(80, 80),
    ]);
    const player = makePlayer(k, k.vec2(80, 80));
});

k.go("intro");