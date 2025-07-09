import type { Status } from "../types";

export const changeUpdateListStatus = async (
  updateListId: number,
  newStatus: Status
) => {
  const endpoint = `/api/v1/updatelists/${updateListId}/status`;
  const options = {
    method: "PUT",
    body: JSON.stringify({
      id: updateListId,
      status: newStatus,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  };

  const put = async () => {
    var res = await fetch(endpoint, options);
    var data = await res.json();

    return data;
  };

  return await put();
};

export const deleteUpdateList = async (updateListId: number) => {
  const endpoint = `/api/v1/updatelists/${updateListId}`;
  const options = {
    method: "DELETE",
  };

  const del = async () => {
    var res = await fetch(endpoint, options);
    var data = await res.json();

    return data;
  };

  return await del();
};
