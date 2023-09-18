import React from 'react'

const SetDisplay = ({artist, tour, venue, date, sets, onClick}) => {
  const formatVenueName = (name) => {
    if (name.indexOf(' at ') !== -1) {
      return name.slice(0, venue.name.indexOf(' at'));
    }
    return name
  }
  
  return (
    <div className='set-display' onClick={() => { onClick({
      set: sets.set,
      artist: artist.name,
      tour: tour?.name || 'Concert',
      venue: formatVenueName(venue.name),
      date
    })}}>
      <div className='set-info'>
        <div className='date-wrapper'>
            <div className='date-month'>{date.month}</div>
            <div className='date-day'>{date.day}</div>
            <p className='date-year'>{date.year}</p>
        </div>
        <div>
          <h2 className='tour-name'>
            {`${tour?.name || 'Concert'}`}
            <span className='venue-name'>{`@ ${formatVenueName(venue.name)}`}</span>
          </h2>
          <h3 className='artist-name'>{artist.name}</h3>
        </div>
      </div>
      <p className='expand'>{'>'}</p>
    </div>
  )
}

export default SetDisplay