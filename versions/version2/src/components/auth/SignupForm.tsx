import React, { useState } from 'react';
import { supabase } from '../../lib/supabase/client';

const SignupForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            setError(error.message);
        } else {
            // Handle successful signup (e.g., redirect or show a success message)
            console.log('User signed up:', data.user);
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSignup} aria-label="Formulario de registro">
            <h2>Registrarse</h2>
            {error && <p role="alert" aria-live="assertive" style={{ color: 'red' }}>{error}</p>}
            <div>
                <label htmlFor="email">Correo electrónico:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-required="true"
                    autoComplete="username"
                />
            </div>
            <div>
                <label htmlFor="password">Contraseña:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    aria-required="true"
                    autoComplete="new-password"
                />
            </div>
            <button type="submit" disabled={loading}>
                {loading ? 'Registrando...' : 'Registrarse'}
            </button>
        </form>
    );
};

export default SignupForm;
