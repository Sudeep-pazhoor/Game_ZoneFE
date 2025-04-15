import React, { useContext, useEffect, useState, useRef } from 'react';
import { GameContext } from '../context/GameContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import PaymentModal from '../components/PaymentModal';
import { getPaidGames, payForGame } from '../services/allApi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Dashboard() {
    const { games, fetchGames } = useContext(GameContext);
    const [paidGames, setPaidGames] = useState([]);
    const [showPayment, setShowPayment] = useState(null);
    const [trialGames, setTrialGames] = useState({}); // Track trial status per game
    const timerRefs = useRef({}); // Use ref to store timer IDs

    useEffect(() => {
        const fetchPaidGamesData = async () => {
            try {
                const data = await getPaidGames();
                setPaidGames(data.map(game => game._id));
            } catch (error) {
                console.error('Fetch paid games error:', error);
                if (error.response?.status !== 401) {
                    toast.error('Failed to load paid games.');
                }
            }
        };
        fetchPaidGamesData();
        fetchGames();
    }, [fetchGames]);

    const startTrial = (gameId) => {
        if (paidGames.includes(gameId) || trialGames[gameId]) return;

        const game = games.find(g => g._id === gameId);
        if (game) {
            const newWindow = window.open(game.link, '_blank');//Opens game link in a new window/tab=>if ('_self'),opens in self tab
            setTrialGames(prev => ({ ...prev, [gameId]: true }));// Marks game as in trial

            const timerId = setTimeout(() => {
                setTrialGames(prev => {
                    const newTrialGames = { ...prev };
                    delete newTrialGames[gameId];
                    return newTrialGames;
                });
                if (newWindow) newWindow.close(); // Attempt to close trial window
                setShowPayment(gameId); // Open payment modal after trial
            }, 60000); // 1-minute trial

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
            clearTimeout(timerRefs.current[gameId]); // Clear trial timer on payment
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
                <h2 className="text-center mb-4">Games</h2>
                <Row className="g-4 justify-content-center">
                    {games.map((game) => (
                        <Col key={game._id} xs={12} sm={6} md={4} lg={3} className="d-flex justify-content-center">
                            <Card style={{ width: '100%', maxWidth: '18rem', backgroundColor: '#1e1e1e', color: 'white' }}>
                                <Card.Img variant="top" src={game.image} style={{ height: '180px', objectFit: 'cover' }} />
                                <Card.Body className="text-center">
                                    <Card.Title>{game.title}</Card.Title>
                                    <p>Price: ${game.price.toFixed(2)}</p>{/* //eg:9.99 */}
                                    <Button
                                        variant="primary"
                                        onClick={() => handleLetsGo(game._id)}
                                        disabled={showPayment === game._id} // Only disable during payment modal
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