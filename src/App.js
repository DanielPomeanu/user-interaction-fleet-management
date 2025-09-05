import './styles/App.css';
import React, { useState } from 'react';
import { useUser } from './components/authentication/UserContext';
import { Routes, Route } from 'react-router-dom';
import AdministratorPage from "./components/pages/AdministratorPage";
import UserTicketPage from "./components/pages/UserTicketPage";

const App = () => {
    const { user, setUser, loading } = useUser();
    const [query, setQuery] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [forceCacheReload, setForceCacheReload] = useState(false);
    const [newTicketSubmitted, setNewTicketSubmitted] = useState(false);

    return (
        <Routes>
            <Route
                path="/"
                element={
                    <AdministratorPage
                        query={query}
                        setQuery={setQuery}
                        loading={loading}
                        user={user}
                        setUser={setUser}
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                        forceCacheReload={forceCacheReload}
                        setForceCacheReload={setForceCacheReload}
                        newTicketSubmitted={newTicketSubmitted}
                        setNewTicketSubmitted={setNewTicketSubmitted}
                    />
                }
            />
            <Route
                path="/bus/:id"
                element={
                    <UserTicketPage
                        newTicketSubmitted={newTicketSubmitted}
                        setNewTicketSubmitted={setNewTicketSubmitted}
                    />
                }
            />
        </Routes>
    );
};

export default App;