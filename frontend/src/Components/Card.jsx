import React from 'react';
import { Link } from 'react-router-dom';

function Card({ title, description, linkTo, buttonText, imageUrl }) {
  return (
    <div className="card h-100 text-center" style={{ maxWidth: '320px', margin: '0 auto' }}>
      {imageUrl && (
        <img
          src={imageUrl}
          className="card-img-top"
          alt={title}
          style={{ height: '180px', objectFit: 'cover' }}
        />
      )}
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{title}</h5>
        <p className="card-text flex-grow-1">{description}</p>
        <Link to={linkTo} className="btn btn-primary mt-auto">
          {buttonText}
        </Link>
      </div>
    </div>
  );
}

export default Card;
