import moment from "moment";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import { gql, useQuery } from "@apollo/client";
import { setIsLoading } from "../../reducers/loading";
import { OverlayPanel } from "primereact/overlaypanel";
import { setNotification } from "../../reducers/notifications";

const GET_ALL_TRANSACTIONS = gql`
  query ($id: ID!) {
    getAllTransactions(id: $id) {
      transaction_type
      transaction_amount
      transaction_date
      currency_code
      description
      category {
        category_name
      }
      account {
        account_name
        account_balance
        account_type
      }
    }
  }
`;

const Table = ({ id }) => {
  const dispatch = useDispatch();
  const op = useRef(null);

  const { loading, error, data } = useQuery(GET_ALL_TRANSACTIONS, {
    variables: {
      id: id,
    },
  });

  if (data) {
    dispatch(setIsLoading({ status: false }));
    // console.log(data.getAllTransactions);
  }

  if (loading) {
    dispatch(setIsLoading({ status: true }));
  }

  if (error) {
    dispatch(setIsLoading({ status: false }));
    dispatch(
      setNotification({
        type: "error",
        message: `${error.message}`,
      })
    );
  }

  return (
    <div>
      {data ? (
        <>
          <table className="table-auto w-full mx-auto">
            <thead className="text-left border-b-2 border-gray-500">
              <tr>
                <th>#</th>
                <th>Transaction</th>
                <th>Amount</th>
                <th>Currency</th>
                <th>Category</th>
                <th>Date & time</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.getAllTransactions.map((transaction, index) => {
                const list = (
                  <>
                    <tr key={index} className="border-b">
                      <td>{index + 1}</td>
                      <td>{transaction.transaction_type}</td>
                      <td>{transaction.transaction_amount.toLocaleString()}</td>
                      <td>{transaction.currency_code}</td>
                      <td>{transaction.category.category_name}</td>
                      <td>
                        {moment
                          .unix(transaction.transaction_date)
                          .format("YYYY-MM-DD HH:mm:ss")}
                      </td>
                      <td>
                        <button
                          className="text-blue-500 hover:text-blue-600"
                          onClick={(e) => op.current.toggle(e)}
                        >
                          More info
                        </button>
                        <OverlayPanel ref={op} className="page-fonts">
                          <p>
                            <span className="font-semibold">Description:</span>{" "}
                            {transaction.description}
                          </p>
                          <br />
                          <p>
                            <span className="font-semibold">Account:</span>{" "}
                            {transaction.account.account_name}
                          </p>
                          <p>
                            <span className="font-semibold">Account type:</span>{" "}
                            {transaction.account.account_type}
                          </p>
                          <p>
                            <span className="font-semibold">Balance:</span>{" "}
                            {transaction.account.account_balance.toLocaleString()}
                          </p>
                        </OverlayPanel>
                      </td>
                    </tr>
                  </>
                );

                return list;
              })}
            </tbody>
          </table>
        </>
      ) : (
        <>
          <div className="text-center my-8">
            <span className="loader"></span>
          </div>
        </>
      )}
      {data && (
        <>
          {!data.getAllTransactions && (
            <div className="text-center my-8">
              <h1 className="text-3xl">
                Hmm... It seems you do not have any transactions 🤔
              </h1>
              <p className="text-xl">
                Right click anywhere on the screen to open the menu and add your
                transactions.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Table;
