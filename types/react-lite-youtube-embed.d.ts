declare module "react-lite-youtube-embed" {
  import * as React from "react";

  export interface LiteYouTube {
    id: string;
    adNetwork?: boolean;
    aspectHeight?: number;
    aspectWidth?: number;
    iframeClass?: string;
    noCookie?: boolean;
    params?: string;
    playerClass?: string;
    playlist?: boolean;
    playlistCoverId?: string;
    poster?: string;
    title?: string;
    wrapperClass?: string;
    onIframeAdded?: () => void;
  }

  const LiteYouTubeEmbed: React.FC<LiteYouTube>;

  export default LiteYouTubeEmbed;
}
