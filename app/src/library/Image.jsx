function Image(props) {
    return <img className={`image ${props.className ? props.className : ''}`} src={props.src} {...props}/>
}

export default Image