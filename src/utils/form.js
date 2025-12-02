export const form = {
  validateRequired(value, fieldName) {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      throw new Error(`${fieldName} необхідно заповнити`)
    }
    return value
  },

  validateMinLength(value, fieldName, minLength) {
    if ((value || '').length < minLength) {
      throw new Error(`${fieldName} має бути як мінімум ${minLength} символів`)
    }
    return value
  },

  validateArray(array, fieldName) {
    if (!Array.isArray(array) || array.length === 0) {
      throw new Error(`${fieldName} не повинно бути пустим`)
    }
    return array
  }
}
