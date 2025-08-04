import React, {useEffect, useState} from 'react';
import { supabase } from '../utils/supabase'; // your Supabase config
import "../styles/AddVehicleForm.css"
import {useUser} from "./UserContext";
import ConfirmationDialog from "./ConfirmationDialog";

const baseFormData = {
    id: '',
    created_at: new Date().toISOString(),
    type: '',
    D22Front: 'green',
    D22FrontError: '',
    D22Back: 'green',
    D22BackError: '',
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
    audioInt: 'green',
    audioIntError: '',
    audioExt: 'green',
    audioExtError: '',
    details: '',
};

const AddVehicleForm = ({ busId, openDialog, onClose, setQuery, setForceCacheReload }) => {
    const { user } = useUser();
    console.log("RERENDER:", { busId, user });

    const [formData, setFormData] = useState(baseFormData);
    const [deleteRequest, setDeleteRequest] = useState(false);

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
                            last_modified_by: user.email
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

        const { error } =
            busId ?
                await supabase.from('Buses')
                    .update([formData])
                    .eq('id', busId) :
                await supabase.from('Buses').insert([formData]);

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

    const handleConfirmationClose = () => {
        setDeleteRequest(false);
        onClose();
    }

    return (
        <form onSubmit={handleSubmit} className="add-vehicle-form">
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
                    D22 - față
                    <select
                        name="D22Front"
                        value={formData.D22Front || ''}
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
                    Eroare D22 - față
                    <input
                        type="text"
                        name="D22FrontError"
                        value={formData.D22FrontError || ''}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <div className="form-row">
                <label>
                    D22 - spate
                    <select
                        name="D22Back"
                        value={formData.D22Back || ''}
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
                    Eroare D22 - spate
                    <input
                        type="text"
                        name="D22BackError"
                        value={formData.D22BackError || ''}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <div className="form-row">
                <label>
                    D29 - față
                    <select
                        name="D29Front"
                        value={formData.D29Front || ''}
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
                    Eroare D29 - față
                    <input
                        type="text"
                        name="D29FrontError"
                        value={formData.D29FrontError || ''}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <div className="form-row">
                <label>
                    D29 - spate
                    <select
                        name="D29Back"
                        value={formData.D29Back || ''}
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
                    Eroare D29 - spate
                    <input
                        type="text"
                        name="D29BackError"
                        value={formData.D29BackError || ''}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <div className="form-row">
                <label>
                    LED interior - față
                    <select
                        name="ledIntFront"
                        value={formData.ledIntFront || ''}
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
                    Eroare LED interior - față
                    <input
                        type="text"
                        name="ledIntFrontError"
                        value={formData.ledIntFrontError || ''}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <div className="form-row">
                <label>
                    LED interior - spate
                    <select
                        name="ledIntBack"
                        value={formData.ledIntBack || ''}
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
                    Eroare LED interior - spate
                    <input
                        type="text"
                        name="ledIntBackError"
                        value={formData.ledIntBackError || ''}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <div className="form-row">
                <label>
                    LED exterior - față
                    <select
                        name="ledExtFront"
                        value={formData.ledExtFront || ''}
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
                    Eroare LED exterior - față
                    <input
                        type="text"
                        name="ledExtFrontError"
                        value={formData.ledExtFrontError || ''}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <div className="form-row">
                <label>
                    LED exterior - lateral față
                    <select
                        name="ledExtSide1"
                        value={formData.ledExtSide1 || ''}
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
                    Eroare LED exterior - lateral față
                    <input
                        type="text"
                        name="ledExtSide1Error"
                        value={formData.ledExtSide1Error || ''}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <div className="form-row">
                <label>
                    LED exterior - lateral spate
                    <select
                        name="ledExtSide2"
                        value={formData.ledExtSide2 || ''}
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
                    Eroare LED exterior - lateral spate
                    <input
                        type="text"
                        name="ledExtSide2Error"
                        value={formData.ledExtSide2Error || ''}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <div className="form-row">
                <label>
                    LED exterior - spate
                    <select
                        name="ledExtBack"
                        value={formData.ledExtBack || ''}
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
                    Eroare LED exterior - spate
                    <input
                        type="text"
                        name="ledExtBackError"
                        value={formData.ledExtBackError || ''}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <div className="form-row">
                <label>
                    Anunțuri audio - interior
                    <select
                        name="audioInt"
                        value={formData.audioInt || ''}
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
                    Eroare anunțuri audio - interior
                    <input
                        type="text"
                        name="audioIntError"
                        value={formData.audioIntError || ''}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <div className="form-row">
                <label>
                    Anunțuri audio - exterior
                    <select
                        name="audioExt"
                        value={formData.audioExt || ''}
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
                    Eroare anunțuri audio - exterior
                    <input
                        type="text"
                        name="audioExtError"
                        value={formData.audioExtError || ''}
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

            { deleteRequest && <ConfirmationDialog busId={busId} onClose={ handleConfirmationClose } setQuery={ setQuery } /> }
        </form>
    );
};

export default React.memo(AddVehicleForm);