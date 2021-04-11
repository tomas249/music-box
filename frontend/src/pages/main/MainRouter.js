import { useState } from 'react';
import { Switch, Route, Redirect, NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import SearchComponent from '../../pagesBK/components/search/SearchComponent';
const IconHomeEmpty = () => (
  <svg viewBox="0 0 512 512" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M 256.274 60.84 L 84.324 166.237 L 84.324 443.063 L 193.27 443.063 L 193.27 293.73 L 320.228 293.73 L 320.228 443.063 L 428.222 443.063 L 428.222 165.476 L 256.274 60.84 Z M 256.274 35.95 L 448.452 149.145 L 448.452 464.395 L 300 464.395 L 300 315.062 L 213.499 315.062 L 213.499 464.395 L 64.095 464.395 L 64.095 150.161 L 256.274 35.95 Z"
      fill="currentColor"
    ></path>
  </svg>
);
const IconHomeFull = () => (
  <svg viewBox="0 0 512 512" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M448 463.746h-149.333v-149.333h-85.334v149.333h-149.333v-315.428l192-111.746 192 110.984v316.19z"
      fill="currentColor"
    ></path>
  </svg>
);
const IconSearchEmpty = () => (
  <svg viewBox="0 0 512 512" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M349.714 347.937l93.714 109.969-16.254 13.969-93.969-109.969q-48.508 36.825-109.207 36.825-36.826 0-70.476-14.349t-57.905-38.603-38.603-57.905-14.349-70.476 14.349-70.476 38.603-57.905 57.905-38.603 70.476-14.349 70.476 14.349 57.905 38.603 38.603 57.905 14.349 70.476q0 37.841-14.73 71.619t-40.889 58.921zM224 377.397q43.428 0 80.254-21.461t58.286-58.286 21.461-80.254-21.461-80.254-58.286-58.285-80.254-21.46-80.254 21.46-58.285 58.285-21.46 80.254 21.46 80.254 58.285 58.286 80.254 21.461z"
      fill="currentColor"
      fillRule="evenodd"
    ></path>
  </svg>
);
const IconSearchFull = () => (
  <svg viewBox="0 0 512 512" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M357.079 341.334l94.476 110.73-32.508 27.683-94.222-110.476q-45.714 30.476-100.826 30.476-36.826 0-70.476-14.349t-57.905-38.603-38.603-57.905-14.349-70.476 14.349-70.476 38.603-57.905 57.905-38.603 70.476-14.349 70.476 14.349 57.905 38.603 38.603 57.905 14.349 70.476q0 23.365-5.841 45.714t-16.635 41.651-25.778 35.555zM224 357.079q28.19 0 53.841-11.048t44.19-29.587 29.587-44.19 11.048-53.841-11.048-53.841-29.587-44.191-44.19-29.587-53.841-11.047-53.841 11.047-44.191 29.588-29.587 44.19-11.047 53.841 11.047 53.841 29.588 44.19 44.19 29.587 53.841 11.048z"
      fill="currentColor"
    ></path>
  </svg>
);
const IconLibraryEmpty = () => (
  <svg viewBox="0 0 512 512" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M291.301 81.778l166.349 373.587-19.301 8.635-166.349-373.587zM64 463.746v-384h21.334v384h-21.334zM192 463.746v-384h21.334v384h-21.334z"
      fill="currentColor"
    ></path>
  </svg>
);
const IconLibraryFull = () => (
  <svg viewBox="0 0 512 512" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M311.873 77.46l166.349 373.587-39.111 17.27-166.349-373.587zM64 463.746v-384h42.666v384h-42.666zM170.667 463.746v-384h42.667v384h-42.666z"
      fill="currentColor"
    ></path>
  </svg>
);

const IconAdd = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="currentColor"
    className="bi bi-plus-square"
    viewBox="0 0 16 16"
  >
    <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
  </svg>
);

const IconLike = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="currentColor"
    className="bi bi-heart"
    viewBox="0 0 16 16"
  >
    <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
  </svg>
);

