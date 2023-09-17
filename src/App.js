import { useEffect, useState } from 'react';
import axios from 'axios';

import './App.css'
import { FadingDiv, SetDisplay } from './components';
import { TRANSITION_DURATION, dateStrToObj } from './util';
import { background, spinner, spotifyLogo }from './assets';

const App = () => {
  const [currPage, setCurrPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);
  const [results, setResults] = useState([]);
  
  useEffect(() => {
    if (currPage < 0) {
      setTimeout(() => {
        setCurrPage(currPage * -1)
      }, TRANSITION_DURATION);
    }
  }, [currPage])
  
  const nextPage = () => {
    setCurrPage((currPage + 1) * -1);
  }
  
  const prevPage = () => {
    setCurrPage((currPage - 1) * -1);
  }
  
  const renderResults = () => {
    
  }

  return (
    <div className='wrapper'>
      <img src={background} alt='a concert crowd' className='background'/>
      <div className='background-overlay'></div>
      <div className='container'>
        <div className='navbar'>
          <FadingDiv persist show={currPage > 1}>
            <button 
              className='light-btn back-btn' 
              onClick={currPage > 1 ? prevPage : ()=>{}} 
              style={currPage <= 1 ? {cursor: 'default'} : {}}
            >
              <span className='back-icon'>{'<'}</span>Back
            </button>
          </FadingDiv>
          <FadingDiv
            persist
            show={currPage > 1}
            style={{cursor: currPage > 1 ? 'pointer' : 'default'}}
            onClick={currPage > 1 ? () => {setCurrPage(-1)} : () => {}}
          >
            <h1 className='logo-title'>set<span className="title-em">UP</span></h1>
            <h2 className='logo-subtitle'>
              for <img src={spotifyLogo} alt='spotify' className='logo-spotify-logo'/>
            </h2>
          </FadingDiv>
          <div>
            <button className='light-btn'>Log In</button>
          </div>
        </div>
        {/* PAGE ONE */}
        <FadingDiv show={currPage === 1} className='page-one'>
          <div className='title-wrapper'>
            <h1 className='title'>set<span className="title-em">UP</span></h1>
            <h2 className='subtitle'>
              for <img src={spotifyLogo} alt='spotify' className='spotify-logo'/>
            </h2>
          </div>
          <div className='search-input-wrapper'>
            {!showSpinner ?
              (<>
                <input 
                  type='text'
                  placeholder='Search an artist'
                  value={search} 
                  className="search-input"
                  onChange={ (e) => { setSearch(e.target.value); }}
                  onKeyDown = { (e) => {
                    if (e.key === 'Enter' && search.trim().length) {
                      setShowSpinner(true);
                      axios.get('https://setup-for-spotify.onrender.com/search', { params: {q: search} })
                        .then((res) => {
                          nextPage();
                          if (res.data){
                            setResults(res.data.setlist);
                          } else {
                            setResults([])
                          }
                          setShowSpinner(false);
                        })
                    }
                  }}
                />
                <p className='search-input-description'>press enter to search</p>
              </>) :
              (<img src={spinner} alt='loading icon' className="spinner"/>)
            }
          </div>
        </FadingDiv>
        {/* PAGE TWO */}
        <FadingDiv show={currPage === 2} className='page-two'>
          <p className='results-prompt'>Showing results for '{search}'</p>
          <div className='results-container'>
            {results?.map((val, idx) => (
              <SetDisplay key={idx} {...{...val, date: dateStrToObj(val.eventDate)}}/>
            ))}
          </div>
          <div className='result-container'>
            
          </div>
        </FadingDiv>
        {/* PAGE THREE*/}
          {/* <button
            className='search-button'
            onClick={() => console.log(search)}
          >
            Generate Playlist
          </button> */}
      </div>
    </div>
  );
}

export default App;
