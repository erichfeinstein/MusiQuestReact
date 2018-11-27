import React from 'react';

const ArtistList = props => {
  const artists = props.artists;
  const selectArtist = props.selectArtist;
  return (
    <div>
      <ul id="artist-list">
        {artists.map(artist => {
          return (
            <div
              className="artist"
              key={artist.id}
              onClick={() => selectArtist(artist)}
            >
              <img
                src={
                  artist.images[0]
                    ? artist.images[0].url
                    : 'http://media.virbcdn.com/cdn_images/crop_300x300/cd/default_song_album.jpg'
                }
              />
              <div>{artist.name}</div>
            </div>
          );
        })}
      </ul>
    </div>
  );
};

export default ArtistList;
