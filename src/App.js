import './App.css';

// eslint-disable-next-line import/no-webpack-loader-syntax
import pokemonCSV from '!!csv-loader!./pokemon.csv';

import { Pokeballs } from "./Pokeballs";

const pokemonList = [];
let i = 1;
for (const row of pokemonCSV) {
    if (i !== 1) {
        const name = row[3] || "";
        pokemonList.push({
            name: name,
            imageName: `/pokemon/${name.toLowerCase().replace(/[^a-z]/gi, '')}.png`,
        })
    }
    i++;
}

function App() {
    return (
        <div className="App">
            <Pokeballs pokemonList={pokemonList}/>
        </div>
      );
}

export default App;
