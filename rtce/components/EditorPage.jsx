'use client';
import { SimpleEditor } from "../src/components/tiptap-templates/simple/simple-editor";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";

export default function EditorPage() {
    // odavde se uzimaju podaci..
    const { data: session } = useSession();
    const router = useRouter();

  return (
    <div className="flex h-screen">
      {/* Levi deo sa editorom i toolbar-om */}
      <div className="flex flex-col flex-grow">
        <SimpleEditor />
      </div>

      {/* Desni deo sa dugmetom, pomerenim ispod toolbar-a */}
      <div className="w-32 p-4 flex flex-col">
        {/* Koristimo marginu da pomerimo dugme ispod toolbar-a */}
        <div className="mt-[60px]"> {/* Prilagodi vrednost prema visini toolbar-a */}
          <button
            onClick={() => {
              signOut();
              router.push("/");
              console.log("Logout clicked");
            }}
            className="
              bg-red-600 hover:bg-red-700
              text-white font-semibold
              py-2 px-4 rounded-md
              shadow-md
              transition
              duration-300
              ease-in-out
              focus:outline-none
              focus:ring-2 focus:ring-red-400
              focus:ring-offset-1
              w-full
            "
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}