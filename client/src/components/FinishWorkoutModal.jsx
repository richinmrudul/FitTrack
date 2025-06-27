import React from 'react';
import { MdCheckCircle } from 'react-icons/md';

const FinishWorkoutModal = ({ isOpen, onClose, onGoToHistory }) => {
    if (!isOpen) return null;

    const modalStyle = {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        alignItems: 'center', zIndex: 9999,
        textAlign: 'center',
    };

    const modalContentStyle = {
        backgroundColor: 'var(--color-card-dark)', padding: '50px',
        borderRadius: '20px', position: 'relative', maxWidth: '400px',
        width: '90%', boxShadow: '0 8px 30px rgba(0, 0, 0, 0.8)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px',
    };

    const iconStyle = {
        fontSize: '80px',
        color: 'var(--color-primary-neon)',
        marginBottom: '15px',
    };

    return (
        <div style={modalStyle} onClick={onClose}>
            <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
                <MdCheckCircle style={iconStyle} />
                <h2 style={{ margin: 0 }}>Workout Saved!</h2>
                <p style={{ margin: '10px 0 20px 0' }}>Great job on finishing your workout. Time to rest!</p>
                <button onClick={onGoToHistory} style={{ width: '100%' }}>View History</button>
                <button onClick={onClose} style={{ width: '100%', marginTop: '10px' }}>Close</button>
            </div>
        </div>
    );
};

export default FinishWorkoutModal;