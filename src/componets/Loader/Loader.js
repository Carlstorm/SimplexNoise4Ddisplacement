import style from './Loader.module.scss'

export default function Loader({className}) {
    className = className ? className : ""
    return (
        <span className={`${style.component} ${className}`}></span>
    )
}