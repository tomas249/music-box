import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { IconAdd, IconLike } from './Icons';

const Playlist = ({ list }) => {
  return (
    <div className='playlist no-scroll-bars'>
      <NavLinkStyled to='/playlist/create' activeStyle={{ color: '#fff' }}>
        <IconAdd />
        Create Playlist
      </NavLinkStyled>
      <NavLinkStyled to='/collection/tracks' activeStyle={{ color: '#fff' }}>
        <IconLike />
        Liked Songs
      </NavLinkStyled>

      <div className='no-scroll-bars' style={{ overflowY: 'scroll', padding: '0 20px' }}>
        <hr style={{ width: '100%' }} />
        {list?.map((playlist) => (
          <NavLinkItemStyled
            key={playlist._id}
            to={'/playlist/' + playlist._id}
            activeStyle={{ color: '#fff' }}
          >
            {playlist.name}
          </NavLinkItemStyled>
        ))}
      </div>
    </div>
  );
};

export default Playlist;

const NavLinkStyled = styled(NavLink)`
  padding: 8px 20px;
  background: transparent;
  width: 100%;
  border: 0;
  font-weight: bold;
  border-radius: 4px;
  display: flex;
  align-items: center;
  color: rgb(179, 179, 179);
  cursor: pointer;
  text-decoration: none;
  outline: 0;
  &:hover {
    color: #fff;
  }
  > svg {
    margin-right: 16px;
  }
`;

const NavLinkItemStyled = styled(NavLink)`
  text-decoration: none;
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
