import React from 'react';
import { Link } from 'react-router-dom';

function Card({ title, description, linkTo, buttonText }) {
  return (
    <div className="card text-center" style={{ maxWidth: '400px', margin: '0 auto' }}>
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{description}</p>
        <Link to={linkTo} className="btn btn-primary">
          {buttonText}
        </Link>
      </div>
    </div>
  );
}

export default Card;
