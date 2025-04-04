import { Pause, Play, Trash } from 'lucide-react';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { cn } from '../../../../../../lib/utils';
import { DurationSchemaType } from '../../../../../../modules/tracks/trackType';

export interface AudioInputProps {
  label?: string;
  id: string;
  name?: string;
  value?: File | null;
  className?: string;
  required?: boolean;
  duration?: DurationSchemaType;
  waveData?: Array<string | number>;
  trackUrl?: string;
  waveDataFromSource?: string;
  // eslint-disable-next-line no-unused-vars
  // onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onFileChange: (e?: ChangeEvent<HTMLInputElement>) => void;
  setUrlNull?: () => void;
  onDurationChange: (duration: DurationSchemaType) => void;
  onWaveDataChange: (waveData: Array<String>) => void;
}

const MusicUploader = ({ className, ...props }: AudioInputProps) => {
  const waveRef = useRef<any>();
  const audioRef = useRef<HTMLAudioElement | undefined>(undefined);
  const audioContainerRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const durationInSec =
    (props.duration?.hour ?? 0) * 60 * 60 +
    (props.duration?.minutes ?? 0) * 60 +
    (props.duration?.seconds ?? 0);
  // const waveData = props.waveDataFromSource?.substring(0, 50);

  const waveDataModified = props.waveDataFromSource
    ? props.waveDataFromSource!.match(/-?\d+(\.\d+)?/g)
    : undefined;

  const float32Array = waveDataModified
    ? Float32Array.from(waveDataModified.map(Number))
    : undefined;

  const handlePlayPause = () => {
    if (!waveRef.current) return;
    if (isPlaying) {
      waveRef.current.pause();
    } else {
      waveRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  console.log(audioRef.current);

  const secondsToDurationSchemaType = (seconds: number) => {
    const hour = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const sec = Math.floor(seconds % 60);
    return {
      hour: hour,
      minutes: minutes,
      seconds: sec,
    };
  };

  useEffect(() => {
    if (waveRef.current != null) {
      waveRef.current.destroy();
      waveRef.current = null;
    }

    if (props.value) {
      const audioElement = new Audio();
      audioElement.src = URL.createObjectURL(props.value);
      waveRef.current = WaveSurfer.create({
        container: audioContainerRef.current,
        waveColor: 'black',
        progressColor: 'grey',
        url: audioElement.src,
        barWidth: 3,
        height: 80,
        barRadius: 2,
      });

      if (waveRef.current) {
        waveRef.current.on('ready', () => {
          const audioDuration = secondsToDurationSchemaType(
            audioElement.duration
          );
          props.onDurationChange(audioDuration);
          const waveData = waveRef.current.exportPeaks()[0];
          console.log(waveData);
          props.onWaveDataChange(waveData);
        });
        waveRef.current.on('finish', () => {
          waveRef.current.setTime(0);
          setIsPlaying(false);
        });
      }
    }
    return () => {
      waveRef.current?.destroy();
    };
  }, [props.value]);

  useEffect(() => {
    console.log('float array updates');
    if (typeof window === 'undefined' || !props.trackUrl) return;
    const create = async () => {
      if (waveRef.current) {
        waveRef.current.destroy();
        waveRef.current = undefined;
      }
      if (audioRef.current) {
        audioRef.current = undefined;
      }

      // let tempAudio = new Audio(props.trackUrl);
      // audioRef.current = tempAudio;
      waveRef.current = WaveSurfer.create({
        container: audioContainerRef.current,
        waveColor: 'black',
        progressColor: 'grey',
        peaks: [float32Array!],
        barWidth: 3,
        height: 80,
        barRadius: 2,
        // url: props.trackUrl,
        // duration:
        duration: props.duration?.minutes ?? undefined,
      });

      // if (audioRef.current != undefined) {
      //   audioRef.current?.addEventListener('ended', () => {});

      //   const getCurrentTime = () => {
      //     setCurrentTime(audioRef.current!.currentTime);
      //     console.log(audioRef.current!.currentTime);
      //   };

      //   audioRef.current?.addEventListener('timeupdate', () => {
      //     getCurrentTime();
      //   });

      //   // getCurrentTime();
      // }
    };
    create();
    return () => {
      audioRef.current?.removeEventListener('ended', () => {});
      audioRef.current?.removeEventListener('pause', () => {});
      audioRef.current?.removeEventListener('timeupdate', () => {});
      waveRef.current?.destroy();
    };
  }, [float32Array, props.trackUrl]);

  useEffect(() => {
    if (!waveRef.current) {
      return;
    }

    if (currentTime != 0) {
      waveRef.current?.manualRenderProgress(currentTime / durationInSec);
    }
  }, [currentTime]);

  return (
    <div className={`flex flex-col last-of-type:mb-0 ` + className}>
      {props.label ? (
        <label
          htmlFor={props.id}
          className="text-sm font-medium mb-2 text-dark-500"
        >
          {props.label}
          {props.required ? '*' : ''}
        </label>
      ) : (
        <></>
      )}
      <div className="flex flex-col sm:flex-row items-end sm:items-center border-0 sm:border rounded-md bg-transparent sm:bg-slate-50">
        <div className="flex-1 border sm:border-0 rounded-md bg-slate-50 text-sm focus:outline-none w-full text-slate-600 relative overflow-clip">
          {props.value || props.trackUrl ? (
            <div
              className={cn(
                `rounded pl-12 pr-20 mx-2 my-4 relative flex flex-col justify-center z-0`
              )}
              ref={audioContainerRef}
            >
              <button
                className="inline-flex absolute left-[0px] top-1/2 transform -translate-y-1/2"
                type="button"
                onClick={handlePlayPause}
              >
                {isPlaying ? (
                  <div
                    className={`${'rounded-full bg-black p-2 hover:shadow-md shadow-gray-200'} `}
                  >
                    <Pause size="21" className={`text-white`} />
                  </div>
                ) : (
                  <div
                    className={`${'rounded-full bg-black p-2 hover:shadow-md shadow-gray-200'} `}
                  >
                    <Play size="21" className={` text-white`} />
                  </div>
                )}
              </button>
              <div className="inline-flex absolute right-[3px] top-1/2 transform -translate-y-1/2 py-0.5 px-2 bg-gray-600 text-white rounded-md">
                {props.duration
                  ? `${props.duration.hour?.toString().padStart(2, '0') ?? '00'}:${props.duration.minutes?.toString().padStart(2, '0') ?? '00'}:${props.duration.seconds}`
                  : '0:00'}
              </div>
              <button
                role="button"
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  if (props.value) {
                    props.onFileChange(undefined);
                  }
                  if (props.trackUrl) {
                    props.setUrlNull?.();
                    audioRef.current = undefined;
                  }
                }}
                className="absolute rounded-sm -top-2 bg-red-600 p-1 text-white right-1 "
              >
                <Trash size="16" />
              </button>
            </div>
          ) : (
            <label htmlFor={props.id} className="h-full w-full py-3 px-2 block">
              Choose Audio
            </label>
          )}
        </div>
        <input
          onChange={(e) => {
            props.onFileChange(e);
          }}
          className="hidden"
          type="file"
          id={props.id}
          name={props.name}
          accept="audio/*"
        />
      </div>
    </div>
  );
};

export default MusicUploader;
