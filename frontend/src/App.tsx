import React, {JSX, useEffect} from 'react';
import {useLocation} from "react-router-dom";
import './App.css';
import Header from "./components/layout/header/Header";
import SideBar from "./components/layout/side-bar/SideBar";
import Routing from "./utils/Routing";
import {deckService} from "./services/DeckService";
import {useLang} from "./state/lang-state";

const NO_NAV_ROUTES = ['/login', '/register'];

function App(): JSX.Element {
    const location = useLocation();
    const hideNav = NO_NAV_ROUTES.includes(location.pathname);
    const lang = useLang();

    useEffect(() => {
        async function createTarotList(): Promise<void> {
            await deckService.getTarotDetails();
            console.log(deckService.tarotCardsDetails);
        }
        createTarotList();
    }, []);

    // Hebrew text renders visually smaller than Latin at the same rem size,
    // so bump the root font-size while Hebrew is active — every rem-sized
    // rule in the app scales up together instead of hand-editing each one.
    useEffect(() => {
        document.documentElement.setAttribute('data-lang', lang);
    }, [lang]);


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
