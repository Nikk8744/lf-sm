function convertToSubcurrency(total: number, factor = 100) {
    console.log("total", total)
    if (!total ) {
        throw new Error('Amount must be greater than 0');
      }
    return Math.round(total * factor)
}

export default convertToSubcurrency;