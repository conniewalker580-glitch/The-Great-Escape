import * as THREE from 'three'

export const hotspots = []

export function createRoom(scene) {
    // Create a box room
    const room = new THREE.Mesh(
        new THREE.BoxGeometry(10, 5, 10),
        new THREE.MeshStandardMaterial({ color: 0x222222, side: THREE.BackSide })
    )
    scene.add(room)

    // Add invisible hotspots with clues
    addHotspot(scene, [-2, 1, -4], 'A book whispers: 3.14 is more than a number.')
    addHotspot(scene, [3, 0.3, 1], 'A scratched symbol: π')
    addHotspot(scene, [0, 2, -3], 'A painting hums: circles never end.')
    addHotspot(scene, [-3, 1, 2], 'Wall carving: r × r × π')
}

function addHotspot(scene, position, clue) {
    const spot = new THREE.Mesh(
        new THREE.SphereGeometry(0.2),
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 })
    )
    spot.position.set(...position)
    spot.userData.clue = clue
    hotspots.push(spot)
    scene.add(spot)
}
