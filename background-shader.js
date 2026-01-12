// Dynamic Shader Background that responds to XP progression
class ShaderBackground {
    constructor() {
        this.canvas = null;
        this.gl = null;
        this.program = null;
        this.currentXP = 0;
        this.maxXP = 160; // Max XP across all levels
        this.animationFrame = null;
        this.startTime = Date.now();
        this.init();
    }

    init() {
        // Create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'shader-background';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.pointerEvents = 'none';
        document.body.insertBefore(this.canvas, document.body.firstChild);

        // Get WebGL context
        this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
        
        if (!this.gl) {
            console.warn('WebGL not supported, falling back to CSS animation');
            this.fallbackToCSS();
            return;
        }

        // Set canvas size
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Initialize shaders
        this.setupShaders();
        
        // Start animation
        this.animate();

        // Update XP from progression system
        this.updateFromProgressionSystem();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        if (this.gl) {
            this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    setupShaders() {
        const vertexShaderSource = `
            attribute vec2 a_position;
            void main() {
                gl_Position = vec4(a_position, 0.0, 1.0);
            }
        `;

        const fragmentShaderSource = `
            precision mediump float;
            uniform vec2 u_resolution;
            uniform float u_time;
            uniform float u_xp_progress; // 0.0 to 1.0 based on XP
            
            // Rotation matrix
            mat2 rotate(float a) {
                float s = sin(a);
                float c = cos(a);
                return mat2(c, -s, s, c);
            }
            
            // Distance to a line segment
            float sdSegment(vec2 p, vec2 a, vec2 b) {
                vec2 pa = p - a;
                vec2 ba = b - a;
                float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
                return length(pa - ba * h);
            }
            
            // Draw DNA helix strand
            float drawDNA(vec2 p, float time, float xpProgress) {
                float dna = 0.0;
                
                // Scale starts larger
                // At xpProgress = 0 (Intern): scale = 1.5
                // At xpProgress = 1.0 (Max): scale = 3.0
                float scale = 1.5 + xpProgress * 1.5;
                p *= scale;
                
                // Smooth rotation speed curve for gradual acceleration
                float smoothXP = smoothstep(0.0, 1.0, xpProgress);
                smoothXP = smoothXP * smoothXP; // Quadratic easing for even smoother feel
                
                // Rotation speed starts faster
                // At xpProgress = 0 (Intern): rotSpeed = 0.3
                // At xpProgress = 1.0 (Max): rotSpeed = 1.5
                float rotSpeed = 0.3 + smoothXP * 1.2;
                float angle = time * rotSpeed;
                
                // Number of base pairs increases with XP
                float pairs = 8.0 + xpProgress * 12.0;
                
                // Helix parameters
                float helixRadius = 0.15;
                float helixHeight = 10.0; // Increased height to cover full viewport
                float twists = 2.0 + xpProgress * 2.0;
                
                // Draw the two strands of the helix
                for(float i = 0.0; i < 20.0; i += 1.0) {
                    if(i >= pairs) break;
                    
                    float t = i / pairs;
                    float y = t * helixHeight - helixHeight * 0.5; // Start from top, extend to bottom
                    float phase = t * twists * 6.28318 + angle;
                    
                    // Strand 1
                    float x1 = cos(phase) * helixRadius;
                    float z1 = sin(phase) * helixRadius;
                    
                    // Strand 2 (opposite)
                    float x2 = cos(phase + 3.14159) * helixRadius;
                    float z2 = sin(phase + 3.14159) * helixRadius;
                    
                    // Project 3D to 2D
                    vec2 pos1 = vec2(x1 * (1.0 - z1 * 0.3), y);
                    vec2 pos2 = vec2(x2 * (1.0 - z2 * 0.3), y);
                    
                    // Distance to strands
                    float d1 = length(p - pos1) - 0.03;
                    float d2 = length(p - pos2) - 0.03;
                    
                    // Brightness based on depth
                    float brightness1 = 0.5 + z1 * 0.5;
                    float brightness2 = 0.5 + z2 * 0.5;
                    
                    // Add glowing spheres for nucleotides
                    dna += (1.0 - smoothstep(0.0, 0.08, d1)) * brightness1;
                    dna += (1.0 - smoothstep(0.0, 0.08, d2)) * brightness2;
                    
                    // Connect base pairs when they're close to each other
                    if(abs(z1) < 0.3 && abs(z2) < 0.3) {
                        float connection = sdSegment(p, pos1, pos2);
                        dna += (1.0 - smoothstep(0.0, 0.02, connection)) * 0.3;
                    }
                }
                
                // Add connecting line between sequential nucleotides
                for(float i = 0.0; i < 19.0; i += 1.0) {
                    if(i >= pairs - 1.0) break;
                    
                    float t1 = i / pairs;
                    float t2 = (i + 1.0) / pairs;
                    
                    float y1 = (t1 - 0.5) * helixHeight;
                    float y2 = (t2 - 0.5) * helixHeight;
                    
                    float phase1 = t1 * twists * 6.28318 + angle;
                    float phase2 = t2 * twists * 6.28318 + angle;
                    
                    // Strand 1 connections
                    float x1a = cos(phase1) * helixRadius;
                    float z1a = sin(phase1) * helixRadius;
                    float x1b = cos(phase2) * helixRadius;
                    float z1b = sin(phase2) * helixRadius;
                    
                    vec2 pos1a = vec2(x1a * (1.0 - z1a * 0.3), y1);
                    vec2 pos1b = vec2(x1b * (1.0 - z1b * 0.3), y2);
                    
                    float conn1 = sdSegment(p, pos1a, pos1b);
                    dna += (1.0 - smoothstep(0.0, 0.015, conn1)) * 0.2;
                    
                    // Strand 2 connections
                    float x2a = cos(phase1 + 3.14159) * helixRadius;
                    float z2a = sin(phase1 + 3.14159) * helixRadius;
                    float x2b = cos(phase2 + 3.14159) * helixRadius;
                    float z2b = sin(phase2 + 3.14159) * helixRadius;
                    
                    vec2 pos2a = vec2(x2a * (1.0 - z2a * 0.3), y1);
                    vec2 pos2b = vec2(x2b * (1.0 - z2b * 0.3), y2);
                    
                    float conn2 = sdSegment(p, pos2a, pos2b);
                    dna += (1.0 - smoothstep(0.0, 0.015, conn2)) * 0.2;
                }
                
                return clamp(dna, 0.0, 1.0);
            }
            
            void main() {
                vec2 uv = gl_FragCoord.xy / u_resolution;
                vec2 p = (uv * 2.0 - 1.0);
                p.x *= u_resolution.x / u_resolution.y;
                
                // Base dark color
                vec3 bgColor = vec3(0.02, 0.02, 0.02);
                vec3 color = bgColor;
                
                float time = u_time * 0.5;
                
                // DNA strand on the left side
                vec2 pLeft = p;
                pLeft.x += 1.5; // Position to the left
                float dnaLeft = drawDNA(pLeft, time, u_xp_progress);
                
                // DNA strand on the right side
                vec2 pRight = p;
                pRight.x -= 1.5; // Position to the right
                float dnaRight = drawDNA(pRight, time, u_xp_progress);
                
                // Color progression with XP
                vec3 dnaColorLow = vec3(0.5, 0.5, 0.5); // Gray-white
                vec3 dnaColorMid = vec3(0.8, 0.8, 0.8); // Bright white
                vec3 dnaColorHigh = vec3(1.0, 1.0, 1.0); // Pure white
                
                vec3 dnaColor;
                if (u_xp_progress < 0.5) {
                    dnaColor = mix(dnaColorLow, dnaColorMid, u_xp_progress * 2.0);
                } else {
                    dnaColor = mix(dnaColorMid, dnaColorHigh, (u_xp_progress - 0.5) * 2.0);
                }
                
                // Apply DNA strands to both sides
                color = mix(color, dnaColor, dnaLeft);
                color = mix(color, dnaColor, dnaRight);
                
                // Add glow effect at high XP
                if (u_xp_progress > 0.7) {
                    float glowLeft = dnaLeft * 0.3 * (u_xp_progress - 0.7) * 3.0;
                    float glowRight = dnaRight * 0.3 * (u_xp_progress - 0.7) * 3.0;
                    color += vec3(glowLeft + glowRight) * dnaColor * 0.5;
                }
                
                gl_FragColor = vec4(color, 1.0);
            }
        `;

        // Compile shaders
        const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);

        // Create program
        this.program = this.gl.createProgram();
        this.gl.attachShader(this.program, vertexShader);
        this.gl.attachShader(this.program, fragmentShader);
        this.gl.linkProgram(this.program);

        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            console.error('Unable to initialize shader program:', this.gl.getProgramInfoLog(this.program));
            return;
        }

        // Setup geometry
        const positions = new Float32Array([
            -1, -1,
             1, -1,
            -1,  1,
             1,  1,
        ]);

        const positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);

