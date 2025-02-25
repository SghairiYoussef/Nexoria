import { setBackgroundColor,setMapColliders } from "./roomUtils.js";
import { makePlayer } from "../entities/player.js";
import { makeSkeleton } from "../entities/skeleton.js";

export function room1(k, roomData, previousSceneData) {
    setBackgroundColor(k, "#0e1536");
    const roomLayers = roomData.layers;
    const map=k.add([k.pos(0,0), k.sprite('room1')]);

    k.setGravity(1000);

    const colliders = []
    const spawners = []

    for (const layer of roomLayers) {
        if (layer.name == "WallColliders") {
            colliders.push(...layer.objects)
            continue;
        }

        if (layer.name == "Spawners") {
            spawners.push(...layer.objects)
        }
    }

    setMapColliders(k, map, colliders);

    const player = k.add(makePlayer(k));

    for (const spawner of spawners) {
        if (spawner.name === "Player") {
            player.setPosition(spawner.x , spawner.y );
            player.setControls();
            player.setEvents();
            continue;
        }

        if (spawner.type === "skeleton") {
            const skeleton = map.add(makeSkeleton(k));
            skeleton.setPosition(spawner.x, spawner.y);
            skeleton.setAI();
            skeleton.setEvents();
        }
    }
}