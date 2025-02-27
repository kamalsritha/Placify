import React from "react";
import { useParams } from "react-router-dom";

function Location() {
  const { loc } = useParams(); 

  if (!loc) {
    return <p style={{ textAlign: "center", marginTop: "20px" }}>Location not available</p>;
  }

  function extractSrc(iframeString) {
    const match = iframeString.match(/src="([^"]+)"/);
    return match ? match[1] : null;
  }
  

  const iframeString = loc;
  const extractedSrc = extractSrc(iframeString);
  

  return (
    <div
      style={{
        display: "grid",
        justifyContent: "center",
        textAlign: "center",
        marginTop: "20px",
      }}
    >
      <h2><b>Location of Interview</b></h2>
      <iframe
        title="Google Maps Location"
        src={extractedSrc}
        width="800"
        height="650"
        style={{
          border: "0",
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
}

export default Location;
