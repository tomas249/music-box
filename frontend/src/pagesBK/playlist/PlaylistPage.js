import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PlaylistCreate from './PlaylistCreate';

function PlaylistPage() {
  return (
    <div>
      PLAY LIST PAGE
      <div>
        <Route path="/playlist/create">
          <PlaylistCreate />
        </Route>
      </div>
    </div>
  );
}

export default PlaylistPage;