const MainRouter = ({ user }) => {
  const location = useLocation();
  const [song, setSong] = useState();

  return (
    <Container>
      <Navbar>
        <div style={{ textAlign: 'center' }}>
          <h1>MBOX</h1>
        </div>

        <NavItem exact to="/" activeStyle={{ backgroundColor: 'rgb(40, 40, 40)', color: '#fff' }}>
          {location.pathname === '/' ? <IconHomeFull /> : <IconHomeEmpty />}
          <span>Home</span>
        </NavItem>

        <NavItem
          exact
          to="/search"
          activeStyle={{ backgroundColor: 'rgb(40, 40, 40)', color: '#fff' }}
        >
          {location.pathname === '/search' ? <IconSearchFull /> : <IconSearchEmpty />}
          <span>Search</span>
        </NavItem>

        <NavItem
          exact
          to="/collection"
          activeStyle={{ backgroundColor: 'rgb(40, 40, 40)', color: '#fff' }}
        >
          {location.pathname === '/collection' ? <IconLibraryFull /> : <IconLibraryEmpty />}
          <span>Your Library</span>
        </NavItem>

        <div
          style={{
            marginTop: '24px',
            padding: '0 20px',
            overflowX: 'scroll',
          }}
        >
          <ListOpt>
            <IconAdd />
            Create Playlist
          </ListOpt>
          <ListOpt>
            <IconLike />
            Liked Songs
          </ListOpt>
          <hr style={{ marginBottom: '16px' }} />
          <ListItem>Playliiist 1</ListItem>
          <ListItem>Playliiist 2</ListItem>
          <ListItem>Playliiist 3</ListItem>
        </div>
      </Navbar>
      <Content>
        <Switch>
          <Route exact path="/">
            <div>Main page</div>
          </Route>
          <Route path="/search">
            <SearchComponent />
          </Route>
          <Route path="/user/:key">
            <div>some playlist</div>
          </Route>
          <Route path="/playlist/:id">
            <div>some playlist</div>
          </Route>
          <Route path="/collection">
            <div>Collection page</div>
            <div>Playlists</div>
            <div>Artists</div>
            <div>Albums</div>
            <div>NOTHERE: Tracks</div>
          </Route>
          <Redirect to="/"></Redirect>
        </Switch>
      </Content>
      <Player>PLAYER</Player>
    </Container>
  );
};

export default MainRouter;

const ListOpt = styled.button`
  background: transparent;
  width: 100%;
  border: 0;
  padding: 5px 0;
  font-weight: bold;
  border-radius: 4px;
  display: flex;
  align-items: center;
  color: rgb(179, 179, 179);
  cursor: pointer;
  &:hover {
    color: #fff;
  }
  > svg {
    margin-right: 16px;
  }
`;

const ListItem = styled.div`
  width: 100%;
  padding: 5px 0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  color: rgb(179, 179, 179);
  cursor: pointer;
  &:hover {
    color: #fff;
  }
`;

const Container = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 5fr;
  grid-template-rows: auto min-content;
  @media (max-width: 800px) {
    height: 100%;
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: auto 60px min-content;
  }
`;

const Navbar = styled.div`
  background-color: rgb(0, 0, 0);
  min-width: 200px;
  padding: 1em 0.5em;
  grid-column-start: 1;
  grid-column-end: 2;
  grid-row-start: 1;
  grid-row-end: 2;
  color: white;
  @media (max-width: 800px) {
    display: flex;
    width: 100%;
    padding: 0;
    grid-column-start: 1;
    grid-column-end: 2;
    grid-row-start: 3;
    grid-row-end: 4;
    > div {
      display: none;
    }
  }
`;

const NavItem = styled(NavLink)`
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

const Content = styled.div`
  background-color: rgb(24, 24, 24);
  grid-column-start: 2;
  grid-column-end: 3;
  grid-row-start: 1;
  grid-row-end: 2;
  display: flex;
  min-height: 0;
  @media (max-width: 800px) {
    grid-column-start: 1;
    grid-column-end: 2;
    grid-row-start: 1;
    grid-row-end: 2;
  }
`;

const Player = styled.div`
  grid-column-start: 1;
  grid-column-end: 3;
  grid-row-start: 2;
  grid-row-end: 3;
  background-color: rgb(24, 24, 24);
  border-top: 1px solid #282828;
  min-height: 90px;
  @media (max-width: 800px) {
    min-height: 0;
    grid-column-start: 1;
    grid-column-end: 2;
    grid-row-start: 2;
    grid-row-end: 3;
  }
`;
