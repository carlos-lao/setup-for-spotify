import React from 'react'

const SongDisplay = ({ order, name = null, songs, encore = false }) => {
  const renderSong = (song, idx) => {
    if (song.name.length > 0){
      return (
        <li className='song-wrapper' key={idx}>
          <p className='song-name'>
            {song.name}
            {song?.info ? <span className='song-info has-name'><br/>{song.info}</span> : null}
          </p>
        </li>
      );
    } else {
      return (
          <li className='song-wrapper' key={idx}>
            <p className='song-name'>
              <span className='song-info'>{song?.info || 'Song not found.'}</span>
            </p>
          </li>
      );
    }
  }
  
  return (
    <div className='set-part'>
      <h3 className='set-order'>
        Set {order}
        <span className='set-title'>{name || encore ? `: ${name || 'Encore'}` : ''}</span>
      </h3>
      <ol className='song-list'>
        {songs.map((song, idx) => (
          renderSong(song, idx)
        ))}
      </ol>
    </div>
  )
}

export default SongDisplay