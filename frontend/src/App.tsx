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

    const [menuOpen, setMenuOpen] = useState(false);

    // Mobile nav auto-closes on route change (so tapping a link doesn't
    // leave the overlay open on the next page) and locks body scroll while open.
    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        document.body.classList.toggle('menu-open', menuOpen);
        return () => document.body.classList.remove('menu-open');
    }, [menuOpen]);

    useEffect(() => {
        if (!menuOpen) return;
        const handleClick = (e: MouseEvent): void => {
            const target = e.target as HTMLElement;
            if (!target.closest('.side-bar') && !target.closest('.header-menu-toggle')) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [menuOpen]);

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
        <Header showMenuToggle={!hideNav} menuOpen={menuOpen} onToggleMenu={() => setMenuOpen(o => !o)} />
      </header>
      <section>
          {!hideNav && (
              <aside className={`side-bar${menuOpen ? ' side-bar--open' : ''}`}>
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
