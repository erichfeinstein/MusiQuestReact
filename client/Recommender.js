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
        onClick={async () => await props.likeTrack()}
        disabled={props.outOfSuggestions}
      >
        Like!
      </button>
      <button
        className="recommend-button"
        id="dislike-button"
        onClick={async () => await props.skipTrack()}
        disabled={props.outOfSuggestions}
      >
        Dislike
      </button>
    </div>
  );
};
