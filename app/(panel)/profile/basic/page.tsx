import ProfileTabs from "@/features/profile/components/list";

export default function BasicProfilePage() {
  return (
    <div>
      <ProfileTabs isUpdateMode={true} currentTab="basic" />
    </div>
  );
}
