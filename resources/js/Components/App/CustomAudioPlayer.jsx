import { PlayCircleIcon, PauseCircleIcon } from "@heroicons/react/24/solid";

import React, { useState, useRef } from "react";

const CustomAudioPlayer = ({ file, showVolume = true }) => {
    const audioRef = useRef();
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    const togglePlayPause = () => {
        const audio = audioRef.current;
        if (isPlaying) {
            audio.pause();
        } else {
            setDuration(audio.duration);
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleVolumeChange = (e) => {
        const volume = ev.target.value;
        audioRef.current.volume = volume;
        setVolume(volume);
    };
    const handleTimeUpdate = (e) => {
        const audio = audioRef.current;
        setDuration(audio.duration);
        setCurrentTime(ev.target.currentTime);
    };

    const handleLoadedMetaData = (e) => {
        setDuration(e.target.duration);
    };
    const handleSeekChange = (e) => {
        const time = e.target.value;
        audioRef.current.currentTime = time;
    };

    return (
        <div className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-md bg-slate-800">
            <audio
                src={file.url}
                ref={audioRef}
                controls
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetaData}
                className="hidden"
            ></audio>

            <button onClick={togglePlayPause}>
                {isPlaying && <PauseCircleIcon className="w-6 text-gray-400" />}
                {!isPlaying && <PlayCircleIcon className="w-6 text-gray-400" />}
            </button>
            {showVolume && (
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    onChange={handleVolumeChange}
                />
            )}
            <input
                type="range"
                className="flex-1"
                min="0"
                max={duration}
                step="0.01"
                value={currentTime}
                onChange={handleSeekChange}
            />
        </div>
    );
};

export default CustomAudioPlayer;
