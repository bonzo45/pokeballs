import { React } from 'react';
import anime from 'animejs';

export const Pokeballs = () => {
    let loaded = 0;
    const numbles = 898;
    const pokeballRotation = 25;
    const numInGenerations = [151, 100, 135, 107, 156, 72, 88, 89];
    const numInGenerationsTotal = [];
    let total = 0;
    for (let numInGeneration of numInGenerations) {
        total += numInGeneration;
        numInGenerationsTotal.push(total);
    }
    let highlightThreshold = numInGenerationsTotal[0];
    const pokeballAppearTime = 1000;
    const pokeballAppearDelay = 5000;
    const pokeballWobbleTime = 1000;
    const pokeballWobbleDelay = 400000;

    let canvas;
    let ctx;
    const pokeballStates = [];
    let pokeballImg;
    let pokeballGreyscaleImg;
    let pokeballSize;
    let rows = 0;
    let columns = 0;
    function setCanvasSize() {
        const canvasWidth = document.getElementById('poke-canvas-wrapper').clientWidth;
        const canvasHeight = document.getElementById('poke-canvas-wrapper').clientHeight;
        const aspectRatio = canvasWidth / canvasHeight;
        columns = Math.sqrt(numbles * aspectRatio);
        rows = columns / aspectRatio;
        columns = Math.ceil(columns);
        rows = Math.ceil(rows);
        pokeballSize = Math.min(canvasWidth / columns, canvasHeight / rows);

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.width = canvasWidth + 'px';
        canvas.style.height = canvasHeight + 'px';
    }

    const createRenderPokeballs = (alwaysRender = false) => () => {
        for (let i = 0; i < numbles; i++) {
            const row = Math.floor(i / columns);
            const column = i % columns;

            // Only bother re-rendering the ball if the size or rotation isn't in the end state.
            const pokeballState = pokeballStates[i];
            if (pokeballState.currentPokeballSize === pokeballSize && pokeballState.rotation === 0 && !alwaysRender) {
                continue;
            }

            // Clear the part of the canvas that corresponds to this pokeball (and the space it can roll into).
            ctx.clearRect(
                column * pokeballSize,
                row * pokeballSize,
                pokeballSize + 2,
                pokeballSize + 2,
            );

            const scaledSize = pokeballState.currentPokeballSize * 0.80;

            ctx.save();
            // Crazy rotation...
            const adjustmentForRotation = (Math.PI * scaledSize * (pokeballState.rotation / 360));
            const halfPokeballSize = pokeballSize / 2;
            const getToCenterLeft = (column * pokeballSize) + halfPokeballSize + adjustmentForRotation;
            const getToCenterTop = (row * pokeballSize) + halfPokeballSize;
            ctx.translate(getToCenterLeft, getToCenterTop);
            ctx.rotate(pokeballState.rotation * Math.PI / 180)
            ctx.translate(-getToCenterLeft, -getToCenterTop);

            // Then draw it as normal...
            const halfCurrentSize = scaledSize / 2
            const left = getToCenterLeft - halfCurrentSize;
            const top = getToCenterTop - halfCurrentSize;
            const image = i < highlightThreshold ? pokeballImg : pokeballGreyscaleImg;
            ctx.drawImage(image, left, top, scaledSize, scaledSize);
            ctx.restore();
        }
    }

    const animatePokeball = () => {
        anime.timeline({
            targets: pokeballStates,
            loop: true,
            update: createRenderPokeballs(),
        }).add({
            currentPokeballSize: pokeballSize,
            delay: function() { return anime.random(0, pokeballAppearDelay); },
            duration: pokeballAppearTime,
        }).add({
            keyframes: [
                {
                    rotation: 0,
                },
                {
                    rotation: pokeballRotation,
                },
                {
                    rotation: -pokeballRotation,
                },
                {
                    rotation: 0,
                },
            ],
            easing: 'cubicBezier(0.450, 0.010, 0.010, 1.000)',
            duration: pokeballWobbleTime,
            delay: function() { return anime.random(0, pokeballWobbleDelay); },
        });
    }

    const runStuff = () => {
        loaded++;
        if (loaded !== 2) {
            return;
        }

        for (let i = 0; i < numbles; i++) {
            pokeballStates.push({
                currentPokeballSize: 0,
                rotation: 0,
            })
        }

        canvas = document.getElementById("poke-canvas");
        ctx = canvas.getContext('2d');

        pokeballImg = document.getElementById("pokeball-img");
        pokeballGreyscaleImg = document.getElementById("pokeball-greyscale-img");


        const render = anime({
            duration: pokeballAppearTime + pokeballAppearDelay + pokeballWobbleTime + pokeballWobbleDelay,
        })

        setCanvasSize();
        render.play();
        animatePokeball();
    }

    return (
        <div id="poke-wrapper">
            <div id="poke-canvas-wrapper">
                <canvas id="poke-canvas"/>
            </div>
            <div id="poke-controls">
                <h1>Controls</h1>
                <form>
                    <label htmlFor="generation">Generation:</label><br/>
                    <input type="number" id="generation" name="generation" defaultValue="1" min="1" max="8" onChange={(event) => {
                        highlightThreshold = numInGenerationsTotal[event.target.value - 1];
                        createRenderPokeballs(true)();
                    }} />
                </form>
            </div>
            <img style={{display: 'none'}} onLoad={runStuff} id="pokeball-img" src="pokeball.svg" alt="" />
            <img style={{display: 'none'}} onLoad={runStuff} id="pokeball-greyscale-img" src="pokeball-greyscale.svg" alt="" />
        </div>
    );
}
