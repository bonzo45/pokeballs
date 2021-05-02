import './App.css';

// eslint-disable-next-line import/no-webpack-loader-syntax
import pokemonCSV from '!!csv-loader!./pokemon.csv';

import { Pokeballs } from "./Pokeballs";

const pokemonList = [];
let i = 0;
const seen = new Set();
for (const row of pokemonCSV) {
    i++;
    if (i === 1) {
        continue;
    }
    const number = row[0];
    if (seen.has(number)) {
        continue
    }
    seen.add(number);
    const name = row[3] || "";
    pokemonList.push({
        name: name,
        imageName: `/pokemon/${name.toLowerCase().replace(/\s/gi, '-').replace(/[^a-z-]/gi, '')}.png`,
        type: row[4] || "",
        weight: row[14],
        height: row[15],
    })
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
