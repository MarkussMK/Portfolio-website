// Three.js Shader Background with Custom Animation
class CustomScene {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.geometry = null;
        this.light = null;
        this.material = null;
        this.mesh = null;
        this.renderer = null;
        this.clock = null;
        this.canvas = null;
    }

    init(canvas) {
        this.canvas = canvas;
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
        this.light = new THREE.SpotLight(0xffffff, 1);

        const fov = 45;
        const aspect = window.innerWidth / window.innerHeight;
        const near = 1;
        const far = 100;
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.geometry = new THREE.PlaneGeometry(30, 10);
        this.material = new THREE.ShaderMaterial({
            vertexShader: `
precision mediump float;
varying vec2 vUv;
                     
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,
            fragmentShader: `
#ifdef GL_ES
precision highp float;
#endif

#define PI2 6.28318530718
#define MAX_ITER 5

uniform float uTime;
uniform vec2 uResolution;
uniform float spectrum;

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    float time = uTime * .12;
    vec2 uv = fragCoord.xy / uResolution.xy;

    vec2 p = mod(uv * PI2, PI2) - 100.0;
    vec2 i = vec2(p);
    float c = 0.5;
    float inten = .0094;

    for (int n = 0; n < MAX_ITER; n++) {
        float t = time * (4.5 - (2.2 / float(n + 122)));
        i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
        c += 1.0 / length(vec2(p.x / (sin(i.x + t) / inten + spectrum), p.y / (cos(i.y + t) / inten)));
    }

    c /= float(MAX_ITER);
    c = 1.10-pow(c, 1.26);
    // Darker theme: more subtle patterns
    vec3 colour = vec3(c * 0.08, c * 0.08, c * 0.10);

    fragColor = vec4(colour, 1.0);
}

void main( void ) {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}`,
            uniforms: {
                uTime: { value: 0.0 },
                uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
                uMouse: { value: new THREE.Vector2(0, 0) },
                uColor: { value: new THREE.Color(0xffffff) },
                spectrum: { value: 0.0 }
            }
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true
        });
        this.renderer.setClearColor(0x000000, 1);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.scene.add(this.camera);
        this.scene.add(this.mesh);
        this.scene.add(this.light);
        this.mesh.position.set(0, 0, 0);
        this.camera.position.set(0, 0, 10);
        this.light.position.set(0, 0, 10);

        this.light.lookAt(this.mesh.position);
        this.camera.lookAt(this.mesh.position);

        this.clock = new THREE.Clock();

        this.addEvents();
    }

    run() {
        window.requestAnimationFrame(this.run.bind(this));
        this.material.uniforms.uTime.value = this.clock.getElapsedTime();
        this.renderer.render(this.scene, this.camera);
    }

    addEvents() {
        window.addEventListener("resize", this.onResize.bind(this), false);
    }

    onResize() {
        this.material.uniforms.uResolution.value = new THREE.Vector2(window.innerWidth, window.innerHeight);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Wait for Three.js to load before initializing
function initializeScene() {
    if (typeof THREE === 'undefined') {
        console.error('Three.js is not loaded');
        return;
    }

    // Create canvas
    let canvas = document.getElementById('shader-background');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'shader-background';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '-1';
        canvas.style.pointerEvents = 'none';
        document.body.insertBefore(canvas, document.body.firstChild);
    }

    const scene = new CustomScene();
    scene.init(canvas);
    scene.run();
}

// Initialize when DOM and Three.js are ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeScene);
} else {
    initializeScene();
}
