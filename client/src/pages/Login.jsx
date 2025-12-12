import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Heading,
} from "@chakra-ui/react";
import { useState } from "react";
import { useUserStore } from "../store/user";

export default function Login() {
  const login = useUserStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <Flex height="100vh" align="center" justify="center">
      <Box p={8} maxWidth="400px" borderWidth={1} borderRadius="lg">
        <Heading mb={6} textAlign="center">
          Login
        </Heading>

        <form onSubmit={handleSubmit}>
          <FormControl mb={4}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormControl>

          <FormControl mb={6}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormControl>

          <Button colorScheme="blue" width="full" type="submit">
            Login
          </Button>
        </form>
      </Box>
    </Flex>
  );
}
