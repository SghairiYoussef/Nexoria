import { makePlayer } from "./entities/player.js";
import { k } from "./kaboomLoader.js";
import { room1 } from "./scenes/room1.js";

async function main() {
    const room1Data = await (await fetch("./maps/room1.json")).json();

    k.scene("room1", (previousSceneData) => {
        room1(k, room1Data, previousSceneData);
    })
}

main();

k.scene("intro", () => {
    k.add([
        k.text("Hello, Kaboom!", 24),
        k.pos(80, 80),
    ]);
    k.add([
        k.text("Press Enter to start", 24),
        k.pos(80, 120),
    ]);
    k.onKeyPress("enter", () => {
        k.go("room1");
    });
});

k.go("intro");