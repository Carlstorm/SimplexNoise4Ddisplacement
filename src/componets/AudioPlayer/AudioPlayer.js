import {  useEffect, useState } from "react";

// components
import CustomAudioPlayer from "./CustomAudioPlayer";

// style
import style from './CustomAudioPlayer.module.scss'

export default function AudioPlayer({setMusicData, musicData, children, soundRef}) {
    const [songCurrentTime, setSongCurrentTime] = useState(0)

    useEffect(() => {
        if (musicData.sound) {
            setSongCurrentTime(0)
        }
    },[musicData])

    return (
        <>
            {!musicData.sound ?
                <div className={style.music_pick_wrap}>
                    {children}
                </div>
            : null}
            <CustomAudioPlayer musicData={musicData} setMusicData={setMusicData} soundRef={soundRef} />
        </>
    )
}