import * as THREE from 'three'
import { createRoom, hotspots } from './room'
import { revealClue, checkAnswer } from './gameLogic'

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x111111)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 1.6, 5)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// Add orbit controls or simple look around if needed, but keeping it minimal per request
const light = new THREE.PointLight(0xffffff, 1)
light.position.set(5, 5, 5)
scene.add(light)

const ambientLight = new THREE.AmbientLight(0x404040) // soft white light
scene.add(ambientLight)

createRoom(scene)

const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

window.addEventListener('click', (e) => {
    // Ignore clicks on UI
    if (e.target.closest('#ui')) return;

    mouse.x = (e.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
    raycaster.setFromCamera(mouse, camera)
    const hit = raycaster.intersectObjects(hotspots)
    if (hit.length > 0) revealClue(hit[0].object)
})

document.getElementById('submitBtn').onclick = () => {
    checkAnswer(document.getElementById('answerInput').value)
}

function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
}
animate()

// Handle resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})
