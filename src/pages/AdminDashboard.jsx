import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { addGame, editGame, deleteGame, getAllGames } from '../services/allApi';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
    const [games, setGames] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newLink, setNewLink] = useState('');
    const [newImage, setNewImage] = useState('');
    const [newPrice, setNewPrice] = useState('');
    const [editTitle, setEditTitle] = useState('');
    const [editLink, setEditLink] = useState('');
    const [editImage, setEditImage] = useState('');
    const [editPrice, setEditPrice] = useState('');
    const [editId, setEditId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchGames();
    }, []);

    const fetchGames = async () => {
        try {
            const response = await getAllGames();
            setGames(response);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddGame = async () => {
        try {
            await addGame({ title: newTitle, link: newLink, image: newImage, price: newPrice || 5 });
            fetchGames();
            setShowAddModal(false);
            setNewTitle(''); setNewLink(''); setNewImage(''); setNewPrice('');
        } catch (error) {
            console.error(error);
        }
    };

    const handleEditGame = async () => {
        try {
            await editGame(editId, { title: editTitle, link: editLink, image: editImage, price: editPrice || 5 });
            fetchGames();
            setShowEditModal(false);
            setEditId(null); setEditTitle(''); setEditLink(''); setEditImage(''); setEditPrice('');
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteGame(id);
            setGames(games.filter(game => game._id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    const openEditModal = (game) => {
        setEditId(game._id);
        setEditTitle(game.title);
        setEditLink(game.link);
        setEditImage(game.image);
        setEditPrice(game.price || '');
        setShowEditModal(true);
    };

    return (
        <div style={{ backgroundColor: '#121212', color: 'white', minHeight: '130vh' }}>
            <Header />
            <Container className="py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="text-center">Admin Dashboard</h2>
                    <div>
                        <Button variant="success" onClick={() => setShowAddModal(true)} className="me-2">+ Add New Game</Button>
                        <Button variant="primary" onClick={() => navigate('/purchase-history')}>Purchase History</Button>
                    </div>
                </div>
                <Row className="g-4 justify-content-center">
                    {games.map((game) => (
                        <Col key={game._id} xs={12} sm={6} md={4} lg={3} className="d-flex justify-content-center">
                            <Card style={{ width: '100%', maxWidth: '18rem', backgroundColor: '#1e1e1e', color: 'white' }}>
                                <Card.Img variant="top" src={game.image} style={{ height: '180px', objectFit: 'cover' }} />
                                <Card.Body className="text-center">
                                    <Card.Title>{game.title}</Card.Title>
                                    <p>Price: ${game.price.toFixed(2)}</p>
                                    <div className="d-flex justify-content-between">
                                        <Button variant="outline-warning" onClick={() => openEditModal(game)}><i className="fa-solid fa-pen"></i></Button>
                                        <Button variant="outline-danger" onClick={() => handleDelete(game._id)}><i className="fa-solid fa-trash"></i></Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
            <Footer />

            {/* Game Modal */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
                <Modal.Header closeButton><Modal.Title>Add New Game</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Enter title" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Link</Form.Label>
                            <Form.Control type="text" value={newLink} onChange={(e) => setNewLink(e.target.value)} placeholder="Enter link" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Image URL</Form.Label>
                            <Form.Control type="text" value={newImage} onChange={(e) => setNewImage(e.target.value)} placeholder="Enter image URL" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Price ($)</Form.Label>
                            <Form.Control type="number" step="0.01" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder="Enter price (default: 5)" />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleAddGame}>Add Game</Button>
                </Modal.Footer>
            </Modal>

            {/* Edit Game Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton><Modal.Title>Edit Game</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Enter title" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Link</Form.Label>
                            <Form.Control type="text" value={editLink} onChange={(e) => setEditLink(e.target.value)} placeholder="Enter link" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Image URL</Form.Label>
                            <Form.Control type="text" value={editImage} onChange={(e) => setEditImage(e.target.value)} placeholder="Enter image URL" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Price ($)</Form.Label>
                            <Form.Control type="number" step="0.01" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} placeholder="Enter price (default: 5)" />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleEditGame}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default AdminDashboard;