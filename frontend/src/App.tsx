import React, {JSX, useEffect} from 'react';
import {useLocation} from "react-router-dom";
import './App.css';
import Header from "./components/layout/header/Header";
import SideBar from "./components/layout/side-bar/SideBar";
import Routing from "./utils/Routing";
import {deckService} from "./services/DeckService";

const NO_NAV_ROUTES = ['/login', '/register'];

function App(): JSX.Element {
    const location = useLocation();
    const hideNav = NO_NAV_ROUTES.includes(location.pathname);

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
          {!hideNav && (
              <aside className="side-bar">
                  <SideBar />
              </aside>
          )}
          <main className={hideNav ? 'full-width' : ''}>
              <Routing />
          </main>
      </section>
    </div>
  );
}

export default App;
