'use client';
import { SimpleEditor } from "../src/components/tiptap-templates/simple/simple-editor";
import FileExplorer from "../components/file-explorer/FileExplorer"
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function EditorPage() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="flex h-screen">
      <div className="w-[20%] bg-transparent"  >  
        <FileExplorer/>
      </div>

      {/* Srednji deo sa editorom (80%) */}
      <div className="w-[72%] flex flex-col">
        <SimpleEditor />
      </div>

      {/* Desni deo sa logout dugmetom (5%) */}
      <div className="w-[8%] p-2 flex flex-col">
        <div className="mt-[60px]">
          <button
            onClick={() => {
              signOut();
              router.push("/");
              console.log("Logout clicked");
            }}
            className="
              min-w-[100px]
              flex-shrink-0
             bg-red-600
             hover:bg-red-700
             text-white 
              font-semibold
              py-2 px-4 rounded-md shadow-md transition duration-300
               ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1 w-full"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}