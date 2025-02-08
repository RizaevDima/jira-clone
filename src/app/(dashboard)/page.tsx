import { redirect } from "next/navigation";
import { getCurrent } from "@/features/auth/queries";
import { UserButton } from "@/features/auth/components/user-button";
import { CreateWorkspaceForm } from "@/features/workspaces/components/create-workspace-form";
import { getWorkspaces } from "@/features/workspaces/queries";

export default async function Home() {
  const user = await getCurrent();

  console.log("user", user);

  if (!user) {
    redirect("/sign-in");
  }

  const workspace = await getWorkspaces();
  if (workspace.total == 0) {
    redirect("/workspaces/create");
  } else {
    redirect("/workspaces/" + workspace.documents[0].$id);
  }

  return (
    <div className="bg-neutral-500 p-4 h-full">
      {/* <CreateWorkspaceForm /> */}
    </div>
  );
}
