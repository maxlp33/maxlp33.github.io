import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Scene setup
const canvas = document.getElementById('three-canvas');
if (!canvas) {
    console.error('Canvas not found');
    throw new Error('Canvas element not found');
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0); // Transparent background

// Lighting - bright setup
const ambientLight = new THREE.AmbientLight(0xffffff, 2.5);
scene.add(ambientLight);

const pointLight1 = new THREE.PointLight(0xffffff, 3, 100);
pointLight1.position.set(10, 10, 10);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xffffff, 2.5, 100);
pointLight2.position.set(-10, -10, 10);
scene.add(pointLight2);

const pointLight3 = new THREE.PointLight(0xffffff, 1, 100);
pointLight3.position.set(0, 10, -10);
scene.add(pointLight3);

camera.position.z = 100;

// Model variable
let model = null;

// Rotation limits
let targetRotationY = 0;
let targetRotationX = -0.2; // Start tilted forward
const maxRotationY = Math.PI / 4; // 45 degrees for Y axis
const maxRotationX = Math.PI / 9; // ~20 degrees for X axis

// Load the GLB model
const loader = new GLTFLoader();
loader.load(
    'models/scene.glb',
    (gltf) => {
        model = gltf.scene;
        model.scale.set(150, 150, 150);
        
        // Center the model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        
        // Tilt model forward a bit
        model.rotation.x = targetRotationX;
        
        scene.add(model);
        console.log('Model loaded successfully');
    },
    (progress) => {
        console.log('Loading:', (progress.loaded / progress.total * 100).toFixed(1) + '%');
    },
    (error) => {
        console.error('Error loading model:', error);
    }
);

// Mouse drag rotation with limits
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDragging || !model) return;
    
    const deltaX = e.clientX - previousMousePosition.x;
    const deltaY = e.clientY - previousMousePosition.y;
    
    // Rotate Y axis (horizontal), clamp to -45 to 45 degrees
    targetRotationY += deltaX * 0.01;
    targetRotationY = Math.max(-maxRotationY, Math.min(maxRotationY, targetRotationY));
    model.rotation.y = targetRotationY;
    
    // Rotate X axis (vertical), clamp to -20 to 20 degrees
    targetRotationX += deltaY * 0.01;
    targetRotationX = Math.max(-maxRotationX, Math.min(maxRotationX, targetRotationX));
    model.rotation.x = targetRotationX;
    
    previousMousePosition = { x: e.clientX, y: e.clientY };
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
});

canvas.addEventListener('mouseleave', () => {
    isDragging = false;
});

// Touch support for mobile
canvas.addEventListener('touchstart', (e) => {
    isDragging = true;
    previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
});

canvas.addEventListener('touchmove', (e) => {
    if (!isDragging || !model) return;
    
    const deltaX = e.touches[0].clientX - previousMousePosition.x;
    const deltaY = e.touches[0].clientY - previousMousePosition.y;
    
    // Rotate Y axis (horizontal), clamp to -45 to 45 degrees
    targetRotationY += deltaX * 0.01;
    targetRotationY = Math.max(-maxRotationY, Math.min(maxRotationY, targetRotationY));
    model.rotation.y = targetRotationY;
    
    // Rotate X axis (vertical), clamp to -20 to 20 degrees
    targetRotationX += deltaY * 0.01;
    targetRotationX = Math.max(-maxRotationX, Math.min(maxRotationX, targetRotationX));
    model.rotation.x = targetRotationX;
    
    previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
});

canvas.addEventListener('touchend', () => {
    isDragging = false;
});

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();
