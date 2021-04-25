import './App.css';
import {Pokeball} from "./Pokeball";

function App() {
    const pokeballs = [];
    for (let i = 0; i < 898; i++) {
        pokeballs.push(<Pokeball key={i} index={i} />);
    }
    return (
        <div className="App">
            <header className="App-header">
                {pokeballs}
            </header>
        </div>
      );
}

export default App;
