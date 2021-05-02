import React, {useState, useEffect, useRef, useCallback} from 'react';
import anime from 'animejs';

const NUMBER_OF_POKEMON = 898;
const NUMBER_OF_POKEMON_PER_GENERATION = [151, 100, 135, 107, 156, 72, 88, 89];
const NUMBER_OF_POKEMON_PER_GENERATION_TOTAL = [];
let total = 0;
for (let numInGeneration of NUMBER_OF_POKEMON_PER_GENERATION) {
    total += numInGeneration;
    NUMBER_OF_POKEMON_PER_GENERATION_TOTAL.push(total);
}

const POKEBALL_ROTATION = 25;
const POKEBALL_APPEAR_TIME = 1000;
const POKEBALL_APPEAR_DELAY = 5000;
const POKEBALL_WOBBLE_TIME = 1000;
const POKEBALL_WOBBLE_DELAY = 400000;

const pokeballStates = [];
let highlightThreshold = NUMBER_OF_POKEMON_PER_GENERATION_TOTAL[0];
let forceRender = false;

export const Pokeballs = ({pokemonList}) => {
    const [imagesLoaded, setImagesLoaded] = useState(0);
    const [animating, setAnimating] = useState(false);
    const [selectedPokemon, setSelectedPokemon] = useState({pokemonNumber: 1, row: 1, column: 1});
    const [, setRows] = useState(0);
    const [columns, setColumns] = useState(0);
    const [pokeballSize, setPokeballSize] = useState(0);

    const canvasWrapperRef = useRef();
    const canvasRef = useRef();
    const ctxRef = useRef();
    const pokeballImgRef = useRef();
    const pokeballGreyscaleImgRef = useRef();

    // Measure the screen size to work out the number of rows, columns and size of the pokeballs.
    useEffect(() => {
        const canvasWidth = canvasWrapperRef.current.clientWidth;
        const canvasHeight = canvasWrapperRef.current.clientHeight;
        const aspectRatio = canvasWidth / canvasHeight;
        let _columns = Math.sqrt(NUMBER_OF_POKEMON * aspectRatio);
        let _rows = _columns / aspectRatio;
        _columns = Math.ceil(_columns);
        _rows = Math.ceil(_rows);
        setColumns(_columns);
        setRows(_rows);
        setPokeballSize(Math.min(canvasWidth / _columns, canvasHeight / _rows));

        canvasRef.current.width = canvasWidth;
        canvasRef.current.height = canvasHeight;
        canvasRef.current.style.width = canvasWidth + 'px';
        canvasRef.current.style.height = canvasHeight + 'px';
    }, [canvasWrapperRef, canvasRef])

    const renderPokeballs = useCallback(() => {
        for (let i = 0; i < NUMBER_OF_POKEMON; i++) {
            const row = Math.floor(i / columns);
            const column = i % columns;

            // Only bother re-rendering the ball if the size or rotation isn't in the end state.
            const pokeballState = pokeballStates[i];
            // alert(pokeballSize);
            if (pokeballState.currentPokeballSize === pokeballSize && pokeballState.rotation === 0 && !forceRender) {
                continue;
            }

            // Clear the part of the canvas that corresponds to this pokeball (and the space it can roll into).
            ctxRef.current.clearRect(
                column * pokeballSize,
                row * pokeballSize,
                pokeballSize + 2,
                pokeballSize + 2,
            );

            const scaledSize = pokeballState.currentPokeballSize * 0.80;

            ctxRef.current.save();
            // Crazy rotation...
            const adjustmentForRotation = (Math.PI * scaledSize * (pokeballState.rotation / 360));
            const halfPokeballSize = pokeballSize / 2;
            const getToCenterLeft = (column * pokeballSize) + halfPokeballSize + adjustmentForRotation;
            const getToCenterTop = (row * pokeballSize) + halfPokeballSize;
            ctxRef.current.translate(getToCenterLeft, getToCenterTop);
            ctxRef.current.rotate(pokeballState.rotation * Math.PI / 180)
            ctxRef.current.translate(-getToCenterLeft, -getToCenterTop);

            // Then draw it as normal...
            const halfCurrentSize = scaledSize / 2
            const left = getToCenterLeft - halfCurrentSize;
            const top = getToCenterTop - halfCurrentSize;
            const image = i < highlightThreshold ? pokeballImgRef.current : pokeballGreyscaleImgRef.current;
            ctxRef.current.drawImage(image, left, top, scaledSize, scaledSize);
            ctxRef.current.restore();
        }

        forceRender = false;
    }, [columns, pokeballSize]);

    const imageLoaded = () => {
        setImagesLoaded(imagesLoaded + 1);
    }

    useEffect(() => {
        if (imagesLoaded !== 2 || animating) {
            return;
        }
        setAnimating(true);

        for (let i = 0; i < NUMBER_OF_POKEMON; i++) {
            pokeballStates.push({
                currentPokeballSize: 0,
                rotation: 0,
            })
        }

        ctxRef.current = canvasRef.current.getContext('2d');

        anime.timeline({
            targets: pokeballStates,
            loop: true,
            update: renderPokeballs,
            duration: POKEBALL_APPEAR_TIME + POKEBALL_APPEAR_DELAY + POKEBALL_WOBBLE_TIME + POKEBALL_WOBBLE_DELAY,
        }).add({
            currentPokeballSize: pokeballSize,
            delay: function() { return anime.random(0, POKEBALL_APPEAR_DELAY); },
            duration: POKEBALL_APPEAR_TIME,
        }).add({
            keyframes: [
                {
                    rotation: 0,
                },
                {
                    rotation: POKEBALL_ROTATION,
                },
                {
                    rotation: -POKEBALL_ROTATION,
                },
                {
                    rotation: 0,
                },
            ],
            easing: 'cubicBezier(0.450, 0.010, 0.010, 1.000)',
            duration: POKEBALL_WOBBLE_TIME,
            delay: function() { return anime.random(0, POKEBALL_WOBBLE_DELAY); },
        });
    }, [imagesLoaded, animating, renderPokeballs, pokeballSize])

    const selectPokemon = (event) => {
        const row = Math.floor(event.pageY / pokeballSize) + 1;
        const column = Math.floor(event.pageX / pokeballSize) + 1;
        const pokemonNumber = (row - 1) * columns + column;
        if (pokemonNumber > NUMBER_OF_POKEMON) {
            return;
        }
        setSelectedPokemon({
            pokemonNumber,
            row,
            column,
        });
    }

    let pokemonToDisplay;
    const pokemonEntry = pokemonList[selectedPokemon.pokemonNumber - 1];
    if (pokemonEntry !== undefined) {
        pokemonToDisplay = (
            <div className="poke-popup" style={{left: (selectedPokemon.column - 1) * pokeballSize, top: (selectedPokemon.row) * pokeballSize }}>
                <h1>{pokemonEntry.name}</h1>
                <img src={pokemonEntry.imageName} alt={pokemonEntry.name} />
                <p>Type: {pokemonEntry.type}</p>
                <p>Weight: {pokemonEntry.weight}</p>
                <p>Height: {pokemonEntry.height}</p>
            </div>
        );
    }

    return (
        <div id="poke-wrapper">
            <div ref={canvasWrapperRef} id="poke-canvas-wrapper">
                <canvas ref={canvasRef} onClick={selectPokemon} id="poke-canvas"/>
            </div>
            <div id="poke-controls">
                <h1>Controls</h1>
                <form>
                    <label htmlFor="generation">Generation:</label><br/>
                    <input type="number" id="generation" name="generation" defaultValue="1" min="1" max="8" onChange={(event) => {
                        highlightThreshold = NUMBER_OF_POKEMON_PER_GENERATION_TOTAL[event.target.value - 1];
                        forceRender = true;
                    }} />
                </form>
                {pokemonToDisplay}
            </div>
            <img ref={pokeballImgRef} style={{display: 'none'}} onLoad={imageLoaded} id="pokeball-img" src="pokeball.svg" alt="" />
            <img ref={pokeballGreyscaleImgRef} style={{display: 'none'}} onLoad={imageLoaded} id="pokeball-greyscale-img" src="pokeball-greyscale.svg" alt="" />
        </div>
    );
}
