import React from "react";
import { Button, Form, Input, Space, Typography } from "antd";
import { ILoginFormProps } from "../types/types.login";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { style } from "../components/authentication/styles";

const LoginPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) router.push("/");
  const handleLoginFormSubmit = async (values: ILoginFormProps) => {
    console.log(values);
    try {
      const response = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });
      console.log(
        "🚀 ~ file: login.tsx ~ line 21 ~ handleLoginFormSubmit ~ response",
        response
      );
      if (response?.ok) {
        // router.push("/");
      } else {
        alert("Invalid Credentials");
      }
    } catch (err) {
      alert(err);
    }
  };
  return (
    <Space direction="vertical" size="middle">
      <Form
        layout="vertical"
        onFinish={handleLoginFormSubmit}
        scrollToFirstError={true}
        requiredMark={false}
        autoComplete={"off"}
        disabled={false}
        style={style.loginPage}
        initialValues={{ email: "testuser@test.com", password: "Testuser@123" }}
      >
        <Typography.Text>Login with Credentials</Typography.Text>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              whitespace: true,
              message: "this is a required field",
            },
            {
              type: "email",
              message: "enter a valid email",
            },
          ]}
        >
          <Input type="email" placeholder="enter your email" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              whitespace: true,
              message: "this is a required field",
            },
          ]}
        >
          <Input.Password placeholder="enter your password" />
        </Form.Item>
        <Button htmlType="submit" style={{ width: "100%" }} type="primary">
          Login
        </Button>
      </Form>
      <Typography.Text>Or</Typography.Text>
      <Typography.Text>Login With</Typography.Text>

      <Button
        style={{ width: 400, color: "#f54545" }}
        onClick={() => signIn("google", { callbackUrl: "/" })}
      >
        Google
      </Button>
    </Space>
  );
};

export default LoginPage;
