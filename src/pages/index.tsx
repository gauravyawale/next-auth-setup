import { Button, Typography } from "antd";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Loader from "../components/authentication/Loader";

export default function Home() {
  const { data: session, status } = useSession();
  console.log("🚀 ~ file: index.tsx ~ line 8 ~ Home ~ session", session)
  
  const router = useRouter();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: 400,
        border: status === "loading" ? "none" : "1px solid #dbe0e8",
        padding: 20,
        borderRadius: 5,
      }}
    >
      {status === "loading" ? (
        <Loader />
      ) : session ? (
        <>
          <Typography.Text>
            You logged in successfully as{" "}
            <Typography.Text style={{ color: "#1461ee" }}>
              {" "}
              {session?.user?.name}
            </Typography.Text>
          </Typography.Text>

          <Button
            onClick={() => signOut()}
            type={"primary"}
            style={{ margin: 18 }}
          >
            Logout
          </Button>
        </>
      ) : (
        <>
          <Typography.Text>Please login to access this page</Typography.Text>
          <Button
            onClick={() => router.push("/login")}
            type={"primary"}
            style={{ margin: 18 }}
          >
            Login
          </Button>
        </>
      )}
    </div>
  );
}
