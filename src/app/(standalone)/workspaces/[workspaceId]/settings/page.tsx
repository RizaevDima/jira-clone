import { getCurrent } from "@/features/auth/queries";
import { getWorkspace } from "@/features/workspaces/queries";
import { EditWorkspaceForm } from "@/features/workspaces/components/edit-workspace-form";
import { redirect } from "next/navigation";
import { use } from "react";
interface WorksapceIdSettingsPageProps {
  params: {
    workspaceId: string;
  };
}

const WorksapceIdSettingsPage = async ({
  params,
}: WorksapceIdSettingsPageProps) => {
  const user = await getCurrent();

  if (!user) {
    redirect("/sign-in");
  }
  const { workspaceId } = await params;
  const initialValues = await getWorkspace({
    workspaceId: workspaceId,
  });
  if (!initialValues) {
    redirect(`/workspaces/${params.workspaceId}`);
  }

  return (
    <div className="w-full lg:max-w-xl">
      <EditWorkspaceForm initialValues={initialValues} />
    </div>
  );
};

export default WorksapceIdSettingsPage;
