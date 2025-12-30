import {useAdminUserStore} from '../store/user.admin'
import AdminUserRow from './AdminUserRow.jsx'
import {Flex,} from "@chakra-ui/react";


export default function AdminUserList({ users,onBan }) {
  return (
    <>
      {users.map((user) => (
        <AdminUserRow key={user._id} user={user} onBan={onBan} />
      ))}
    </>
  );
}

