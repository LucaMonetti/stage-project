import { Link, useNavigate, useParams } from "react-router";
import BasicLoader from "../../../../components/Loader/BasicLoader";
import { FaPencil, FaDownload, FaUser } from "react-icons/fa6";
import InfoWidget from "../../../../components/SinglePage/Widgets/InfoWidget";
import DefinitionListWidget from "../../../../components/SinglePage/Widgets/DefinitionListWidget";
import { useGet } from "../../../../hooks/useGenericFetch";
import { UserSchema } from "../../../../models/User";

const SingleUserView = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const user = useGet({
    method: "GET",
    endpoint: `accounts/${userId}`,
    schema: UserSchema,
  });

  if (user.isLoading) {
    return (
      <div className="px-8 py-4 flex justify-center align-center h-full">
        <BasicLoader />
      </div>
    );
  }

  if (user.errorMsg) {
    navigate("/error/404");
  }

  return (
    <div className="px-8 py-8 grid grid-cols-4 gap-4">
      <InfoWidget
        title={user.data?.username}
        subtitle={`${user.data?.firstName} ${user.data?.lastName}`}
        callout={`Ruolo: ${user.data?.roles.join(", ")}`}
        CalloutIcon={FaUser}
        actions={[
          {
            color: "purple",
            Icon: FaPencil,
            route: `/admin-dashboard/edit/users/${userId}`,
            text: "Modifica",
          },
          {
            color: "blue",
            Icon: FaDownload,
            route: `/admin-dashboard/download/users/${userId}`,
            text: "Scarica",
          },
        ]}
      />

      <DefinitionListWidget
        title="Informazioni Generali"
        values={[
          {
            title: "Nome",
            value: `${user.data?.firstName} ${user.data?.lastName}`,
          },
          {
            title: "Ruoli",
            value: user.data?.roles.join(", "),
          },
          {
            title: "Azienda",
            value: user.data?.company.id,
          },
        ]}
      />

      <DefinitionListWidget
        title="Informazioni di contatto"
        values={[
          {
            title: "Email",
            value: (
              <Link to={`mailto:${user.data?.email}`}>{user.data?.email}</Link>
            ),
          },
          {
            title: "Numero di telefono",
            value: (
              <Link to={`tel:${user.data?.phone}`}>{user.data?.phone}</Link>
            ),
          },
        ]}
      />
    </div>
  );
};

export default SingleUserView;
