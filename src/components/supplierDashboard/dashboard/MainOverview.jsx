import React from "react";
import MainInsights from "./MainInsights";
import GraphsInsights from "./GraphsInsights";


export default function MainOverview() {
  return (
    <div className="flex flex-col gap-15">
      <MainInsights />
      <GraphsInsights />
    </div>
  );
}
