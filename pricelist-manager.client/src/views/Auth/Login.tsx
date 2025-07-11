import GenericForm from "../../components/Forms/GenericForm";
import { useLogin } from "../../hooks/auth/useAuthQuery";
import { UserLoginSchema } from "../../models/UserLogin";

const Login = () => {
  const mutation = useLogin();

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
              isLoading: mutation.isPending,
            },
          }}
          mutation={mutation}
        />
      </div>
    </div>
  );
};

export default Login;
