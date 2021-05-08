import { useEffect, useState } from 'react';
import { getMyTracks } from '../../../api/TrackApi';
import {
  getPlaylistById,
  addTrackToPlaylist,
  removeTrackFromPlaylist,
} from '../../../api/PlaylistApi';
import LoadingComponent from '../../../components/LoadingComponent';
import SectionHeaderComponent from '../components/SectionHeaderComponent';
import TrackListComponent from '../components/TrackListComponent';
import styled from 'styled-components';

const PlaylistPage = ({ match, me, track, isPlaying, controls }) => {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [title, setTitle] = useState('');

  const newControls = {
    ...controls,
    play: (idx) => controls.play(idx, list),
  };

  useEffect(() => {
    if (me) {
      getMyTracks()
        .then((r) => {
          setTitle(r.name);
          setList(r.items);
        })
        .finally(() => setLoading(false));
    } else {
      getPlaylistById(match.params.id)
        .then((r) => {
          setTitle(r.name);
          setList(r.items);
        })
        .finally(() => setLoading(false));
    }
  }, [match]);

  const handlePlay = () => newControls.play(Math.floor(Math.random() * list.length));

  const handleAddToPlaylist = (trackId, playlistId) => {
    if (!trackId || !playlistId) return;
    console.log('ADD', playlistId, trackId);
    addTrackToPlaylist(trackId, playlistId);
  };

  const handleRemoveFromPlaylist = (trackId, playlistId) => {
    console.log('REMOVE', playlistId, trackId);
    removeTrackFromPlaylist(trackId, playlistId);
  };

  return (
    <>
      <SectionHeaderComponent type='playlist' title={title} handlePlay={handlePlay} />
      <LoadingComponent loading={loading}>
        <TrackListComponent
          list={list}
          currentTrack={track}
          isPlaying={isPlaying}
          controls={newControls}
          playlistId={match.params.id}
          handleAddToPlaylist={handleAddToPlaylist}
          handleRemoveFromPlaylist={handleRemoveFromPlaylist}
        />
      </LoadingComponent>
    </>
  );
};

export default PlaylistPage;
