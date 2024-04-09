function Label(props) {
    return <label className={`label ${props.className ? props.className : ''}`} htmlFor={props.forId} {...props}>{props.children}</label>
}

export default Label