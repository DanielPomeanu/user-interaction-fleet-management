import {useEffect, useState} from "react";
import "../styles/BusLoadingScreen.css";
import busIcon from '../assets/bus_icon.png';

const BusLoadingScreen = ({ loading }) => {
    const [shouldRender, setShouldRender] = useState(true);

    useEffect(() => {
        if (!loading) {
            setShouldRender(false);
        }
        else {
            setShouldRender(true);
        }
    }, [loading]);

    return (
        <>
            {
                shouldRender && (
                    <div className="loading-spinner">
                        <img src={busIcon} alt="Bus" className="bus-icon"/>
                        <div className="loading-text">Se încarcă...</div>
                    </div>
                )
            }
        </>
    );
};

export default BusLoadingScreen;