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
import Register from "../components/auth/Register";
import Login from "../components/auth/Login";
import MySpreadsPage from "../components/my-spreads/MySpreadsPage";
import SpreadDetailsPage from "../components/my-spreads/SpreadDetailsPage";
import PrivateRoute from "./PrivateRoute";

function Routing(): JSX.Element {
    return (
        <div className="routing-container">
            <Routes>
                <Route path="/tarot-deck" element={<PrivateRoute child={<TarotDeckRoute />} />}/>
                <Route path="/celtic-spread-global" element={<PrivateRoute child={<CelticSpreadRoute />} />}/>
                <Route path="/three-cards-spread" element={<PrivateRoute child={<ThreeCardsSpreadRoute />} />}/>
                <Route path="/register" element={<Register />}/>
                <Route path="/login" element={<Login />}/>
                <Route path="/my-spreads" element={<PrivateRoute child={<MySpreadsPage />} />}/>
                <Route path="/my-spreads/:id" element={<PrivateRoute child={<SpreadDetailsPage />} />}/>
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
