"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserView = void 0;
var UserView = /** @class */ (function () {
    function UserView() {
        this.id = null;
        this.email = null;
        this.username = null;
    }
    UserView.getInstance = function () {
        if (!UserView.instance) {
            UserView.instance = new UserView();
        }
        return UserView.instance;
    };
    UserView.prototype.fillFromSession = function (sessionUser) {
        var _a, _b, _c;
        if (!sessionUser) {
            this.reset();
            return;
        }
        this.id = (_a = sessionUser.id) !== null && _a !== void 0 ? _a : null;
        this.email = (_b = sessionUser.email) !== null && _b !== void 0 ? _b : null;
        this.username = (_c = sessionUser.username) !== null && _c !== void 0 ? _c : null;
    };
    UserView.prototype.reset = function () {
        this.id = null;
        this.email = null;
        this.username = null;
    };
    return UserView;
}());
exports.UserView = UserView;
exports.default = UserView;
