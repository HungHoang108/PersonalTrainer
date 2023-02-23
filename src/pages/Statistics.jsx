import { useContext } from "react";
import _ from "lodash";
import {
  Tooltip,
  BarChart,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid,
  Bar,
} from "recharts";

import { TrainingContext } from "../context/TrainingContext";

const Statistics = () => {
  const { training } = useContext(TrainingContext);

  const groupedActivities = _.groupBy(training, "activity");
  const groupsArray = _.map(groupedActivities, (groupedActivity, key) => ({
    activity: key,
    customer: groupedActivity,
  }));
  
  const data = [];
  groupsArray.map((item) => {
    let totalDuration = 0;
    item.customer.map((item) => (totalDuration += Number(item.duration)));
    data.push({ name: item.activity, Activity: totalDuration });
  });

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Trainer's activity stats</h1>
      <div>
        <BarChart
          width={1200}
          height={300}
          data={data}
          margin={{
            top: 5,
            left: 200,
            bottom: 5,
          }}
          barSize={40}
        >
          <XAxis
            dataKey="name"
            scale="point"
            padding={{ left: 40, right: 30 }}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <CartesianGrid strokeDasharray="3 3" />
          <Bar
            dataKey="Activity"
            fill="#8884d8"
            background={{ fill: "#eee" }}
          />
        </BarChart>
      </div>
    </div>
  );
};

export default Statistics;
