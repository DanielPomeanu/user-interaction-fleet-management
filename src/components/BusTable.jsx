import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { supabase } from '../utils/supabase'
import '../styles/Table.css';
import '../styles/BusTable.css';
import AddVehicleFormDialog from "./AddVehicleFormDialog";

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
                        'D22Front.in.(red,yellow),D22Back.in.(red,yellow),D29Front.in.(red,yellow),D29Back.in.(red,yellow),' +
                        'ledIntFront.in.(red,yellow),ledIntBack.in.(red,yellow),ledExtFront.in.(red,yellow),ledExtSide1.in.(red,yellow),' +
                        'ledExtSide2.in.(red,yellow),ledExtBack.in.(red,yellow),audioInt.in.(red,yellow),audioExt.in.(red,yellow)'
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
                            bus.D22Front, bus.D22Back, bus.D29Front, bus.D29Back,
                            bus.ledIntFront, bus.ledIntBack, bus.ledExtFront,
                            bus.ledExtSide1, bus.ledExtSide2, bus.ledExtBack,
                            bus.audioInt, bus.audioExt
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
                        <div className="bus-cell table-cell">D22 față</div>
                        <div className="bus-cell table-cell">D22 spate</div>
                        <div className="bus-cell table-cell">D29 față</div>
                        <div className="bus-cell table-cell">D29 spate</div>
                        <div className="bus-cell table-cell">LED int. față</div>
                        <div className="bus-cell table-cell">LED int. spate</div>
                        <div className="bus-cell table-cell">LED ext. față</div>
                        <div className="bus-cell table-cell">LED ext. lateral față</div>
                        <div className="bus-cell table-cell">LED ext. lateral spate</div>
                        <div className="bus-cell table-cell">LED ext. spate</div>
                        <div className="bus-cell table-cell">Audio interior</div>
                        <div className="bus-cell table-cell">Audio exterior</div>
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
                                 data-tooltip-content={bus.D22FrontError}>
                                {statusMap[bus.D22Front]}
                            </div>
                            <div className="bus-cell table-cell" data-tooltip-id="error-message-tooltip"
                                 data-tooltip-content={bus.D22BackError}>
                                {statusMap[bus.D22Back]}
                            </div>
                            <div className="bus-cell table-cell" data-tooltip-id="error-message-tooltip"
                                 data-tooltip-content={bus.D29FrontError}>
                                {statusMap[bus.D29Front]}
                            </div>
                            <div className="bus-cell table-cell" data-tooltip-id="error-message-tooltip"
                                 data-tooltip-content={bus.D29BackError}>
                                {statusMap[bus.D29Back]}
                            </div>
                            <div className="bus-cell table-cell" data-tooltip-id="error-message-tooltip"
                                 data-tooltip-content={bus.ledIntFrontError}>
                                {statusMap[bus.ledIntFront]}
                            </div>
                            <div className="bus-cell table-cell" data-tooltip-id="error-message-tooltip"
                                 data-tooltip-content={bus.ledIntBackError}>
                                {statusMap[bus.ledIntBack]}
                            </div>
                            <div className="bus-cell table-cell" data-tooltip-id="error-message-tooltip"
                                 data-tooltip-content={bus.ledExtFrontError}>
                                {statusMap[bus.ledExtFront]}
                            </div>
                            <div className="bus-cell table-cell" data-tooltip-id="error-message-tooltip"
                                 data-tooltip-content={bus.ledExtSide1Error}>
                                {statusMap[bus.ledExtSide1]}
                            </div>
                            <div className="bus-cell table-cell" data-tooltip-id="error-message-tooltip"
                                 data-tooltip-content={bus.ledExtSide2Error}>
                                {statusMap[bus.ledExtSide2]}
                            </div>
                            <div className="bus-cell table-cell" data-tooltip-id="error-message-tooltip"
                                 data-tooltip-content={bus.ledExtBackError}>
                                {statusMap[bus.ledExtBack]}
                            </div>
                            <div className="bus-cell table-cell" data-tooltip-id="error-message-tooltip"
                                 data-tooltip-content={bus.audioIntError}>
                                {statusMap[bus.audioInt]}
                            </div>
                            <div className="bus-cell table-cell" data-tooltip-id="error-message-tooltip"
                                 data-tooltip-content={bus.audioExtError}>
                                {statusMap[bus.audioExt]}
                            </div>
                            <div className="bus-cell table-cell">{bus.details}</div>
                        </div>
                    ))}

                    <Tooltip
                        id="error-message-tooltip"
                        place="top"
                        className="custom-tooltip-all"
                    />

                    <Tooltip
                        id="last-modified-tooltip"
                        place="top"
                        className="custom-tooltip-desktop-only"
                    />

                    {
                        showDialog && (
                            <AddVehicleFormDialog
                                busId={selectedBus}
                                onCloseDialog={closeDialog}
                                setQuery={setQuery}
                                setForceCacheReload={setForceCacheReload}
                            />
                        )}
                </div>
            }
        </>
    );
};

export default BusTable;