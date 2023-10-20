export default function PlayIcon({onClick, className}) {
    return (
        <svg className={className} version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" onClick={onClick}>
            <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{stopColor: "#6600ff", stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: "#ff0045", stopOpacity: 1}} />
                </linearGradient>
            </defs>
            <path d="M256,0C114.609,0,0,114.609,0,256s114.609,256,256,256s256-114.609,256-256S397.391,0,256,0z M256,472
                c-119.297,0-216-96.703-216-216S136.703,40,256,40s216,96.703,216,216S375.297,472,256,472z" fill="url(#grad1)"/>
            <polygon points="192,336 352,256 192,176" fill="url(#grad1)"/>
        </svg>
    )
}