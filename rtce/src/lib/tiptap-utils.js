"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertFileToBase64 = exports.handleImageUpload = exports.isNodeInSchema = exports.isMarkInSchema = exports.MAX_FILE_SIZE = void 0;
exports.getActiveMarkAttrs = getActiveMarkAttrs;
exports.isEmptyNode = isEmptyNode;
exports.cn = cn;
exports.findNodePosition = findNodePosition;
exports.isAllowedUri = isAllowedUri;
exports.sanitizeUrl = sanitizeUrl;
exports.MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
/**
 * Checks if a mark exists in the editor schema
 * @param markName - The name of the mark to check
 * @param editor - The editor instance
 * @returns boolean indicating if the mark exists in the schema
 */
var isMarkInSchema = function (markName, editor) {
    if (!(editor === null || editor === void 0 ? void 0 : editor.schema))
        return false;
    return editor.schema.spec.marks.get(markName) !== undefined;
};
exports.isMarkInSchema = isMarkInSchema;
/**
 * Checks if a node exists in the editor schema
 * @param nodeName - The name of the node to check
 * @param editor - The editor instance
 * @returns boolean indicating if the node exists in the schema
 */
var isNodeInSchema = function (nodeName, editor) {
    if (!(editor === null || editor === void 0 ? void 0 : editor.schema))
        return false;
    return editor.schema.spec.nodes.get(nodeName) !== undefined;
};
exports.isNodeInSchema = isNodeInSchema;
/**
 * Gets the active attributes of a specific mark in the current editor selection.
 *
 * @param editor - The Tiptap editor instance.
 * @param markName - The name of the mark to look for (e.g., "highlight", "link").
 * @returns The attributes of the active mark, or `null` if the mark is not active.
 */
function getActiveMarkAttrs(editor, markName) {
    var _a;
    if (!editor)
        return null;
    var state = editor.state;
    var marks = state.storedMarks || state.selection.$from.marks();
    var mark = marks.find(function (mark) { return mark.type.name === markName; });
    return (_a = mark === null || mark === void 0 ? void 0 : mark.attrs) !== null && _a !== void 0 ? _a : null;
}
/**
 * Checks if a node is empty
 */
function isEmptyNode(node) {
    return !!node && node.content.size === 0;
}
/**
 * Utility function to conditionally join class names into a single string.
 * Filters out falsey values like false, undefined, null, and empty strings.
 *
 * @param classes - List of class name strings or falsey values.
 * @returns A single space-separated string of valid class names.
 */
function cn() {
    var classes = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        classes[_i] = arguments[_i];
    }
    return classes.filter(Boolean).join(" ");
}
/**
 * Finds the position and instance of a node in the document
 * @param props Object containing editor, node (optional), and nodePos (optional)
 * @param props.editor The TipTap editor instance
 * @param props.node The node to find (optional if nodePos is provided)
 * @param props.nodePos The position of the node to find (optional if node is provided)
 * @returns An object with the position and node, or null if not found
 */
function findNodePosition(props) {
    var _a;
    var editor = props.editor, node = props.node, nodePos = props.nodePos;
    if (!editor || !((_a = editor.state) === null || _a === void 0 ? void 0 : _a.doc))
        return null;
    // Zero is valid position
    var hasValidNode = node !== undefined && node !== null;
    var hasValidPos = nodePos !== undefined && nodePos !== null;
    if (!hasValidNode && !hasValidPos) {
        return null;
    }
    if (hasValidPos) {
        try {
            var nodeAtPos = editor.state.doc.nodeAt(nodePos);
            if (nodeAtPos) {
                return { pos: nodePos, node: nodeAtPos };
            }
        }
        catch (error) {
            console.error("Error checking node at position:", error);
            return null;
        }
    }
    // Otherwise search for the node in the document
    var foundPos = -1;
    var foundNode = null;
    editor.state.doc.descendants(function (currentNode, pos) {
        // TODO: Needed?
        // if (currentNode.type && currentNode.type.name === node!.type.name) {
        if (currentNode === node) {
            foundPos = pos;
            foundNode = currentNode;
            return false;
        }
        return true;
    });
    return foundPos !== -1 && foundNode !== null
        ? { pos: foundPos, node: foundNode }
        : null;
}
/**
 * Handles image upload with progress tracking and abort capability
 * @param file The file to upload
 * @param onProgress Optional callback for tracking upload progress
 * @param abortSignal Optional AbortSignal for cancelling the upload
 * @returns Promise resolving to the URL of the uploaded image
 */
