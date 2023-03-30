import PageTitle from "../assets/title";
import { signIn } from "../reducers/auth";
import { Button } from "primereact/button";
import { gql, useMutation } from "@apollo/client";
import { setIsLoading } from "../reducers/loading";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  createNewNotification,
  removeOldNotification,
} from "../reducers/notifications";

const USER_AUTH = gql`
  mutation ($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      token
    }
  }
`;

const Signin = () => {
  PageTitle("Signin");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isTwoFA = useSelector((state) => state.auth.twoFA);

  const [tokenAuth, { data, loading, error }] = useMutation(USER_AUTH);

  if (data) {
    dispatch(setIsLoading({ status: false }));
    dispatch(
      signIn({
        token: data.tokenAuth.token,
      })
    );
    isTwoFA ? navigate("/app/login") : navigate("/app/dashboard");
  }
  if (loading) {
    dispatch(setIsLoading({ status: true }));
  }

  if (error) {
    dispatch(setIsLoading({ status: false }));
    dispatch(
      createNewNotification({ type: "error", message: `${error.message}` })
    );
  }

  return (
    <div className="page">
      <h1 className="text-3xl text-center mt-4">Signin to your account</h1>
      <div
        className="mx-auto py-8 px-12 my-8 rounded-md shadow-lg bg-slate-50"
        style={{ width: "35%" }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();

            dispatch(removeOldNotification());

            tokenAuth({
              variables: {
                username: e.target.username.value,
                password: e.target.password.value,
              },
            });
          }}
        >
          <div className="mb-4">
            <label htmlFor="email" className="text-gray-600">
              Email
            </label>
            <input
              type="email"
              name="username"
              id="email"
              className="block w-full px-2 border-0 border-b-2 border-gray-300 focus:ring-0 focus:border-gray-500 bg-slate-50"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="text-gray-600">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="block w-full px-2 border-0 border-b-2 border-gray-300 focus:ring-0 focus:border-gray-500 bg-slate-50"
            />
          </div>
          <div className="mt-8">
            <Button
              type="submit"
              label="Submit"
              severity="success"
              className="w-full page-fonts"
              loading={loading}
            />
          </div>
        </form>
      </div>
      <p className="text-center">
        Don't have an account? Go to{" "}
        <Link
          to="/app/signup"
          className="text-sky-600 hover:text-sky-900 underline"
        >
          Sign up
        </Link>
        .
      </p>
      <br />
    </div>
  );
};

export default Signin;
