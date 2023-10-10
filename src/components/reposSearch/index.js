import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import Favorites from '../favorite';

const ReposSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPagination, setShowPagination] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showFavoritesColumn, setShowFavoritesColumn] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const resultsPerPage = 10;
  const [isEmpty, setIsEmpty] = useState(false);
  const totalResults = results.length;
  const totalPages = Math.ceil(totalResults / resultsPerPage);

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(`https://api.github.com/search/repositories?q=${query}`);
      setResults(response.data.items);
      setShowPagination(response.data.items.length > 10);
      setError(null);
      if(response?.data.total_count == 0) {
        setError('Searched repository doesn\'t exist.');
        setIsEmpty(true);
      }
    } catch (error) {
      console.error('Error fetching GitHub API:', error);
      setShowPagination(false);
      setResults([]);
      setError('Searched repository doesn\'t exist.');
      setIsEmpty(false);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected + 1);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchData();
      setIsEmpty(false)
    }
  };

  const handleFavorite = (result) => {
    const isFavorite = favorites.some((fav) => fav.id === result.id);

    if (isFavorite) {
      const updatedFavorites = favorites.filter((fav) => fav.id !== result.id);
      setFavorites(updatedFavorites);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      
      if(updatedFavorites.length == 0) {
        setShowFavoritesColumn(false);
      }
    } else {
      const updatedFavorites = [...favorites, result];
      setFavorites(updatedFavorites);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));

      if(updatedFavorites.length > 0) {
        setShowFavoritesColumn(true);
      }
    }
  };

  useEffect(() => {
    query?.length > 1 && fetchData();
  }, [currentPage]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites);

    const handleBeforeUnload = () => {
      localStorage.clear();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };

  }, []);

  return (
    <>
      <div className='col-12 col-sm-7 col-lg-5 mx-auto'>
        <InputGroup className="my-4 position-relative w-100 w-md-50">
          <InputGroup.Text className='bg-transparent border-0 position-absolute set-position'>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M17.5 17.5L14.5834 14.5833M16.6667 9.58333C16.6667 13.4954 13.4954 16.6667 9.58333 16.6667C5.67132 16.6667 2.5 13.4954 2.5 9.58333C2.5 5.67132 5.67132 2.5 9.58333 2.5C13.4954 2.5 16.6667 5.67132 16.6667 9.58333Z" stroke="#667085" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </InputGroup.Text>  
          <Form.Control 
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); query?.length == 0 && setIsEmpty(false); setError('') }}
            onKeyPress={handleKeyPress}
            placeholder="Search GitHub Repository"
            className='rounded-3 ps-5'
          />
        </InputGroup>
      </div>
      {(error && isEmpty) && (
        <div className={`col-12 col-lg-8 mx-auto mb-4 ${error ? '' : 'd-none'}`}>
          <p className="text-white">{error}</p>
        </div>
      )}
      {isLoading && (
        <div className="d-flex flex-column justify-content-center align-items-center text-white mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" enableBackground="new 0 0 0 0">
            <path fill="#fff" d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
              <animateTransform 
                attributeName="transform" 
                attributeType="XML" 
                type="rotate"
                dur="1s" 
                from="0 50 50"
                to="360 50 50" 
                repeatCount="indefinite" />
            </path>
          </svg>
          <p>Loading Data...</p>
        </div>
      )}
      <div className='col-12 col-lg-8 mx-auto mb-4'>
        {results.length > 0 && (
          <ListGroup>
            {results.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage).map((result) => (
              <ListGroup.Item as="li" key={result.id} className='my-2 rounded-2 border-0 text-start position-relative'>
                <div className='flex flex-column'>
                  <p className='me-4'><strong>Name:</strong> {result.name ? result.name : 'No Name'}</p>
                  <p><strong>Owner:</strong> {result.owner.login ? result.owner.login : 'No Owner'}</p>
                  <p><strong>Description:</strong> {result.description ? result.description : 'No Description'}</p>
                  <p><strong>Stars:</strong> {result.stargazers_count ? result.stargazers_count : '0'}</p>
                </div>
                <button className='btn btn-sm border-0 position-absolute top-0 end-0 m-2 p-0 favorite-btn' onClick={() => handleFavorite(result)}>
                  {favorites.some((fav) => fav.id === result.id)
                    ? (<svg fill="#FF0000" height="24" stroke="#FF0000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>)
                    : (<svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>)
                  }
                </button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}

        {showPagination && (
          <div className='mt-3 d-flex justify-content-center flex-wrap gap-2'>
            <ReactPaginate
              previousLabel={'Previous'}
              nextLabel={'Next'}
              breakLabel={'...'}
              pageCount={totalPages}
              marginPagesDisplayed={1}
              pageRangeDisplayed={3}
              onPageChange={handlePageChange}
              containerClassName={'d-flex flex-wrap gap-2 pagination'}
              activeClassName={'active'}
              pageClassName="page-item"
              pageLinkClassName="btn btn-light border-0"
              previousClassName="page-item"
              previousLinkClassName="btn btn-primary border-0"
              nextClassName="page-item"
              nextLinkClassName="btn btn-primary border-0"
              breakClassName="page-item"
              breakLinkClassName="btn btn-light border-0"
            />
          </div>
        )}
      </div>

      {showFavoritesColumn && (
        <div className='col-12 col-lg-4 mx-auto mb-3 mb-lg-0'>
          <Favorites favorites={favorites} handleFavorite={handleFavorite} />
        </div>
      )}
    </>
  );
};

export default ReposSearch;