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
import { useState } from "react";
import { useUserStore } from "../store/user";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router";
export default function Login() {
  const login = useUserStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const success =await login(email, password);
    console.log("success",success)
     navigate("/")
  };

  return (
    <Flex height="100vh" align="center" justify="center" bg="gray.800">
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
           <Text fontSize="sm" color="gray.500">
      Don’t have an account?{" "}
      <Text
        as={Link}
        to="/register"
        color="blue.500"
        _hover={{ textDecoration: "underline" }}
        display="inline"
      >
        Register
      </Text>
    </Text>
        </form>
        
      </Box>
    </Flex>
  );
}
