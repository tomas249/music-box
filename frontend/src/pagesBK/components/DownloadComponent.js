import React, { useState } from 'react';
import axios from 'axios';

function DownloadComponent() {
  const api = 'http://localhost:5000';

  const [queryList, setQueryList] = useState([]);
  const [downloading, setDownloading] = useState(false);

  const handleSubmitSearchField = (e) => {
    e.preventDefault();
    const queryField = e.target.elements.searchField.value;

    // Search
    fetch(`${api}/search/${queryField}`)
      .then((res) => res.json())
      .then((videosList) => {
        setQueryList(videosList);
      })
      .catch(console.error);
  };

  const handleDownload = ({ title, channelTitle: author, link: url, id: videoId }) => {
    title = title.replace('&amp;', '&');
    // setDownloading(true);

    axios
      .post(api + '/download', { url, title, author, videoId })
      .then(console.log)
      .catch(console.error);

    // fetch(api + '/download', {
    //   method: 'POST',
    //   headers: {
    //     'content-type': 'application/json',
    //   },
    //   body: JSON.stringify({ url, title, author, videoId }),
    // })
    //   .then((res) => res.json())
    //   .then((res) => {
    //     let error = 'Error: ';
    //     if (!res.success) {
    //       error += res.message || 'no success';
    //       alert(error);
    //     }
    //     setDownloading(false);
    //   })
    //   .catch((err) => {
    //     alert('Error: downloading');
    //     setDownloading(false);
    //     console.warn(err);
    //   });
  };

  return (
    <div>
      <form style={{ width: '100%', display: 'flex' }} onSubmit={handleSubmitSearchField}>
        <input
          style={{ flex: 1, padding: '1rem', fontSize: '1.4rem' }}
          type="text"
          name="searchField"
          placeholder="Search on youtube"
        />
        <button style={{ padding: '1rem' }} type="submit">
          Search
        </button>
      </form>
      {queryList.map((video) => (
        <div key={video.id} style={{ display: 'flex', borderBottom: '1px solid' }}>
          <button disabled={downloading} onClick={() => handleDownload(video)}>
            {downloading ? 'Downloading...wait!' : 'Download'}
          </button>
          <img src={video.thumbnails.medium.url} width="320px" height="180px" />
          <div style={{ marginLeft: '1rem' }}>
            <h3>{video.title.replace('&amp;', '&')}</h3>
            <p>Channel: {video.channelTitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DownloadComponent;
