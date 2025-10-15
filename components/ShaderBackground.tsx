"use client"

import type React from "react"
import { useRef, useEffect, useCallback } from "react"

interface ShaderBackgroundProps {
  children: React.ReactNode
}

export default function ShaderBackground({ children }: ShaderBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const glRef = useRef<WebGL2RenderingContext | null>(null)
  const programRef = useRef<WebGLProgram | null>(null)
  const startTimeRef = useRef<number>(Date.now())

  const colors = useRef(
    Array.from({ length: 3 }, () => {
    const h = Math.floor(Math.random() * 360)
      const s = Math.floor(Math.random() * 41) + 60
      const l = Math.floor(Math.random() * 41) + 40
      return { h, s, l }
    })
  )
  
  const softness = useRef(Math.random() * 0.3 + 0.65)
  const intensity = useRef(Math.random() * 0.3 + 0.35)

  const hslToRgb = useCallback((h: number, s: number, l: number) => {
    let r: number, g: number, b: number

    if (s === 0) {
      r = g = b = l
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1/6) return p + (q - p) * 6 * t
        if (t < 1/2) return q
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
        return p
      }

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1/3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1/3)
    }

    return { r, g, b }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext("webgl2")
    if (!gl) return
    
    glRef.current = gl

    // Vertex shader
    const vertexShaderSource = `#version 300 es
    precision mediump float;

    layout(location = 0) in vec4 a_position;

    uniform vec2 u_resolution;
    uniform float u_pixelRatio;

    uniform float u_originX;
    uniform float u_originY;
    uniform float u_worldWidth;
    uniform float u_worldHeight;
    uniform float u_fit;

    uniform float u_scale;
    uniform float u_rotation;
    uniform float u_offsetX;
    uniform float u_offsetY;

    out vec2 v_objectUV;
    out vec2 v_objectBoxSize;

    out vec2 v_patternUV;
    out vec2 v_patternBoxSize;

    vec3 getBoxSize(float boxRatio, vec2 givenBoxSize) {
      vec2 box = vec2(0.);
      box.x = boxRatio * min(givenBoxSize.x / boxRatio, givenBoxSize.y);
      float noFitBoxWidth = box.x;
      if (u_fit == 1.) {
        box.x = boxRatio * min(u_resolution.x / boxRatio, u_resolution.y);
      } else if (u_fit == 2.) {
        box.x = boxRatio * max(u_resolution.x / boxRatio, u_resolution.y);
      }
      box.y = box.x / boxRatio;
      return vec3(box, noFitBoxWidth);
    }

    void main() {
      gl_Position = a_position;

      vec2 uv = gl_Position.xy * .5;
      vec2 boxOrigin = vec2(.5 - u_originX, u_originY - .5);
      vec2 givenBoxSize = vec2(u_worldWidth, u_worldHeight);
      givenBoxSize = max(givenBoxSize, vec2(1.)) * u_pixelRatio;
      float r = u_rotation * 3.14159265358979323846 / 180.;
      mat2 graphicRotation = mat2(cos(r), sin(r), -sin(r), cos(r));
      vec2 graphicOffset = vec2(-u_offsetX, u_offsetY);

      float fixedRatio = 1.;
      vec2 fixedRatioBoxGivenSize = vec2(
        (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
        (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
      );

      v_objectBoxSize = getBoxSize(fixedRatio, fixedRatioBoxGivenSize).xy;
      vec2 objectWorldScale = u_resolution.xy / v_objectBoxSize;

      v_objectUV = uv;
      v_objectUV *= objectWorldScale;
      v_objectUV += boxOrigin * (objectWorldScale - 1.);
      v_objectUV += graphicOffset;
      v_objectUV /= u_scale;
      v_objectUV = graphicRotation * v_objectUV;

      float patternBoxRatio = givenBoxSize.x / givenBoxSize.y;
      vec2 patternBoxGivenSize = vec2(
        (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
        (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
      );
      patternBoxRatio = patternBoxGivenSize.x / patternBoxGivenSize.y;

      vec3 boxSizeData = getBoxSize(patternBoxRatio, patternBoxGivenSize);
      v_patternBoxSize = boxSizeData.xy;
      float patternBoxNoFitBoxWidth = boxSizeData.z;
      vec2 patternBoxScale = u_resolution.xy / v_patternBoxSize;

      v_patternUV = uv;
      v_patternUV += graphicOffset / patternBoxScale;
      v_patternUV += boxOrigin;
      v_patternUV -= boxOrigin / patternBoxScale;
      v_patternUV *= u_resolution.xy;
      v_patternUV /= u_pixelRatio;
      if (u_fit > 0.) {
        v_patternUV *= (patternBoxNoFitBoxWidth / v_patternBoxSize.x);
      }
      v_patternUV /= u_scale;
      v_patternUV = graphicRotation * v_patternUV;
      v_patternUV += boxOrigin / patternBoxScale;
      v_patternUV -= boxOrigin;
      v_patternUV *= .01;
    }`

    // Fragment shader
    const fragmentShaderSource = `#version 300 es
    precision lowp float;

    uniform mediump float u_time;
    uniform mediump vec2 u_resolution;
    uniform mediump float u_pixelRatio;

    uniform sampler2D u_noiseTexture;

    uniform vec4 u_colorBack;
    uniform vec4 u_colors[7];
    uniform float u_colorsCount;
    uniform float u_softness;
    uniform float u_intensity;
    uniform float u_noise;
    uniform float u_shape;

    uniform mediump float u_originX;
    uniform mediump float u_originY;
    uniform mediump float u_worldWidth;
    uniform mediump float u_worldHeight;
    uniform mediump float u_fit;

    uniform mediump float u_scale;
    uniform mediump float u_rotation;
    uniform mediump float u_offsetX;
    uniform mediump float u_offsetY;

    in vec2 v_objectUV;
    in vec2 v_objectBoxSize;
    in vec2 v_patternUV;
    in vec2 v_patternBoxSize;

    out vec4 fragColor;

    #define TWO_PI 6.28318530718
    #define PI 3.14159265358979323846

    vec2 rotate(vec2 uv, float th) {
      return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
    }

    float hash21(vec2 p) {
      p = fract(p * vec2(0.3183099, 0.3678794)) + 0.1;
      p += dot(p, p + 19.19);
      return fract(p.x * p.y);
    }

    float hash11(float p) {
      p = fract(p * 0.3183099) + 0.1;
      p *= p + 19.19;
      return fract(p * p);
    }

    float randomR(vec2 p) {
      vec2 uv = floor(p) / 100. + .5;
      return texture(u_noiseTexture, fract(uv)).r;
    }

    vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
        -0.577350269189626, 0.024390243902439);
      vec2 i = floor(v + dot(v, C.yy));
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
        + i.x + vec3(0.0, i1.x, 1.0));
      vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
          dot(x12.zw, x12.zw)), 0.0);
      m = m * m;
      m = m * m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
      vec3 g;
      g.x = a0.x * x0.x + h.x * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    float valueNoiseR(vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);
      float a = randomR(i);
      float b = randomR(i + vec2(1.0, 0.0));
      float c = randomR(i + vec2(0.0, 1.0));
      float d = randomR(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      float x1 = mix(a, b, u.x);
      float x2 = mix(c, d, u.x);
      return mix(x1, x2, u.y);
    }

    float fbmR(vec2 n) {
      float total = 0.;
      float amplitude = .2;
      for (int i = 0; i < 3; i++) {
        n = rotate(n, .3);
        total += valueNoiseR(n) * amplitude;
        n *= 1.99;
        amplitude *= 0.6;
      }
      return total;
    }

    void main() {
      float t = .1 * u_time;

      vec2 shape_uv = vec2(0.);
      vec2 grain_uv = vec2(0.);

      if (u_shape > 3.5) {
        shape_uv = v_objectUV;
        grain_uv = shape_uv;

        float r = u_rotation * 3.14159265358979323846 / 180.;
        mat2 graphicRotation = mat2(cos(r), sin(r), -sin(r), cos(r));
        vec2 graphicOffset = vec2(-u_offsetX, u_offsetY);
        grain_uv = transpose(graphicRotation) * grain_uv;
        grain_uv *= u_scale;
        grain_uv -= graphicOffset;
        grain_uv *= v_objectBoxSize;
        grain_uv *= .7;
      } else {
        shape_uv = .5 * v_patternUV;
        grain_uv = 100. * v_patternUV;

        float r = u_rotation * 3.14159265358979323846 / 180.;
        mat2 graphicRotation = mat2(cos(r), sin(r), -sin(r), cos(r));
        vec2 graphicOffset = vec2(-u_offsetX, u_offsetY);
        grain_uv = transpose(graphicRotation) * grain_uv;
        grain_uv *= u_scale;
        if (u_fit > 0.) {
          vec2 givenBoxSize = vec2(u_worldWidth, u_worldHeight);
          givenBoxSize = max(givenBoxSize, vec2(1.)) * u_pixelRatio;
          float patternBoxRatio = givenBoxSize.x / givenBoxSize.y;
          vec2 patternBoxGivenSize = vec2(
            (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
            (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
          );
          patternBoxRatio = patternBoxGivenSize.x / patternBoxGivenSize.y;
          float patternBoxNoFitBoxWidth = patternBoxRatio * min(patternBoxGivenSize.x / patternBoxRatio, patternBoxGivenSize.y);
          grain_uv /= (patternBoxNoFitBoxWidth / v_patternBoxSize.x);
        }
        vec2 patternBoxScale = u_resolution.xy / v_patternBoxSize;
        grain_uv -= graphicOffset / patternBoxScale;
        grain_uv *= 1.6;
      }

      float shape = 0.;

      // Ripple shape (u_shape == 5)
      shape_uv *= 2.;
      float dist = length(.4 * shape_uv);
      float waves = sin(pow(dist, 1.2) * 5. - 3. * t) * .5 + .5;
      shape = waves;

      float simplex = snoise(grain_uv * .5);
      float grainDist = simplex * snoise(grain_uv * .2) - fbmR(.002 * grain_uv + 10.) - fbmR(.003 * grain_uv);
      float rawNoise = .75 * simplex - fbmR(rotate(.4 * grain_uv, 2.)) - fbmR(.001 * grain_uv);
      float noise = clamp(rawNoise, 0., 1.);

      shape += u_intensity * 2. / u_colorsCount * (grainDist + .5);
      shape += u_noise * 10. / u_colorsCount * noise;

      float aa = fwidth(shape);

      shape = clamp(shape - .5 / u_colorsCount, 0., 1.);
      float totalShape = smoothstep(0., u_softness + 2. * aa, clamp(shape * u_colorsCount, 0., 1.));
      float mixer = shape * (u_colorsCount - 1.);

      vec4 gradient = u_colors[0];
      gradient.rgb *= gradient.a;
      for (int i = 1; i < 7; i++) {
        if (i > int(u_colorsCount) - 1) break;

        float localT = clamp(mixer - float(i - 1), 0., 1.);
        localT = smoothstep(.5 - .5 * u_softness - aa, .5 + .5 * u_softness + aa, localT);

        vec4 c = u_colors[i];
        c.rgb *= c.a;
        gradient = mix(gradient, c, localT);
      }

      vec3 color = gradient.rgb * totalShape;
      float opacity = gradient.a * totalShape;

      vec3 bgColor = u_colorBack.rgb * u_colorBack.a;
      color = color + bgColor * (1.0 - opacity);
      opacity = opacity + u_colorBack.a * (1.0 - opacity);

      fragColor = vec4(color, opacity);
    }`

    // Create shader program
    function createShader(gl: WebGL2RenderingContext, type: number, source: string) {
      const shader = gl.createShader(type)
      if (!shader) return null
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return null
      }
      return shader
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
    
    if (!vertexShader || !fragmentShader) return

    const program = gl.createProgram()
    if (!program) return
    
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program))
      return
    }

    programRef.current = program

    // Create noise texture
    const noiseTexture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, noiseTexture)
    const noiseData = new Uint8Array(256 * 256 * 4)
    for (let i = 0; i < noiseData.length; i += 4) {
      noiseData[i] = Math.random() * 255
      noiseData[i + 1] = Math.random() * 255
      noiseData[i + 2] = Math.random() * 255
      noiseData[i + 3] = 255
    }
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 256, 256, 0, gl.RGBA, gl.UNSIGNED_BYTE, noiseData)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

    // Set up geometry
    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1])
    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)

    const positionLocation = gl.getAttribLocation(program, "a_position")
    gl.enableVertexAttribArray(positionLocation)
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

    // Render loop
    const render = () => {
      if (!gl || !program || !canvasRef.current || !canvas) return

      const rect = canvasRef.current.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      gl.viewport(0, 0, canvas.width, canvas.height)

      // biome-ignore lint/correctness/useHookAtTopLevel: gl.useProgram is WebGL API, not a React hook
      gl.useProgram(program)

      // Set uniforms
      const time = (Date.now() - startTimeRef.current) / 1000
      gl.uniform1f(gl.getUniformLocation(program, "u_time"), time)
      gl.uniform2f(gl.getUniformLocation(program, "u_resolution"), canvas.width, canvas.height)
      gl.uniform1f(gl.getUniformLocation(program, "u_pixelRatio"), window.devicePixelRatio)
      
      // Colors
      const colorArray = new Float32Array(28) // 7 colors * 4 components
      for (let i = 0; i < 3; i++) {
        const { h, s, l } = colors.current[i]
        const c = hslToRgb(h / 360, s / 100, l / 100)
        colorArray[i * 4] = c.r
        colorArray[i * 4 + 1] = c.g
        colorArray[i * 4 + 2] = c.b
        colorArray[i * 4 + 3] = 1.0
      }
      gl.uniform4fv(gl.getUniformLocation(program, "u_colors"), colorArray)
      gl.uniform1f(gl.getUniformLocation(program, "u_colorsCount"), 3)
      
      gl.uniform4f(gl.getUniformLocation(program, "u_colorBack"), 0, 0, 0, 1)
      gl.uniform1f(gl.getUniformLocation(program, "u_softness"), softness.current)
      gl.uniform1f(gl.getUniformLocation(program, "u_intensity"), intensity.current)
      gl.uniform1f(gl.getUniformLocation(program, "u_noise"), 0)
      gl.uniform1f(gl.getUniformLocation(program, "u_shape"), 5) // ripple
      
      gl.uniform1f(gl.getUniformLocation(program, "u_originX"), 0.5)
      gl.uniform1f(gl.getUniformLocation(program, "u_originY"), 0.5)
      gl.uniform1f(gl.getUniformLocation(program, "u_worldWidth"), 0)
      gl.uniform1f(gl.getUniformLocation(program, "u_worldHeight"), 0)
      gl.uniform1f(gl.getUniformLocation(program, "u_fit"), 0)
      gl.uniform1f(gl.getUniformLocation(program, "u_scale"), 1)
      gl.uniform1f(gl.getUniformLocation(program, "u_rotation"), 0)
      gl.uniform1f(gl.getUniformLocation(program, "u_offsetX"), 0)
      gl.uniform1f(gl.getUniformLocation(program, "u_offsetY"), 0)

      gl.uniform1i(gl.getUniformLocation(program, "u_noiseTexture"), 0)

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

      animationRef.current = requestAnimationFrame(render)
    }

    render()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [hslToRgb])

  return (
    <div ref={containerRef} className="h-[95vh]">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 -z-10 w-full h-full"
        style={{ width: "100%", height: "100%" }}
      />
      {children}
    </div>
  )
}
