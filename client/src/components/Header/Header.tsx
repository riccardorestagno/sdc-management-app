import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../pages/Login/authContext';
import { useContext } from 'react';
import './Header.css';

export const Header = () => {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext)!;

    return (
        <header className='header'>
            <button className="logoutButton" onClick={() => { logout(); navigate("/login"); }}>
                Logout
            </button>
        </header>
    );
};

export default Header;
