import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Heading,
  Text
} from "@chakra-ui/react";
import {useEffect} from "react";
import {useAdminUserStore} from '../store/user.admin.js'
import {useAdminNoteStore} from '../store/note.admin.js'
import AdminUserList from '../components/AdminUserlist.jsx'
export default function AdminDashboard(){
// 1️⃣ 统一用 selector，一次性订阅
const users = useAdminUserStore((s) => s.users);
const loadingUsers = useAdminUserStore((s) => s.loading);
const fetchAllUsers = useAdminUserStore((s) => s.fetchAllUsers);
const banUser = useAdminUserStore((s) => s.banUser);
const notes = useAdminNoteStore((s) => s.notes);
const fetchAllNotes = useAdminNoteStore((s) => s.getAllNotes);

useEffect(() => {
  fetchAllUsers();
  fetchAllNotes();
}, [fetchAllUsers, fetchAllNotes]);

// useEffect(() => {
//   console.log("users updated:", users);
// }, [users]);

// useEffect(() => {
//   console.log("notes updated:", notes);
// }, [notes]);
function reFresh(){
  fetchAllUsers()
  fetchAllNotes()
}




return (
  <Flex minH="100vh" bg="gray.900" color="gray.100">
    {/* Sidebar */}
    <Box
      w="260px"
      p={6}
      borderRight="1px solid"
      borderColor="gray.700"
      bg="gray.800"
    >
      <Heading size="md" mb={8}>
        Admin Panel
      </Heading>

      <Flex direction="column" gap={3}>
        <Button variant="ghost" justifyContent="flex-start">
          Dashboard
        </Button>
        <Button variant="ghost" justifyContent="flex-start">
          Users
        </Button>
        <Button variant="ghost" justifyContent="flex-start">
          Notes
        </Button>
        <Button variant="ghost" justifyContent="flex-start">
          Audit Logs
        </Button>
      </Flex>
    </Box>

    {/* Main Content */}
    <Box flex="1" p={8}>
      {/* Header */}
      <Flex justify="space-between" align="center" mb={8}>
        <Box>
          <Heading size="lg">Admin Dashboard</Heading>
          <Text fontSize="sm" color="gray.400">
            Manage users and notes
          </Text>
        </Box>

        <Button colorScheme="blue" onClick={reFresh}>
          Refresh
        </Button>
      </Flex>

      {/* Stats */}
      <Flex gap={6} mb={10}>
        <Box
          flex="1"
          p={6}
          bg="gray.800"
          borderRadius="md"
        >
          <Text fontSize="sm" color="gray.400">
            Total Users
          </Text>
          <Heading size="lg">{users.length}</Heading>
        </Box>

        <Box
          flex="1"
          p={6}
          bg="gray.800"
          borderRadius="md"
        >
          <Text fontSize="sm" color="gray.400">
            Total Notes
          </Text>
          <Heading size="lg">{notes.length}</Heading>
        </Box>

        <Box
          flex="1"
          p={6}
          bg="gray.800"
          borderRadius="md"
        >
          <Text fontSize="sm" color="gray.400">
            Banned Users
          </Text>
          <Heading size="lg">{users.filter((user) =>user.isBanned).length}</Heading>
        </Box>
      </Flex>

      {/* Users Section */}
      <Box bg="gray.800" p={6} borderRadius="md">
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="md">Users</Heading>

          <Input
            placeholder="Search users"
            maxW="260px"
          />
        </Flex>

        {/* Table Header */}
        <Flex
          py={3}
          borderBottom="1px solid"
          borderColor="gray.700"
          fontSize="sm"
          color="gray.400"
        >
          <Box flex="3">Email</Box>
          <Box flex="1">Role</Box>
          <Box flex="1">Status</Box>
          <Box flex="2">Created</Box>
          <Box flex="2" textAlign="right">
            Actions
          </Box>
        </Flex>

        {/* Row */}

        <AdminUserList users={users} onBan={banUser}></AdminUserList>
        {/* <Flex
          py={4}
          borderBottom="1px solid"
          borderColor="gray.700"
          align="center"
        >
          <Box flex="3">user@test.com</Box>
          <Box flex="1">user</Box>
          <Box flex="1" color="green.400">
            active
          </Box>
          <Box flex="2">2024-01-02</Box>
          <Box flex="2" textAlign="right">
            <Button size="sm" mr={2}>
              View
            </Button>
            <Button size="sm" colorScheme="red">
              Ban
            </Button>
          </Box>

        </Flex> */}

        {/* Pagination */}
        <Flex justify="space-between" mt={6}>
          <Text fontSize="sm" color="gray.400">
            Page 1 of 5
          </Text>
          <Flex gap={2}>
            <Button size="sm">Prev</Button>
            <Button size="sm">Next</Button>
          </Flex>
        </Flex>
      </Box>
    </Box>
  </Flex>
);
}