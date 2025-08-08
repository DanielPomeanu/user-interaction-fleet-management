import {useCallback, useEffect, useRef, useState} from "react";
import {supabase} from "../../utils/supabase";
import "../../styles/tables/StationsTable.css"
import CRUDFormDialog from "../dialogs/CRUDFormDialog";
import ScrollableContainer from "../utils/ScrollableContainer";

const StationsTable = ({ query, setQuery, forceCacheReload, setForceCacheReload }) => {
    console.log('RERENDER Stations');

    const [stations, setStations] = useState([]);
    const [selectedStation, setSelectedStation] = useState({});
    const [showDialog, setShowDialog] = useState(false);
    const cache = useRef({});

    const openDialog = useCallback(() => { setShowDialog(true)}, []);
    const closeDialog = useCallback(() => { setShowDialog(false) }, []);

    useEffect(() => {
        console.log('StationsTable useEffect');

        let isCancelled = false;

        const fetchStations = async () => {
            const cacheKey = JSON.stringify({
                name: query.name || '',
            });

            // 🔄 Invalidate cache if needed
            if (forceCacheReload) {
                delete cache.current[cacheKey];
                setForceCacheReload(false); // Reset flag
            }

            if (cache.current[cacheKey]) {
                setStations(cache.current[cacheKey]);
                return;
            }

            if (isCancelled) {
                return;
            }

            if (!query.name) {
                const { data, error } = await supabase
                    .from('Stations')
                    .select('*')
                    .order('name', { ascending: true });
                if (!isCancelled) {
                    if (error) console.error('Error fetching stations:', error);
                    else {
                        cache.current[cacheKey] = data;
                        setStations(data);
                    }
                }
                return;
            }

            return () => {
                isCancelled = true;
            };
        }

        fetchStations();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query]);

    const handleStationNameClick = (stationName) => {
        setSelectedStation(stationName);
        openDialog();
    };


    const statusMap = {
        green: '🟢',
        yellow: '🟡',
        red: '🔴',
        missing: '⚪',
        unknown: '❓',
    };

    // TODO: move it to somewhere generic because it's used by multiple components
    function formatDateWithTimezone(date) {
        const pad = num => String(num).padStart(2, '0');

        const day = pad(date.getDate());
        const month = pad(date.getMonth() + 1); // months are 0-indexed
        const year = date.getFullYear();

        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());

        return `${day}/${month}/${year} la ${hours}:${minutes}:${seconds}`;
    }

    return (
        <>
            {
                <ScrollableContainer className="stations-table table">
                    {/* Header Row */}
                    <div className="station-row table-row stations-header table-header">
                        <div className="station-cell table-cell sticky">Nume</div>
                        <div className="station-cell table-cell">Afișaj digital</div>
                        <div className="station-cell table-cell">Sistem ticketing</div>
                        <div className="station-cell table-cell">Mobilier urban</div>
                        <div className="station-cell table-cell">Anunț audio în vehicule</div>
                    </div>

                    {/* Data Rows */}
                    {stations.map((station) => (
                        <div key={station.id} className="station-row table-row">
                            <div className="station-cell station-name table-cell sticky"
                                 data-tooltip-id="last-modified-tooltip"
                                 data-tooltip-content={
                                     station.last_modified_by ?
                                         `Ultima modificare: ${station.last_modified_by} în ${formatDateWithTimezone(new Date(station.created_at))}` :
                                         undefined
                                 }
                                 onClick={() => handleStationNameClick(station.name) }>
                                {station.name}
                            </div>
                            <div className="station-cell table-cell"
                                 data-tooltip-id="error-message-tooltip"
                                 data-tooltip-content={station.digital_timetable_error}>
                                {statusMap[station.digital_timetable]}
                            </div>
                            <div className="station-cell table-cell"
                                 data-tooltip-id="error-message-tooltip"
                                 data-tooltip-content={station.ticketing_error}>
                                {statusMap[station.ticketing]}
                            </div>
                            <div className="station-cell table-cell"
                                 data-tooltip-id="error-message-tooltip"
                                 data-tooltip-content={station.street_furniture_error}>
                                {statusMap[station.street_furniture]}
                            </div>
                            <div className="station-cell table-cell"
                                 data-tooltip-id="error-message-tooltip"
                                 data-tooltip-content={station.audio_in_buses_error}>
                                {statusMap[station.audio_in_buses]}
                            </div>
                        </div>
                    ))}
                </ScrollableContainer>
            }

            {
                showDialog && (
                    <CRUDFormDialog
                        type={'station'}
                        id={selectedStation}
                        title={'Modifică stația'}
                        onCloseDialog={closeDialog}
                        setQuery={setQuery}
                        setForceCacheReload={setForceCacheReload}
                    />
                )
            }
        </>
    )
};


    export default StationsTable;