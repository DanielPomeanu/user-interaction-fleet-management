import {useParams} from "react-router-dom";
import "../../styles/pages/UserTicketPage.css"
import "../../styles/App.css"
import {supabase} from "../../utils/supabase";
import {useState} from "react";
import StylishImageUploader from "../utils/StylishImageUploader";

import busIcon from "../../assets/ticket-form-vehicle-icon.png"
import personalDetailsIcon from "../../assets/ticket-form-personal-details.png"
import imageIcon from "../../assets/ticket-form-image.png"
import thankYouIcon from "../../assets/ticket-form-thank-you.png"

const baseFormData = {
    created_at: '',
    category: 'bus',
    reporter_name: '',
    reporter_email: '',
    details: '',
    image_url: '',
    status: 'open',
    bus_id: '',
    station_id: ''
};

const UserTicketPage = ({newTicketSubmitted, setNewTicketSubmitted}) => {
    const { id } = useParams(); // grabs "201" from /bus/201
    const [formData, setFormData] = useState(baseFormData);
    const [currentStep, setCurrentStep] = useState(1);
    const [nextStepActive, setNextStepActive] = useState(false);

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();

        const submissionData = {
            ...formData,
            created_at: new Date().toISOString(),
            bus_id: id,
            station_id: null
        };

        const { error } = await supabase.from('Tickets').insert([submissionData]);

        if (error) {
                console.log('Eroare la adăugarea tichetului: ' + error.message);
        } else {
            console.log('Tichetul a fost adăugat cu succes!');
            setNewTicketSubmitted(true);
        }
    };

    return (
        <div className="user-ticket-wrapper">
            <form onSubmit={handleSubmit} className="add-user-ticket-form">
                <div className="ticket-form-header">
                    <div className="ticket-form-speech-balloon-wrapper">
                        <div className="ticket-form-speech-balloon-circle ticket-form-speech-balloon-circle-left"></div>
                        <div
                            className="ticket-form-speech-balloon-circle ticket-form-speech-balloon-circle-middle"></div>
                        <div
                            className="ticket-form-speech-balloon-circle ticket-form-speech-balloon-circle-right"></div>
                        <div
                            className="ticket-form-speech-balloon-circle ticket-form-speech-balloon-circle-small-1"></div>
                        <div
                            className="ticket-form-speech-balloon-circle ticket-form-speech-balloon-circle-small-2"></div>
                        <div
                            className="ticket-form-speech-balloon-circle ticket-form-speech-balloon-circle-small-3"></div>

                        <div className="fade-container">
                            <h1>Salut!</h1>
                            <h1>Hello!</h1>
                            <h1>Szervus!</h1>
                            <h1>Hallo!</h1>
                            <h1>Bonjour!</h1>
                            <h1>Salut!</h1>
                        </div>
                    </div>
                    {
                        currentStep === 3 && (
                            <button type="submit" className="primaryButton">Trimite</button>
                        )
                    }
                </div>
                <div className="ticket-form-content">
                    {
                        currentStep !== 1 && currentStep !== 4 && (
                            <div className="ticket-form-back">Înapoi</div>
                        )
                    }

                    {
                        currentStep === 1 && (
                            <div className="ticket-form-current-vehicle">
                                {/*<img className="ticket-form-current-vehicle-icon"*/}
                                {/*     src={busIcon} alt="Autobuz"/>*/}
                                <h3 className="ticket-form-current-vehicle-text">
                                    Te afli în vehiculul cu indicativ {id}.
                                    <br/><br/>
                                    Ce probleme ai întâmpinat pe parcursul călătoriei?
                                </h3>
                                <div className="ticket-form-current-vehicle-details">
                                    <textarea
                                        className="custom-textarea"
                                        name="details"
                                        rows="8"
                                        value={formData.details || ''}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        )
                    }

                    {
                        currentStep === 2 && (
                            <div className="ticket-form-image">
                                <img className="ticket-form-image-icon"
                                     src={imageIcon} alt="Fotografie"/>
                                <h3 className="ticket-form-image-text">
                                    Dorești să atașezi și o poză?
                                </h3>
                                <StylishImageUploader setFormData={setFormData}/>
                            </div>
                        )
                    }

                    {
                        currentStep === 3 && (
                            <div className="ticket-form-personal-details">
                                <img className="ticket-form-personal-details-icon"
                                     src={personalDetailsIcon} alt="Email"/>
                                <h3 className="ticket-form-personal-details-text">
                                    Îți suntem recunoscători că ne scrii și îți promitem că vom încerca să rezolvăm problema
                                    semnalată de tine în cel mai scurt timp cu putință!
                                    <br/>
                                    Doar dacă dorești, ne poți lăsa un nume și o adresă de e-mail, astfel încât să putem lua
                                    legătura cu tine.
                                </h3>
                                <div className="ticket-form-current-vehicle-name-and-email">
                                    <label>
                                        Nume
                                        <input
                                            type="text"
                                            name="reporter_name"
                                            value={formData.reporter_name || ''}
                                            onChange={handleChange}
                                        />
                                    </label>
                                    <label>
                                        E-mail
                                        <input
                                            type="text"
                                            name="reporter_email"
                                            value={formData.reporter_email || ''}
                                            onChange={handleChange}
                                        />
                                    </label>
                                </div>
                            </div>
                        )
                    }

                    {
                        currentStep === 4 && (
                            <div className="ticket-form-thank-you">
                                <img className="ticket-form-thank-you-icon"
                                     src={thankYouIcon} alt="Email"/>
                                <h3 className="ticket-form-thank-you-text">
                                    Îți mulțumim că ne-ai scris!
                                    <br/>
                                    O zi excelentă!
                                </h3>
                                <div className="ticket-form-current-vehicle-name-and-email">
                                    <label>
                                        Nume
                                        <input
                                            type="text"
                                            name="reporter_name"
                                            value={formData.reporter_name || ''}
                                            onChange={handleChange}
                                        />
                                    </label>
                                    <label>
                                        E-mail
                                        <input
                                            type="text"
                                            name="reporter_email"
                                            value={formData.reporter_email || ''}
                                            onChange={handleChange}
                                        />
                                    </label>
                                </div>
                            </div>
                        )
                    }
                </div>
            </form>
        </div>
    )

    //return <div>Bus ID: {id}</div>;
}

export default UserTicketPage;