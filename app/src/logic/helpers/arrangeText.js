const arrangeText = (text) => {
    let capital = text[0].toUpperCase()
    let newText = capital + text.slice(1)
    return newText.replace("-", " ")
}

export default arrangeText