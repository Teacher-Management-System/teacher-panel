import ProfileTabs from "@/features/profile/components/list";

export default function DocumentsProfilePage() {
  return (
    <div>
      <ProfileTabs isUpdateMode={true} currentTab="documents" />
    </div>
  );
}
