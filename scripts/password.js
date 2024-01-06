function generateSecurePassword(length) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789?=.!@#+=$%^&*'
    const charsetLength = charset.length

    let password = ''

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charsetLength)
        password += charset[randomIndex]
    }

    return password
}

module.exports = {
    generateSecurePassword
}