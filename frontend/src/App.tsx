import React, {JSX, useEffect, useState} from 'react';
import {useLocation} from "react-router-dom";
import './App.css';
import Header from "./components/layout/header/Header";
import SideBar from "./components/layout/side-bar/SideBar";
import Routing from "./utils/Routing";
import {deckService} from "./services/DeckService";
import {useLang} from "./state/lang-state";
import {authStore} from "./state/auth-state";
import {IAuthUser} from "./arrays-&-models/authUser.interface";

// Login/Register always hide the sidebar (pure auth forms). Home only hides
// it while logged out — the "gated landing page" behavior shouldn't persist
// once there's a session, or a logged-in user landing on "/" would have no
// way to navigate anywhere else.
const ALWAYS_NO_NAV_ROUTES = ['/login', '/register'];

function App(): JSX.Element {
    const location = useLocation();
    const lang = useLang();
    const [user, setUser] = useState<IAuthUser | null>(authStore.getState().user);

    useEffect(() => {
        const unsubscribe = authStore.subscribe(() => {
            setUser(authStore.getState().user);
        });
        return unsubscribe;
    }, []);

    const hideNav = ALWAYS_NO_NAV_ROUTES.includes(location.pathname) || (location.pathname === '/' && !user);

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
