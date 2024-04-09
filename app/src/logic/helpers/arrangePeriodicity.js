const arrangePeriodicity = (periodicity) => {
    let string
    if (periodicity > 1 && periodicity < 7)
        string = 'days'

    if (periodicity === 1)
        string = 'day'

    if (periodicity > 7 && periodicity % 7 !== 0)
        string = 'days'

    if (periodicity > 7 && periodicity % 7 === 0) {
        let rest = periodicity / 7

        string = 'weeks'
        periodicity = rest
    }

    if (periodicity === 7) {
        periodicity = 1
        string = 'week'
    }

    if (!periodicity) {
        periodicity = ''
        string = ''
    }

    return `${periodicity} ${string}`
}

export default arrangePeriodicity