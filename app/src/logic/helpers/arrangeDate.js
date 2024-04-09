const arrangeDate = (date) => {
    let month = date.slice(5, 7)
    let day = date.slice(8, 10)
    return `${day} ${month}`
}

export default arrangeDate