import { React } from 'react';
import anime from 'animejs';

export const Pokeballs = () => {
    const runStuff = () => {
        var canvas = document.getElementById("poke-canvas");
        var ctx = canvas.getContext("2d");

        var img = document.getElementById("poke-img");
        // const numbles = 251;
        const numbles = 898;
        console.log(anime.stagger(10))
        let pokeballSize;
        var pokeballStates = [];
        for (let i = 0; i < numbles; i++) {
            pokeballStates.push({
                currentPokeballSize: 0,
            })
        }
        // const rows = 23;
        const columns = 39;

        function setCanvasSize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            canvas.style.width = window.innerWidth + 'px';
            canvas.style.height = window.innerHeight + 'px';
            pokeballSize = window.innerWidth / columns;
        }

        const renderPokeballs = () => {
            for (let i = 0; i < numbles; i++) {
                const row = Math.floor(i / columns);
                const column = i % columns;
                const currentSize = pokeballStates[i].currentPokeballSize;
                const left = (column * pokeballSize) + (pokeballSize / 2) - (currentSize / 2);
                const top = (row * pokeballSize) + (pokeballSize / 2) - (currentSize / 2);
                ctx.drawImage(img, left, top, currentSize, currentSize);
            }
        }

        const animatePokeball = () => {
            anime.timeline().add({
                targets: pokeballStates,
                currentPokeballSize: pokeballSize,
                delay: function() { return anime.random(0, 2000); },
                update: renderPokeballs,
                duration: 1000,
            });
        }

        const render = anime({
            update: function() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            },
        })

        setCanvasSize();
        render.play();
        animatePokeball();
    }
    return (
        <>
            <canvas id="poke-canvas"/>
            <img style={{display: 'none'}} onLoad={runStuff} id="poke-img" src="pokeball.svg" alt="" />
        </>
    );
}
