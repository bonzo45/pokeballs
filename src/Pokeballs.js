import { React } from 'react';
import anime from 'animejs';

export const Pokeballs = () => {
    let loaded = 0;
    const runStuff = () => {
        loaded++;
        if (loaded !== 2) {
            return;
        }

        var canvas = document.getElementById("poke-canvas");
        var ctx = canvas.getContext('2d');

        var pokeballImg = document.getElementById("pokeball-img");
        var pokeballGreyscaleImg = document.getElementById("pokeball-greyscale-img");
        const numbles = 898;
        const pokeballRotation = 25;
        const numGeneration1 = 151;
        const pokeballStates = [];
        for (let i = 0; i < numbles; i++) {
            pokeballStates.push({
                currentPokeballSize: 0,
                rotation: 0,
            })
        }
        const pokeballAppearTime = 1000;
        const pokeballAppearDelay = 5000;
        const pokeballWobbleTime = 1000;
        const pokeballWobbleDelay = 200000;

        let pokeballSize;
        let rows = 0;
        let columns = 0;
        function setCanvasSize() {
            const aspectRatio = window.innerWidth / window.innerHeight;
            columns = Math.sqrt(numbles * aspectRatio);
            rows = columns / aspectRatio;
            columns = Math.ceil(columns);
            rows = Math.ceil(rows);
            pokeballSize = Math.min(window.innerWidth / columns, window.innerHeight / rows);

            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            canvas.style.width = window.innerWidth + 'px';
            canvas.style.height = window.innerHeight + 'px';
        }

        const renderPokeballs = () => {
            for (let i = 0; i < numbles; i++) {
                const row = Math.floor(i / columns);
                const column = i % columns;

                // Only bother re-rendering the ball if the size or rotation isn't in the end state.
                const pokeballState = pokeballStates[i];
                if (pokeballState.currentPokeballSize === pokeballSize && pokeballState.rotation === 0) {
                    continue;
                }

                let currentSize;
                if (i < numGeneration1) {
                    currentSize = pokeballState.currentPokeballSize * 0.80;
                }
                else {
                    currentSize = pokeballState.currentPokeballSize * 0.75;
                }

                // Clear the part of the canvas that corresponds to this pokeball (and the space it can roll into).
                const maxAdjustmentForRotation = (Math.PI * currentSize * (pokeballRotation / 360));
                ctx.clearRect(
                    (column * pokeballSize) - maxAdjustmentForRotation,
                    (row * pokeballSize) - maxAdjustmentForRotation,
                    pokeballSize + 2 * maxAdjustmentForRotation,
                    pokeballSize + 2 * maxAdjustmentForRotation
                );

                ctx.save();
                // Crazy rotation...
                const adjustmentForRotation = (Math.PI * currentSize * (pokeballState.rotation / 360));
                const halfPokeballSize = pokeballSize / 2;
                const getToCenterLeft = (column * pokeballSize) + halfPokeballSize + adjustmentForRotation;
                const getToCenterTop = (row * pokeballSize) + halfPokeballSize;
                ctx.translate(getToCenterLeft, getToCenterTop);
                ctx.rotate(pokeballState.rotation * Math.PI / 180)
                ctx.translate(-getToCenterLeft, -getToCenterTop);

                // Then draw it as normal...
                const halfCurrentSize = currentSize / 2
                const left = getToCenterLeft - halfCurrentSize;
                const top = getToCenterTop - halfCurrentSize;
                const image = i < numGeneration1 ? pokeballImg : pokeballGreyscaleImg;
                ctx.drawImage(image, left, top, currentSize, currentSize);
                ctx.restore();
            }
        }

        const animatePokeball = () => {
            anime.timeline().add({
                targets: pokeballStates,
                currentPokeballSize: pokeballSize,
                delay: function() { return anime.random(0, pokeballAppearDelay); },
                update: renderPokeballs,
                duration: pokeballAppearTime,
            }).add({
                targets: pokeballStates,
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
                loop: 3,
                update: renderPokeballs,
            });
        }

        const render = anime({
            // update: function() {
            //     ctx.clearRect(0, 0, canvas.width, canvas.height);
            // },
            duration: pokeballAppearTime + pokeballAppearDelay + pokeballWobbleTime + pokeballWobbleDelay,
        })

        setCanvasSize();
        render.play();
        animatePokeball();
    }

    return (
        <>
            <canvas id="poke-canvas"/>
            <img style={{display: 'none'}} onLoad={runStuff} id="pokeball-img" src="pokeball.svg" alt="" />
            <img style={{display: 'none'}} onLoad={runStuff} id="pokeball-greyscale-img" src="pokeball-greyscale.svg" alt="" />
        </>
    );
}
