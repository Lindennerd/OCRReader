var RegexParser = function (text, context) {
    this.text = text;
    this.context = context;
    this.result = context;
}

RegexParser.prototype.runParser = function (cb) {
    for (var prop in this.context) {
        if (this.context[prop]) {
            for (var pattern in this.context[prop]) {
                var re = new RegExp(this.context[prop][pattern]);
                this.result[prop] = re.exec(this.text);
            }
        }
    }
    cb(this.result);
}