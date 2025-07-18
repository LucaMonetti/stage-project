import { Link, useNavigate, useParams } from "react-router";
import BasicLoader from "../../../components/Loader/BasicLoader";
import { FaPencil, FaUser } from "react-icons/fa6";
import InfoWidget from "../../../components/SinglePage/Widgets/InfoWidget";
import DefinitionListWidget from "../../../components/SinglePage/Widgets/DefinitionListWidget";
import { useUser } from "../../../hooks/users/useQueryUsers";
import { useAuth } from "../../../components/Authentication/AuthenticationProvider";
import type { Action } from "../../../components/Buttons/ActionRenderer";
import { useEffect } from "react";

const SingleUserView = () => {
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();

  const { userId } = useParams();
  const { data, isPending, isError } = useUser(userId ?? "");

  const actions: Action[] = [];

  if (isAdmin() || user?.company.id === data?.company.id) {
    actions.unshift({
      color: "purple",
      type: "link",
      Icon: FaPencil,
      route: `/dashboard/edit/users/${userId}`,
      text: "Modifica",
    });
  }

  useEffect(() => {
    if (isError) {
      navigate("/error/404");
    }
  }, [user, data, isError]);

  if (isPending) {
    return (
      <div className="px-8 py-4 flex justify-center align-center h-full">
        <BasicLoader />
      </div>
    );
  }

  return (
    <div className="px-8 py-8 grid grid-cols-4 gap-4">
      <InfoWidget
        title={data?.username}
        subtitle={`${data?.firstName} ${data?.lastName}`}
        callout={`Ruolo: ${data?.roles.join(", ")}`}
        CalloutIcon={FaUser}
        actions={actions}
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
