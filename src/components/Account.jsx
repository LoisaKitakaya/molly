import moment from "moment";
import { Menu } from "primereact/menu";
import Reports from "./reports/Reports";
import PageTitle from "../assets/title";
import { useQuery, gql } from "@apollo/client";
import EditAccount from "./accounts/EditAccount";
import { setIsLoading } from "../reducers/loading";
import { useRef, useState, useEffect } from "react";
import DeleteAccount from "./accounts/DeleteAccount";
import Transactions from "./transactions/Transactions";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

const GET_ACCOUNT = gql`
  query ($id: ID!) {
    getAccount(id: $id) {
      id
      account_name
      account_type
      account_number
      account_balance
      currency_code
      created_at
      updated_at
    }
  }
`;

const Account = () => {
  const { id } = useParams();

  PageTitle(`Account: ${id}`);

  const navigate = useNavigate();

  const menu = useRef(null);

  const [isVisible, setIsVisible] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const checkAuth = () => {
    if (isLoggedIn == false) {
      navigate("/app/signin");
    }
  };

  const { loading, error, data } = useQuery(GET_ACCOUNT, {
    variables: { id: id },
  });

  if (data) {
    dispatch(setIsLoading({ status: false }));
  }

  if (loading) {
    dispatch(setIsLoading({ status: true }));
  }

  if (error) {
    dispatch(setIsLoading({ status: false }));
  }

  const items = [
    {
      label: "Update",
      icon: "pi pi-refresh",
      command: () => setIsVisible(true),
    },
    {
      label: "Delete",
      icon: "pi pi-trash",
      command: () => setIsDelete(true),
    },
  ];

  useEffect(() => {
    checkAuth();
  }, [isLoggedIn]);

  return (
    <div className="page">
      {data ? (
        <>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl">{data.getAccount.account_name}</h1>
            <div className="flex justify-between items-center">
              <div>
                <button
                  onClick={(e) => menu.current.toggle(e)}
                  className="text-blue-500 hover:text-blue-800 border border-zinc-300 hover:border-zinc-400 px-2 rounded-md bg-slate-50 hover:bg-slate-100 shadow mr-4"
                >
                  <i className="bi bi-list"></i> Menu
                </button>
                <Menu model={items} popup ref={menu} />
              </div>
              <button
                className="text-blue-500 hover:text-blue-800 border border-zinc-300 hover:border-zinc-400 px-2 rounded-md bg-slate-50 hover:bg-slate-100 shadow"
                onClick={() => {
                  window.history.back();
                }}
              >
                <i className="bi bi-arrow-left-short"></i> Back
              </button>
            </div>
          </div>
          <div>
            <hr className="my-4" />
            <p className="text-lg">
              <span className="font-semibold">Account type:</span>{" "}
              {data.getAccount.account_type}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Account balance:</span>{" "}
              {data.getAccount.account_balance.toLocaleString()}
            </p>
            {data.getAccount.account_number === 0 ? (
              <>
                <p className="text-lg">
                  <span className="font-semibold">Account number:</span>{" "}
                  {data.getAccount.account_number}
                </p>
              </>
            ) : (
              <></>
            )}
            <p className="text-lg">
              <span className="font-semibold">Currency code:</span>{" "}
              {data.getAccount.currency_code}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Created on:</span>{" "}
              {moment.unix(data.getAccount.created_at).format("YYYY-MM-DD")}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Updated on:</span>{" "}
              {moment.unix(data.getAccount.updated_at).format("YYYY-MM-DD")}
            </p>
          </div>
          <hr className="my-4" />
          <Transactions
            id={data.getAccount.id}
            currency={data.getAccount.currency_code}
          />
          <Reports id={data.getAccount.id} />
        </>
      ) : (
        <>
          <div className="text-center my-56">
            <span className="loader"></span>
          </div>
        </>
      )}

      {/* update account */}
      {data && (
        <EditAccount
          isVisible={isVisible}
          setIsVisible={setIsVisible}
          id={data.getAccount.id}
        />
      )}
      {/* update account */}

      {/* delete account */}
      {data && (
        <DeleteAccount
          isVisible={isDelete}
          setIsVisible={setIsDelete}
          id={data.getAccount.id}
        />
      )}
      {/* delete account */}
    </div>
  );
};

export default Account;
