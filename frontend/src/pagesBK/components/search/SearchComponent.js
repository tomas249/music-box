import axios from 'axios';
import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Input = styled.input`
  font-size: 1.3em;
  flex: 5;
  padding: 0.7em;
`;

const Bttn = styled.button`
  font-size: 1.3em;
  padding: 0.7em;
  flex: 1;
`;

const Video = styled.div`
  display: flex;
  font-size: 1.3em;
  padding: 0.7em;
  border: 2px solid green;
  border-radius: 5px;
  margin: 6px 6px;
  max-width: 900px;
`;

function SearchComponent() {
  const [step, setStep] = useState(1);
  const [queryList, setQueryList] = useState([]);

  const getStyle = (a, b) => {
    const cond = a === b;
    const color = cond ? 'black' : 'gray';
    const fontSize = cond ? '1.7em' : '1em';
    return { marginBottom: '12px', color, fontSize };
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const queryField = e.target.elements.searchField.value;

    // Search
    const api = process.env.REACT_APP_API_URL;
    console.log(api);
    fetch(`${api}/songs/search/${queryField}`)
      .then((res) => res.json())
      .then((videosList) => {
        console.log(videosList);
        setQueryList(videosList);
      })
      .catch(console.error);
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
        <span style={getStyle(step, 1)}>1. You search a song</span>
        <span style={getStyle(step, 2)}>2. Selected song is stored at MusicBOX</span>
        <span style={getStyle(step, 3)}>
          3. You can now listen the song from MusicBOX with no ads :D
        </span>
      </div>

      <form
        onSubmit={handleSearch}
        style={{
          minWidth: '70%',
          display: 'flex',
          flexWrap: 'wrap',
          marginBottom: '2em',
        }}
      >
        <Input type="text" name="searchField" placeholder="Search a song..." />
        <Bttn type="submit" onClick={() => setStep(step + 1)}>
          Search
        </Bttn>
      </form>
      <div
        style={{
          overflowY: 'scroll',
          display: 'flex',
          flexDirection: 'column',
          // justifyContent: 'center',
        }}
      >
        {queryList.map((track, idx) => (
          <VideoComponent key={idx} track={track} />
        ))}
      </div>
    </Container>
  );
}

function VideoComponent({ track }) {
  const imgUrl = 'https://miro.medium.com/max/2400/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg';
  const [downloading, setDownloading] = useState(false);
  const handleSave = () => {
    const api = process.env.REACT_APP_API_URL;
    axios
      .get(`${api}/songs/save/${track.id}?download=true`)
      .then(console.warn)
      .catch((e) => console.log(e.response));
  };
  return (
    <Video>
      <img
        style={{ borderRadius: '5px' }}
        src={track.thumbnails.medium.url}
        alt=""
        width="120px"
        height="90px"
        objectFit="cover"
      />
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', marginLeft: '0.8em' }}>
        <span style={{ fontSize: '1em' }}>
          <strong>{track.title.replace('&amp;', '&')}</strong>
        </span>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: '0.8em',
            marginTop: '0.8em',
          }}
        >
          <span>Artist: {track.channelTitle}</span>
          {/* <span>Duration: 5:20 min</span> */}
        </div>
        <div
          style={{
            margin: 'auto 0 0 auto',
            // paddingTop: '1em',
            display: 'flex',
            justifyContent: 'right',
            borderWidth: '2px 2px 2px 0',
            borderStyle: 'solid solid solid none ',
            borderColor: 'green',
          }}
        >
          <button
            onClick={handleSave}
            style={{
              padding: '1em',
              backgroundColor: 'lightgreen',
              borderWidth: '0 0 0 2px',
              borderStyle: 'none none none solid',
              borderColor: 'green',
            }}
          >
            {track.song ? 'Available' : 'Save to MBOX'}
          </button>
          <button
            style={{
              padding: '1em',
              backgroundColor: 'lightcoral',
              borderWidth: '0 0 0 2px',
              borderStyle: 'none none none solid',
              borderColor: 'green',
            }}
          >
            Like
          </button>
        </div>
      </div>
    </Video>
  );
}

export default SearchComponent;
