import React, { useEffect, useState, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Container, Row, Col, Table, Button, Form } from 'react-bootstrap';
import { getPaidGames, uploadProfileImage, getUserProfile, deleteProfileImage } from '../services/allApi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom';

function Profile() {
    const [profileImage, setProfileImage] = useState('https://placehold.co/150x150');
    const [paidGames, setPaidGames] = useState([]);
    const [file, setFile] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0); // Trigger for re-fetching
    const toastShownRef = useRef(false);
    const location = useLocation();

    // Fallback for image loading errors
    const handleImageError = (e) => {
        e.target.src = 'https://placehold.co/150x150?text=Default';
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await getUserProfile();
                const serverUrl = process.env.NODE_ENV === 'production'
                    ? 'https://game-zoneserver.onrender.com'
                    : 'http://localhost:3000';
                const imageUrl = userData.profileImage
                    ? `${serverUrl}${userData.profileImage}`
                    : 'https://placehold.co/150x150';
                setProfileImage(imageUrl);
                const gamesData = await getPaidGames();
                setPaidGames(gamesData);
            } catch (error) {
                console.error('Fetch user data error:', error);
                if (!toastShownRef.current) {
                    toast.error('Failed to load user data.');
                    toastShownRef.current = true;
                }
            }
        };
        fetchUserData();
    }, [location.pathname, refreshTrigger]); // Re-run on navigation or refresh trigger

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedFormats.includes(selectedFile.type)) {
                toast.error('Invalid file format. Only JPEG, JPG, or PNG allowed.');
                setFile(null);
                return;
            }
            //  file size (5MB = 5 * 1024 * 1024 bytes)
            if (selectedFile.size > 5 * 1024 * 1024) {
                toast.error('File too large. Maximum size is 5MB.');
                setFile(null);
                return;
            }
            setFile(selectedFile);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            toast.error('Please select a file to upload.');
            return;
        }
        try {
            const formData = new FormData();
            formData.append('profileImage', file);
            console.log('Uploading file:', file.name, file.size, file.type);
            const response = await uploadProfileImage(formData);
            const serverUrl = process.env.NODE_ENV === 'production'
                ? 'https://game-zoneserver.onrender.com'
                : 'http://localhost:3000';
            setProfileImage(`${serverUrl}${response.profileImage}`);
            toast.success('Profile image uploaded successfully!');
            setFile(null);
            setRefreshTrigger(prev => prev + 1); // Trigger re-fetch
        } catch (error) {
            console.error('Upload error:', error);
            toast.error(error.response?.data?.error || 'Failed to upload profile image.');
        }
    };

    const handleDeleteImage = async () => {
        if (!window.confirm('Are you sure you want to delete your profile image?')) {
            return;
        }
        try {
            await deleteProfileImage();
            setProfileImage('https://placehold.co/150x150');
            toast.success('Profile image deleted successfully!');
            setRefreshTrigger(prev => prev + 1); // Trigger re-fetch
        } catch (error) {
            console.error('Delete image error:', error);
            toast.error(error.response?.data?.error || 'Failed to delete profile image.');
        }
    };

    return (
        <div style={{ backgroundColor: '#121212', color: 'white', minHeight: '130vh' }}>
            <Header />
            <Container className="py-4">
                <Row>
                    <Col md={4} className="text-center">
                        <h3>Profile Image</h3>
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                            <img
                                src={profileImage}
                                alt="Profile"
                                style={{
                                    width: '200px',
                                    height: '200px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    marginBottom: '20px',
                                    border: '2px solid #fff'
                                }}
                                onError={handleImageError}
                            />
                            {profileImage && profileImage !== 'https://placehold.co/150x150' && (
                                <i
                                    className="fa-solid fa-trash"
                                    style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        color: '#dc3545',
                                        cursor: 'pointer',
                                        fontSize: '20px',
                                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                        borderRadius: '50%',
                                        padding: '5px',
                                        transition: 'color 0.2s, transform 0.2s'
                                    }}
                                    onClick={handleDeleteImage}
                                    onMouseEnter={(e) => {
                                        e.target.style.color = '#c82333';
                                        e.target.style.transform = 'scale(1.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.color = '#dc3545';
                                        e.target.style.transform = 'scale(1)';
                                    }}
                                    title="Delete Profile Image"
                                />
                            )}
                        </div>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Control type="file" accept="image/jpeg,image/jpg,image/png" onChange={handleFileChange} />
                        </Form.Group>
                        <Button variant="primary" onClick={handleUpload}>
                            Upload Image
                        </Button>
                    </Col>
                    <Col md={8}>
                        <h3>Purchased Games</h3>
                        {paidGames.length > 0 ? (
                            <Table striped bordered hover variant="dark">
                                <thead>
                                    <tr>
                                        <th>Game Name</th>
                                        <th>Link</th>
                                        <th>Price (₹)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paidGames.map((game) => (
                                        <tr key={game._id}>
                                            <td>{game.title}</td>
                                            <td>
                                                {game.link && game.link.trim() !== '' ? (
                                                    <a
                                                        href={game.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{ color: '#0d6efd' }}
                                                    >
                                                        Play Now
                                                    </a>
                                                ) : (
                                                    <span>No link available</span>
                                                )}
                                            </td>
                                            <td>₹{game.price.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        ) : (
                            <p>No purchased games found.</p>
                        )}
                    </Col>
                </Row>
            </Container>
            <Footer />
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
}

export default Profile;