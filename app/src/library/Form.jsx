function Form(props) {
    return <form id={props.id} className={`form ${props.className ? props.className : ''}`} onSubmit={props.onSubmit} {...props}>{props.children}</form>
}

export default Form