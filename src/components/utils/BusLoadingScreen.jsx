import "../../styles/utils/BusLoadingScreen.css";
import busIcon from '../../assets/bus_icon.png';

const BusLoadingScreen = () => {
    return (
        <>
            {
                <div className="loading-spinner">
                    <img src={busIcon} alt="Bus" className="bus-icon"/>
                    <div className="loading-text">Se încarcă...</div>
                </div>
            }
        </>
    );
};

export default BusLoadingScreen;