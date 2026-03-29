import ProfileTabs from "@/features/profile/components/list";

export default function AddressProfilePage() {
  return (
    <div>
      <ProfileTabs isUpdateMode={true} currentTab="address" />
    </div>
  );
}
