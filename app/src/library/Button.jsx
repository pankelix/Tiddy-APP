function Button(props) {
    return <button name={props.name} form={props.form} value={props.value} style={props.style} className={`button ${props.className ? props.className : ''}`} onClick={props.onClick} type={props.type} {...props}>{props.children}</button>
}

export default Button