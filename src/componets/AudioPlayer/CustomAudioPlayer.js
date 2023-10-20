import { useEffect, useRef, useState } from "react"
import StopIcon from "../../assets/svgs/StopIcon"
import PlayIcon from "../../assets/svgs/PlayIcon"

import style from './CustomAudioPlayer.module.scss'

export default function CustomAudioPlayer({soundRef, musicData}) {
    const [isPlaying, setIsPlaying] = useState(false)
    const animationFrameRef = useRef(null);

    const [time, setTime] = useState(0)

    let playerElm = soundRef.current

    const canvasRef = useRef(null)
    const canvasRefFull = useRef(null)

    useEffect(() => {
        if (!canvasRef.current || !canvasRefFull.current)
            return
        if (musicData.sound)
            drawAudioWave()
        else {
            clearAudioWave()
            setTime(0)
            setIsPlaying(false)
        }
        window.addEventListener("resize", drawAudioWave)
        return () => {
            window.removeEventListener("resize", drawAudioWave)
        }
    },[musicData, canvasRef, canvasRefFull])

    useEffect(() => {
        if (isPlaying) {
            playerElm.play()
            startAnimation();
        } else {
            stopAnimation();
            if (playerElm)
                playerElm.pause()
        }
    }, [isPlaying]);


    const clearAudioWave = () => {
        const canvas = canvasRef.current; 
        const canvas_empt = canvasRefFull.current;
        const ctx = canvas.getContext("2d");
        const ctx2 = canvas_empt.getContext("2d")
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx2.clearRect(0, 0, canvas_empt.width, canvas_empt.height);
    }

    const drawAudioWave = () =>  {
        clearAudioWave()
        let audioDisplayChunkSize = 400*(window.innerWidth/3841);

        const canvas = canvasRef.current; 
        const canvas_empt = canvasRefFull.current

        canvas.width = musicData.data.length;
        canvas_empt.width = musicData.data.length;
        
        const closestFactor = Math.round(musicData.data.length / audioDisplayChunkSize);

        const result = musicData.data.length / closestFactor;

        const chunkValue = musicData.data.length/result;

        let arrayCleanChunks = []
        let currentSum = 0

        for (let i = 0; i < musicData.data.length; i++) {
            currentSum += musicData.data[i];
        
            if ((i + 1) % (musicData.data.length / result) === 0) {
                arrayCleanChunks.push(currentSum);
                currentSum = 0;
            }
        }
        
        if (currentSum !== 0) {
            arrayCleanChunks.push(currentSum);
        }

    
        const maxVal = Math.max(...arrayCleanChunks);
        const minVal = Math.min(...arrayCleanChunks);

        // Normalize the values
        const normalizedArray = arrayCleanChunks.map(value => (value - minVal) / (maxVal - minVal))

        const centerHeight = Math.ceil(canvas.height / 2);
        const scaleFactor = (canvas.height / 2);

        const ctx = canvas.getContext("2d");
        const ctx2 = canvas_empt.getContext("2d")

        var grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
        grad.addColorStop(0, "blue");
        grad.addColorStop(1, "red");
        ctx.strokeStyle = grad;
        ctx2.strokeStyle = grad;

        let lineWidth = chunkValue*0.25
        for (let index in normalizedArray) {
            ctx2.lineWidth = lineWidth;
            ctx.lineWidth = lineWidth;

            ctx2.beginPath();
            ctx2.moveTo((index*chunkValue)+(lineWidth/2), centerHeight - ((normalizedArray[index]) * scaleFactor));
            ctx2.lineTo((index*chunkValue)+(lineWidth/2), centerHeight + ((normalizedArray[index]) * scaleFactor));
            ctx2.stroke();

            ctx.beginPath();
            ctx.moveTo((index*chunkValue)+(lineWidth/2), centerHeight - ((normalizedArray[index]) * scaleFactor));
            ctx.lineTo((index*chunkValue)+(lineWidth/2), centerHeight + ((normalizedArray[index]) * scaleFactor));
            ctx.stroke();
        }
    }

    const startAnimation = () => {
        const animationLoop = () => {
            const currentTime = (playerElm.currentTime / musicData.duratin) * 100
            if (currentTime > 99.9) {
                return resetPlayer()
            }
            setTime(currentTime);
            animationFrameRef.current = requestAnimationFrame(animationLoop);
        };
        animationLoop();
    };

    const resetPlayer = () => {
        setIsPlaying(false)
        playerElm.currentTime = 0
        setTime(0)
    }

    const stopAnimation = () => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
    };

    const event = {
        play: () => {
            setIsPlaying(true);
        },
        pause: () => {
            setIsPlaying(false);
        },
        setTime: (e) => {
            const bar = e.target.getBoundingClientRect()
            const diff = e.clientX-bar.x
            const percentage = diff/bar.width
            playerElm.currentTime = musicData.duratin*percentage
            setTime(percentage*100)
        },
    }

    return (
        <div className={style.component}>
            {musicData.sound ? 
                <div className={style.player_actions}>
                    {isPlaying ? 
                        <StopIcon className={style.stop_icon} onClick={() => event.pause()}/>
                        :
                        <PlayIcon className={style.play_icon} onClick={() => event.play()}/>
                    }
                </div>
            : null}
            <div className={style.wave_wrap}>
                <>
                    <canvas onClick={(e) => event.setTime(e)} className={style.audio_wave_bg} style={{clipPath: `inset(0% 0% 0% ${(time)}%)`}} ref={canvasRefFull} height="100"></canvas>
                    <canvas onClick={(e) => event.setTime(e)} className={style.audio_wave_bg_fill} style={{clipPath: `inset(0% ${100-(time)}% 0% 0%)`}} ref={canvasRef} height="100"></canvas>
                </>
            </div>
            <audio autoPlay={false} ref={soundRef} id="sound"></audio>
        </div>
    )
}