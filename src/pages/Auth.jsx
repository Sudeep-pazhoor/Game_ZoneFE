import React, { useState } from 'react';
import { Row, Col, Form, FloatingLabel, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { loginAdmin, loginUser, registerUser } from '../services/allApi';

function AuthPage() {
    const [authStatus, setAuthStatus] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [user, setUser] = useState({ username: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = isAdmin
                ? await loginAdmin({ email: user.email, password: user.password })
                : await loginUser({ email: user.email, password: user.password });
            localStorage.setItem('token', response.token);
            navigate(isAdmin ? '/admin' : '/about'); // Redirect users to /about, admins to /admin
        } catch (error) {
            console.error(error);
            alert('Login failed. Check credentials.');
        }
    };

    const handleSignUp = async () => {
        try {
            await registerUser(user);
            setAuthStatus(false);
            alert('Sign up successful. Please sign in.');
        } catch (error) {
            console.error(error);
            alert('Sign up failed.');
        }
    };

    const changeStatus = () => {
        setAuthStatus(!authStatus);
    };

    return (
        <div style={{ backgroundColor: '#121212', color: 'white', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Container className="p-4" style={{ maxWidth: '800px', backgroundColor: '#1e1e1e', borderRadius: '10px', boxShadow: '0px 0px 10px rgba(255, 255, 255, 0.1)' }}>
                <div className="text-center mb-3">
                    <Button variant={isAdmin ? "secondary" : "primary"} onClick={() => setIsAdmin(false)}>User</Button>
                    <Button variant={isAdmin ? "primary" : "secondary"} className="ms-2" onClick={() => setIsAdmin(true)}>Admin</Button>
                    {/*primary and secondary =>blue,grey like that,its jst a predefined variants for the Button component.*/}
                </div>
                <Row>
                    <Col xs={12} md={6} className="d-flex align-items-center justify-content-center">
                        <img src="https://giffiles.alphacoders.com/163/163062.gif" alt="img" className="img-fluid rounded" style={{ maxHeight: '250px' }} />
                    </Col>
                    <Col xs={12} md={6}>
                        {isAdmin ? (
                            <>
                                <h2 className="text-center">Admin Login</h2>
                                <FloatingLabel controlId="floatingInput" label="Email address" className="mb-3">
                                    <Form.Control type="email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} placeholder="name@example.com" />
                                </FloatingLabel>
                                <FloatingLabel controlId="floatingPassword" label="Password">
                                    <Form.Control type="password" value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} placeholder="Password" />
                                </FloatingLabel>
                                <div className="d-flex justify-content-center mt-4">
                                    <Button className="btn btn-success" onClick={handleLogin}>LOGIN</Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h2 className="text-center">{authStatus ? "SIGN UP" : "SIGN IN"}</h2>
                                <FloatingLabel controlId="floatingInput" label="Email address" className="mb-3">
                                    <Form.Control type="email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} placeholder="name@example.com" />
                                </FloatingLabel>
                                {authStatus && (
                                    <FloatingLabel controlId="floatingInput" label="User Name" className="mb-3">
                                        <Form.Control type="text" value={user.username} onChange={(e) => setUser({ ...user, username: e.target.value })} placeholder="User Name" />
                                    </FloatingLabel>
                                )}
                                <FloatingLabel controlId="floatingPassword" label="Password">
                                    <Form.Control type="password" value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} placeholder="Password" />
                                </FloatingLabel>
                                <div className="d-flex justify-content-between mt-4">
                                    {authStatus ? <Button className="btn btn-success" onClick={handleSignUp}>SIGN UP</Button> : <Button className="btn btn-success" onClick={handleLogin}>SIGN IN</Button>}
                                    {authStatus ? <Button className="btn btn-link" onClick={changeStatus}>Already a user?</Button> : <Button className="btn btn-link" onClick={changeStatus}>New user?</Button>}
                                </div>
                            </>
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default AuthPage;