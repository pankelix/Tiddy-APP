function Input(props) {
    return <input className={`input ${props.className ? props.className : ''}`} ref={props.ref} onChange={props.onChange} checked={props.checked} name={props.name} defaultValue={props.defaultValue} accept={props.accept} min={props.min} max={props.max} maxLength={props.maxLength} value={props.value} type={props.type} id={props.id} list={props.list} required={props.required} placeholder={props.placeholder} />
}

export default Input