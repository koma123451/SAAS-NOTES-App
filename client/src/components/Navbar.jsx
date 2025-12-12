import { Flex, Button, Text, Box, Avatar } from "@chakra-ui/react";
import { useUserStore } from "../store/user";

export default function Navbar() {
  const user = useUserStore((s) => s.user);
  const logout = useUserStore((s) => s.logout);

  return (
    <Flex
      as="nav"
      px={8}
      py={3}
      justify="space-between"
      align="center"
      bg="white"
      borderBottom="1px solid #E2E8F0"
      boxShadow="sm"
    >
      {/* 左侧 Logo */}
      <Text fontSize="xl" fontWeight="bold" color="gray.700">
        SaaS Notes
      </Text>

      {/* 右侧用户信息 */}
      {user && (
        <Flex align="center" gap={4}>
          <Flex align="center" gap={2}>
            <Avatar size="sm" name={user.username} />
            <Text fontWeight="medium" color="gray.600">
              {user.username}
            </Text>
          </Flex>

          <Button
          onClick={logout}
          size="sm"
          bg="gray.700"
          color="white"
          _hover={{ bg: "gray.800" }}
        >
          Logout
        </Button>

        </Flex>
      )}
    </Flex>
  );
}
