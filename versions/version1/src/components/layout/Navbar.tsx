"use client";

import Link from 'next/link';
import useAuth from '../../hooks/useAuth';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav>
            <ul>
                <li>
                    <Link href="/">Home</Link>
                </li>
                <li>
                    <Link href="/forum/rooms">Rooms</Link>
                </li>
                <li>
                    <Link href="/forum/topics">Topics</Link>
                </li>
                {user ? (
                    <>
                        <li>
                            <span>Hola, {user.name || 'Usuario'}</span>
                        </li>
                        <li>
                            <button onClick={() => logout()}>Cerrar sesión</button>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <Link href="/auth/login">Iniciar sesión</Link>
                        </li>
                        <li>
                            <Link href="/auth/signup">Registrarse</Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
