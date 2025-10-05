import React, { useState } from 'react';

const StarRatingModal = ({ isOpen, onClose, onSubmit, currentRating = 0 }) => {
  const [selectedRating, setSelectedRating] = useState(currentRating);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = () => {
    if (selectedRating > 0) {
      onSubmit(selectedRating);
    }
  };

  const handleStarClick = (rating) => {
    setSelectedRating(rating);
  };

  const handleStarHover = (rating) => {
    setHoveredRating(rating);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  const displayRating = hoveredRating || selectedRating;

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1050
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '30px',
          maxWidth: '400px',
          width: '90%',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#666',
            padding: '5px 10px'
          }}
        >
          ×
        </button>

        {/* Modal Title */}
        <h4 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
          Rate this Blog Post
        </h4>

        {/* Star Rating Display */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => handleStarClick(star)}
              onMouseEnter={() => handleStarHover(star)}
              onMouseLeave={handleStarLeave}
              style={{
                fontSize: '48px',
                cursor: 'pointer',
                color: star <= displayRating ? '#ffc107' : '#e0e0e0',
                transition: 'color 0.2s',
                marginRight: '5px',
                userSelect: 'none'
              }}
            >
              ★
            </span>
          ))}
        </div>

        {/* Rating Text */}
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px', fontSize: '18px', minHeight: '27px' }}>
          {selectedRating > 0 ? (
            <>
              <strong>{selectedRating}</strong> out of 5 stars
            </>
          ) : (
            'Click on a star to rate'
          )}
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              borderRadius: '5px',
              border: '1px solid #ddd',
              backgroundColor: 'white',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={selectedRating === 0}
            style={{
              padding: '10px 20px',
              borderRadius: '5px',
              border: 'none',
              backgroundColor: selectedRating > 0 ? '#007bff' : '#ccc',
              color: 'white',
              cursor: selectedRating > 0 ? 'pointer' : 'not-allowed',
              fontSize: '16px'
            }}
          >
            Submit Rating
          </button>
        </div>
      </div>
    </div>
  );
};

export default StarRatingModal;
