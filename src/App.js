import './styles/App.css';
import React from 'react';
import Header from './components/Header';
import BusTable from './components/BusTable';

const App = () => {
    return (
        <div>
            <Header />
            <main>
                <BusTable />
            </main>
        </div>
    );
};

export default App;
