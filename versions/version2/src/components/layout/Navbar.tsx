"use client";

import Link from 'next/link';
import useAuth from '../../hooks/useAuth';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-10 px-8 py-3">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
                    </svg>
                    Foro Hippo
                </Link>

                <ul className="flex gap-6 items-center">
                    <li>
                        <Link href="/" className="text-indigo-600 font-medium hover:text-indigo-800">
                            Inicio
                        </Link>
                    </li>
                    <li>
                        <Link href="/rooms" className="text-gray-800 font-medium hover:text-indigo-600">
                            Salas
                        </Link>
                    </li>
                    <li>
                        <Link href="/topics" className="text-gray-800 font-medium hover:text-indigo-600">
                            Temas
                        </Link>
                    </li>
                    {user ? (
                        <>
                            <li className="ml-4">
                                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm">
                                    Hola, {user.name || 'Usuario'}
                                </span>
                            </li>
                            <li>
                                <button
                                    onClick={() => logout()}
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                                >
                                    Cerrar sesión
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link
                                    href="/login"
                                    className="text-indigo-600 font-medium hover:text-indigo-800"
                                >
                                    Iniciar sesión
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/signup"
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                                >
                                    Registrarse
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
