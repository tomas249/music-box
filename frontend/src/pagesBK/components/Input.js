import styled from 'styled-components';

const styles = {
  formContainer: {
    width: '95%',
  },
  formInput: {
    border: '1px solid lightskyblue',
    borderRadius: '10px',
    marginBotom: '1em',
    width: '100%',
    padding: '0.5em 0.5em',
    outline: '0',
    fontSize: '1.3em',
    '& > label': {
      marginLeft: '0.5em',
      color: 'grey',
    },
  },
};

const Input = ({ name, label, onChange, placeholder, value, error }) => {
  let wrapperClass = 'form-container';
  if (error && error.length > 0) {
    wrapperClass += ' ' + 'has-error';
  }

  return (
    <div style={styles.formContainer}>
      <label htmlFor={name}>{label}</label>
      <div className="field">
        <input
          style={styles.formInput}
          type="text"
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        {error && <div className="alert alert-danger">{error}</div>}
      </div>
    </div>
  );
};

export default Input;

// .form-container {
//   width: 95%;
//   padding: 0;
//   text-align: left;
// }

// .form-input {
//   border: 1px solid lightskyblue;
//   border-radius: 10px;
//   margin-bottom: 1rem;
//   width: 100%;
//   padding: 0.5rem 0.5rem;
//   outline: 0;
//   font-size: 1.3rem;
// }

// .form-container > label {
//   margin-left: 0.5rem;
//   color: grey;
// }
