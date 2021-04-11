import './NavbarComponent.css';
import React from 'react';
import NavbarElementComponent from './NavbarElementComponent';

function NavbarComponent() {
  return (
    <div className="navbar-container">
      <div style={{ userSelect: 'none', margin: '0.5em auto', textAlign: 'center' }}>
        <h1 style={{ margin: '0 auto' }}>MusicBOX</h1>
        <span>Expect redesign :p</span>
      </div>
      <NavbarElementComponent text="Home" path="/" />
      <NavbarElementComponent text="Search" path="/search" />
      <hr style={{ width: '100%' }} />
      <NavbarElementComponent text="Create Playlist" path="/playlist/create" />
      <NavbarElementComponent text="Liked Songs" path="/playlist" />
    </div>
  );
}

export default NavbarComponent;
