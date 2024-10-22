import { MicrophoneIcon, StopCircleIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

export default function AudioRecorder({ fileReady }) {
    const [recording, setRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);

    const onMicrophoneClick = async () => {
        if (recording) {
            setRecording(false);
            if (mediaRecorder) {
                mediaRecorder.stop();
                setMediaRecorder(null);
            }
            return;
        }
        setRecording(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });
            const newMediaRecorder = new MediaRecorder(stream);
            const chunks = [];

            newMediaRecorder.addEventListener("dataavailable", (event) => {
                chunks.push(event.data);
            });
            newMediaRecorder.addEventListener("stop", (event) => {
                let audioBlob = new Blob(chunks, {
                    type: "audio/ogg; codecs=opus",
                });
                let audioFile = new File([audioBlob], "recorder_audio.ogg", {
                    type: "audio/ogg; codecs=opus",
                });
                let url = URL.createObjectURL(audioFile);

                fileReady(audioFile, url);
            });
            newMediaRecorder.start();
            setMediaRecorder(newMediaRecorder);

        } catch (error) {
            setRecording(false);
        }
    };
    return (
        <button
            className="p-1 text-gray-400 hover:text-gray-200"
            onClick={onMicrophoneClick}
        >
            {recording && <StopCircleIcon className="w-6 text-red-600" />}
            {!recording && <MicrophoneIcon className="w-6 " />}
        </button>
    );
}