        const positionLocation = this.gl.getAttribLocation(this.program, 'a_position');
        this.gl.enableVertexAttribArray(positionLocation);
        this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);

        // Get uniform locations
        this.uniforms = {
            resolution: this.gl.getUniformLocation(this.program, 'u_resolution'),
            time: this.gl.getUniformLocation(this.program, 'u_time'),
            xpProgress: this.gl.getUniformLocation(this.program, 'u_xp_progress')
        };
    }

    createShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error('Shader compile error:', this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    updateFromProgressionSystem() {
        // Listen for XP updates
        const updateXP = () => {
            if (typeof getProgressionState === 'function') {
                const state = getProgressionState();
                this.currentXP = state.totalXP || 0;
            }
        };

        updateXP();
        // Update periodically
        setInterval(updateXP, 500);
    }

    animate() {
        if (!this.gl || !this.program) return;

        const time = (Date.now() - this.startTime) / 1000;
        const xpProgress = Math.min(this.currentXP / this.maxXP, 1.0);

        this.gl.useProgram(this.program);
        this.gl.uniform2f(this.uniforms.resolution, this.canvas.width, this.canvas.height);
        this.gl.uniform1f(this.uniforms.time, time);
        this.gl.uniform1f(this.uniforms.xpProgress, xpProgress);

        this.gl.clearColor(0.02, 0.02, 0.02, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

        this.animationFrame = requestAnimationFrame(() => this.animate());
    }

    fallbackToCSS() {
        // CSS-only animated background if WebGL is not available
        this.canvas.remove();
        const style = document.createElement('style');
        style.textContent = `
            @keyframes dnaRotate {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            @keyframes dnaGrow {
                0%, 100% { transform: scaleY(0.8); }
                50% { transform: scaleY(1.2); }
            }
            
            body::before,
            body::after {
                content: '';
                position: fixed;
                width: 100px;
                height: 100%;
                top: 0;
                z-index: -1;
                background: repeating-linear-gradient(
                    0deg,
                    transparent,
                    transparent 20px,
                    rgba(20, 100, 150, 0.3) 20px,
                    rgba(20, 100, 150, 0.3) 22px
                );
                animation: dnaRotate 30s linear infinite, dnaGrow 8s ease-in-out infinite;
            }
            
            body::before {
                left: 5%;
                animation-delay: 0s;
            }
            
            body::after {
                right: 5%;
                animation-delay: 1s;
            }
        `;
        document.head.appendChild(style);
    }

    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        if (this.canvas) {
            this.canvas.remove();
        }
    }
}

// Initialize shader background when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.shaderBackground = new ShaderBackground();
    });
} else {
    window.shaderBackground = new ShaderBackground();
}
