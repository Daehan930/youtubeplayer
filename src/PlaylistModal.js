import React, { useState, useEffect } from "react";
import "./PlaylistModal.scss";

  const PlaylistModal = ({ playlist, onClose }) => {

  const [videosData, setVideosData] = useState([]);

  const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
  // API 키


  useEffect(() => {
    const fetchVideos = async () => {
      // playlistId를 정의합니다.
      const playlistId = playlist.id;
  
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&maxResults=25&playlistId=${playlistId}&key=${API_KEY}`
      );
      const data = await response.json();
      setVideosData(data.items);
    };
  
    if (playlist) {
      fetchVideos();
    }
  }, [playlist]);

  return (
    <div className="playlist-modal">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          X
        </button>
        {videosData.length > 0 && (
          <div className="video-section">
            <div className="main-video">
              <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${videosData[0].snippet.resourceId.videoId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <p>{videosData[0].snippet.description}</p>
            </div>
            <div className="video-list">
              <h3>{videosData[0].snippet.playlistTitle}</h3>
              {videosData.map((video, index) => (
                <div key={video.snippet.resourceId.videoId} className="video-item">
                  <img
                    src={video.snippet.thumbnails.default.url}
                    alt={video.snippet.title}
                  />
                  <p>{video.snippet.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistModal;