var handleImageUpload = function (file, onProgress, abortSignal) { return __awaiter(void 0, void 0, void 0, function () {
    var progress;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // Validate file
                if (!file) {
                    throw new Error("No file provided");
                }
                if (file.size > exports.MAX_FILE_SIZE) {
                    throw new Error("File size exceeds maximum allowed (".concat(exports.MAX_FILE_SIZE / (1024 * 1024), "MB)"));
                }
                progress = 0;
                _a.label = 1;
            case 1:
                if (!(progress <= 100)) return [3 /*break*/, 4];
                if (abortSignal === null || abortSignal === void 0 ? void 0 : abortSignal.aborted) {
                    throw new Error("Upload cancelled");
                }
                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 500); })];
            case 2:
                _a.sent();
                onProgress === null || onProgress === void 0 ? void 0 : onProgress({ progress: progress });
                _a.label = 3;
            case 3:
                progress += 10;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/, "/images/placeholder-image.png"
                // Uncomment for production use:
                // return convertFileToBase64(file, abortSignal);
            ];
        }
    });
}); };
exports.handleImageUpload = handleImageUpload;
/**
 * Converts a File to base64 string
 * @param file The file to convert
 * @param abortSignal Optional AbortSignal for cancelling the conversion
 * @returns Promise resolving to the base64 representation of the file
 */
var convertFileToBase64 = function (file, abortSignal) {
    if (!file) {
        return Promise.reject(new Error("No file provided"));
    }
    return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        var abortHandler = function () {
            reader.abort();
            reject(new Error("Upload cancelled"));
        };
        if (abortSignal) {
            abortSignal.addEventListener("abort", abortHandler);
        }
        reader.onloadend = function () {
            if (abortSignal) {
                abortSignal.removeEventListener("abort", abortHandler);
            }
            if (typeof reader.result === "string") {
                resolve(reader.result);
            }
            else {
                reject(new Error("Failed to convert File to base64"));
            }
        };
        reader.onerror = function (error) {
            return reject(new Error("File reading error: ".concat(error)));
        };
        reader.readAsDataURL(file);
    });
};
exports.convertFileToBase64 = convertFileToBase64;
var ATTR_WHITESPACE = 
// eslint-disable-next-line no-control-regex
/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g;
function isAllowedUri(uri, protocols) {
    var allowedProtocols = [
        "http",
        "https",
        "ftp",
        "ftps",
        "mailto",
        "tel",
        "callto",
        "sms",
        "cid",
        "xmpp",
    ];
    if (protocols) {
        protocols.forEach(function (protocol) {
            var nextProtocol = typeof protocol === "string" ? protocol : protocol.scheme;
            if (nextProtocol) {
                allowedProtocols.push(nextProtocol);
            }
        });
    }
    return (!uri ||
        uri.replace(ATTR_WHITESPACE, "").match(new RegExp(
        // eslint-disable-next-line no-useless-escape
        "^(?:(?:".concat(allowedProtocols.join("|"), "):|[^a-z]|[a-z0-9+.-]+(?:[^a-z+.-:]|$))"), "i")));
}
function sanitizeUrl(inputUrl, baseUrl, protocols) {
    try {
        var url = new URL(inputUrl, baseUrl);
        if (isAllowedUri(url.href, protocols)) {
            return url.href;
        }
    }
    catch (_a) {
        // If URL creation fails, it's considered invalid
    }
    return "#";
}
