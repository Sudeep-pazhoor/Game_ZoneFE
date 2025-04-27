import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const PaymentModal = ({ show, handleClose, onPay, gameTitle, price }) => {
    
    const qrScannerImg = 'https://storage.googleapis.com/dara-c1b52.appspot.com/daras_ai/media/a3202e58-17ef-11ee-9a70-8e93953183bb/cleaned_qr.png'; 
    const googlePayImg = 'https://png.pngtree.com/png-clipart/20230916/original/pngtree-google-pay-icon-vector-png-image_12256720.png'; 
    const bhimImg = 'https://img.icons8.com/fluent/512/bhim.png'; 
    const phonePeImg = 'https://w7.pngwing.com/pngs/332/615/png-transparent-phonepe-india-unified-payments-interface-india-purple-violet-text-thumbnail.png'; 
    const paytmImg = 'https://w7.pngwing.com/pngs/305/719/png-transparent-paytm-ecommerce-shopping-social-icons-circular-color-icon-thumbnail.png'; 

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Pay for {gameTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
                <div style={{ marginBottom: '20px' }}>
                    <img
                        src={qrScannerImg}
                        alt="QR Scanner"
                        style={{ width: '100px', height: '100px', marginBottom: '10px' }}
                    />
                    <p>Scan the QR code using any UPI app</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
                    <img src={googlePayImg} alt="Google Pay" style={{ width: '40px', height: '40px' }} />
                    <img src={bhimImg} alt="BHIM" style={{ width: '40px', height: '40px' }} />
                    <img src={phonePeImg} alt="PhonePe" style={{ width: '40px', height: '40px' }} />
                    <img src={paytmImg} alt="Paytm" style={{ width: '40px', height: '40px' }} />
                </div>
                <p><strong>UPI ID: Pay with this ID and CLICK on Pay Now, so you can use the game</strong></p>
                <p style={{ fontSize: '12px', color: '#666' }}>
                    Please note: If we determine that payment has not been received, we will send a warning email and take appropriate action in accordance with our policies in ₹.
                </p>
                <p><strong>Total Amount: ₹{price.toFixed(2)}</strong></p> 
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={onPay}>
                    Pay Now
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PaymentModal;