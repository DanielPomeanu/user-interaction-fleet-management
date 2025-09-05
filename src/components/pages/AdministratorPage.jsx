import BusLoadingScreen from "../utils/BusLoadingScreen";
import Header from "../layout/Header";
import Filter from "../tables/Filter";
import Menu from "../layout/Menu";
import BusTable from "../tables/BusTable";
import StationsTable from "../tables/StationsTable";
import TicketsTable from "../tables/TicketsTable";
import {Tooltip} from "react-tooltip";
import {useState} from "react";

const AdministratorPage = ({ query, setQuery, loading, user, setUser, isLoading, setIsLoading, forceCacheReload, setForceCacheReload, newTicketSubmitted, setNewTicketSubmitted }) => {
    const [busesTabSelected, setBusesTabSelected] = useState(true);
    const [stationsTabSelected, setStationsTabSelected] = useState(false);
    const [ticketsTabSelected, setTicketsTabSelected] = useState(false);

    const handleTabClick = (event) => {
        setBusesTabSelected(event.target.id === 'buses-tab');
        setStationsTabSelected(event.target.id === 'stations-tab');
        setTicketsTabSelected(event.target.id === 'tickets-tab');
    };

    return (
        <div>
            {isLoading && <BusLoadingScreen />}
            <Header user={user} setUser={setUser} setIsLoading={setIsLoading} />
            <main>
                <div>
                    <>
                        <div className="main-heading">
                            {
                                user?.email ? (
                                    <p>Salut, {user.email}!</p>
                                ) : (
                                    <p>Salut!</p>
                                )
                            }

                            <div className="main-actions">
                                <Filter setQuery={setQuery} />
                                {
                                    user && (
                                        <Menu setQuery={setQuery} setIsLoading={setIsLoading} setForceCacheReload={setForceCacheReload} />
                                    )
                                }
                            </div>
                        </div>
                        <div className="main-content">
                            <div className="main-content-tabs">
                                <div
                                    id="buses-tab"
                                    className={`tabs-tab ${busesTabSelected ? 'active' : ''}`}
                                    onClick={handleTabClick}
                                >
                                    Vehicule
                                </div>
                                <div
                                    id="stations-tab"
                                    className={`tabs-tab ${stationsTabSelected ? 'active' : ''}`}
                                    onClick={handleTabClick}
                                >
                                    Stații
                                </div>
                                <div
                                    id="tickets-tab"
                                    className={`tabs-tab ${ticketsTabSelected ? 'active' : ''}`}
                                    onClick={handleTabClick}
                                >
                                    Sesizări
                                </div>
                            </div>

                            {!loading && busesTabSelected && (
                                <BusTable
                                    setQuery={setQuery}
                                    query={query}
                                    forceCacheReload={forceCacheReload}
                                    setForceCacheReload={setForceCacheReload}
                                    user={user}
                                />
                            )}

                            {stationsTabSelected && (
                                <StationsTable
                                    setQuery={setQuery}
                                    query={query}
                                    forceCacheReload={forceCacheReload}
                                    setForceCacheReload={setForceCacheReload}
                                    user={user}
                                />
                            )}

                            {ticketsTabSelected && (
                                <TicketsTable
                                    query={query}
                                    forceCacheReload={forceCacheReload}
                                    setForceCacheReload={setForceCacheReload}
                                    newTicketSubmitted={newTicketSubmitted}
                                    setNewTicketSubmitted={setNewTicketSubmitted}
                                />
                            )}
                        </div>
                    </>
                </div>

                <Tooltip id="error-message-tooltip" place="top" className="custom-tooltip-all" />
                <Tooltip id="last-modified-tooltip" place="top" className="custom-tooltip-desktop-only" />
            </main>
        </div>
    );
}

export default AdministratorPage;