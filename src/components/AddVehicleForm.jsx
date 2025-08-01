import React, { useState } from 'react';
import { supabase } from '../utils/supabase.ts'; // your Supabase config
import "../styles/AddVehicleForm.css"

const AddVehicleForm = ({ user, onClose }) => {
    const initialFormData = {
        id: '',
        created_at: new Date().toISOString().replace('T', ' ').replace('Z', '+00'),
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
        last_modified_by: user.email,
    };

    const [formData, setFormData] = useState(initialFormData);

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();

        const { error } = await supabase.from('Buses').insert([formData]);

        if (error) {
            alert('Failed to add bus: ' + error.message);
        } else {
            alert('Bus added successfully!');
            setFormData(initialFormData);
            onClose(); // 👈 closes dialog from parent
            // setFormData(Object.fromEntries(Object.keys(formData).map(key => [key, ''])));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="add-vehicle-form">
            <div className="form-row first">
                <label>
                    Nr. parc
                    <input
                        type="text"
                        name="id"
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
                        onChange={handleChange}
                    />
                </label>
            </div>
            <button type="submit" className="primaryButton">Adaugă</button>
        </form>
    );
};

export default AddVehicleForm;