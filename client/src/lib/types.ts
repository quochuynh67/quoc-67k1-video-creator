export type AudioTrack = {
  id: string;
  path: string;
  loop: boolean;
  volume: number;
  startTime: number;
  endTime: number;
  seekStart: number;
  seekEnd: number;
  fadeInDuration: number;
  fadeOutDuration: number;
};

export type FontEntry = {
  id: string;
  path: string;
  family: string;
  format: string;
};

export type SceneTransition = {
  id: string;
  duration: number;
};

export type Scene = {
  id: string;
  name: string;
  duration: number;
  background: string;
  sourceType: "html" | "url";
  html: string;
  url: string;
  transition: SceneTransition | null;
  startTime: number;
  autostartRender: boolean;
};

export type Project = {
  width: number;
  height: number;
  fps: number;
  backgroundOpacity: number;
  outputFormat: "mp4" | "webm";
  videoQuality: number;
  videoBitrate: string;
  audioBitrate: string;
  pixelFormat: "yuv420p" | "yuv444p" | "rgb24";
  volume: number;
  coverCapture: boolean;
  coverCaptureTime: number;
  coverCaptureFormat: "jpg" | "png" | "bmp";
  attachCoverPath: string;
  fonts: FontEntry[];
  audios: AudioTrack[];
  scenes: Scene[];
};
