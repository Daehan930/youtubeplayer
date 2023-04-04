import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import "./Main.scss";
   
function Main(){
    const [channelData, setChannelData] = useState({});

  const [playlistsData, setPlaylistsData] = useState([]);
  
  const API_KEY = "AIzaSyBeRoJxa8dsDPjG789v-azHEkrbKYn_qME";
  const channelId = "UCSLrpBAzr-ROVGHQ5EmxnUg";

  
    const [offset, setOffset] = useState(0);
  
    const slide = (direction) => {
      const newOffset = offset + direction * 4;
      if (newOffset >= 0 && newOffset < playlistsData.length) {
        setOffset(newOffset);
      }
    };
    
    const variants = {
      hidden: (index) => ({
        x: index < offset ? -100 : 100,
        opacity: 0,
      }),
      visible: { x: 0, opacity: 1 },
    };
  
  
  // 채널의 재생목록, 동영상 관련 호출
  async function fetchPlaylistsData() {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/playlists?part=snippet&channelId=${channelId}&maxResults=50&key=${API_KEY}`
      );
      const data = await response.json();
      setPlaylistsData(data.items);
    } catch (error) {
      console.error("Failed to fetch playlists data:", error);
    }
  }

  // 채널 기본정보 호출
    useEffect(() => {
      async function fetchChannelData() {
        try {
          const response = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${API_KEY}`
          );
          const data = await response.json();
          const channelItem = data.items[0];
          const snippet = channelItem.snippet;
          const statistics = channelItem.statistics;

          setChannelData({
            logo: snippet.thumbnails.default.url,
            name: snippet.title,
            description: snippet.description,
          subscriberCount: statistics.subscriberCount,
          videoCount: statistics.videoCount,
          viewCount: statistics.viewCount,
          });
        // {
        //   console.log(statistics);
        // }
        } catch (error) {
        console.error("Failed to fetch channel data:", error);
        }
      }
  
      fetchChannelData();
    fetchPlaylistsData();
    }, []);

  function formatNumber(num) {
    num = num || 0; // num이 undefined일 경우 기본값 0으로 설정
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + "만";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "천";
    } else {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); //전체 조회수 3자리수마다 " , " 찍기
    }
  }

  return (
    <header>
      <div className="glass">
        <div className="channel-info">
         <h1 className="channel-name">{channelData.name}</h1>

          <img
            className="channel-logo"
            src={channelData.logo}
            alt="채널 로고"
          />

        <p className="channel-description">{channelData.description}</p>

          <div className="channel-statistics">
            <p>구독자 수: {formatNumber(channelData.subscriberCount)} 명</p>
          <p>동영상 수: {channelData.videoCount}</p>
            <p>전체 조회수: {formatNumber(channelData.viewCount)} 회</p>
        </div>
      </div>

      <button className="btn-left" onClick={() => slide(-1)}>이전</button>

      <div className="playlists-container">
      <h2 className="playlists-title">재생 목록</h2>
        <AnimatePresence>
          {playlistsData.slice(offset, offset + 4).map((playlist, index) => (
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

    </div>
    <button className="btn-right" onClick={() => slide(1)}>다음</button>



      </div>
    </header>
  );
}


export default Main;
