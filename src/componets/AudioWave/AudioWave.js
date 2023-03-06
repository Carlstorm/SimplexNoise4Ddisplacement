import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";

export default function AudioWave({setMusicData, musicData, setSongCurrentTime, soundRef}) {
    const margin = 10;
    const chunkSize = 50;


    const inputRef = useRef(null)
    const canvasRef = useRef(null)
    // const soundRef = useRef(null)



    useEffect(() => {
        if (musicData.sound) {
            soundRef.current.play()
            setSongCurrentTime(0)
        }
    },[musicData])


    async function drawToCanvas() {
        const input = inputRef.current;
        // const canvas = canvasRef.current; 
        // const ctx = canvas.getContext("2d");
        const ac = new AudioContext();
        // const {width, height} = canvas;
        // const centerHeight = Math.ceil(height / 2);
        // const scaleFactor = (height - margin * 2) / 2;
        const buffer = await input.files[0].arrayBuffer();
        const audioBuffer = await ac.decodeAudioData(buffer);

        const float32Array = audioBuffer.getChannelData(0);

        const array = [];

        let i = 0;
        const length = float32Array.length;
        while (i < length) {
            array.push(
            float32Array.slice(i, i += chunkSize).reduce(function (total, value) {
                return Math.max(total, Math.abs(value));
            })
            );
        }

        // canvas.width = Math.ceil(float32Array.length / chunkSize + margin * 2);
        soundRef.current.src = URL.createObjectURL(input.files[0])
        setMusicData({sound:URL.createObjectURL(input.files[0]), data:array, duratin:audioBuffer.duration})
        
        // for (let index in array) {
        //     ctx.strokeStyle = "black";
        //     ctx.beginPath();
        //     ctx.moveTo(margin + Number(index), centerHeight - array[index] * scaleFactor);
        //     ctx.lineTo(margin + Number(index), centerHeight + array[index] * scaleFactor);
        //     ctx.stroke();
        // }
    }

    const test = (e) => {
        console.log(soundRef.current.currentTime)
        setSongCurrentTime(e.target.currentTime)
    }

    const test2 = () => {
        setSongCurrentTime("paused")
    }

    return (
        <div className="upload">
            <input ref={inputRef} type="file" accept="audio/mp3" onInput={() => drawToCanvas()}></input>
            {/* <canvas ref={canvasRef} height="100"></canvas> */}
            <audio onPlay={(e) => test(e)} onPause={() => test2()} ref={soundRef} id="sound" controls></audio>
        </div>
    )
}