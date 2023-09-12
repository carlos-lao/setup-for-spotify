import { useState } from 'react';
import setlistfm from 'setlistfm-js';

import './App.css'
import background from './assets/background.jpeg';
import spotifyLogoWhite from './assets/spotify-logo-white.png'

const App = () => {
  const [search, setSearch] = useState("");
  const setlistfmClient = new setlistfm({
    key: process.env.REACT_APP_SETLISTFM_AUTH_TOKEN,
    format: "json",
  })

  return (
    <div className='wrapper'>
      <img src={background} alt='a concert crowd' className='background'/>
      <div className='content'>
        <div className='container'>
          <div className='title-wrapper'>
            <h1 className='title'>set<span className="title-em">UP</span></h1>
            <h2 className='subtitle'>
              for <img src={spotifyLogoWhite} alt='spotify' className='spotify-logo'/>
            </h2>
          </div>
          <div className='search-input-wrapper'>
            <input 
              type='text'
              placeholder='Search an artist or tour'
              value={search} 
              className="search-input"
              onChange={ (e) => { setSearch(e.target.value); }}
              onKeyDown = { (e) => {
                if (e.key === 'Enter') {       
                  console.log(setlistfmClient);           
                  setlistfmClient.searchSetlists({
                    artistName: search
                  })
                    .then((results) => {
                      console.log(results);
                    })
                }
              }}
            />
            <p className='search-input-description'>press enter to search</p>
          </div>
          {/* <button
            className='search-button'
            onClick={() => console.log(search)}
          >
            Generate Playlist
          </button> */}
        </div>
      </div>
    </div>
  );
}

export default App;
