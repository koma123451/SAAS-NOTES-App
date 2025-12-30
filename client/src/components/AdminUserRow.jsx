import { Flex, Box, Button } from "@chakra-ui/react";

export default function AdminUserRow({ user, onBan }) {
  function clickBan() {
    onBan(user._id);
  }

  return (
    <Flex py={4} borderBottom="1px solid" borderColor="gray.700" align="center">
      <Box flex="3">{user.email}</Box>
      <Box flex="1">{user.role}</Box>

      <Box flex="1" color={user.isBanned ? "red.400" : "green.400"}>
        {user.isBanned ? "banned" : "active"}
      </Box>

      <Box flex="2">
        {user.createdAt
          ? new Date(user.createdAt).toLocaleDateString("en-CA")
          : "—"}
      </Box>

      <Box flex="2" textAlign="right">
        <Button size="sm" mr={2}>
          View
        </Button>

        <Button
          size="sm"
          colorScheme={user.isBanned ? "red" : "gray"}
          onClick={clickBan}
          //isDisabled={user.isBanned}
        >
          {user.isBanned ? "Banned" : "Ban"}
        </Button>
      </Box>
    </Flex>
  );
}
