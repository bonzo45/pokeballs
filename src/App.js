import './App.css';
// import {Pokeball} from "./Pokeball";
import {Pokeballs} from "./Pokeballs";

function App() {
    // const pokeballs = [];
    // for (let i = 0; i < 898; i++) {
    //     pokeballs.push(<Pokeball key={i} index={i} />);
    // }
    return (
        <div className="App">
            <header className="App-header">
                {/*{pokeballs}*/}
                {<Pokeballs />}
            </header>
        </div>
      );
}

export default App;
