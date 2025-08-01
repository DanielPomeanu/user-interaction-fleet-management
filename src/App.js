import './styles/App.css';
import React, {useEffect, useState} from 'react';
import Header from './components/Header';
import BusTable from './components/BusTable';
import {supabase} from "./utils/supabase.ts";

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
                            <p>Welcome, {user.email}!</p>
                            <BusTable />
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
