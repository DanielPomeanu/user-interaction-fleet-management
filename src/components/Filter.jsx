import "../styles/Filter.css"
import { useEffect, useRef, useState } from "react";

const Filter = ({ setQuery }) => {
    const [openFilterMenu, setOpenFilterMenu] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const menuRef = useRef(null);

    const handleFilterButtonClick = () => {
        setOpenFilterMenu(prev => !prev);
    };

    const handleFilterByAllVehicles = () => {
        setQuery({ type: '', timestamp: Date.now() });
    };

    const handleFilterByErrors = () => {
        setQuery({ type: 'errors', timestamp: Date.now() });
    };

    const handleFilterByNoErrors = () => {
        setQuery({ type: 'no-errors', timestamp: Date.now() });
    };

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSearch = () => {
        setQuery({ type: 'search', timestamp: Date.now(), term: inputValue });
    };

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenFilterMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="filter-wrapper" ref={menuRef}>
            <button className="filter-button" onClick={handleFilterButtonClick}></button>

            {openFilterMenu && (
                <div className="filter-content">
                    <div className="filter-include">
                        <p>Arată: </p>
                        <button className="filter filter-all secondaryButton" onClick={handleFilterByAllVehicles}>Toate vehiculele</button>
                        <button className="filter filter-errors secondaryButton" onClick={handleFilterByErrors}>Doar vehiculele cu erori</button>
                        <button className="filter filter-no-errors secondaryButton" onClick={handleFilterByNoErrors}>Doar vehiculele fără erori</button>
                    </div>
                    <div className="filter_byinput">
                        <input
                            type="text"
                            name="query"
                            className="filter-input"
                            value={inputValue}
                            onChange={ handleInputChange }
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearch();
                                }
                            }}
                        />
                        <button type="button" className="filter-search-button primaryButton" onClick={ handleSearch }>Caută</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Filter;