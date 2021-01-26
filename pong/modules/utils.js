function generateRandomId(length) {
    const chars = "abcdefghijklmnopqrstuvwxyz1234567890"
    let id = ""
    for(i = 0; i < length; i++) {
        let r = Math.floor(Math.random() * chars.length)
        id += chars[r]
    }
    return id
}

module.exports = {
    generateRandomId
}