import {JSX} from "react";
import {Route, Routes} from "react-router-dom";
import {HomePage} from "../components/home-route/HomePage";
import {TarotDeck} from "../components/tarot-deck-route/tarot-deck/TarotDeck";
import './Routing.css';
import {TarotDeckRoute} from "../components/tarot-deck-route/TarotDeckRoute";
import {CelticSpreadRoute} from "../components/celtic-spread-route/CelticSpreadRoute";
import {
    ThreeCardsSpreadRoute
} from "../components/three-cards-spread-route/ThreeCardsSpreadRoute";
import {MasterSpreadRoute} from "../components/master-spread-route/MasterSpreadRoute";
import Register from "../components/auth/Register";
import Login from "../components/auth/Login";
import MySpreadsPage from "../components/my-spreads/MySpreadsPage";
import SpreadDetailsPage from "../components/my-spreads/SpreadDetailsPage";
import PrivateRoute from "./PrivateRoute";
import SpreadInfoPage from "../components/spread-info-route/SpreadInfoPage";
import Footer from "../components/layout/footer/Footer";
import AboutPage from "../components/legal-route/AboutPage";
import TermsPage from "../components/legal-route/TermsPage";
import PrivacyPage from "../components/legal-route/PrivacyPage";

function Routing(): JSX.Element {
    return (
        <div className="routing-container">
            <Routes>
                <Route path="/tarot-deck" element={<PrivateRoute child={<TarotDeckRoute />} />}/>
                <Route path="/celtic-spread-global" element={<PrivateRoute child={<CelticSpreadRoute />} />}/>
                <Route path="/three-cards-spread" element={<PrivateRoute child={<ThreeCardsSpreadRoute />} />}/>
                <Route path="/master-spread" element={<PrivateRoute child={<MasterSpreadRoute />} />}/>
                <Route path="/spread-info/:spreadKey" element={<SpreadInfoPage />}/>
                <Route path="/about" element={<AboutPage />}/>
                <Route path="/terms" element={<TermsPage />}/>
                <Route path="/privacy" element={<PrivacyPage />}/>
                <Route path="/register" element={<Register />}/>
                <Route path="/login" element={<Login />}/>
                <Route path="/my-spreads" element={<PrivateRoute child={<MySpreadsPage />} />}/>
                <Route path="/my-spreads/:id" element={<PrivateRoute child={<SpreadDetailsPage />} />}/>
                <Route path="*" element={<HomePage />}/>
                <Route path="/" element={<HomePage />}/>
            </Routes>
            <Footer />
        </div>
    );
}

//  <Route path="/new-course" element={<CourseForm />}/>
//             <Route path="/courses-list" element={<CourseListRoute />}/>
//             {/*<Route path="/task-details/:id" element={<TaskDetails />}/>*/}
//             <Route path="/" element={<HomePage />}/>
//             <Route path="*" element={<HomePage />}/>

export default Routing;
