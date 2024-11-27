class Message {
    constructor(doc) {
        this.id = doc.id;
        for (let key in doc.data()) {
            this[key] = doc.data()[key];
        }
    }
}

export default Message;