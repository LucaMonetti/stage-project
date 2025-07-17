import { useNavigate, useLocation } from "react-router";
import { useAuth } from "../../components/Authentication/AuthenticationProvider";
import GenericForm from "../../components/Forms/GenericForm";
import { useLogin } from "../../hooks/auth/useLogin";
import { UserLoginSchema } from "../../models/UserLogin";
import { useEffect } from "react";

const Login = () => {
  const navigation = useNavigate();
  const location = useLocation();
  const { login, isLoading, isAuthenticated, user } = useAuth();

  const mutation = useLogin({
    onSuccess: (data) => {
      login(data.token);
    },
    onError: () => {
      console.error("Login failed");
    },
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect to the page they were trying to access before login
      const redirectPath =
        (location.state as any)?.from?.pathname || "/dashboard";
      navigation(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, location.state, navigation]);

  return (
    <div className="w-full h-[calc(100vh-66px)] flex justify-center items-center">
      <div className="w-96">
        <GenericForm
          id="login-form"
          method="POST"
          schema={UserLoginSchema}
          config={{
            fieldset: [
              {
                title: "Login",
                inputs: [
                  {
                    id: "email",
                    type: "email",
                    placeholder: "Inserisci la tua email",
                    label: "Email",
                  },
                  {
                    id: "password",
                    type: "password",
                    label: "Password",
                    placeholder: "Enter your password",
                  },
                ],
              },
            ],
            endpoint: "auth/login",
            submitButton: {
              label: "Login",
              isLoading: isLoading,
            },
          }}
          mutation={mutation}
        />
      </div>
    </div>
  );
};

export default Login;
