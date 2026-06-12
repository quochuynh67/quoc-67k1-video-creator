declare module "web-video-creator" {
  const WebVideoCreator: any;
  export default WebVideoCreator;

  export const VIDEO_ENCODER: Record<string, Record<string, string>>;
  export const AUDIO_ENCODER: Record<string, Record<string, string>>;
  export const TRANSITION: Record<string, string>;
}
