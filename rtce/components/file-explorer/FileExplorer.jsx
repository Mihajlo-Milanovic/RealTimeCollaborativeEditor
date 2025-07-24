"use client";
import { useState } from "react";
import { Folder, FolderOpen, FileText } from "lucide-react";
import {getRequestSingle} from "../../src/app/api/serverRequests/methods"
import { useSession } from "next-auth/react";

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
    const { data: session } = useSession();
    //console.log(session.user);

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
  const [structure, setStructure] = useState([]);

  // useEffect(() => {
  //   async function fetchStructure() {
  //     // const res = await getRequestSingle("directory/getgetUsersDirectoriesStructured", "uuid", );

  //     // if (res.ok) {
  //     //   const data = await res.json();
  //     //   setStructure(data);
  //     // }
  //   }
  //   fetchStructure();
  // }, [userId]);

  return (
    <div className="w-full h-full text-sm font-mono overflow-y-auto p-2 flex-100%">
      {dummyStructure.map((node, index) => (
        <FileItem key={index} node={node} /> // ici ce child.id za key vrv, dobra je praksa da postoji key
      ))}
    </div>
  );
  // const { data: session, status } = useSession();

  // if (status === "loading") return <p>Učitavanje sesije...</p>;
  // if (!session) return <p>Nema sesije, korisnik nije ulogovan.</p>;

  // return (
  //   <div className="p-4">
  //     <h2 className="font-bold mb-2">Podaci iz sesije:</h2>
  //     <pre className="bg-gray-100 p-4 rounded text-sm">
  //       {JSON.stringify(session, null, 2)}
  //     </pre>
  //   </div>
  // );
}