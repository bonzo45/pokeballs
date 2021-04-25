import { React } from 'react';
import anime from 'animejs';

export const Pokeballs = () => {
    let loaded = 0;
    const runStuff = () => {
        loaded++;
        if (loaded != 2) {
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
            })
        }
        const pokeballAppearTime = 1000;
        const pokeballRandomDelay = 2000;

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
                const currentSize = pokeballStates[i].currentPokeballSize;
                const left = (column * pokeballSize) + (pokeballSize / 2) - (currentSize / 2);
                const top = (row * pokeballSize) + (pokeballSize / 2) - (currentSize / 2);
                if (i < numGeneration1) {
                    ctx.drawImage(pokeballImg, left, top, currentSize, currentSize);
                }
                else {
                    ctx.drawImage(pokeballGreyscaleImg, left, top, currentSize, currentSize);
                }
            }
        }

        const animatePokeball = () => {
            anime.timeline().add({
                targets: pokeballStates,
                currentPokeballSize: pokeballSize,
                delay: function() { return anime.random(0, pokeballRandomDelay); },
                update: renderPokeballs,
                duration: pokeballAppearTime,
            });
        }

        const render = anime({
            update: function() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            },
            duration: pokeballAppearTime + pokeballRandomDelay,
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
