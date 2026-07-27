import { useCallback, useEffect, useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Maximize, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { getYouTubeEmbedUrl, getYouTubeThumbnail, getYouTubeVideoId } from "@/lib/youtube";

type Props = {
  url: string;
  title: string;
  poster?: string;
  hero?: boolean;
  autoplayWhenVisible?: boolean;
  className?: string;
};

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const totalSeconds = Math.floor(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  return `${minutes}:${String(totalSeconds % 60).padStart(2, "0")}`;
};

export const YouTubeFacade = ({ url, title, poster, hero = false, autoplayWhenVisible = false, className = "" }: Props) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerId = useId().replace(/:/g, "");
  const seekingRef = useRef(false);
  const [mounted, setMounted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [posterFailed, setPosterFailed] = useState(false);
  const reduced = useReducedMotion();
  const videoId = getYouTubeVideoId(url);
  const posterUrl = posterFailed || !poster ? getYouTubeThumbnail(url) : poster;

  const command = useCallback((func: string, args: unknown[] = []) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args }),
      "https://www.youtube-nocookie.com",
    );
  }, []);

  const requestPlayerState = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;
    iframe.contentWindow.postMessage(
      JSON.stringify({ event: "listening", id: playerId, channel: "neotrix-motion" }),
      "https://www.youtube-nocookie.com",
    );
    command("getCurrentTime");
    command("getDuration");
  }, [command, playerId]);

  const start = useCallback((unmute = false) => {
    setMounted(true);
    setPlaying(true);
    if (unmute) setMuted(false);
    window.setTimeout(() => {
      command("playVideo");
      if (unmute) command("unMute");
    }, 500);
  }, [command]);

  useEffect(() => {
    if (!autoplayWhenVisible || reduced || !rootRef.current || !window.matchMedia("(pointer:fine)").matches) return;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (connection?.saveData) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const timer = window.setTimeout(() => start(false), 900);
        observer.disconnect();
        return () => window.clearTimeout(timer);
      }
    }, { threshold: 0.6 });
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, [autoplayWhenVisible, reduced, start]);

  useEffect(() => {
    if (!mounted) return;
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.source !== iframe.contentWindow) return;
      if (event.origin !== "https://www.youtube-nocookie.com" && event.origin !== "https://www.youtube.com") return;

      let data: { event?: string; info?: Record<string, unknown> };
      try {
        data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
      } catch {
        return;
      }

      if (data.event === "infoDelivery" && data.info) {
        const nextDuration = Number(data.info.duration ?? data.info.videoDuration);
        const nextCurrentTime = Number(data.info.currentTime);
        if (Number.isFinite(nextDuration) && nextDuration > 0) setDuration(nextDuration);
        if (!seekingRef.current && Number.isFinite(nextCurrentTime) && nextCurrentTime >= 0) setCurrentTime(nextCurrentTime);
      }

      if (data.event === "onStateChange") {
        const state = Number(data.info);
        if (state === 1) setPlaying(true);
        if (state === 2 || state === 0) setPlaying(false);
        if (state === 0) setCurrentTime(0);
      }
    };

    window.addEventListener("message", handleMessage);
    requestPlayerState();
    const retryTimers = [250, 750, 1500].map((delay) => window.setTimeout(requestPlayerState, delay));
    const pollTimer = window.setInterval(requestPlayerState, 500);

    return () => {
      window.removeEventListener("message", handleMessage);
      retryTimers.forEach((timer) => window.clearTimeout(timer));
      window.clearInterval(pollTimer);
    };
  }, [mounted, requestPlayerState]);

  const togglePlay = () => {
    if (!mounted) return start(false);
    command(playing ? "pauseVideo" : "playVideo");
    setPlaying((value) => !value);
  };

  const toggleMute = () => {
    command(muted ? "unMute" : "mute");
    setMuted((value) => !value);
  };

  const seek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextTime = Number(event.target.value);
    seekingRef.current = true;
    setCurrentTime(nextTime);
    command("seekTo", [nextTime, true]);
    window.setTimeout(() => {
      seekingRef.current = false;
    }, 150);
  };

  const fullscreen = () => rootRef.current?.requestFullscreen?.();

  if (!videoId) {
    return <div className={"grid aspect-video place-items-center bg-white/5 text-sm text-white/50 " + className}>Video unavailable</div>;
  }

  return (
    <div ref={rootRef} className={"group relative isolate aspect-video overflow-hidden bg-[#141719] " + className}>
      <img
        src={posterUrl}
        alt=""
        aria-hidden
        loading={hero ? "eager" : "lazy"}
        fetchPriority={hero ? "high" : "auto"}
        decoding="async"
        onError={() => setPosterFailed(true)}
        className={"absolute inset-0 size-full object-cover transition duration-1000 group-hover:scale-[1.025] " + (mounted ? "opacity-0" : "opacity-100")}
      />
      {mounted && (
        <iframe
          ref={iframeRef}
          title={title}
          src={getYouTubeEmbedUrl(url, { autoplay: true, muted, loop: hero })}
          className="absolute inset-0 size-full border-0"
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/20" />
      {!mounted && (
        <button onClick={() => start(false)} className="absolute inset-0 grid place-items-center" aria-label={"Play " + title}>
          <motion.span whileHover={reduced ? undefined : { scale: 1.08 }} className="grid size-20 place-items-center rounded-full border border-white/35 bg-black/25 text-white backdrop-blur-md sm:size-24">
            <Play className="ml-1 size-7 fill-current" />
          </motion.span>
        </button>
      )}
      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between sm:bottom-5 sm:left-5 sm:right-5">
        <div className="pointer-events-none">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#B8FF35]">{playing ? "Now playing" : "Showreel"}</p>
          <p className="mt-1 text-sm font-medium text-white sm:text-base">{title}</p>
        </div>
        <div className="flex gap-2">
          {mounted && (
            <>
              <button onClick={togglePlay} className="grid size-10 place-items-center rounded-full border border-white/20 bg-black/30 backdrop-blur-md" aria-label={playing ? "Pause video" : "Play video"}>
                {playing ? <Pause className="size-4 fill-current" /> : <Play className="ml-0.5 size-4 fill-current" />}
              </button>
              <button onClick={toggleMute} className="grid size-10 place-items-center rounded-full border border-white/20 bg-black/30 backdrop-blur-md" aria-label={muted ? "Unmute video" : "Mute video"}>
                {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
              </button>
            </>
          )}
          <button onClick={fullscreen} className="grid size-10 place-items-center rounded-full border border-white/20 bg-black/30 backdrop-blur-md" aria-label="Enter fullscreen">
            <Maximize className="size-4" />
          </button>
        </div>
      </div>
      {mounted && (
        <div className="absolute bottom-3 left-3 right-16 z-20 sm:left-5 sm:right-28">
          <div className="mb-1 flex justify-between font-mono text-[9px] tabular-nums text-white/70" aria-hidden="true">
            <span>{formatTime(currentTime)}</span>
            <span>{duration > 0 ? formatTime(duration) : "--:--"}</span>
          </div>
          <input
            type="range"
            min={0}
            max={Math.max(duration, 1)}
            step={0.1}
            value={Math.min(currentTime, Math.max(duration, 1))}
            onChange={seek}
            disabled={duration <= 0}
            aria-label={`Seek ${title}`}
            className="h-1 w-full cursor-pointer appearance-none rounded-full accent-[#B8FF35] disabled:cursor-wait disabled:opacity-50"
            style={{
              background: `linear-gradient(to right, #B8FF35 ${(duration > 0 ? currentTime / duration : 0) * 100}%, rgba(255,255,255,.25) ${(duration > 0 ? currentTime / duration : 0) * 100}%)`,
            }}
          />
        </div>
      )}
    </div>
  );
};
