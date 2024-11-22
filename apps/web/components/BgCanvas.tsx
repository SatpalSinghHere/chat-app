'use client'
import React from 'react'
import * as SimplexNoise from 'simplex-noise'
import * as dat from 'dat.gui';
import Head from 'next/head';

declare module 'simplex-noise' {
    export default class SimplexNoise {
        constructor(seed?: string | number);
        noise2D(x: number, y: number): number;
        noise3D(x: number, y: number, z: number): number;
        noise4D(x: number, y: number, z: number, w: number): number;
    }
}


const BgCanvas = () => {
    /**
 * requestAnimationFrame
 */
    window.requestAnimationFrame = (function () {
        return window.requestAnimationFrame ||
            // window.webkitRequestAnimationFrame ||
            // window.mozRequestAnimationFrame ||
            // window.oRequestAnimationFrame ||
            // window.msRequestAnimationFrame ||
            function (callback: FrameRequestCallback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    // Configs

    interface Config {
        backgroundColor: string;
        particleNum: number;
        step: number;
        base: number;
        zInc: number;
    }

    const Configs: Config = {
        backgroundColor: '#eee9e9',
        particleNum: 1000,
        step: 5,
        base: 1000,
        zInc: 0.001
    };

    // Vars

    let canvas: HTMLCanvasElement;
    let context: CanvasRenderingContext2D;
    let screenWidth: number;
    let screenHeight: number;
    let centerX: number;
    let centerY: number;
    let particles: Particle[] = [];
    let hueBase = 0;
    let simplexNoise: any;
    let zoff = 0;
    let gui: dat.GUI;

    // Initialize

    function init() {
        canvas = document.getElementById('c') as HTMLCanvasElement;

        window.addEventListener('resize', onWindowResize, false);
        onWindowResize(null);

        for (let i = 0, len = Configs.particleNum; i < len; i++) {
            initParticle((particles[i] = new Particle()));
        }

        simplexNoise = new simplexNoise();

        canvas.addEventListener('click', onCanvasClick, false);

        gui = new dat.GUI();
        gui.add(Configs, 'step', 1, 10);
        gui.add(Configs, 'base', 500, 3000);
        gui.add(Configs, 'zInc', 0.0001, 0.01);
        gui.close();

        update();
    }

    // Event listeners

    function onWindowResize(e: Event | null) {
        screenWidth = canvas.width = window.innerWidth;
        screenHeight = canvas.height = window.innerHeight;

        centerX = screenWidth / 2;
        centerY = screenHeight / 2;

        context = canvas.getContext('2d')!;
        context.lineWidth = 0.3;
        context.lineCap = context.lineJoin = 'round';
    }

    function onCanvasClick(e: MouseEvent) {
        context.save();
        context.globalAlpha = 0.8;
        context.fillStyle = Configs.backgroundColor;
        context.fillRect(0, 0, screenWidth, screenHeight);
        context.restore();

        simplexNoise = new SimplexNoise();
    }

    // Functions

    function getNoise(x: number, y: number, z: number): number {
        const octaves = 4;
        const fallout = 0.5;
        let amp = 1;
        let f = 1;
        let sum = 0;

        for (let i = 0; i < octaves; ++i) {
            amp *= fallout;
            sum += amp * (simplexNoise.noise3D(x * f, y * f, z * f) + 1) * 0.5;
            f *= 2;
        }

        return sum;
    }

    function initParticle(p: Particle) {
        p.x = p.pastX = screenWidth * Math.random();
        p.y = p.pastY = screenHeight * Math.random();
        p.color.h = hueBase + Math.atan2(centerY - p.y, centerX - p.x) * 180 / Math.PI;
        p.color.s = 1;
        p.color.l = 0.5;
        p.color.a = 0;
    }

    // Update

    function update() {
        const step = Configs.step;
        const base = Configs.base;

        for (let i = 0, len = particles.length; i < len; i++) {
            const p = particles[i];
            if (p) {
                p.pastX = p.x;
                p.pastY = p.y;

                const angle = Math.PI * 6 * getNoise(p.x / base * 1.75, p.y / base * 1.75, zoff);
                p.x += Math.cos(angle) * step;
                p.y += Math.sin(angle) * step;

                if (p.color.a < 1) p.color.a += 0.003;

                context.beginPath();
                context.strokeStyle = p.color.toString();
                context.moveTo(p.pastX, p.pastY);
                context.lineTo(p.x, p.y);
                context.stroke();

                if (p.x < 0 || p.x > screenWidth || p.y < 0 || p.y > screenHeight) {
                    initParticle(p);
                }
            }
        }

        hueBase += 0.1;
        zoff += Configs.zInc;

        requestAnimationFrame(update);
    }

    /**
     * HSLA
     */
    class HSLA {
        constructor(
            public h: number = 0,
            public s: number = 0,
            public l: number = 0,
            public a: number = 0
        ) { }

        toString(): string {
            return `hsla(${this.h},${this.s * 100}%,${this.l * 100}%,${this.a})`;
        }
    }

    /**
     * Particle
     */
    class Particle {
        pastX: number;
        pastY: number;

        constructor(
            public x: number = 0,
            public y: number = 0,
            public color: HSLA = new HSLA()
        ) {
            this.pastX = this.x;
            this.pastY = this.y;
        }
    }


    return (
        <div>
            <Head>
            <script src="https://cdn.jsdelivr.net/npm/simplex-noise@4.0.3/dist/cjs/simplex-noise.min.js"></script>
            </Head>
            <canvas id='c'></canvas>
        </div>
    )
}

export default BgCanvas
