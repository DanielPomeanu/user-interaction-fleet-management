import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import 'react-tooltip/dist/react-tooltip.css';
import { supabase } from '../../utils/supabase'
import '../../styles/tables/Table.css';
import '../../styles/tables/BusTable.css';
import CRUDFormDialog from "../dialogs/CRUDFormDialog";

const BusTable = ({ setQuery, query, forceCacheReload, setForceCacheReload }) => {
    console.log('BusTable RERENDER');
    const [buses, setBuses] = useState([]);
    const [selectedBus, setSelectedBus] = useState({});
    const [showDialog, setShowDialog] = useState(false);
    const cache = useRef({});

    const openDialog = useCallback(() => { setShowDialog(true)}, []);
    const closeDialog = useCallback(() => { setShowDialog(false) }, []);

    // Memoize filters string for search queries
    const searchFilters = useMemo(() => {
        if (query.type !== 'search') return null;
        return isNaN(query.term)
            ? `type.ilike.%${query.term}%`
            : `id.eq.${query.term},type.ilike.%${query.term}%`;
    }, [query]);

    useEffect(() => {
        console.log('BusTable useEffect');

        let isCancelled = false;

        const fetchBuses = async () => {
            const cacheKey = JSON.stringify({
                type: query.type || '',
                term: query.term || ''
            });

            // 🔄 Invalidate cache if needed
            if (forceCacheReload) {
                delete cache.current[cacheKey];
                setForceCacheReload(false); // Reset flag
            }

            if (cache.current[cacheKey]) {
                setBuses(cache.current[cacheKey]);
                return;
            }

            if (isCancelled) {
                return;
            }

            if (!query.type) {
                const { data, error } = await supabase
                    .from('Buses')
                    .select('*')
                    .order('id', { ascending: true });
                if (!isCancelled) {
                    if (error) console.error('Error fetching buses:', error);
                    else {
                        cache.current[cacheKey] = data;
                        setBuses(data);
                    }
                }
                return;
            }

            if (query.type === 'errors') {
                const { data, error } = await supabase
                    .from('Buses')
                    .select('*')
                    .or(
                        'displays_int.in.(red,yellow),displays_ext.in.(red,yellow),ticketing_machines.in.(red,yellow),' +
                        'pos_machines.in.(red,yellow),environment.in.(red,yellow),audio_int.in.(red,yellow),audio_ext.in.(red,yellow)'
                    )
                    .order('id', { ascending: true });

                if (!isCancelled) {
                    if (error) console.error('Error fetching buses:', error);
                    else {
                        cache.current[cacheKey] = data;
                        setBuses(data);
                    }
                }
                return;
            }

            if (query.type === 'no-errors') {
                // Fetch all then filter in memory for better clarity and performance
                const { data, error } = await supabase.from('Buses').select('*');
                if (!isCancelled) {
                    if (error) {
                        console.error('Error fetching buses:', error);
                        return;
                    }
                    // Filter buses without red/yellow status in any error fields
                    const filtered = data.filter((bus) => {
                        const errorFields = [
                            bus.displays_int, bus.displays_ext,
                            bus.ticketing_machines, bus.pos_machines, bus.environment,
                            bus.audio_int, bus.audio_ext
                        ];
                        return errorFields.every(status => status !== 'red' && status !== 'yellow');
                    });
                    cache.current[cacheKey] = filtered;
                    setBuses(filtered);
                }
                return;
            }

            if (query.type === 'search' && searchFilters) {
                const { data, error } = await supabase
                    .from('Buses')
                    .select('*')
                    .or(searchFilters)
                    .order('id', { ascending: true });

                if (!isCancelled) {
                    if (error) console.error('Error fetching buses:', error);
                    else {
                        cache.current[cacheKey] = data;
                        setBuses(data);
                    }
                }
                return;
            }
        };

        fetchBuses();

        return () => {
            isCancelled = true;
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, searchFilters]);

    const handleBusIdClick = (busId) => {
        setSelectedBus(busId);
        openDialog();
    };


    const statusMap = {
        green: '🟢',
        yellow: '🟡',
        red: '🔴',
        missing: '⚪',
        unknown: '❓',
    };

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
                <div className="bus-table table">
                    {/* Header Row */}
                    <div className="bus-row table-row bus-header table-header">
                        <div className="bus-cell table-cell sticky">Nr. parc</div>
                        <div className="bus-cell table-cell">Vehicul</div>
                        <div className="bus-cell table-cell">Afișaj interior</div>
                        <div className="bus-cell table-cell">Afișaj exterior</div>
                        <div className="bus-cell table-cell">Validatoare</div>
                        <div className="bus-cell table-cell">POS-uri</div>
                        <div className="bus-cell table-cell">Mediu ambiental</div>
                        <div className="bus-cell table-cell">Anunțuri audio interior</div>
                        <div className="bus-cell table-cell">Anunțuri audio exterior</div>
                        <div className="bus-cell table-cell">Detalii</div>
                    </div>

                    {/* Data Rows */}
                    {buses.map((bus) => (
                        <div key={bus.id} className="bus-row table-row">
                            <div className="bus-cell table-cell sticky bus-id"
                                 data-tooltip-id="last-modified-tooltip"
                                 data-tooltip-content={
                                     bus.last_modified_by ?
                                         `Ultima modificare: ${bus.last_modified_by} în ${formatDateWithTimezone(new Date(bus.created_at))}` :
                                         undefined
                                 }
                                 onClick={() => handleBusIdClick(bus.id) }
                            >
                                {bus.id}
                            </div>
                            <div className="bus-cell table-cell">{bus.type}</div>
                            <div className="bus-cell table-cell" data-tooltip-id="error-message-tooltip"
                                 data-tooltip-content={bus.displays_int_error}>
                                {statusMap[bus.displays_int]}
                            </div>
                            <div className="bus-cell table-cell" data-tooltip-id="error-message-tooltip"
                                 data-tooltip-content={bus.displays_ext_error}>
                                {statusMap[bus.displays_ext]}
                            </div>
                            <div className="bus-cell table-cell" data-tooltip-id="error-message-tooltip"
                                 data-tooltip-content={bus.ticketing_machines_error}>
                                {statusMap[bus.ticketing_machines]}
                            </div>
                            <div className="bus-cell table-cell" data-tooltip-id="error-message-tooltip"
                                 data-tooltip-content={bus.pos_machines_error}>
                                {statusMap[bus.pos_machines]}
                            </div>
                            <div className="bus-cell table-cell" data-tooltip-id="error-message-tooltip"
                                 data-tooltip-content={bus.environment_error}>
                                {statusMap[bus.environment]}
                            </div>
                            <div className="bus-cell table-cell" data-tooltip-id="error-message-tooltip"
                                 data-tooltip-content={bus.audio_int_error}>
                                {statusMap[bus.audio_int]}
                            </div>
                            <div className="bus-cell table-cell" data-tooltip-id="error-message-tooltip"
                                 data-tooltip-content={bus.audio_ext_error}>
                                {statusMap[bus.audio_ext]}
                            </div>
                            <div className="bus-cell table-cell">{bus.details}</div>
                        </div>
                    ))}

                    {
                        showDialog && (
                            <CRUDFormDialog
                                type={'bus'}
                                id={selectedBus}
                                title={'Modifică vehicul'}
                                onCloseDialog={closeDialog}
                                setQuery={setQuery}
                                setForceCacheReload={setForceCacheReload}
                            />
                        )
                    }
                </div>
            }
        </>
    );
};

export default BusTable;