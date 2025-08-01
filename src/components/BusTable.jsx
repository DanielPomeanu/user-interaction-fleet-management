import React, { useState } from 'react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import '../styles/BusTable.css';

const BusTable = () => {
    const [buses] = useState([
        {
            id: 830,
            type: 'Solaris Urbino 18',
            D22Front: 'green',
            D22FrontError: '',
            D22Back: 'green',
            D22BackError: '',
            D29Front: 'missing',
            D29FrontError: '',
            D29Back: 'missing',
            D29BackError: '',
            ledIntFront: 'green',
            ledIntFrontError: '',
            ledIntBack: 'green',
            ledIntBackError: '',
            ledExtFront: 'green',
            ledExtFrontError: '',
            ledExtSide1: 'green',
            ledExtSide1Error: '',
            ledExtSide2: 'missing',
            ledExtSide2Error: '',
            ledExtBack: 'green',
            ledExtBackError: '',
            audioInt: 'green',
            audioIntError: '',
            audioExt: 'missing',
            audioExtError: '',
            details: 'Adaugat'
        },
        {
            id: 229,
            type: 'Solaris Urbino Electric 12',
            D22Front: 'red',
            D22FrontError: 'Afișaj blocat la Disp. Grigorescu.',
            D22Back: 'missing',
            D22BackError: '',
            D29Front: 'missing',
            D29FrontError: '',
            D29Back: 'missing',
            D29BackError: '',
            ledIntFront: 'yellow',
            ledIntFrontError: 'Nu arată decât ora.',
            ledIntBack: 'missing',
            ledIntBackError: '',
            ledExtFront: 'green',
            ledExtFrontError: '',
            ledExtSide1: 'green',
            ledExtSide1Error: '',
            ledExtSide2: 'missing',
            ledExtSide2Error: '',
            ledExtBack: 'green',
            ledExtBackError: '',
            audioInt: 'red',
            audioIntError: 'Anunțurile interioare nu funcționează.',
            audioExt: 'missing',
            audioExtError: '',
            details: 'Adaugat'
        },
        {
            id: 901,
            type: 'Mercedes Conecto G 18',
            D22Front: 'yellow',
            D22FrontError: 'Afișează grafica veche Thoreb (cu reclama mică în mijloc).',
            D22Back: 'yellow',
            D22BackError: 'Afișează grafica veche Thoreb (cu reclama mică în mijloc).',
            D29Front: 'green',
            D29FrontError: '',
            D29Back: 'green',
            D29BackError: '',
            ledIntFront: 'green',
            ledIntFrontError: '',
            ledIntBack: 'green',
            ledIntBackError: '',
            ledExtFront: 'green',
            ledExtFrontError: '',
            ledExtSide1: 'green',
            ledExtSide1Error: '',
            ledExtSide2: 'green',
            ledExtSide2Error: '',
            ledExtBack: 'green',
            ledExtBackError: '',
            audioInt: 'yellow',
            audioIntError: 'Anunțurile interioare se aud încet.',
            audioExt: 'green',
            audioExtError: '',
            details: 'Adaugat'
        }
    ]);

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
                <div className="bus-cell">Nr. parc</div>
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
                    <div className="bus-cell">{bus.id}</div>
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