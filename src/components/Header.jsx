import React from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

function Header() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <Navbar style={{ background: 'linear-gradient(90deg, #1e1e1e, #292929)', padding: '10px 0' }}>
            <Container className="d-flex justify-content-between align-items-center">
                <Navbar.Brand href="" className="text-light fw-bold fs-4">
                    <i className="fa-solid fa-gamepad text-warning me-2"></i>
                    Game<span className="text-warning">Zone</span>
                </Navbar.Brand>
                <button
                    className="btn btn-danger px-3 fw-bold d-flex align-items-center"
                    style={{ transition: '0.3s' }}
                    onClick={handleLogout}
                    onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                    onMouseLeave={(e) => e.target.style.opacity = '1'}
                >
                    Logout <i className="fa-solid fa-arrow-right-from-bracket ms-2"></i>
                </button>
            </Container>
        </Navbar>
    );
}

export default Header;