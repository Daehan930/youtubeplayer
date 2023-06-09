import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Main.scss";
import PlaylistModal from "./PlaylistModal";

import ColorThief from "colorthief";

function Main() {
  const DEFAULT_CHANNEL_ID = "UCOmHUn--16B90oW2L6FRR3A";
  // 기본 채널 ID

  const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
  // API 키

  const initialChannelData = null;
  // 초기 채널 데이터

  const [searchTerm, setSearchTerm] = useState(DEFAULT_CHANNEL_ID);
  // 검색어

  const [channelData, setChannelData] = useState(initialChannelData);
  // 채널 데이터

  const [playlistsData, setPlaylistsData] = useState([]);
  // 재생목록 데이터

  const [offset, setOffset] = useState(0);
  // 재생목록 데이터의 시작 인덱스

  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);

  const openPlaylistModal = (playlistId) => {
    setSelectedPlaylistId(playlistId);
  };

  const closePlaylistModal = () => {
    setSelectedPlaylistId(null);
  };

  const channelDataCache = {};

  async function fetchChannelData(channelId) {
    if (channelDataCache[channelId]) {
      console.log("Cache hit:", channelId);
      return channelDataCache[channelId];
    }

    console.log("Fetching channel data:", channelId);
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${API_KEY}`
    );
    const channelResult = await channelResponse.json();
    channelDataCache[channelId] = channelResult;
    return channelResult;
  }
  // 캐시를 사용하여 중복 요청을 방지 (캐시를 사용하지 않으면, 동일한 채널을 검색할 때마다 API 요청이 발생)

  const colorThief = new ColorThief();

  const applyChannelLogoColorToBackground = async (logoUrl) => {
    const img = new Image();
    img.crossOrigin = "Anonymous"; // CORS 설정
    img.src = logoUrl;

    img.onload = () => {
      const dominantColor = colorThief.getColor(img);
      document.body.style.backgroundColor = `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`;
    };
  };
  // 채널 로고의 주요 색상을 배경색으로 설정

  const variants = {
    hidden: (index) => ({
      x: index < offset ? -100 : 100,
      opacity: 0,
    }),
    visible: { x: 0, opacity: 1 },
  };
  // 애니메이션 설정

  useEffect(() => {
    if (!searchTerm) {
      setSearchTerm(DEFAULT_CHANNEL_ID);
    }
  }, []);

  useEffect(() => {
    if (!searchTerm) return;

    const fetchResults = async () => {
      try {
        let channelId;
        if (searchTerm === "") {
          channelId = DEFAULT_CHANNEL_ID;
        } else {
          console.log("Searching:", searchTerm);
          const searchResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&type=channel&q=${searchTerm}&key=${API_KEY}`
          );
          // 채널 검색 요청

          const searchResult = await searchResponse.json();
          // 검색 결과

          if (searchResult.items.length === 0) {
            setChannelData(initialChannelData);
            setPlaylistsData([]);
            return;
          }

          channelId = searchResult.items[0].snippet.channelId;
        }

        const channelResult = await fetchChannelData(channelId);
        // 채널 데이터 요청

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
        // 채널 데이터 설정 (숫자는 콤마를 추가)

        applyChannelLogoColorToBackground(
          channelResult.items[0].snippet.thumbnails.high.url
        );

        console.log("Fetching playlists:", channelId);
        const playlistsResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/playlists?part=snippet&maxResults=8&channelId=${channelId}&key=${API_KEY}`
        );
        // 할당량 관리로 maxResults를 8로 설정

        const playlistsResult = await playlistsResponse.json();

        setPlaylistsData(playlistsResult.items);
      } catch (error) {
        console.log(error);
      }
    };

    fetchResults();
  }, [searchTerm]);

  const handleSearch = (event) => {
    event.preventDefault();
    if (event.target.search.value === "") {
      setSearchTerm(DEFAULT_CHANNEL_ID);
    } else {
      setSearchTerm(event.target.search.value);
    }
  };

  const handleRandomChannel = async () => {
    // 랜덤한 검색어 생성 (예: 한글 글자)
    const randomSearchTerm = String.fromCharCode(
      0xac00 + Math.floor(Math.random() * (0xd7af - 0xac00 + 1))
    );

    // 랜덤한 검색어로 채널 검색
    const searchResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&type=channel&q=${randomSearchTerm}&regionCode=KR&key=${API_KEY}`
    );
    const searchResult = await searchResponse.json();

    // 검색 결과가 없으면 다시 시도
    if (searchResult.items.length === 0) {
      handleRandomChannel();
      return;
    }

    // 검색 결과 중 랜덤한 채널 선택
    const randomChannelIndex = Math.floor(
      Math.random() * searchResult.items.length
    );
    const channelId = searchResult.items[randomChannelIndex].snippet.channelId;

    // 선택한 채널 정보 가져오기
    setSearchTerm(channelId);
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
      {channelData ? (
        <header>
          <div className="glass">
            <form className="search-box" onSubmit={handleSearch}>
              <div>
                <input type="text" placeholder="채널 검색" name="search" />
                <button type="submit">검색</button>
              </div>
            </form>
            <button onClick={handleRandomChannel}>랜덤 채널</button>
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
                        onClick={() => openPlaylistModal(playlist.id)}
                      >
                           {selectedPlaylistId && (
                <PlaylistModal
                  playlistId={selectedPlaylistId}
                  onClose={closePlaylistModal}
                />
              )}
                        <img
                          className="playlist-thumbnail"
                          src={playlist.snippet.thumbnails.high.url}
                          alt="재생 목록 썸네일"
                        />
                        <p className="playlist-title">
                          {playlist.snippet.title}
                        </p>
                      </motion.div>
                    ))}
                  {console.log(playlistsData, "재생목록ㅇ")}
                </AnimatePresence>
              ) : (
                <p>재생 목록이 없습니다.</p>
              )}
           
            </div>

            <button className="btn-right" onClick={() => handleSlide(1)}>
              다음
            </button>
          </div>
        </header>
      ) : null}
    </div>
  );
}

export default Main;
