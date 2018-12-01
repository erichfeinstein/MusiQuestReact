import React from 'react';

export const Recommender = props => {
  //   const artistName = props.artist.name;
  //   const trackName = props.track.name;
  //probably more here
  return (
    <div>
      {props.track.name} by {props.artist.name}
      {props.track.album && <img src={props.track.album.images[0].url} />}
      <button onClick={() => props.skipTrack()}>Like!</button>
      <button onClick={() => props.skipTrack()}>Dislike</button>
    </div>
  );
};
