import React, { useState } from 'react';
import { supabase } from '../utils/supabase.ts'; // your Supabase config

const AddVehicleForm = () => {
    const [formData, setFormData] = useState({
        id: '',
        created_at: new Date().toISOString().replace('T', ' ').replace('Z', '+00'),
        type: '',
        D22Front: '',
        D22FrontError: '',
        D22Back: '',
        D22BackError: '',
        D29Front: '',
        D29FrontError: '',
        D29Back: '',
        D29BackError: '',
        ledIntFront: '',
        ledIntFrontError: '',
        ledIntBack: '',
        ledIntBackError: '',
        ledExtFront: '',
        ledExtFrontError: '',
        ledExtSide1: '',
        ledExtSide1Error: '',
        ledExtSide2: '',
        ledExtSide2Error: '',
        ledExtBack: '',
        ledExtBackError: '',
        audioInt: '',
        audioIntError: '',
        audioExt: '',
        audioExtError: '',
        details: '',
    });

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
            setFormData(Object.fromEntries(Object.keys(formData).map(key => [key, ''])));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="add-bus-form">
            {Object.entries(formData).map(([key, value]) => (
                <div key={key} className="form-row">
                    <label>{key}</label>
                    <input
                        type="text"
                        name={key}
                        value={value}
                        onChange={handleChange}
                        required={key === 'id'}
                    />
                </div>
            ))}

            <button type="submit">Add Bus</button>
        </form>
    );
};

export default AddVehicleForm;