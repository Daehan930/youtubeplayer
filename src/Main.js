import React, { useEffect, useState } from 'react';
import './Main.scss';
   
function Main() {
    const [channelData, setChannelData] = useState({});

      // YouTube API 키를 여기에 넣으세요.
    const API_KEY = 'AIzaSyBeRoJxa8dsDPjG789v-azHEkrbKYn_qME';
  
    useEffect(() => {
      async function fetchChannelData() {
        // 채널 ID를 여기에 넣으세요.
        const channelId = 'UCSLrpBAzr-ROVGHQ5EmxnUg';
        
        try {
          const response = await fetch(
            `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${API_KEY}`
          );
          const data = await response.json();
          const channelItem = data.items[0];
          const snippet = channelItem.snippet;
          const statistics = channelItem.statistics;

          setChannelData({
            logo: snippet.thumbnails.default.url,
            name: snippet.title,
            description: snippet.description,
            // subscriberCount: statistics.subscriberCount,
            // videoCount: statistics.videoCount,
            // playlistCount: statistics.playlistCount
          });
        } catch (error) {
          console.error('Failed to fetch channel data:', error);
        }
      }
  
      fetchChannelData();
    }, []);

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
        {/* <div className="channel-statistics">
          <p>구독자 수: {channelData.subscriberCount}</p>
          <p>동영상 수: {channelData.videoCount}</p>
          <p>재생목록 수: {channelData.playlistCount}</p>
        </div> */}
        </div>
      </div>
    </header>
  );
}

export default Main;

