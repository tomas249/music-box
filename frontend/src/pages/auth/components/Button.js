import styled from 'styled-components';

const Button = ({ type = 'submit', value, flex, textAlign, handleClick = null }) => {
  return (
    <ButtonStyled style={{ flex, textAlign }} type={type} onClick={handleClick}>
      {value}
    </ButtonStyled>
  );
};

export default Button;

const ButtonStyled = styled.button`
  text-transform: uppercase;
  border: none;
  padding: 0.5em 1em;
  font-size: 2em;
  letter-spacing: 1px;
  background: transparent;
  color: rgb(102, 102, 102);
  cursor: pointer;
  outline: 0;
  &:hover {
    background-color: rgb(102, 102, 102);
    color: white;
  }
`;
