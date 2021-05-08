import { useState } from 'react';
import styled from 'styled-components';
import { getTrackList, downloadTrack, likeTrack } from '../../../../api/TrackApi';
import LoadingComponent from '../../../../components/LoadingComponent';

const imgUrl = 'https://i.scdn.co/image/ab67706c0000da847b347fba62cc7b417054c8ed';

const Search = () => {
  const [loading, setLoading] = useState(false);
  const [queryList, setQueryList] = useState([]);
  const [step, setStep] = useState(1);

  const getStyle = (a, b) => {
    const cond = a === b;
    const color = cond ? 'white' : 'gray';
    const fontSize = cond ? '1.7em' : '1em';
    return { marginBottom: '12px', color, fontSize };
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const queryField = e.target.elements.searchField.value.trim();

    if (!queryField) return;

    // Increase stepper
    setStep(2);
    // Search
    setLoading(true);
    getTrackList(queryField).then(({ videos }) => {
      console.log(videos);
      setQueryList(videos);
      setLoading(false);
    });
  };

  return (
    <Container>
      <div
        style={{
          padding: '1em',
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'center',
        }}
      >
        <span style={getStyle(step, 1)}>1. Search a song</span>
        <span style={getStyle(step, 2)}>2. Select a song from the list</span>
        <span style={getStyle(step, 3)}>3. You will find the song in "Liked songs"</span>
      </div>
      <form
        onSubmit={handleSearch}
        style={{
          width: '100%',
          maxWidth: '1200px',
          display: 'flex',
          flexWrap: 'wrap',
          margin: '0 auto 12px',
        }}
      >
        <Input type='text' name='searchField' placeholder='Search a song...' />
        <Bttn type='submit'>Search</Bttn>
      </form>
      <LoadingComponent loading={loading}>
        <ListContainer>
          {queryList.map((video, idx) => (
            <VideoComponent key={idx} video={video} />
          ))}
        </ListContainer>
      </LoadingComponent>
    </Container>
  );
};

export default Search;

const VideoComponent = ({ video }) => {
  const [id, setId] = useState(video.mbox?._id || video.ytId);
  const [saved, setSaved] = useState(!!video.mbox);
  const [loading, setLoading] = useState(false);

  const saveAtMBox = (ytId) => {
    setLoading(true);
    downloadTrack(ytId)
      .then((file) => {
        console.log(file);
        setSaved(true);
        setId(file._id);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  };

  const handleLike = (trackId) => {
    likeTrack(trackId)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.error(err));
  };

  if (video.type === 'channel') {
    return (
      <Video>
        <div
          style={{
            margin: '0 70px',
            display: 'flex',
            justifyContent: 'center',
            borderRadius: '50%',
          }}
          className='image'
        >
          <img style={{ borderRadius: '50%', width: '160px' }} src={video.image} alt='' />
        </div>
        <div>
          <div className='text'>
            <span>{video.name}</span>
            <span>
              {video.subCountLabel} subscribers • {video.videoCountLabel} videos
            </span>
          </div>
          <div className='buttons'>
            <button>Explore Artist</button>
            <button>Follow</button>
          </div>
        </div>
      </Video>
    );
  } else {
    return (
      <Video>
        <div style={{ position: 'relative' }} className='image'>
          <img src={video.thumbnail} alt='' />
          {/* <iframe width='300px' src={`https://www.youtube.com/embed/${video.ytId}`}></iframe> */}
          <span
            style={{
              position: 'absolute',
              right: '0',
              bottom: '0',
              margin: '4px',
              padding: '3px 4px',
              height: '16px',
              fontWeight: '500',
              lineHeight: '1em',
              borderRadius: '4px',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
            }}
          >
            {video.timestamp}
          </span>
        </div>
        <div>
          <div className='text'>
            <span>{video.title}</span>
            <span>
              <b>{video.artist.name}</b>
            </span>
            <span>
              {video.views} views • {video.ago}
            </span>
          </div>
          <div className='buttons'>
            {loading ? (
              <button>Saving...</button>
            ) : (
              <button onClick={() => saveAtMBox(video.ytId)}>
                {saved ? 'SAVED!' : 'Save at MBOX'}
              </button>
            )}
            <button onClick={() => handleLike(id)}>Like</button>
          </div>
        </div>
      </Video>
    );
  }
};

const Container = styled.div`
  min-height: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 20px;
  @media (max-width: 800px) {
    padding: 0;
    & > div:first-child {
      display: none !important;
      background-color: green;
    }
  }
`;

const ListContainer = styled.div`
  margin: 0 auto;
  overflow-y: scroll;
  border-top: 1px solid #282828;
  max-width: 1200px;
  width: 100%;
`;

const Video = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0 auto 8px;
  border-radius: 4px;
  background-color: var(--item-background);
  padding: 16px;
  & > div:last-child {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  & .image {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
    border-radius: 2px;
    line-height: 0;
    & > img,
    & > iframe {
      width: 300px;
      border-radius: 2px;
      max-height: 300px;
    }
  }
  & .text {
    display: flex;
    flex-direction: column;
    margin-left: 16px;
    margin-top: 16px;
    & span:first-child {
      color: white;
      font-weigth: bold;
      font-size: 20px;
    }
    & span:not(:first-child) {
      margin-top: 6px;
      color: #828282;
      font-size: 18px;
      font-weigth: 14px;
    }
  }
  & .buttons {
    display: flex;
    flex-direction: row;
    justify-content: right;
    & button {
      background: transparent;
      padding: 8px 12px;
      color: #828282;
      font-size: 18px;
      border: 1px solid #828282;
      cursor: pointer;
    }
    & button:first-child {
      border-right: 0;
    }
    & button:hover {
      background-color: #232323;
      color: white;
    }
  }
`;

const Input = styled.input`
  font-size: 1.3em;
  flex: 5;
  padding: 0.7em;
  border-radius: 0;
  border: 0;
  outline: 0;
`;

const Bttn = styled.button`
  font-size: 1.3em;
  padding: 0.7em;
  flex: 1;
  border-radius: 0;
  border: 0;
  background-color: var(--green);
  outline: 0;
  cursor: pointer;
  &:hover {
    background-color: var(--green-hover);
  }
`;
