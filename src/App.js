import './styles/App.css';
import React, {useState} from 'react';
import Header from './components/Header';
import BusTable from './components/BusTable';
import Menu from "./components/Menu";
import { useUser } from './components/UserContext';
import Filter from "./components/Filter";
import BusLoadingScreen from "./components/BusLoadingScreen";

const App = () => {
    const { user, setUser, loading } = useUser();

    const [query, setQuery] = useState({});

    return (
        <div>
            <Header user={ user } setUser={ setUser } />
            <main>
                <div>
                    <BusLoadingScreen loading={ loading } />

                    {
                        user ? (
                            <>
                                <div className="main-heading">
                                    <p>Salut, {user.email}!</p>
                                    <div className="main-actions">
                                        <Filter setQuery={ setQuery } />
                                        <Menu setQuery={ setQuery } />
                                    </div>
                                </div>
                                <div className="main-content">
                                    <BusTable setQuery={ setQuery } query={ query } />
                                </div>
                            </>
                        ) : (
                            <div>
                                <p>Pentru a vizualiza datele, trebuie să vă autentificați.</p>
                            </div>
                        )
                    }
                </div>
            </main>
        </div>
    );
};

export default App;
