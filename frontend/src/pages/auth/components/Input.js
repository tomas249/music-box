import styled from 'styled-components';

const Input = ({
  type = 'text',
  placeholder,
  handleChange,
  autofocus = true,
  disabled = false,
  value,
  info,
  error,
}) => {
  return (
    <>
      <InputStyled
        spellcheck="off"
        autoFocus={autofocus}
        disabled={disabled}
        type={type}
        placeholder={placeholder}
        onChange={handleChange}
        value={value}
      />
      {error && <ErrorStyled>{error}</ErrorStyled>}
    </>
  );
};

export default Input;

const InputStyled = styled.input`
  width: 100%;
  max-width: 400px;
  border: none;
  border-bottom: 1px solid rgb(102, 102, 102);
  padding: 0.2em 0;
  letter-spacing: 1px;
  font-size: 2em;
  text-align: center;
  background: transparent;
  outline: 0;
  color: white;
  &::placeholder {
    color: rgb(102, 102, 102);
  }
  &:focus::placeholder {
    color: white;
  }
`;

const ErrorStyled = styled.p`
  width: 100%;
  text-align: center;
  color: darkred;
`;
