import { getUsers } from "@/components/admin/data/actions";
import UserManagement from "@/components/admin/users/UserManagement";

export default async function UsersPage() {
  // Fetch initial users data from the server action (fallback)
  try {
    const initialUsers = await getUsers();

    return (
      <div className="space-y-6">
        <UserManagement initialUsers={initialUsers} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching initial users data:", error);
    // Return the component with empty data and let the client-side handle fetching
    return (
      <div className="space-y-6">
        <UserManagement initialUsers={[]} />
      </div>
    );
  }
}
