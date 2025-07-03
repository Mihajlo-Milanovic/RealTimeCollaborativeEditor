import RegisterForm from "../../../components/RegisterForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import EditorPage from "../../../components/EditorPage";

export default async function Editor() {
    return <EditorPage />;
}