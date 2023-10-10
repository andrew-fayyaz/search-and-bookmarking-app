import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';

const Favorites = ({ favorites, handleFavorite }) => {
  return (
    <div className='border rounded-3 mt-2 px-2 py-3 fav-col'>
      <h4 className='fw-bold text-capitalize'>Favorites list</h4>
      <ListGroup>
        {favorites.map((fav) => (
          <ListGroup.Item key={fav.id} className='my-2 rounded-2 border-0 text-start position-relative'>
            <div className='flex flex-column'>
              <p className='me-4'><strong>Name:</strong> {fav.name ? fav.name : 'No Name'}</p>
              <p><strong>Owner:</strong> {fav.owner.login ? fav.owner.login : 'No Owner'}</p>
              <p><strong>Description:</strong> {fav.description ? fav.description : 'No Description'}</p>
              <p><strong>Stars:</strong> {fav.stargazers_count ? fav.stargazers_count : '0'}</p>
            </div>
            <button className='btn btn-sm border-0 position-absolute top-0 end-0 m-2 p-0 favorite-btn' onClick={() => handleFavorite(fav)}>
              <svg class="feather feather-heart" fill="#FF0000" height="24" stroke="#FF0000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default Favorites;
