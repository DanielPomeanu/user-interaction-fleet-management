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
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div>
            {
                isLoading && (
                    <BusLoadingScreen />
                )
            }

            <Header user={ user } setUser={ setUser } setIsLoading={ setIsLoading } />
            <main>
                <div>
                    {
                        user ? (
                            <>
                                <div className="main-heading">
                                    <p>Salut, {user.email}!</p>
                                    <div className="main-actions">
                                        <Filter setQuery={ setQuery } />
                                        <Menu setQuery={ setQuery } setIsLoading={ setIsLoading } />
                                    </div>
                                </div>
                                <div className="main-content">
                                    {
                                        !loading && (
                                            <BusTable setQuery={ setQuery } query={ query } />
                                        )
                                    }
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
