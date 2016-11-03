var AccountList = function (observe) {
    watch(AccountList.prototype.__list, function () {
        localStorage.setItem('accountList', JSON.stringify(this));
        if (observe) {
            observe(this);
        }
    });
}

AccountList.prototype.__list = localStorage.getItem('accountList') !== "undefined"
        ? JSON.parse(localStorage.getItem('accountList'))
        : new Array();

AccountList.prototype.push = function (item) {
    this.__list.push(item)
}

AccountList.prototype.get = function () {
    return this.__list;
}

AccountList.prototype.splice = function (indexOf, qt, newEl) {
    if (newEl) {
        AccountList.prototype.__list.splice(indexOf, qt, newEl);
    } else {
        AccountList.prototype.__list.splice(indexOf, qt);
    }
}