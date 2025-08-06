import {useState} from 'react';
import { supabase } from '../../utils/supabase';
import '../../styles/forms/AuthForm.css';
import {useUser} from "../authentication/UserContext";

const AuthForm = ({ setIsLoading }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLogin] = useState(true);
    const { user, loading } = useUser();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        let result;
        if (isLogin) {
            result = await supabase.auth.signInWithPassword({ email, password });
        } else {
            result = await supabase.auth.signUp({ email, password });
        }

        if (result.error) {
            setError(result.error.message);
        } else {
            if (!isLogin) {
                alert('Signed up! Check your email for confirmation.');
            } else {
                // delayed intentionally for the animation to load on sign-in
                setTimeout(() => { setIsLoading(false) }, 500);
            }
        }
    };

    const handleSignOutClick = () => {
        setIsLoading(true);

        const timer = setTimeout(handleSignOut, 1000);

        return () => clearTimeout(timer);
    };

    const handleSignOut = () => {
        supabase.auth.signOut()
            .then(() => {
                setIsLoading(false);
            })
    };

    if (loading) return null;

    return (
        <>
            <div className="auth-form">
                { user ? (
                    <button className="secondaryButton" onClick={ handleSignOutClick }>
                        Logout
                    </button>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="auth-form-inputs">
                            <div className="auth-form-email-container">
                                <label>E-mail</label>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="auth-form-password-container">
                                <label>Parolă</label>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="secondaryButton">{isLogin ? 'Login' : 'Sign Up'}</button>
                        {error && <p style={{color: 'red'}}>{error}</p>}
                    </form>
                )}

                {/*<p>*/}
                {/*    {isLogin ? 'No account?' : 'Have an account?'}{' '}*/}
                {/*    <button onClick={() => setIsLogin(!isLogin)}>*/}
                {/*        {isLogin ? 'Sign up' : 'Login'}*/}
                {/*    </button>*/}
                {/*</p>*/}
            </div>
        </>
    );
};

export default AuthForm;