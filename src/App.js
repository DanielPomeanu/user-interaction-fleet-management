import './styles/App.css';
import React, {useEffect, useState} from 'react';
import Header from './components/Header';
import BusTable from './components/BusTable';
import {supabase} from "./utils/supabase.ts";
import Menu from "./components/Menu";

const App = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
        };
        checkUser();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <Header />
            <main>
                <div>
                    {user ? (
                        <>
                            <div className="main-heading">
                                <p>Salut, { user.email }!</p>
                                <Menu user={ user }/>
                            </div>
                            <div className="main-content">
                                <BusTable value={user}/>
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
