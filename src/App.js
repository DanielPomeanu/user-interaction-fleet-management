import './styles/App.css';
import React, {useEffect, useState} from 'react';
import Header from './components/Header';
import BusTable from './components/BusTable';
import Menu from "./components/Menu";
import { UserProvider } from "./components/UserContext";
import { useUser } from './components/UserContext';
import Filter from "./components/Filter";

const App = () => {
    const { user, loading } = useUser();

    const [query, setQuery] = useState({});

    return (
        <div>
            <Header />
            <main>
                <div>
                    {user ? (
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
                            <p>You must be logged in to view the bus table.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default App;
