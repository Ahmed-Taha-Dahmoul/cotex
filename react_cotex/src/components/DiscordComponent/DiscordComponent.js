import React from 'react';

const DiscordWidget = () => {
  return (
    <div className="discord-widget">
      <iframe
        src="https://discord.com/widget?id=689951983519662096&theme=dark"
        width="100%" // Use percentage width for responsiveness
        height="500"
        allowtransparency="true"
        frameBorder="0"
        sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
        title="Discord Widget"
      ></iframe>
    </div>
  );
};

export default DiscordWidget;
