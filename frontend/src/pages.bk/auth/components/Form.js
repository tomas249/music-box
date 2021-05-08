import styled from 'styled-components';
import Button from './Button';

const Form = ({ children, handleSubmit, goBack = false, backValue = 'back', submitValue }) => {
  return (
    <FormStyled onSubmit={handleSubmit}>
      {children}
      <div style={{ display: 'flex' }}>
        {goBack && (
          <Button type="button" value={backValue} flex="1" textAlign="right" handleClick={goBack} />
        )}
        <Button
          value={submitValue}
          flex={goBack ? '3' : '1'}
          textAlign={goBack ? 'left' : 'center'}
        />
      </div>
    </FormStyled>
  );
};

export default Form;

const FormStyled = styled.form`
  display: flex;
  flex-direction: column;
  flex: 2;
  height: 100%;
`;
