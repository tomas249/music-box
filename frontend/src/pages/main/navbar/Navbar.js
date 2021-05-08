import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import Playlist from './Playlist';
import {
  IconHome,
  IconHomeFill,
  IconSearchFill,
  IconSearch,
  IconLibraryFill,
  IconLibrary,
} from './Icons';

const Navbar = ({ location, playlists }) => {
  return (
    <NavbarStyled>
      <div style={{ textAlign: 'center' }}>
        <h1>MBOX</h1>
      </div>
      <NavLinkStyled
        exact
        to='/'
        activeStyle={{ backgroundColor: 'rgb(40, 40, 40)', color: '#fff' }}
      >
        {location.pathname === '/' ? <IconHomeFill /> : <IconHome />}
        <span>Home</span>
      </NavLinkStyled>

      <NavLinkStyled
        to='/search'
        activeStyle={{ backgroundColor: 'rgb(40, 40, 40)', color: '#fff' }}
      >
        {location.pathname === '/search' ? <IconSearchFill /> : <IconSearch />}
        <span>Search</span>
      </NavLinkStyled>

      <NavLinkStyled
        to='/collection/playlists'
        isActive={(match, location) => {
          if (!match) return false;
          if (location.pathname.split('/')[2] === 'tracks') return false;
          return true;
        }}
        activeStyle={{ backgroundColor: 'rgb(40, 40, 40)', color: '#fff' }}
      >
        {location.pathname.split('/')[1] === 'collection' &&
        location.pathname.split('/')[2] !== 'tracks' ? (
          <IconLibraryFill />
        ) : (
          <IconLibrary />
        )}
        <span>Your Library</span>
      </NavLinkStyled>
      <Playlist list={playlists} />
    </NavbarStyled>
  );
};

export default Navbar;

const NavbarStyled = styled.div`
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  background-color: rgb(0, 0, 0);
  min-width: 200px;
  max-width: 400px;
  resize: horizontal;
  padding: 1em 0.5em 0;
  grid-column-start: 1;
  grid-column-end: 2;
  grid-row-start: 1;
  grid-row-end: 2;
  color: white;
  & > .playlist {
    margin-top: 24px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }
  @media (max-width: 800px) {
    resize: none;
    max-width: none;
    flex-direction: row;
    display: flex;
    width: 100% !important;
    padding: 0;
    grid-column-start: 1;
    grid-column-end: 2;
    grid-row-start: 3;
    grid-row-end: 4;
    & > .playlist,
    div {
      display: none;
    }
  }
`;

const NavLinkStyled = styled(NavLink)`
  padding: 8px 20px;
  font-weight: bold;
  border-radius: 4px;
  display: flex;
  align-items: center;
  color: rgb(179, 179, 179);
  text-decoration: none;
  > svg {
    margin-right: 16px;
  }
  :hover {
    color: #fff;
  }
  @media (max-width: 800px) {
    padding: 20px 8px;
    flex: 1;
    justify-content: center;
    border-radius: 0;
    > svg {
      margin-right: 8px;
    }
  }
  @media (max-width: 490px) {
    padding: 14px 8px;
    & > svg {
      margin-right: 0;
      width: 30px;
      height: 30px;
    }
    & > span {
      display: none;
    }
  }
`;
