import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const Link = styled(NavLink)`
  background: lightgray;
  border-radius: 3px;
  border: 2px solid;
  margin: 0.5em 0;
  padding: 1em;
  text-decoration: none;
  cursor: pointer;
  text-decoration: none;
  color: black;
  font-weight: bold;
  &:hover {
    background-color: lightgreen;
  }
`;

function NavbarElementComponent({ text, path }) {
  return <Link to={path}>{text}</Link>;
}

export default NavbarElementComponent;
