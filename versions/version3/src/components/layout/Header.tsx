import React from 'react';

const Header: React.FC = () => {
    return (
        <header>
            <h1>Foro de Debate</h1>
            <nav>
                <ul>
                    <li><a href="/">Inicio</a></li>
                    <li><a href="/(auth)/login">Iniciar Sesión</a></li>
                    <li><a href="/(auth)/signup">Registrarse</a></li>
                    <li><a href="/(forum)/rooms">Salas de Debate</a></li>
                    <li><a href="/(forum)/topics">Temas</a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;