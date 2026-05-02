import React from 'react';

const TestYouTube = () => {
  const testVideoUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
  
  const getEmbedUrl = (url) => {
    let videoId = url.split('v=')[1];
    if (videoId && videoId.includes('&')) {
      videoId = videoId.split('&')[0];
    }
    return `https://www.youtube.com/embed/${videoId}`;
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>YouTube Video Test</h1>
      <div style={{ 
        position: "relative", 
        paddingBottom: "56.25%", 
        height: 0, 
        overflow: "hidden",
        marginBottom: "2rem"
      }}>
        <iframe
          src={getEmbedUrl(testVideoUrl)}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%"
          }}
          frameBorder="0"
          allowFullScreen
          title="Test Video"
        />
      </div>
      <p>If you can see this video, YouTube embedding works!</p>
      <p>Video URL: {testVideoUrl}</p>
    </div>
  );
};

export default TestYouTube;
