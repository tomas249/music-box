const LoadingComponent = ({ loading, children }) => {
  if (loading) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontWeight: 'bold',
          fontSize: '36px',
          margin: '0 auto',
          letterSpacing: '2px',
        }}
      >
        Loading...
      </div>
    );
  } else {
    return children;
  }
};

export default LoadingComponent;
