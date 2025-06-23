import React, { useEffect, useState } from "react";
import MainInsights from "./MainInsights";
import GraphsInsights from "./GraphsInsights";
import { api } from "../../../api/axiosInstance";

export default function MainOverview() {
  const [adminData, setAdminData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);

  useEffect(() => {
    const fetchAdminCharts = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get("/admin/chart");
        // console.log(data);
        setAdminData(data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdminCharts();
  }, []);
  return (
    <div className="flex flex-col gap-15">
      <MainInsights data={adminData} />
      <GraphsInsights data={adminData} />
    </div>
  );
}
