import React, {useEffect, useState} from 'react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { supabase } from '../utils/supabase.ts'
import '../styles/BusTable.css';

const BusTable = () => {
    const [buses, setBuses] = useState([]);

    useEffect(() => {
        const fetchBuses = async () => {
            const { data, error } = await supabase
                .from('Buses')
                .select('*')
                .order('id', { ascending: true });

            if (error) {
                console.error('Error fetching buses:', error);
            } else {
                setBuses(data);
            }
        };

        fetchBuses();
    }, []);


    const statusMap = {
        green: '🟢',
        yellow: '🟡',
        red: '🔴',
        missing: '⚪',
        '': '❓'
    };

    return (
        <div className="bus-table">
            {/* Header Row */}
            <div className="bus-row bus-header">
                <div className="bus-cell sticky">Nr. parc</div>
                <div className="bus-cell">Vehicul</div>
                <div className="bus-cell">D22 fata</div>
                <div className="bus-cell">D22 spate</div>
                <div className="bus-cell">D29 fata</div>
                <div className="bus-cell">D29 spate</div>
                <div className="bus-cell">LED int. fata</div>
                <div className="bus-cell">LED int. spate</div>
                <div className="bus-cell">LED ext. fata</div>
                <div className="bus-cell">LED ext. lateral 1</div>
                <div className="bus-cell">LED ext. lateral 2</div>
                <div className="bus-cell">LED ext. spate</div>
                <div className="bus-cell">Audio interior</div>
                <div className="bus-cell">Audio exterior</div>
                <div className="bus-cell">Detalii</div>
            </div>

            {/* Data Rows */}
            {buses.map((bus) => (
                <div key={bus.id} className="bus-row">
                    <div className="bus-cell sticky">{bus.id}</div>
                    <div className="bus-cell">{bus.type}</div>
                    <div className="bus-cell" data-tooltip-id="bus-tooltip" data-tooltip-content={bus.D22FrontError}>
                        {statusMap[bus.D22Front]}
                    </div>
                    <div className="bus-cell" data-tooltip-id="bus-tooltip" data-tooltip-content={bus.D22BackError}>
                        {statusMap[bus.D22Back]}
                    </div>
                    <div className="bus-cell" data-tooltip-id="bus-tooltip" data-tooltip-content={bus.D29FrontError}>
                        {statusMap[bus.D29Front]}
                    </div>
                    <div className="bus-cell" data-tooltip-id="bus-tooltip" data-tooltip-content={bus.D29BackError}>
                        {statusMap[bus.D29Back]}
                    </div>
                    <div className="bus-cell" data-tooltip-id="bus-tooltip" data-tooltip-content={bus.ledIntFrontError}>
                        {statusMap[bus.ledIntFront]}
                    </div>
                    <div className="bus-cell" data-tooltip-id="bus-tooltip" data-tooltip-content={bus.ledIntBackError}>
                        {statusMap[bus.ledIntBack]}
                    </div>
                    <div className="bus-cell" data-tooltip-id="bus-tooltip" data-tooltip-content={bus.ledExtFrontError}>
                        {statusMap[bus.ledExtFront]}
                    </div>
                    <div className="bus-cell" data-tooltip-id="bus-tooltip" data-tooltip-content={bus.ledExtSide1Error}>
                        {statusMap[bus.ledExtSide1]}
                    </div>
                    <div className="bus-cell" data-tooltip-id="bus-tooltip" data-tooltip-content={bus.ledExtSide2Error}>
                        {statusMap[bus.ledExtSide2]}
                    </div>
                    <div className="bus-cell" data-tooltip-id="bus-tooltip" data-tooltip-content={bus.ledExtBackError}>
                        {statusMap[bus.ledExtBack]}
                    </div>
                    <div className="bus-cell" data-tooltip-id="bus-tooltip" data-tooltip-content={bus.audioIntError}>
                        {statusMap[bus.audioInt]}
                    </div>
                    <div className="bus-cell" data-tooltip-id="bus-tooltip" data-tooltip-content={bus.audioExtError}>
                        {statusMap[bus.audioExt]}
                    </div>
                    <div className="bus-cell">{bus.details}</div>
                </div>
            ))}

            <Tooltip
                id="bus-tooltip"
                place="top"
                delayShow={100}
                className="custom-tooltip"
            />
        </div>
    );
};

export default BusTable;