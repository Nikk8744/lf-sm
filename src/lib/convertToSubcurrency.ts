function convertToSubcurrency(total: number, factor = 100) {
    return  Math.round(total * factor)
}

export default convertToSubcurrency;