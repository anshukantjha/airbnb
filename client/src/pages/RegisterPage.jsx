import React, { useState ,useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import { Input, Button } from "../components/index";
import { useForm } from "react-hook-form";
import axios from "axios";
import { UserContext } from "../user.context";

function RegisterPage() {
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);

  const { setUser } = useContext(UserContext);

  const RegisterUser = async (e) => {
    
    try {
      await axios.post("/register", {
        name,
        email,
        password,
      });
      // console.log("I am in login front")
      const response = await axios.post("/login", { email, password });
      setUser(response.data);
      alert("Login Sucessfull");
      // console.log(response);
      // console.log(response.data);
      setRedirect(true);
    } catch (error) {
      console.error(error);
      alert("Login unSucessfull");
    }
    setRedirect(true);
  };

  if (redirect) {
    return <Navigate to={"/"}/>
  }

  return (
    <div className="flex items-center justify-center w-full">
      <div
        className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}
      >
        <div className="mb-2 flex justify-center">
          <span className="inline-block w-full max-w-[100px]">Logo</span>
        </div>
        <h2 className="text-center text-2xl font-bold leading-tight">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-base text-black/60">
          Already have any account?&nbsp;
          <Link
            to="/login"
            className="font-medium text-primary transition-all duration-200 hover:underline"
          >
            Log In
          </Link>
        </p>
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
        <form onSubmit={handleSubmit(RegisterUser)} className="mt-8">
          <div className="space-y-5">
            <Input
              label="Name: "
              placeholder="Enter your name"
              type="text"
              {...register("name", {
                required: true,
              })}
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Input>
            <Input
              label="Email: "
              placeholder="Enter your email"
              type="email"
              {...register("email", {
                required: true,
                validate: {
                  matchPatern: (value) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                    "Email address must be a valid address",
                },
              })}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Password: "
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: true,
              })}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" className="w-full">
              Register
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
