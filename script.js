// Importing Three.js from CDN
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 50;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// UI Controls
const sizeSlider = document.getElementById("sizeSlider");
const velocitySlider = document.getElementById("velocitySlider");

// Particle System
const particles = [];
const particleCount = 200;

function createExplosion() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = 0;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = 0;

        velocities[i * 3] = (Math.random() - 0.5) * velocitySlider.value;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * velocitySlider.value;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * velocitySlider.value;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

    const material = new THREE.PointsMaterial({
        color: 0xffa500, 
        size: parseInt(sizeSlider.value),
        transparent: true,
        opacity: 1
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
    particles.push({ system: particleSystem, age: 0 });
}

function animate() {
    requestAnimationFrame(animate);

    particles.forEach((p, index) => {
        const positions = p.system.geometry.attributes.position.array;
        const velocities = p.system.geometry.attributes.velocity.array;
        
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] += velocities[i * 3]; 
            positions[i * 3 + 1] += velocities[i * 3 + 1] - 0.05; // Gravity
            positions[i * 3 + 2] += velocities[i * 3 + 2];

            velocities[i * 3 + 1] -= 0.02; // Simulate falling effect
        }

        p.system.geometry.attributes.position.needsUpdate = true;
        p.age += 0.02;

        if (p.age > 2) {
            scene.remove(p.system);
            particles.splice(index, 1);
        }
    });

    renderer.render(scene, camera);
}

// Automated explosions
setInterval(createExplosion, 1000);

animate();

// Resize Handling
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
