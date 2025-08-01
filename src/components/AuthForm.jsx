import {useEffect, useState} from 'react';
import { supabase } from '../utils/supabase.ts';
import '../styles/AuthForm.css';

const AuthForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLogin, setIsLogin] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user); // Will be `null` if not logged in
        };

        checkUser();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
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
                window.location.reload();
            }
        }
    };

    return (
        <div className="auth-form">
            {user ? (
                <button onClick={() => supabase.auth.signOut()
                    .then(() => {
                        setUser(null);
                        window.location.reload();
                    })
                }>
                    Logout
                </button>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="auth-form-email-container">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="auth-form-password-container">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
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
    );
};

export default AuthForm;