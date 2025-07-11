import { Link, useNavigate, useParams } from "react-router";
import BasicLoader from "../../../components/Loader/BasicLoader";
import { FaPencil, FaDownload, FaUser } from "react-icons/fa6";
import InfoWidget from "../../../components/SinglePage/Widgets/InfoWidget";
import DefinitionListWidget from "../../../components/SinglePage/Widgets/DefinitionListWidget";
import { useGet } from "../../../hooks/useGenericFetch";
import { UserSchema } from "../../../models/User";
import { useAllUsers, useUser } from "../../../hooks/users/useQueryUsers";

const SingleUserView = () => {
  const navigate = useNavigate();
  const { userId } = useParams();

  const { data, isPending, error, isError } = useUser(userId ?? "");

  if (isPending) {
    return (
      <div className="px-8 py-4 flex justify-center align-center h-full">
        <BasicLoader />
      </div>
    );
  }

  if (isError) {
    navigate("/error/404");
  }

  return (
    <div className="px-8 py-8 grid grid-cols-4 gap-4">
      <InfoWidget
        title={data?.username}
        subtitle={`${data?.firstName} ${data?.lastName}`}
        callout={`Ruolo: ${data?.roles.join(", ")}`}
        CalloutIcon={FaUser}
        actions={[
          {
            color: "purple",
            type: "link",
            Icon: FaPencil,
            route: `/admin-dashboard/edit/users/${userId}`,
            text: "Modifica",
          },
          {
            color: "blue",
            type: "link",
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
            value: `${data?.firstName} ${data?.lastName}`,
          },
          {
            title: "Ruoli",
            value: data?.roles.join(", "),
          },
          {
            title: "Azienda",
            value: data?.company.id,
          },
        ]}
      />

      <DefinitionListWidget
        title="Informazioni di contatto"
        values={[
          {
            title: "Email",
            value: <Link to={`mailto:${data?.email}`}>{data?.email}</Link>,
          },
          {
            title: "Numero di telefono",
            value: <Link to={`tel:${data?.phone}`}>{data?.phone}</Link>,
          },
        ]}
      />
    </div>
  );
};

export default SingleUserView;
