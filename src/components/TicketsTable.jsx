import {supabase} from "../utils/supabase";
import {useEffect, useRef, useState} from "react";
import "../styles/Table.css"
import "../styles/TicketsTable.css"

const TicketsTable = ((query, forceCacheReload, setForceCacheReload) => {
    console.log('RERENDER TicketsTable');

    const [tickets, setTickets] = useState([]);
    const cache = useRef({});

    useEffect(() => {
        console.log('TicketsTable useEffect');

        let isCancelled = false;

        const fetchTickets = async () => {
            const cacheKey = JSON.stringify({
                category: query.category || '',
                status: query.status || ''
            });

            // 🔄 Invalidate cache if needed
            if (forceCacheReload) {
                delete cache.current[cacheKey];
                setForceCacheReload(false); // Reset flag
            }

            if (cache.current[cacheKey]) {
                setTickets(cache.current[cacheKey]);
                return;
            }

            if (isCancelled) {
                return;
            }

            if (!query.category) {
                const { data, error } = await supabase
                    .from('Tickets')
                    .select('*')
                    .order('id', { ascending: true });
                if (!isCancelled) {
                    if (error) console.error('Error fetching buses:', error);
                    else {
                        cache.current[cacheKey] = data;
                        setTickets(data);
                    }
                }
                return;
            }

            // if (query.type === 'errors') {
            //     const { data, error } = await supabase
            //         .from('Buses')
            //         .select('*')
            //         .or(
            //             'D22Front.in.(red,yellow),D22Back.in.(red,yellow),D29Front.in.(red,yellow),D29Back.in.(red,yellow),' +
            //             'ledIntFront.in.(red,yellow),ledIntBack.in.(red,yellow),ledExtFront.in.(red,yellow),ledExtSide1.in.(red,yellow),' +
            //             'ledExtSide2.in.(red,yellow),ledExtBack.in.(red,yellow),audioInt.in.(red,yellow),audioExt.in.(red,yellow)'
            //         )
            //         .order('id', { ascending: true });
            //
            //     if (!isCancelled) {
            //         if (error) console.error('Error fetching buses:', error);
            //         else {
            //             cache.current[cacheKey] = data;
            //             setBuses(data);
            //         }
            //     }
            //     return;
            // }
            //
            // if (query.type === 'no-errors') {
            //     // Fetch all then filter in memory for better clarity and performance
            //     const { data, error } = await supabase.from('Buses').select('*');
            //     if (!isCancelled) {
            //         if (error) {
            //             console.error('Error fetching buses:', error);
            //             return;
            //         }
            //         // Filter buses without red/yellow status in any error fields
            //         const filtered = data.filter((bus) => {
            //             const errorFields = [
            //                 bus.D22Front, bus.D22Back, bus.D29Front, bus.D29Back,
            //                 bus.ledIntFront, bus.ledIntBack, bus.ledExtFront,
            //                 bus.ledExtSide1, bus.ledExtSide2, bus.ledExtBack,
            //                 bus.audioInt, bus.audioExt
            //             ];
            //             return errorFields.every(status => status !== 'red' && status !== 'yellow');
            //         });
            //         cache.current[cacheKey] = filtered;
            //         setBuses(filtered);
            //     }
            //     return;
            // }
            //
            // if (query.type === 'search' && searchFilters) {
            //     const { data, error } = await supabase
            //         .from('Buses')
            //         .select('*')
            //         .or(searchFilters)
            //         .order('id', { ascending: true });
            //
            //     if (!isCancelled) {
            //         if (error) console.error('Error fetching buses:', error);
            //         else {
            //             cache.current[cacheKey] = data;
            //             setBuses(data);
            //         }
            //     }
            //     return;
            // }
        };

        fetchTickets();

        return () => {
            isCancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query]);

    const fetchCorrespondence = async (ticket) => {
        if (ticket.category === 'bus') {
            return ticket.busId;
        }

        if (ticket.category === 'station') {
            const {data, error} = await supabase
                .from('Stations')
                .select('name')
                .eq('id', ticket.station_id);

            if (error) console.error('Error fetching buses:', error);
            else {
                return data;
            }
        }

        return '';
    };

    const generateReporter = async (ticket) => {
        let reporter = '';
        if (ticket.reporter_name) {
            reporter += ticket.reporter_name;
        }

        if (ticket.reporter_email) {
            reporter += ' / ' + ticket.reporter_email;
        }

        if (!reporter) {
            reporter = 'Anonim';
        }

        return reporter;
    };

    return (
        <>
            {
                <div className="tickets-table table">
                    {/* Header Row */}
                    <div className="tickets-row table-row tickets-header table-header">
                        <div className="ticket-cell table-cell sticky">Corespondență</div>
                        <div className="ticket-cell table-cell">Tip sesizare</div>
                        <div className="ticket-cell table-cell">Nume / Email</div>
                        <div className="ticket-cell table-cell">Detalii</div>
                        <div className="ticket-cell table-cell">Atașament</div>
                        <div className="ticket-cell table-cell">Status</div>
                    </div>

                    {/* Data Rows */}
                    {tickets.map((ticket) => (
                        <div key={ticket.id} className="ticket-row table-row">
                            <div className="ticket-cell table-cell sticky">
                                {fetchCorrespondence(ticket)}
                            </div>
                            <div className="ticket-cell table-cell">
                                {ticket.category}
                            </div>
                            <div className="ticket-cell table-cell">
                                {generateReporter(ticket)}
                            </div>
                            <div className="ticket-cell table-cell">
                                {ticket.details}
                            </div>
                            <div className="ticket-cell table-cell">
                                {ticket.image_url}
                            </div>
                            <div className="ticket-cell table-cell">
                                {ticket.status}
                            </div>
                        </div>
                    ))}
                </div>
            }
        </>
    );
});

export default TicketsTable;