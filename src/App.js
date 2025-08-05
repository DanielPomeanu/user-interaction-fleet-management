import './styles/App.css';
import React, {useState} from 'react';
import Header from './components/Header';
import BusTable from './components/BusTable';
import Menu from "./components/Menu";
import { useUser } from './components/UserContext';
import Filter from "./components/Filter";
import BusLoadingScreen from "./components/BusLoadingScreen";
import TicketsTable from "./components/TicketsTable";

const App = () => {
    const { user, setUser, loading } = useUser();

    const [query, setQuery] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [forceCacheReload, setForceCacheReload] = useState(false);

    const [busesTabSelected, setBusesTabSelected] = useState(true);
    const [stationsTabSelected, setStationsTabSelected] = useState(false);
    const [ticketsTabSelected, setTicketsTabSelected] = useState(false);

    // const cld = new Cloudinary({ cloud: { cloudName: 'dkxv4i4dx' } });
    //
    // const img = cld
    //     .image('cld-sample-5')
    //     .format('auto') // Optimize delivery by resizing and applying auto-format and auto-quality
    //     .quality('auto')
    //     .resize(auto().gravity(autoGravity()).width(500).height(500)); // Transform the image: auto-crop to square aspect_ratio

    const handleTabClick = (event) => {
        if (event.target.id === 'buses-tab') {
            setBusesTabSelected(true);
            setStationsTabSelected(false);
            setTicketsTabSelected(false);
        }

        if (event.target.id === 'stations-tab') {
            setBusesTabSelected(false);
            setStationsTabSelected(true);
            setTicketsTabSelected(false);
        }

        if (event.target.id === 'tickets-tab') {
            setBusesTabSelected(false);
            setStationsTabSelected(false);
            setTicketsTabSelected(true);
        }
    };

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
                                        <Menu setQuery={ setQuery } setIsLoading={ setIsLoading } setForceCacheReload={ setForceCacheReload } />
                                    </div>
                                </div>
                                <div className="main-content">
                                    <div className="main-content-tabs">
                                        <div id="buses-tab" className="tabs-tab" onClick={ handleTabClick }>Vehicule</div>
                                        <div id="stations-tab" className="tabs-tab" onClick={ handleTabClick }>Stații</div>
                                        <div id="tickets-tab" className="tabs-tab" onClick={ handleTabClick }>Sesizări</div>
                                    </div>
                                    {
                                        !loading && busesTabSelected && (
                                            <BusTable setQuery={ setQuery } query={ query } forceCacheReload={ forceCacheReload } setForceCacheReload={ setForceCacheReload } />
                                        )
                                    }

                                    {
                                        stationsTabSelected && (
                                            <div></div>
                                        )
                                    }

                                    {
                                        ticketsTabSelected && (
                                            <TicketsTable query={ query } forceCacheReload={ forceCacheReload } setForceCacheReload={ setForceCacheReload } />
                                        )
                                    }
                                </div>
                            </>
                        ) : (
                            !loading &&
                                <div>
                                    <p>Pentru a vizualiza datele, trebuie să vă autentificați.</p>
                                </div>
                        )
                    }
                </div>
            </main>

            {/*<AdvancedImage cldImg={img}/>*/}
        </div>
    );
};

export default App;
