import {JSX} from "react";
import {Route, Routes} from "react-router-dom";
import Main from "../components/layout/main/Main";
import {TarotDeck} from "../components/tarot-deck-route/tarot-deck/TarotDeck";
import './Routing.css';
import {TarotDeckRoute} from "../components/tarot-deck-route/TarotDeckRoute";
import {CelticSpreadRoute} from "../components/celtic-spread-route/CelticSpreadRoute";
import {
    ThreeCardsSpreadRoute
} from "../components/three-cards-spread-route/ThreeCardsSpreadRoute";

function Routing(): JSX.Element {
    return (
        <div className="routing-container">
            <Routes>
                <Route path="/tarot-deck" element={<TarotDeckRoute />}/>
                <Route path="/celtic-spread-global" element={<CelticSpreadRoute />}/>
                <Route path="/three-cards-spread" element={<ThreeCardsSpreadRoute />}/>
                <Route path="*" element={<Main />}/>
                <Route path="/" element={<Main />}/>
            </Routes>
        </div>
    );
}

//  <Route path="/new-course" element={<CourseForm />}/>
//             <Route path="/courses-list" element={<CourseListRoute />}/>
//             {/*<Route path="/task-details/:id" element={<TaskDetails />}/>*/}
//             <Route path="/" element={<Main />}/>
//             <Route path="*" element={<Main />}/>

export default Routing;
