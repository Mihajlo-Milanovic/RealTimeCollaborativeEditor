"use client";
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.ImageUploadNode = void 0;
var React = require("react");
var react_1 = require("@tiptap/react");
var close_icon_1 = require("@/components/tiptap-icons/close-icon");
require("@/components/tiptap-node/image-upload-node/image-upload-node.scss");
function useFileUpload(options) {
    var _this = this;
    var _a = React.useState(null), fileItem = _a[0], setFileItem = _a[1];
    var uploadFile = function (file) { return __awaiter(_this, void 0, void 0, function () {
        var error, abortController, newFileItem, url_1, error_1;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (file.size > options.maxSize) {
                        error = new Error("File size exceeds maximum allowed (".concat(options.maxSize / 1024 / 1024, "MB)"));
                        (_a = options.onError) === null || _a === void 0 ? void 0 : _a.call(options, error);
                        return [2 /*return*/, null];
                    }
                    abortController = new AbortController();
                    newFileItem = {
                        id: crypto.randomUUID(),
                        file: file,
                        progress: 0,
                        status: "uploading",
                        abortController: abortController,
                    };
                    setFileItem(newFileItem);
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    if (!options.upload) {
                        throw new Error("Upload function is not defined");
                    }
                    return [4 /*yield*/, options.upload(file, function (event) {
                            setFileItem(function (prev) {
                                if (!prev)
                                    return null;
                                return __assign(__assign({}, prev), { progress: event.progress });
                            });
                        }, abortController.signal)];
                case 2:
                    url_1 = _d.sent();
                    if (!url_1)
                        throw new Error("Upload failed: No URL returned");
                    if (!abortController.signal.aborted) {
                        setFileItem(function (prev) {
                            if (!prev)
                                return null;
                            return __assign(__assign({}, prev), { status: "success", url: url_1, progress: 100 });
                        });
                        (_b = options.onSuccess) === null || _b === void 0 ? void 0 : _b.call(options, url_1);
                        return [2 /*return*/, url_1];
                    }
                    return [2 /*return*/, null];
                case 3:
                    error_1 = _d.sent();
                    if (!abortController.signal.aborted) {
                        setFileItem(function (prev) {
                            if (!prev)
                                return null;
                            return __assign(__assign({}, prev), { status: "error", progress: 0 });
                        });
                        (_c = options.onError) === null || _c === void 0 ? void 0 : _c.call(options, error_1 instanceof Error ? error_1 : new Error("Upload failed"));
                    }
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var uploadFiles = function (files) { return __awaiter(_this, void 0, void 0, function () {
        var file;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            if (!files || files.length === 0) {
                (_a = options.onError) === null || _a === void 0 ? void 0 : _a.call(options, new Error("No files to upload"));
                return [2 /*return*/, null];
            }
            if (options.limit && files.length > options.limit) {
                (_b = options.onError) === null || _b === void 0 ? void 0 : _b.call(options, new Error("Maximum ".concat(options.limit, " file").concat(options.limit === 1 ? "" : "s", " allowed")));
                return [2 /*return*/, null];
            }
            file = files[0];
            if (!file) {
                (_c = options.onError) === null || _c === void 0 ? void 0 : _c.call(options, new Error("File is undefined"));
                return [2 /*return*/, null];
            }
            return [2 /*return*/, uploadFile(file)];
        });
    }); };
    var clearFileItem = function () {
        if (!fileItem)
            return;
        if (fileItem.abortController) {
            fileItem.abortController.abort();
        }
        if (fileItem.url) {
            URL.revokeObjectURL(fileItem.url);
        }
        setFileItem(null);
    };
    return {
        fileItem: fileItem,
        uploadFiles: uploadFiles,
        clearFileItem: clearFileItem,
    };
}
var CloudUploadIcon = function () { return (<svg width="24" height="24" viewBox="0 0 24 24" className="tiptap-image-upload-icon" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.1953 4.41771C10.3478 4.08499 9.43578 3.94949 8.5282 4.02147C7.62062 4.09345 6.74133 4.37102 5.95691 4.83316C5.1725 5.2953 4.50354 5.92989 4.00071 6.68886C3.49788 7.44783 3.17436 8.31128 3.05465 9.2138C2.93495 10.1163 3.0222 11.0343 3.3098 11.8981C3.5974 12.7619 4.07781 13.5489 4.71463 14.1995C5.10094 14.5942 5.09414 15.2274 4.69945 15.6137C4.30476 16 3.67163 15.9932 3.28532 15.5985C2.43622 14.731 1.79568 13.6816 1.41221 12.5299C1.02875 11.3781 0.91241 10.1542 1.07201 8.95084C1.23162 7.74748 1.66298 6.59621 2.33343 5.58425C3.00387 4.57229 3.89581 3.72617 4.9417 3.10998C5.98758 2.4938 7.15998 2.1237 8.37008 2.02773C9.58018 1.93176 10.7963 2.11243 11.9262 2.55605C13.0561 2.99968 14.0703 3.69462 14.8919 4.58825C15.5423 5.29573 16.0585 6.11304 16.4177 7.00002H17.4999C18.6799 6.99991 19.8288 7.37933 20.7766 8.08222C21.7245 8.78515 22.4212 9.7743 22.7637 10.9036C23.1062 12.0328 23.0765 13.2423 22.6788 14.3534C22.2812 15.4644 21.5367 16.4181 20.5554 17.0736C20.0962 17.3803 19.4752 17.2567 19.1684 16.7975C18.8617 16.3382 18.9853 15.7172 19.4445 15.4105C20.069 14.9934 20.5427 14.3865 20.7958 13.6794C21.0488 12.9724 21.0678 12.2027 20.8498 11.4841C20.6318 10.7655 20.1885 10.136 19.5853 9.6887C18.9821 9.24138 18.251 8.99993 17.5001 9.00002H15.71C15.2679 9.00002 14.8783 8.70973 14.7518 8.28611C14.4913 7.41374 14.0357 6.61208 13.4195 5.94186C12.8034 5.27164 12.0427 4.75043 11.1953 4.41771Z" fill="currentColor"/>
    <path d="M11 14.4142V21C11 21.5523 11.4477 22 12 22C12.5523 22 13 21.5523 13 21V14.4142L15.2929 16.7071C15.6834 17.0976 16.3166 17.0976 16.7071 16.7071C17.0976 16.3166 17.0976 15.6834 16.7071 15.2929L12.7078 11.2936C12.7054 11.2912 12.703 11.2888 12.7005 11.2864C12.5208 11.1099 12.2746 11.0008 12.003 11L12 11L11.997 11C11.8625 11.0004 11.7343 11.0273 11.6172 11.0759C11.502 11.1236 11.3938 11.1937 11.2995 11.2864C11.297 11.2888 11.2946 11.2912 11.2922 11.2936L7.29289 15.2929C6.90237 15.6834 6.90237 16.3166 7.29289 16.7071C7.68342 17.0976 8.31658 17.0976 8.70711 16.7071L11 14.4142Z" fill="currentColor"/>
  </svg>); };
var FileIcon = function () { return (<svg width="43" height="57" viewBox="0 0 43 57" fill="currentColor" className="tiptap-image-upload-dropzone-rect-primary" xmlns="http://www.w3.org/2000/svg">
    <path d="M0.75 10.75C0.75 5.64137 4.89137 1.5 10 1.5H32.3431C33.2051 1.5 34.0317 1.84241 34.6412 2.4519L40.2981 8.10876C40.9076 8.71825 41.25 9.5449 41.25 10.4069V46.75C41.25 51.8586 37.1086 56 32 56H10C4.89137 56 0.75 51.8586 0.75 46.75V10.75Z" fill="currentColor" fillOpacity="0.11" stroke="currentColor" strokeWidth="1.5"/>
  </svg>); };
var FileCornerIcon = function () { return (<svg width="10" height="10" className="tiptap-image-upload-dropzone-rect-secondary" viewBox="0 0 10 10" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0.75H0.343146C1.40401 0.75 2.42143 1.17143 3.17157 1.92157L8.82843 7.57843C9.57857 8.32857 10 9.34599 10 10.4069V10.75H4C1.79086 10.75 0 8.95914 0 6.75V0.75Z" fill="currentColor"/>
  </svg>); };
var ImageUploadDragArea = function (_a) {
    var onFile = _a.onFile, children = _a.children;
    var _b = React.useState(false), dragover = _b[0], setDragover = _b[1];
    var onDrop = function (e) {
        setDragover(false);
        e.preventDefault();
        e.stopPropagation();
        var files = Array.from(e.dataTransfer.files);
        onFile(files);
    };
    var onDragover = function (e) {
        e.preventDefault();
        setDragover(true);
    };
    var onDragleave = function (e) {
        e.preventDefault();
        setDragover(false);
    };
    return (<div className={"tiptap-image-upload-dragger ".concat(dragover ? "tiptap-image-upload-dragger-active" : "")} onDrop={onDrop} onDragOver={onDragover} onDragLeave={onDragleave}>
      {children}
    </div>);
};
var ImageUploadPreview = function (_a) {
    var file = _a.file, progress = _a.progress, status = _a.status, onRemove = _a.onRemove;
    var formatFileSize = function (bytes) {
        if (bytes === 0)
            return "0 Bytes";
        var k = 1024;
        var sizes = ["Bytes", "KB", "MB", "GB"];
        var i = Math.floor(Math.log(bytes) / Math.log(k));
        return "".concat(parseFloat((bytes / Math.pow(k, i)).toFixed(2)), " ").concat(sizes[i]);
    };
    return (<div className="tiptap-image-upload-preview">
      {status === "uploading" && (<div className="tiptap-image-upload-progress" style={{ width: "".concat(progress, "%") }}/>)}

      <div className="tiptap-image-upload-preview-content">
        <div className="tiptap-image-upload-file-info">
          <div className="tiptap-image-upload-file-icon">
            <CloudUploadIcon />
          </div>
          <div className="tiptap-image-upload-details">
            <span className="tiptap-image-upload-text">{file.name}</span>
            <span className="tiptap-image-upload-subtext">
              {formatFileSize(file.size)}
            </span>
          </div>
        </div>
        <div className="tiptap-image-upload-actions">
          {status === "uploading" && (<span className="tiptap-image-upload-progress-text">
              {progress}%
            </span>)}
          <button className="tiptap-image-upload-close-btn" onClick={function (e) {
            e.stopPropagation();
            onRemove();
        }}>
            <close_icon_1.CloseIcon />
          </button>
        </div>
      </div>
    </div>);
};
var DropZoneContent = function (_a) {
    var maxSize = _a.maxSize;
    return (<>
    <div className="tiptap-image-upload-dropzone">
      <FileIcon />
      <FileCornerIcon />
      <div className="tiptap-image-upload-icon-container">
        <CloudUploadIcon />
      </div>
    </div>

    <div className="tiptap-image-upload-content">
      <span className="tiptap-image-upload-text">
        <em>Click to upload</em> or drag and drop
      </span>
      <span className="tiptap-image-upload-subtext">
        Maximum file size {maxSize / 1024 / 1024}MB.
      </span>
    </div>
  </>);
};
var ImageUploadNode = function (props) {
    var _a = props.node.attrs, accept = _a.accept, limit = _a.limit, maxSize = _a.maxSize;
    var inputRef = React.useRef(null);
    var extension = props.extension;
    var uploadOptions = {
        maxSize: maxSize,
        limit: limit,
        accept: accept,
        upload: extension.options.upload,
        onSuccess: extension.options.onSuccess,
        onError: extension.options.onError,
    };
    var _b = useFileUpload(uploadOptions), fileItem = _b.fileItem, uploadFiles = _b.uploadFiles, clearFileItem = _b.clearFileItem;
    var handleChange = function (e) {
        var _a, _b;
        var files = e.target.files;
        if (!files || files.length === 0) {
            (_b = (_a = extension.options).onError) === null || _b === void 0 ? void 0 : _b.call(_a, new Error("No file selected"));
            return;
        }
        handleUpload(Array.from(files));
    };
    var handleUpload = function (files) { return __awaiter(void 0, void 0, void 0, function () {
        var url, pos, filename;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, uploadFiles(files)];
                case 1:
                    url = _b.sent();
                    if (url) {
                        pos = props.getPos();
                        filename = ((_a = files[0]) === null || _a === void 0 ? void 0 : _a.name.replace(/\.[^/.]+$/, "")) || "unknown";
                        props.editor
                            .chain()
                            .focus()
                            .deleteRange({ from: pos, to: pos + 1 })
                            .insertContentAt(pos, [
                            {
                                type: "image",
                                attrs: { src: url, alt: filename, title: filename },
                            },
                        ])
                            .run();
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    var handleClick = function () {
        if (inputRef.current && !fileItem) {
            inputRef.current.value = "";
            inputRef.current.click();
        }
    };
    return (<react_1.NodeViewWrapper className="tiptap-image-upload" tabIndex={0} onClick={handleClick}>
      {!fileItem && (<ImageUploadDragArea onFile={handleUpload}>
          <DropZoneContent maxSize={maxSize}/>
        </ImageUploadDragArea>)}

      {fileItem && (<ImageUploadPreview file={fileItem.file} progress={fileItem.progress} status={fileItem.status} onRemove={clearFileItem}/>)}

      <input ref={inputRef} name="file" accept={accept} type="file" onChange={handleChange} onClick={function (e) { return e.stopPropagation(); }}/>
    </react_1.NodeViewWrapper>);
};
exports.ImageUploadNode = ImageUploadNode;
