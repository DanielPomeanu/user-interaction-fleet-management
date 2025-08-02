import {useEffect, useState} from "react";
import "../styles/BusLoadingScreen.css";
import busIcon from '../assets/bus_icon.png';

const BusLoadingScreen = ({ loading }) => {
    const [delayedLoading, setDelayedLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!loading) {
                setDelayedLoading(false);
            }
        }, 1000);

        return () => clearTimeout(timer);
    },[loading]);

    return (
        <>
            {
                (delayedLoading) ? (
                    <div className="loading-spinner">
                        <img src={busIcon} alt="Bus" className="bus-icon"/>
                        <div className="loading-text">Se încarcă...</div>
                    </div>
                ) : null
            }
        </>
    );
}
export default BusLoadingScreen;