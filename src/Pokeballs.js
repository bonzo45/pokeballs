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
        var ctx = canvas.getContext("2d");

        var pokeballImg = document.getElementById("pokeball-img");
        var pokeballGreyscaleImg = document.getElementById("pokeball-greyscale-img");
        const numbles = 898;
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
        const pokeballWobbleDelay = 500000;

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
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < numbles; i++) {
                const row = Math.floor(i / columns);
                const column = i % columns;
                let currentSize;
                if (i < numGeneration1) {
                    currentSize = pokeballStates[i].currentPokeballSize;
                }
                else {
                    currentSize = pokeballStates[i].currentPokeballSize * 0.8;
                }

                ctx.save();
                // Crazy rotation...
                const adjustmentForRotation = (Math.PI * currentSize * (pokeballStates[i].rotation / 360));
                const getToCenterLeft = (column * pokeballSize) + (pokeballSize / 2) + adjustmentForRotation;
                const getToCenterTop = (row * pokeballSize) + (pokeballSize / 2);
                ctx.translate(getToCenterLeft, getToCenterTop);
                ctx.rotate(pokeballStates[i].rotation * Math.PI / 180)
                ctx.translate(-getToCenterLeft, -getToCenterTop);

                // Then draw it as normal...
                const left = getToCenterLeft - (currentSize / 2);
                const top = getToCenterTop - (currentSize / 2);
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
                        rotation: 25,
                    },
                    {
                        rotation: -25,
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
            update: function() {
                // ctx.clearRect(0, 0, canvas.width, canvas.height);
            },
            duration: pokeballAppearTime + pokeballAppearDelay,
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
