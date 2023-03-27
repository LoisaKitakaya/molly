import { Chart } from "primereact/chart";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { setIsLoading } from "../reducers/loading";

const GET_TRANSACTION = gql`
  query ($id: ID!) {
    getTransactionsByAccount(id: $id) {
      id
      transaction_type
      transaction_amount
      currency_code
      transaction_date
      description
      created_at
      updated_at
      category {
        category_name
        category_description
      }
    }
  }
`;

const Reports2 = ({ budget_data }) => {
  const dispatch = useDispatch();

  const [lineData, setLineData] = useState({});
  const [lineOptions, setLineOptions] = useState({});

  const {
    loading,
    error,
    data: reportData,
  } = useQuery(GET_TRANSACTION, {
    variables: { id: budget_data.account.id },
  });

  if (reportData) {
    dispatch(setIsLoading({ status: false }));
    // console.log(reportData);
  }

  if (loading) {
    dispatch(setIsLoading({ status: true }));
  }

  if (error) {
    dispatch(setIsLoading({ status: false }));
  }

  const getStats = (reportData, budget_data) => {
    const payable = reportData.getTransactionsByAccount.filter(
      (record) => record.transaction_type === "payable"
    );

    const budgetAmount = budget_data.budget_amount;

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue(
      "--text-color-secondary"
    );
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");

    const data = {
      labels: payable.map((record) => `ID: ${record.id}`),
      datasets: [
        {
          label: "Payable Transactions Trend",
          fill: true,
          borderColor: documentStyle.getPropertyValue("--orange-500"),
          tension: 0.4,
          yAxisID: "y",
          backgroundColor: "rgba(251, 146, 60,0.2)",
          data: payable.map((record) =>
            parseFloat(record.transaction_amount.replace(",", ""))
          ),
        },
        {
          label: "Active Budget",
          fill: true,
          borderColor: documentStyle.getPropertyValue("--green-500"),
          tension: 0.4,
          yAxisID: "y1",
          backgroundColor: "rgba(74, 222, 128,0.2)",
          data: payable.map(() => budgetAmount),
        },
      ],
    };

    const options = {
      stacked: false,
      maintainAspectRatio: false,
      aspectRatio: 0.7,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y: {
          type: "linear",
          display: true,
          position: "left",
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y1: {
          type: "linear",
          display: true,
          position: "right",
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            drawOnChartArea: false,
            color: surfaceBorder,
          },
        },
      },
    };

    setLineData(data);
    setLineOptions(options);
  };

  useEffect(() => {
    reportData && getStats(reportData, budget_data);
  }, [reportData]);

  return (
    <div>
      <div
        className="p-4 mx-1 flex justify-center items-center"
        style={{
          width: "100%",
        }}
      >
        <Chart
          type="line"
          data={lineData}
          options={lineOptions}
          style={{
            width: "100%",
          }}
        />
      </div>
    </div>
  );
};

export default Reports2;