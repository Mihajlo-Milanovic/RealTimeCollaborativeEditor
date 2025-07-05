"use client";
import { useState } from "react";
import { Folder, FolderOpen, FileText } from "lucide-react";

// Dummy struktura fajlova i foldera
const dummyStructure = [
  {
    name: "Dokumenti",
    type: "folder",
    children: [
      { name: "CV.pdf", type: "file" },
      { name: "CoverLetter.docx", type: "file" },
    ],
  },
  {
    name: "Projekti",
    type: "folder",
    children: [
      {
        name: "EditorApp",
        type: "folder",
        children: [
          { name: "index.jsx", type: "file" },
          { name: "style.scss", type: "file" },
        ],
      },
      {name: "jasamnajjaci.exe", type: "file"}
    ],
  },
];

function FileItem({ node }) {
  const [open, setOpen] = useState(false);

  if (node.type === "file") {
    return (
      <div className="flex items-center gap-2 pl-2 py-1 hover:bg-blue-200 rounded cursor-pointer">
        <FileText size={16} />
        {node.name}
      </div>
    );
  }

  return (
    <div className="pl-2">
      <div
        className="flex items-center gap-2 py-1 hover:bg-blue-400 rounded cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        {open ? <FolderOpen size={16} /> : <Folder size={16} />}
        {node.name}
      </div>
      {/* uslovni render a && b => (...) */}
      {open && node.children && (
        <div className="pl-4">
          {node.children.map((child, index) => (
            <FileItem key={index} node={child} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FileExplorer() {
  return (
    <div className="w-full h-full text-sm font-mono overflow-y-auto p-2 flex-100%">
      {dummyStructure.map((node, index) => (
        <FileItem key={index} node={node} /> // ici ce child.id za key vrv, dobra je praksa da postoji key
      ))}
    </div>
  );
}