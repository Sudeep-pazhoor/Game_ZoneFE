import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Use named import

function About() {
    const navigate = useNavigate();

    const getUsername = () => {
        const token = localStorage.getItem('token');
        if (!token) return 'User';

        try {
            const decoded = jwtDecode(token);
            return decoded.username || 'User';
        } catch (error) {
            console.error('Error decoding token:', error);
            return 'User';
        }
    };

    const username = getUsername();

    return (
        <div
            style={{
                position: 'relative',minHeight: '100vh',backgroundColor: '#121212',color: 'white',overflow: 'hidden',
            }}
        >
            <video
                autoPlay
                loop
                muted
                style={{
                    position: 'absolute',top: 0,left: 0,width: '100%',height: '100%',objectFit: 'cover',zIndex: 0,opacity: 0.3,
                }}
            >
                <source src="https://cdn.pixabay.com/video/2021/04/28/72488-543388303_large.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            <div
                style={{
                    position: 'absolute',width: '100%',height: '100%',backgroundColor: 'rgba(0, 0, 0, 0.6)',zIndex: 1,
                }}
            ></div>

            <div style={{ position: 'relative', zIndex: 2, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Container className="py-5 flex-grow-1">
                    <div className="text-center mb-5">
                        <h1 className="display-4 fw-bold">
                            Welcome {username} to <span className="text-warning">GameZone</span>
                        </h1>
                        <p className="lead text-muted">
                            Your ultimate destination for thrilling gaming experiences!
                        </p>
                    </div>

                    <Row className="justify-content-center mb-5">
                        <Col md={8}>
                            <p className="text-center">
                                At GameZone, we bring you a curated collection of exciting games to explore and enjoy. Whether you're a casual gamer or a dedicated enthusiast, our platform offers something for everyone. Dive into our small games, purchase premium access to unlock exclusive content, and join our growing community of players.
                            </p>
                            <p className="text-center">
                                <strong>Contact Us:</strong> Reach out to us at <a href="mailto:sudeeppazhoor@gmail.com" className="text-warning">sudeeppazhoor@gmail.com</a> or follow us on Instagram at <a href="https://instagram.com/sudeep_pahoor" className="text-warning">@sudeep_pazhoor</a> for the latest updates and promotions.
                            </p>
                        </Col>
                    </Row>

                    <Row className="justify-content-center">
                        <Col md={6} lg={4}>
                            <Card
                                style={{
                                    backgroundColor: '#1e1e1e',color: 'white',border: 'none',boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',transition: 'transform 0.3s',cursor: 'pointer',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                                onClick={() => navigate('/dashboard')}
                            >
                                <Card.Body className="text-center">
                                    <Card.Title className="mb-3">
                                        <i className="fa-solid fa-gamepad text-warning me-2"></i>
                                        Explore Games
                                    </Card.Title>
                                    <Card.Text>
                                        Dive into our collection of games and start playing now!
                                    </Card.Text>
                                    <Button
                                        variant="outline-warning"
                                        style={{
                                            borderRadius: '20px',padding: '8px 20px',
                                        }}>
                                        Go to Dashboard
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
}

export default About;