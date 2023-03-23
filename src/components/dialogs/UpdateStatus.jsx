import { useState } from "react";
import { useDispatch } from "react-redux";
import { useMutation, gql } from "@apollo/client";
import { InputSwitch } from "primereact/inputswitch";
import { setIsLoading } from "../../reducers/loading";
import {
  createNewNotification,
  removeOldNotification,
} from "../../reducers/notifications";

const UPDATE_STATUS = gql`
  mutation ($id: ID!, $status: Boolean!) {
    budgetStatus(id: $id, status: $status)
  }
`;

const GET_BUDGET = gql`
  query ($id: ID!) {
    getBudget(id: $id) {
      id
      budget_name
      budget_description
      budget_is_active
      budget_amount
      category {
        category_name
      }
      created_at
      updated_at
    }
  }
`;

const UpdateStatus = ({ id, currentStatus }) => {
  const dispatch = useDispatch();

  const [checked, setChecked] = useState(currentStatus);

  const [budgetStatus, { data: updateStatusData, loading, error }] =
    useMutation(UPDATE_STATUS, {
      refetchQueries: [{ query: GET_BUDGET, variables: { id: id } }],
    });

  if (updateStatusData) {
    dispatch(setIsLoading({ status: false }));
    dispatch(
      createNewNotification({
        type: "success",
        message: "Budget status changed successfully",
      })
    );
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
    <InputSwitch
      className="mt-2"
      checked={checked}
      onChange={(e) => {
        dispatch(removeOldNotification());

        budgetStatus({
          variables: {
            id: id,
            status: e.value,
          },
        });

        setChecked(e.value);
      }}
    />
  );
};

export default UpdateStatus;