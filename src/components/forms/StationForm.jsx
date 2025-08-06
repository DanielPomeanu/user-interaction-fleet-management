import ConfirmationDialog from "../dialogs/ConfirmationDialog";
import {useUser} from "../authentication/UserContext";
import {useEffect, useState} from "react";
import {supabase} from "../../utils/supabase";
import "../../styles/forms/StationForm.css"

const baseFormData = {
    created_at: '',
    last_modified_by: '',
    name: '',
    digital_timetable: 'green',
    digital_timetable_error: '',
    ticketing: 'green',
    ticketing_error: '',
    street_furniture: 'green',
    street_furniture_error: '',
    audio_in_buses: 'green',
    audio_in_buses_error: '',
};

const StationForm = ({ stationName, openDialog, onClose, setQuery, setForceCacheReload }) => {
    const { user } = useUser();
    console.log("RERENDER StationsForm:", { stationName, user });

    const [formData, setFormData] = useState(baseFormData);
    const [deleteRequest, setDeleteRequest] = useState(false);

    const handleClickOnDelete = () => {
        setDeleteRequest(true);
    }

    useEffect(() => {
        console.log("Use-effect:", { stationName, user });
        let isCancelled = false;

        const fetchStation = async () => {
            try {
                const { data, error } = await supabase
                    .from('Stations')
                    .select('*')
                    .eq('name', stationName);

                if (error) {
                    console.error('Error fetching stations:', error);
                } else if (data && data.length > 0 && !isCancelled) {
                    setFormData(prev => {
                        const newData = {
                            ...baseFormData,
                            ...data[0],
                            last_modified_by: user.email,
                            created_at: new Date().toISOString()
                        };
                        return JSON.stringify(prev) !== JSON.stringify(newData) ? newData : prev;
                    });
                }
            } catch (err) {
                console.error('Unexpected error:', err);
            } finally {
                if (!isCancelled) {
                    openDialog();
                }
            }
        };

        if (stationName) {
            fetchStation();
        } else {
            openDialog(); // create mode, no fetch
        }

        return () => {
            isCancelled = true;
        };
    }, [stationName, openDialog, user]);

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();

        const submissionData = {
            ...formData,
            last_modified_by: user.email,
            created_at: new Date().toISOString()
        };

        const { error } =
            stationName ?
                await supabase.from('Stations')
                    .update([submissionData])
                    .eq('name', stationName) :
                await supabase.from('Stations').insert([submissionData]);

        if (error) {
            stationName ?
                console.log('Eroare la modificarea stației: ' + error.message) :
                console.log('Eroare la adăugarea stației: ' + error.message);
        } else {
            stationName ?
                console.log('Stația a fost modificată cu succes!') :
                console.log('Stația a fost adăugată cu succes!');

            setQuery({ type: '', timestamp: Date.now() });
            setForceCacheReload(true);
            setFormData(baseFormData);
            onClose(); // 👈 closes dialog from parent
        }
    };

    const handleConfirmationClose = () => {
        setDeleteRequest(false);
        onClose();
    }

    return (
        <form onSubmit={handleSubmit} className="add-station-form custom-form">
            <div className="form-row first full-width">
                <label>
                    Numele stației
                    <input
                        type="text"
                        name="name"
                        value={formData.name || ''}
                        onChange={handleChange}
                        required
                    />
                </label>
            </div>
            <div className="form-row">
                <label>
                    Afișaj digital
                    <select
                        name="digital_timetable"
                        value={formData.digital_timetable || ''}
                        onChange={handleChange}
                    >
                        <option value="green">🟢</option>
                        <option value="red">🔴</option>
                        <option value="yellow">🟡</option>
                        <option value="missing">⚪</option>
                        <option value="unknown">❓</option>
                    </select>
                </label>
            </div>
            <div className="form-row">
                <label>
                    Problemă afișaj digital
                    <input
                        type="text"
                        name="digital_timetable_error"
                        value={formData.digital_timetable_error || ''}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <div className="form-row">
                <label>
                    Ticketing
                    <select
                        name="ticketing"
                        value={formData.ticketing || ''}
                        onChange={handleChange}
                    >
                        <option value="green">🟢</option>
                        <option value="red">🔴</option>
                        <option value="yellow">🟡</option>
                        <option value="missing">⚪</option>
                        <option value="unknown">❓</option>
                    </select>
                </label>
            </div>
            <div className="form-row">
                <label>
                    Problemă ticketing
                    <input
                        type="text"
                        name="ticketing_error"
                        value={formData.ticketing_error || ''}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <div className="form-row">
                <label>
                    Mobilier stradal
                    <select
                        name="street_furniture"
                        value={formData.street_furniture || ''}
                        onChange={handleChange}
                    >
                        <option value="green">🟢</option>
                        <option value="red">🔴</option>
                        <option value="yellow">🟡</option>
                        <option value="missing">⚪</option>
                        <option value="unknown">❓</option>
                    </select>
                </label>
            </div>
            <div className="form-row">
                <label>
                    Problemă mobilier stradal
                    <input
                        type="text"
                        name="street_furniture_error"
                        value={formData.street_furniture_error || ''}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <div className="form-row">
                <label>
                    Anunțuri audio în vehicule
                    <select
                        name="audio_in_buses"
                        value={formData.audio_in_buses || ''}
                        onChange={handleChange}
                    >
                        <option value="green">🟢</option>
                        <option value="red">🔴</option>
                        <option value="yellow">🟡</option>
                        <option value="missing">⚪</option>
                        <option value="unknown">❓</option>
                    </select>
                </label>
            </div>
            <div className="form-row">
                <label>
                    Problemă anunțuri audio în vehicule
                    <input
                        type="text"
                        name="audio_in_buses_error"
                        value={formData.audio_in_buses_error || ''}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <div className="form-row full-width buttons">
                <button type="submit" className="primaryButton">{ stationName ? "Modifică" : "Adaugă" }</button>
                { stationName ? <button type="button" className="deleteButton" onClick={ handleClickOnDelete }>Șterge</button> : '' }
            </div>

            { deleteRequest &&
                <ConfirmationDialog
                    id={stationName}
                    category={'station'}
                    onClose={ handleConfirmationClose }
                    setQuery={ setQuery }
                    setForceCacheReload={ setForceCacheReload }
                />
            }
        </form>
    );
}

export default StationForm;