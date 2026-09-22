import { ApplicationsTable } from "@/components/admin/ApplicationsTable";
import { TeacherReorder } from "@/components/admin/TeacherReorder";

export default function InstructorsPage() {
  return (
    <>
      <TeacherReorder />
      <ApplicationsTable kind="instructor" />
    </>
  );
}
