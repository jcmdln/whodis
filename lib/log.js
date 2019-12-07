// log.js

class Log {
    constructor(Prefix) {
        this.prefix = Prefix
    }

    Msg(Message) {
        console.log(this.prefix + ":", Message)
    }

    Info(Message) {
        console.log("[INFO]", this.prefix + ":", Message)
    }

    Warning(Message) {
        console.log("[WARNING]", this.prefix + ":", Message)
    }

    Error(Message) {
        console.log("[ERROR]", this.prefix + ":", Message)
        process.exit(1)
    }

    Fatal(Message) {
        console.log("[FATAL]", this.prefix + ":", Message)
        console.trace()
        process.exit(1)
    }
}

module.exports = Log
