import React from 'react';

export const Recommender = props => {
  return (
    <div>
      <div>
        {props.track.name} by {props.artist.name}
      </div>
      <div id="discovered-img">
        {props.track.album && <img src={props.track.album.images[0].url} />}
      </div>
      <button
        className="recommend-button"
        id="like-button"
        onClick={() => props.likeTrack()}
      >
        Like!
      </button>
      <button
        className="recommend-button"
        id="dislike-button"
        onClick={() => props.skipTrack()}
      >
        Dislike
      </button>
    </div>
  );
};
