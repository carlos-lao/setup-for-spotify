import { useEffect, useState } from 'react';
import { API } from 'aws-amplify';

import './App.css'
import { FadingDiv, SetDisplay, SongDisplay } from './components';
import { TRANSITION_DURATION, dateStrToObj } from './util';
import { background, spinner, spotifyLogo }from './assets';

const App = () => {
  const [page, setPage] = useState({curr: 1, next: 1});
  const [user, setUser] = useState(-1);
  const [search, setSearch] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showLoginWarning, setShowLoginWarning] = useState(false);
  const [completionInfo, setCompletionInfo] = useState(null);
  
  const nextPage = () => { setPage({...page, next: page.curr + 1}) };
  const prevPage = () => { setPage({...page, next: page.curr - 1}) };
  
  useEffect(() => {
    const { href } = window.location;
    if (href.indexOf('#access_token') !== -1) {
      const token = href.slice(href.indexOf('=') + 1);
      API
        .get('setupAPI', '/auth', { queryStringParameters: {token} })
          .then((res) => {
            if (res.success) {
              const { display_name, images } = JSON.parse(res.body);
              setUser({name: display_name, photo: images[0].url, token });
            } else {
              alert("Could not verify the provided token. Please try logging in again.");
              window.open(href.slice(0, href.indexOf('#')), '_self');
            }
          })
    } else {
      setUser(null);
    }
  }, [])
  
  useEffect(() => {
    if (page.curr !== page.next) {
      setTimeout(() => {
        if (page.next === 1) {
          setSearch('');
        } else if (page.next === 2) {
          setShowSpinner(false);
        }
        setPage({...page, curr: page.next})
      }, TRANSITION_DURATION);
    }
  }, [page])
  
  useEffect(() => {
    if (showLoginWarning) {
      setTimeout(() => {
        setShowLoginWarning(false);
      }, 3000);
    }
  }, [showLoginWarning])
  
  const makePlaylist = () => {
    if (selected === null) {
      return;
    } else {
      const body = {
        token: user.token,
        data: {
          title: selected.tour,
          artist: selected.artist,
          description: `${selected.artist}'s "${selected.tour}" set list on ${selected.date.month} ${selected.date.day}, ${selected.date.year} @ ${selected.venue}.`,
          songs: [],
        }
      }
      
      selected.set.forEach(part => {
        part.song.forEach(song => {
          if (song.name.length > 0) {
            body.data.songs.push(song.name);
          }
        })
      });
      
      nextPage();
      API
        .post('setupAPI', '/playlist', { body })
          .then((res) => {
            const data = JSON.parse(res.body);
            if (res.success) {
              setCompletionInfo({
                success: true, 
                ...data
              })
            } else {
              setCompletionInfo({
                success: false, 
                message: "Uh oh! Something went wrong, and we couldn't make your playlist. Try again a later."
              })
            }
          })
    }
  }
  
  const renderAuth = () => {
    if (user === null) {
      return (
        <button 
          className='light-btn'
          onClick={() => {
            console.log("log in clicked")
            API
              .get('setupAPI', '/login')
                .then((res) => {
                  window.open(res.body, '_self');
                })
          }}
        >
          Log In
        </button>
      );
    } else if (user === -1) {
      return (
        <img src={spinner} alt='loading icon' className="spinner-small"/>
      );
    } else {
      return (
        <div className='profile-wrapper'>
          <p className='user-name'>{user.name}</p>
          <img src={user.photo} alt='spotify profile' className="user-photo"/>
        </div>
      );
    }
  }
  
  const renderResults = () => {
    if (results.length > 0) {
      return (
        <div>
          <p className='results-prompt'>Showing results for '{search}'</p>
            <div className='results-container'>
              {results?.map((val, idx) => (
                <SetDisplay
                  onClick={(data) => {
                    setSelected(data);
                    nextPage();
                  }}
                  key={idx} 
                  {...{...val, date: dateStrToObj(val.eventDate)}}
                />
              ))}
            </div>
          <p className='results-prompt results-end'>No more results</p>
        </div>
      );
    } else {
      return (
        <div className='empty-results-wrapper'>
          <p className='results-prompt'>No results found for '{search}'</p>
        </div>
      )
    }
  }
  
  const renderDetails = () => {
    if (selected === null) {
      return (<div></div>);
    } else {
      return (
        <div className='songs-wrapper'>
          <div className='tour-header'>
            <div style={{ display: 'flex', alignItems: 'center'}}>
              <h1 className='tour-title'>{selected.tour}</h1>
              <button
                className={`generate-btn${user === null || user === -1 ? ' disabled' : ''}`}
                onClick={() => {
                  if (user === null || user === -1) {
                    setShowLoginWarning(true);
                  } else {
                    makePlaylist();
                  }
                }}
              >
                <i className="bi bi-download"></i>
              </button>
            </div>
            <h2 className='artist-subtitle'>{selected.artist}</h2>
            <h2 className='tour-venue'>{selected.date.month} {selected.date.day}, {selected.date.year} @ {selected.venue}</h2>
          </div>
          <div className='tour-content'>
            {selected.set.map((set, i) => (
              <SongDisplay
                key={i}
                order={i+1}
                name={set?.name}
                songs={set.song}
                encore={set?.encore}
              />
            ))}
          </div>
        </div>
      );
    }
  }
  
  const renderComplete = () => {
    if (completionInfo === null) {
      return (
        <div className="complete-wrapper">
          <img src={spinner} alt='loading icon' className="spinner lg"/>
          <p className="complete-load-text">Generating your playlist...</p>
        </div>
      )
    } else if (!completionInfo.success) {
      return (
        <div className="complete-wrapper">
          <h2 className="complete-message">{completionInfo.message}</h2>
          <button
            onClick={prevPage}
          >Review Set List</button>
          <button
            onClick={() => {setPage({...page, next: 1})}}
          >Back to Search</button>
        </div>
      )
    } else {
      return (
        <div className="complete-wrapper">
          <h2 className="complete-message">{completionInfo.message}</h2>
          <div className="complete-failures">
            <h4 className="failure-title">Failed to add the following songs:</h4>
            {completionInfo.failures.length > 0 &&
              (
                <ol className="failure-list">
                  {completionInfo.failures.map((elem, idx) => (
                    <li key={idx}>{elem}</li>
                  ))}
                </ol>
              )
            }
          </div>
          <h2 className="complete-disclaimer">Click the button below to check out your new playlist.<br />Make sure to double check that it has the right songs.<br />Even computers mess up sometimes! 🥲</h2>
          <button
            className="complete-main-btn"
            onClick={() => {window.open(completionInfo.playlistURL, '_blank')}}
          >Open Playlist</button>
          <button
            className="complete-home-btn"
            onClick={() => {setPage({...page, next: 1})}}
          >Back to Search</button>
        </div>
      )
    }
  }

  return (
    <div className='wrapper'>
      <img src={background} alt='a concert crowd' className='background'/>
      <div className='background-overlay'></div>
      <div className='container'>
        <div className='navbar'>
          <FadingDiv persist show={page.curr > 1 && page.next > 1 && page.curr < 4 && page.next < 4}>
            <button 
              className='light-btn back-btn' 
              onClick={page.curr > 1 && page.curr < 4 ? prevPage : ()=>{}} 
              style={page.curr <= 1 || page.curr >= 4 ? {cursor: 'default'} : {}}
            >
              <span className='back-icon'>{'<'}</span>Back
            </button>
          </FadingDiv>
          <FadingDiv
            persist
            show={page.curr > 1 && page.next > 1}
            style={{cursor: page.curr > 1 ? 'pointer' : 'default'}}
            onClick={page.curr > 1 ? () => {setPage({...page, next: 1})} : () => {}}
          >
            <h1 className='logo-title'>set<span className="title-em">UP</span></h1>
            <h2 className='logo-subtitle'>
              for <img src={spotifyLogo} alt='spotify' className='logo-spotify-logo'/>
            </h2>
          </FadingDiv>
          <div>
            {renderAuth()}
          </div>
        </div>
        {/* PAGE ONE */}
        <FadingDiv show={page.curr === 1 && page.next === 1} className='page-one'>
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
                      API
                        .get('setupAPI', '/search', { queryStringParameters: {query: search} })
                          .then((res) => {
                            const data = JSON.parse(res.body);
                            if (data?.setlist != null) {
                              setResults(data.setlist);
                            } else {
                              setResults([]);
                            }
                            nextPage();
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
        <FadingDiv show={page.curr === 2 && page.next === 2} className='page-two'>
          {renderResults()}
        </FadingDiv>
        {/* PAGE THREE */}
        <FadingDiv show={page.curr === 3 && page.next === 3} className='page-three'>
            <FadingDiv persist show={showLoginWarning}>
              <p className='login-warning'>You must be logged in to generate a playlist.</p>
            </FadingDiv> 
          {renderDetails()}
        </FadingDiv>
        {/* PAGE FOUR */}
        <FadingDiv show={page.curr === 4 && page.next === 4} className='page-four'>
          {renderComplete()}
        </FadingDiv>
      </div>
    </div>
  );
}

export default App;
