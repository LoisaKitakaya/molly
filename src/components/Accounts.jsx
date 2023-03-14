import moment from "moment";
import { useDispatch } from "react-redux";
import { gql, useQuery } from "@apollo/client";
import { setIsLoading } from "../reducers/loading";
import { setNotification } from "../reducers/notifications";

const GET_ALL_ACCOUNTS = gql`
  query {
    getAllAccounts {
      public_id
      account_name
      account_type
      account_balance
      currency_code
      created_at
      updated_at
    }
  }
`;

const Accounts = () => {
  const dispatch = useDispatch();

  const { loading, error, data } = useQuery(GET_ALL_ACCOUNTS);

  if (data) {
    dispatch(
      setIsLoading({
        status: false,
      })
    );
    console.log(data.getAllAccounts);
  }

  if (loading) {
    dispatch(
      setIsLoading({
        status: true,
      })
    );
  }

  if (error) {
    dispatch(
      setIsLoading({
        status: false,
      })
    );
    dispatch(
      setNotification({
        type: "error",
        message: `${error.message}`,
      })
    );
  }
  return (
    <div>
      <h1 className="text-3xl">Accounts panel</h1>
      <br />
      {data ? (
        data.getAllAccounts.map((account) => {
          const list = (
            <>
              <div
                className="border rounded-md shadow-md p-4 bg-gray-50 mb-4"
                key={account.public_id}
              >
                <p className="text-xl mb-2">{account.account_name}</p>
                <hr className="mb-2" />
                <p>
                  <span className="font-semibold">Account public ID:</span>{" "}
                  {account.public_id}
                </p>
                <p>
                  <span className="font-semibold">Account type:</span>{" "}
                  {account.account_type}
                </p>
                <p>
                  <span className="font-semibold">Account balance:</span>{" "}
                  {account.account_balance}
                </p>
                <p>
                  <span className="font-semibold">Account currency:</span>{" "}
                  {account.currency_code}
                </p>
                <p>
                  <span className="font-semibold">Created on:</span>{" "}
                  {moment
                    .unix(account.created_at)
                    .format("YYYY-MM-DD HH:mm:ss")}
                </p>
                <p>
                  <span className="font-semibold">Updated on:</span>{" "}
                  {moment
                    .unix(account.created_at)
                    .format("YYYY-MM-DD HH:mm:ss")}
                </p>
              </div>
            </>
          );

          return list;
        })
      ) : (
        <></>
      )}
    </div>
  );
};

export default Accounts;
