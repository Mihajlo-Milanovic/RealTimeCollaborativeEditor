"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = VerifySuccessPage;
var react_1 = require("react");
var navigation_1 = require("next/navigation");
function VerifySuccessPage() {
    var router = (0, navigation_1.useRouter)();
    (0, react_1.useEffect)(function () {
        alert("Email je uspešno verifikovan! Možete se sada prijaviti.");
        router.push("/");
    }, []);
    return null;
}
