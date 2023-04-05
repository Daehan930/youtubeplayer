import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Main.scss";

const initialChannelData = {
  name: "채널 이름",
  logo: "로고 이미지",
  description: "채널 소개",
  subscriberCount: 0,
  videoCount: 0,
  viewCount: 0,
};

function Main() {
  const API_KEY = "AIzaSyBeRoJxa8dsDPjG789v-azHEkrbKYn_qME";

  const [searchTerm, setSearchTerm] = useState("");
  const [channelData, setChannelData] = useState(initialChannelData);
  const [playlistsData, setPlaylistsData] = useState([]);
  const [offset, setOffset] = useState(0);

  const variants = {
    hidden: (index) => ({
      x: index < offset ? -100 : 100,
      opacity: 0,
    }),
    visible: { x: 0, opacity: 1 },
  };

  const handleSearch = async (event) => {
    event.preventDefault(); // 기본 동작 중단

    try {
      const searchResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&type=channel&q=${searchTerm}&key=${API_KEY}`
      );
      const searchResult = await searchResponse.json();

      if (searchResult.items.length === 0) {
        setChannelData(initialChannelData);
        setPlaylistsData([]);
        return;
      }

      const channelId = searchResult.items[0].snippet.channelId;

      const channelResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${API_KEY}`
      );
      const channelResult = await channelResponse.json();

      setChannelData({
        name: channelResult.items[0].snippet.title,
        logo: channelResult.items[0].snippet.thumbnails.high.url,
        description: channelResult.items[0].snippet.description,
        subscriberCount:
          +channelResult.items[0].statistics.subscriberCount.toLocaleString(),
        videoCount:
          +channelResult.items[0].statistics.videoCount.toLocaleString(),
        viewCount:
          +channelResult.items[0].statistics.viewCount.toLocaleString(),
      });

      const playlistsResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/playlists?part=snippet&maxResults=12&channelId=${channelId}&key=${API_KEY}`
      );
      const playlistsResult = await playlistsResponse.json();

      setPlaylistsData(playlistsResult.items);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSlide = (direction) => {
    if (direction === -1 && offset > 0) {
      setOffset(offset - 4);
    } else if (direction === 1 && offset < playlistsData.length - 4) {
      setOffset(offset + 4);
    }
  };

  return (
    <div className="App">
      <header>
        <div className="glass">

          <form  className="search-box" onSubmit={handleSearch}>
            <div>
              <input
                type="text"
                placeholder="채널 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit">검색</button>
            </div>
          </form>

          <h1 className="channel-name">{channelData.name}</h1>

          <div className="channel-info">
            <img
              className="channel-logo"
              src={channelData.logo}
              alt="채널 로고"
            />

            <div className="channel-statistics">
              <p>
                구독자 수: {channelData.subscriberCount.toLocaleString()} 명
              </p>
              <p>동영상 수: {channelData.videoCount.toLocaleString()} 개</p>
              <p>전체 조회수: {channelData.viewCount.toLocaleString()} 회</p>
            </div>
          </div>

          <p
            style={{ textAlign: "center", fontSize: "1rem" }}
            className="channel-description"
          >
            {channelData.description}
          </p>

          <button className="btn-left" onClick={() => handleSlide(-1)}>
            이전
          </button>

          <div className="playlists-container">
            <h2 className="playlists-title">재생 목록</h2>
            {playlistsData.length > 0 ? (
              <AnimatePresence>
                {playlistsData
                  .slice(offset, offset + 4)
                  .map((playlist, index) => (
                    <motion.div
                      className="playlist"
                      key={playlist.id}
                      initial="hidden"
                      animate="visible"
                      exit="fadeOut"
                      custom={index}
                      variants={variants}
                      transition={{ duration: 0.2 }}
                    >
                      <img
                        className="playlist-thumbnail"
                        src={playlist.snippet.thumbnails.high.url}
                        alt="재생 목록 썸네일"
                      />
                      <p className="playlist-title">{playlist.snippet.title}</p>
                    </motion.div>
                  ))}
              </AnimatePresence>
            ) : (
              <p>검색 결과가 없습니다.</p>
            )}
          </div>

          <button className="btn-right" onClick={() => handleSlide(1)}>
            다음
          </button>
        </div>
      </header>
    </div>
  );
}

export default Main;
