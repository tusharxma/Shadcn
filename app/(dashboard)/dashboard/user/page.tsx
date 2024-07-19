import { Breadcrumbs } from '@/components/breadcrumbs';
import { UserClient } from '@/components/tables/user-tables/client';
import { db } from '@/utils/firebase';
import { collection, getDocs } from 'firebase/firestore';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'User', link: '/dashboard/user' }
];

async function fetchUsers() {
  const colRef = collection(db, 'users');
  const snapshot = await getDocs(colRef);
  const usersData = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  return usersData;
}

export default async function Page() {
  const users = await fetchUsers();

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      {users.length > 0 ? (
        <>
          <Breadcrumbs items={breadcrumbItems} />
          <UserClient data={users} />
        </>
      ) : (
        <p>No users found</p>
      )}
    </div>
  );
}
