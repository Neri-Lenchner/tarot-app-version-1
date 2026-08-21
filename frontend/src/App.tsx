import React, {JSX, useEffect} from 'react';
import './App.css';
import Header from "./components/layout/header/Header";
import SideBar from "./components/layout/side-bar/SideBar";
import Routing from "./utils/Routing";
import {deckService} from "./services/DeckService";

function App(): JSX.Element {

    useEffect(() => {
        async function createTarotList(): Promise<void> {
            await deckService.getTarotDetails();
            console.log(deckService.tarotCardsDetails);
        }
        createTarotList();
    }, []);


  return (
    <div className="App">
      <header className="App-header">
        <Header />
      </header>
      <section>
          <aside className="side-bar">
              <SideBar />
          </aside>
          <main>
              <Routing />
          </main>
      </section>
    </div>
  );
}

export default App;
