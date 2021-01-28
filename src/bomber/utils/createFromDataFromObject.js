const FormData = require('form-data')

const createFormDataFromObject = (object) => {
    const formData = new FormData()

    for (const key in object) {
        if (object.hasOwnProperty(key)) {
            formData.append(key, object[key])
        }
    }

    return formData
}

module.exports = createFormDataFromObject
