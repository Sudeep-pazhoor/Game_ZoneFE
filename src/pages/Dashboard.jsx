import React, { useContext, useEffect, useState, useRef } from 'react';
import { GameContext } from '../context/GameContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import PaymentModal from '../components/PaymentModal';
import { getPaidGames, payForGame, getUserProfile } from '../services/allApi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const { games, fetchGames } = useContext(GameContext);
    const [paidGames, setPaidGames] = useState([]);
    const [showPayment, setShowPayment] = useState(null);
    const [trialGames, setTrialGames] = useState({});
    const [profileImage, setProfileImage] = useState('https://static.vecteezy.com/system/resources/previews/023/465/688/non_2x/contact-dark-mode-glyph-ui-icon-address-book-profile-page-user-interface-design-white-silhouette-symbol-on-black-space-solid-pictogram-for-web-mobile-isolated-illustration-vector.jpg');
    const timerRefs = useRef({});
    const navigate = useNavigate();
    const toastShownRef = useRef(false);

    // Fallback for image loading errors
    const handleImageError = (e) => {
        e.target.src = 'https://static.vecteezy.com/system/resources/previews/023/465/688/non_2x/contact-dark-mode-glyph-ui-icon-address-book-profile-page-user-interface-design-white-silhouette-symbol-on-black-space-solid-pictogram-for-web-mobile-isolated-illustration-vector.jpg';
    };

    useEffect(() => {
        const fetchPaidGamesData = async () => {
            try {
                const data = await getPaidGames();
                setPaidGames(data.map(game => game._id));
            } catch (error) {
                console.error('Fetch paid games error:', error);
                if (error.response?.status !== 401 && !toastShownRef.current) {
                    toast.error('Failed to load paid games.');
                    toastShownRef.current = true;
                }
            }
        };

        const fetchUserProfile = async () => {
            try {
                const data = await getUserProfile();
                const serverUrl = process.env.NODE_ENV === 'production'
                    ? 'https://game-zoneserver.onrender.com'
                    : 'http://localhost:3000';
                const imageUrl = data.profileImage
                    ? `${serverUrl}${data.profileImage}`
                    : 'https://static.vecteezy.com/system/resources/previews/023/465/688/non_2x/contact-dark-mode-glyph-ui-icon-address-book-profile-page-user-interface-design-white-silhouette-symbol-on-black-space-solid-pictogram-for-web-mobile-isolated-illustration-vector.jpg';
                setProfileImage(imageUrl);
            } catch (error) {
                console.error('Fetch profile error:', error);
                if (!toastShownRef.current) {
                    toast.error('Failed to load profile.');
                    toastShownRef.current = true;
                }
            }
        };

        fetchPaidGamesData();
        fetchUserProfile();
        fetchGames();
    }, [fetchGames]);

    const startTrial = (gameId) => {
        if (paidGames.includes(gameId) || trialGames[gameId]) return;

        const game = games.find(g => g._id === gameId);
        if (game) {
            const newWindow = window.open(game.link, '_blank');
            setTrialGames(prev => ({ ...prev, [gameId]: true }));

            const timerId = setTimeout(() => {
                setTrialGames(prev => {
                    const newTrialGames = { ...prev };
                    delete newTrialGames[gameId];
                    return newTrialGames;
                });
                if (newWindow) newWindow.close();
                setShowPayment(gameId);
            }, 60000);

            timerRefs.current[gameId] = timerId;
        }
    };

    const handleLetsGo = (gameId) => {
        const game = games.find(g => g._id === gameId);
        if (paidGames.includes(gameId)) {
            window.open(game.link, '_blank');
        } else if (!trialGames[gameId]) {
            startTrial(gameId);
        }
    };

    const handlePay = async (gameId) => {
        const game = games.find(g => g._id === gameId);
        if (!game) {
            toast.error('Game not found.');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Please log in to make a payment.');
                return;
            }
            await payForGame({ gameId, price: game.price });
            setPaidGames(prev => [...prev, gameId]);
            setShowPayment(null);
            setTrialGames(prev => {
                const newTrialGames = { ...prev };
                delete newTrialGames[gameId];
                return newTrialGames;
            });
            clearTimeout(timerRefs.current[gameId]);
            delete timerRefs.current[gameId];
            toast.success('Paid successfully!');
            fetchGames();
        } catch (error) {
            console.error('Payment error:', error);
            toast.error('Payment failed. ' + (error.response?.data?.error || 'Please try again.'));
        }
    };

    return (
        <div style={{ backgroundColor: '#121212', color: 'white', minHeight: '130vh' }}>
            <Header />
            <Container className="py-4">
                <div className="text-center mb-4">
                    <img
                        src={profileImage}
                        alt="Profile"
                        style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            cursor: 'pointer',
                            border: '2px solid #fff'
                        }}
                        onError={handleImageError}
                        onClick={() => navigate('/profile')}
                    />
                </div>
                <Row className="g-4 justify-content-center">
                    {games.map((game) => (
                        <Col key={game._id} xs={12} sm={6} md={4} lg={3} className="d-flex justify-content-center">
                            <Card style={{ width: '100%', maxWidth: '18rem', backgroundColor: '#1e1e1e', color: 'white' }}>
                                <Card.Img variant="top" src={game.image} style={{ height: '180px', objectFit: 'cover' }} />
                                <Card.Body className="text-center">
                                    <Card.Title>{game.title}</Card.Title>
                                    <p>Price: ₹{game.price.toFixed(2)}</p>
                                    <Button
                                        variant="primary"
                                        onClick={() => handleLetsGo(game._id)}
                                        disabled={showPayment === game._id}
                                    >
                                        Let's Go
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
            <Footer />
            <PaymentModal
                show={!!showPayment}
                handleClose={() => setShowPayment(null)}
                onPay={() => handlePay(showPayment)}
                gameTitle={games.find(g => g._id === showPayment)?.title || 'Your Game'}
                price={games.find(g => g._id === showPayment)?.price || 5}
            />
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
}

export default Dashboard;