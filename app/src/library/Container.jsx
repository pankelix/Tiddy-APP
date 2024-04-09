function Container(props) {
    return <div className={`container ${props.className ? props.className : ''}`} {...props}>{props.children}</div>
}

export default Container