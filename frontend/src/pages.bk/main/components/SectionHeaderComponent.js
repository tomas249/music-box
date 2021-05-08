import styled from 'styled-components';

const SectionHeaderComponent = ({ type, title, handlePlay, handleFollow, handleOpt }) => {
  return (
    <ContainerStyled>
      <div className='group actions'>
        <button className='play' onClick={handlePlay}>
          <PlayIcon />
        </button>
        <button className='follow' onClick={handleFollow}>
          follow
        </button>
      </div>
      <div className='group info'>
        <div className='type'>{type}</div>
        <h2 style={{ margin: 0 }}>{title}</h2>
      </div>
      <button
        onClick={handleOpt}
        style={{
          background: 'transparent',
          border: 'none',
          marginLeft: 'auto',
          color: 'white',
          padding: '0 12px',
          cursor: 'pointer',
        }}
      >
        <OptIcon />
      </button>
    </ContainerStyled>
  );
};

export default SectionHeaderComponent;

const ContainerStyled = styled.div`
  background-color: #333d46;
  min-height: 60px;
  height: min-content;
  display: flex;
  flex-direction: row;
  align-items: center;
  & .group {
    display: flex;
    align-items: center;
    position: relative;
  }
  & .type {
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 12px;
    padding: 6px 12px;
    border-radius: 500px;
    background-color: #181818bb;
    margin-right: 18px;
  }
  & .follow {
    background-color: transparent;
    border: 1px solid hsla(0, 0%, 100%, 0.3);
    border-top-color: rgba(255, 255, 255, 0.3);
    border-right-color: rgba(255, 255, 255, 0.3);
    border-bottom-color: rgba(255, 255, 255, 0.3);
    border-left-color: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #fff;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.1em;
    line-height: 16px;
    padding: 7px 15px;
    margin-right: 18px;
    text-align: center;
    text-transform: uppercase;
    cursor: pointer;
    &:hover {
      border: 1px solid white;
    }
  }
  & .play {
    border: 0;
    border-radius: 500px;
    padding-left: 6px;
    box-sizing: border-box;
    white-space: nowrap;
    line-height: 0.8;
    // transform: scale(1.06);
    min-width: 40px;
    height: 40px;
    text-align: center;
    background-color: var(--green);
    font-weight: bold;
    color: white;
    margin: 0 18px;
    cursor: pointer;
    &:hover {
      background-color: var(--green-hover);
    }
  }
  @media (max-width: 450px) {
    & .follow {
      display: none;
    }
    & .play {
      margin: 12px;
    }
    & h2 {
      padding-bottom: 18px;
    }
    & .type {
      margin-right: 12px;
      position: absolute;
      bottom: -4px;
      left: 0;
      padding: 2px 6px;
      font-size: 10px;
    }
    // flex-wrap: wrap;
    // padding: 10px 10px 22px;
    // & .info {
    //   order: 1;
    //   flex: 1;
    // }
    // & .actions {
    //   order: 2;
    //   margin-top: 4px;
    // }
  }
`;

const PlayIcon = () => (
  <svg height='16' width='16' viewBox='0 0 24 24'>
    <polygon points='21.57 12 5.98 3 5.98 21 21.57 12' fill='currentColor'></polygon>
  </svg>
);

const OptIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='16'
    height='16'
    fill='currentColor'
    viewBox='0 0 16 16'
  >
    <path d='M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z' />
  </svg>
);
