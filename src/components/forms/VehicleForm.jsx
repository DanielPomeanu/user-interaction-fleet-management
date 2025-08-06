import React, {useEffect, useState} from 'react';
import { supabase } from '../../utils/supabase'; // your Supabase config
import "../../styles/forms/Form.css"
import "../../styles/forms/VehicleForm.css"
import {useUser} from "../authentication/UserContext";

const baseFormData = {
    id: '',
    created_at: '',
    last_modified_by: '',
    type: '',
    displays_int: 'green',
    displays_int_error: '',
    displays_ext: 'green',
    displays_ext_error: '',
    ticketing_machines: 'green',
    ticketing_machines_error: '',
    pos_machines: 'green',
    pos_machines_error: '',
    environment: 'green',
    environment_error: '',
    audio_int: 'green',
    audio_int_error: '',
    audio_ext: 'green',
    audio_ext_error: '',
    details: '',
};

const VehicleForm = ({ busId, openDialog, onClose, setQuery, setForceCacheReload, setDeleteRequest }) => {
    const { user } = useUser();
    console.log("RERENDER VehicleForm:", { busId, user });

    const [formData, setFormData] = useState(baseFormData);

    const handleClickOnDelete = () => {
        setDeleteRequest(true);
    }

    useEffect(() => {
        console.log("Use-effect:", { busId, user });
        let isCancelled = false;

        const fetchBus = async () => {
            try {
                const { data, error } = await supabase
                    .from('Buses')
                    .select('*')
                    .eq('id', busId);

                if (error) {
                    console.error('Error fetching buses:', error);
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

        if (busId) {
            fetchBus();
        } else {
            openDialog(); // create mode, no fetch
        }

        return () => {
            isCancelled = true;
        };
    }, [busId, openDialog, user]);

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
            busId ?
                await supabase.from('Buses')
                    .update([submissionData])
                    .eq('id', busId) :
                await supabase.from('Buses').insert([submissionData]);

        if (error) {
            busId ?
                console.log('Eroare la modificarea vehiculului: ' + error.message) :
                console.log('Eroare la adăugarea vehiculului: ' + error.message);
        } else {
            busId ?
                console.log('Vehicul modificat cu succes!') :
                console.log('Vehicul adăugat cu succes!');

            setQuery({ type: '', timestamp: Date.now() });
            setForceCacheReload(true);
            setFormData(baseFormData);
            onClose(); // 👈 closes dialog from parent
        }
    };

    return (
        <form onSubmit={handleSubmit} className="add-vehicle-form custom-form">
            <div className="form-row first">
                <label>
                    Nr. parc
                    <input
                        type="text"
                        name="id"
                        value={formData.id || ''}
                        onChange={handleChange}
                        required
                    />
                </label>

            </div>
            <div className="form-row">
                <label>
                    Vehicul
                    <input
                        type="text"
                        name="type"
                        value={formData.type || ''}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <div className="form-row">
                <label>
                    Afișaj interior
                    <select
                        name="displays_int"
                        value={formData.displays_int || ''}
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
                    Probleme afișaj interior
                    <input
                        type="text"
                        name="displays_int_error"
                        value={formData.displays_int_error || ''}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <div className="form-row">
                <label>
                    Afișaj exterior
                    <select
                        name="displays_ext"
                        value={formData.displays_ext || ''}
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
                    Probleme afișaj exterior
                    <input
                        type="text"
                        name="displays_ext_error"
                        value={formData.displays_ext_error || ''}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <div className="form-row">
                <label>
                    Validatoare
                    <select
                        name="ticketing_machines"
                        value={formData.ticketing_machines || ''}
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
                    Probleme validatoare
                    <input
                        type="text"
                        name="ticketing_machines_error"
                        value={formData.ticketing_machines_error || ''}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <div className="form-row">
                <label>
                    POS
                    <select
                        name="pos_machines"
                        value={formData.pos_machines || ''}
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
                    Probleme POS
                    <input
                        type="text"
                        name="pos_machines_error"
                        value={formData.pos_machines_error || ''}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <div className="form-row">
                <label>
                    Mediu ambiental
                    <select
                        name="environment"
                        value={formData.environment || ''}
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
                    Probleme mediu ambiental
                    <input
                        type="text"
                        name="environment_error"
                        value={formData.environment_error || ''}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <div className="form-row">
                <label>
                    Anunțuri audio - interior
                    <select
                        name="audio_int"
                        value={formData.audio_int || ''}
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
                    Probleme anunțuri audio - interior
                    <input
                        type="text"
                        name="audio_int_error"
                        value={formData.audio_int_error || ''}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <div className="form-row">
                <label>
                    Anunțuri audio - exterior
                    <select
                        name="audio_ext"
                        value={formData.audio_ext || ''}
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
                    Probleme anunțuri audio - exterior
                    <input
                        type="text"
                        name="audio_ext_error"
                        value={formData.audio_ext_error || ''}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <div className="form-row full-width">
                <label>
                    Detalii
                    <textarea
                        name="details"
                        rows="4"
                        value={formData.details || ''}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <div className="form-row full-width buttons">
                <button type="submit" className="primaryButton">{ busId ? "Modifică" : "Adaugă" }</button>
                { busId ? <button type="button" className="deleteButton" onClick={ handleClickOnDelete }>Șterge</button> : '' }
            </div>
        </form>
    );
};

export default React.memo(VehicleForm);