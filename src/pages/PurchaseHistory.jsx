import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { getPurchaseHistory, removePurchase } from '../services/allApi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function PurchaseHistory() {
    const [purchaseHistory, setPurchaseHistory] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteData, setDeleteData] = useState(null);

    useEffect(() => {
        fetchPurchaseHistory();
    }, []);

    const fetchPurchaseHistory = async () => {
        try {
            const data = await getPurchaseHistory();
            setPurchaseHistory(data);
        } catch (error) {
            console.error('Error fetching purchase history:', error);
        }
    };

    const openDeleteModal = (purchase) => {
        setDeleteData(purchase);
        setShowDeleteModal(true);
    };

    const handleDeletePurchase = async () => {
        if (deleteData) {
            try {
                await removePurchase({ userId: deleteData.userId, gameId: deleteData.gameId });
                setPurchaseHistory(purchaseHistory.filter(p => p.userId !== deleteData.userId || p.gameId !== deleteData.gameId));
                setShowDeleteModal(false);
                setDeleteData(null);
                toast.success('Purchase removed successfully!');
                fetchPurchaseHistory(); // Refresh history
            } catch (error) {
                console.error('Error removing purchase:', error);
                toast.error('Failed to remove purchase.');
            }
        }
    };

    return (
        <div style={{ backgroundColor: '#121212', color: 'white', minHeight: '130vh' }}>
            <Header />
            <Container className="py-4">
                <h2 className="text-center mb-4">Purchase History</h2>
                <Row className="g-4 justify-content-center">
                    {purchaseHistory.length > 0 ? (
                        purchaseHistory.map((purchase, index) => {
                            const purchaseDate = purchase.purchaseTime ? new Date(purchase.purchaseTime) : new Date();
                            const isValidDate = !isNaN(purchaseDate.getTime());

                            return (
                                <Col key={index} xs={12} sm={6} md={4} lg={3} className="d-flex justify-content-center">
                                    <Card style={{ width: '100%', maxWidth: '18rem', backgroundColor: '#1e1e1e', color: 'white' }}>
                                        <Card.Body className="text-center">
                                            <Card.Title>Username: {purchase.username}</Card.Title>
                                            <Card.Text>Email: {purchase.email || 'N/A'}</Card.Text> {/* Add email */}
                                            <Card.Text>Game: {purchase.gameTitle}</Card.Text>
                                            <Card.Text>Amount: ₹{purchase.gameAmount.toFixed(2)}</Card.Text> {/* Changed $ to ₹ */}
                                            <Card.Text>
                                                Time: {isValidDate ? purchaseDate.toLocaleString() : 'N/A'}
                                            </Card.Text>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => openDeleteModal(purchase)}
                                                className="mt-2"
                                            >
                                                <i className="fa-solid fa-trash"></i> Delete
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            );
                        })
                    ) : (
                        <p className="text-center">No purchase history available.</p>
                    )}
                </Row>
            </Container>
            <Footer />

            {/* Delete Purchase Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton><Modal.Title>Confirm Delete</Modal.Title></Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete the purchase for {deleteData?.username} - {deleteData?.gameTitle}?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDeletePurchase}>Delete</Button>
                </Modal.Footer>
            </Modal>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
}

export default PurchaseHistory;