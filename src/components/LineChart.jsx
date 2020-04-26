import React, { useEffect } from "react";
import { Line } from "react-chartjs-2";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";

import brown from "@material-ui/core/colors/brown";
import grey from "@material-ui/core/colors/grey";
import red from "@material-ui/core/colors/red";
import blue from "@material-ui/core/colors/blue";
import yellow from "@material-ui/core/colors/yellow";
import green from "@material-ui/core/colors/green";
import amber from "@material-ui/core/colors/amber";

const colorPalleteIEC = [brown[500], "#000", grey[500]];
const colorPalleteUs = ["#000", red[500], blue[500]];
const colorPalleteIndia = [red[500], yellow[500], blue[500]];
const colorPalleteYazaki = [blue[500], brown[500], "black"];
const colorPallete = [red[500], green[500], blue[500], amber[500]];

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(2)
  },
  selectEmpty: {
    marginTop: theme.spacing(10)
  }
}));

function LineChart(props) {
  const classes = useStyles();

  useEffect(() => {
    var chart = document.getElementById("canvas").getContext("2d"),
      gradient = chart.createLinearGradient(0, 0, 0, 450);

    gradient.addColorStop(0, "rgba(255, 0,0, 0.5)");
    gradient.addColorStop(0.5, "rgba(255, 0, 0, 0.25)");
    gradient.addColorStop(1, "rgba(255, 0, 0, 0)");
  }, []);

  const data = {
    labels: props.time,
    datasets: props.value.map((val, index) => {
      return {
        label: props.label[index],
        fill: false,
        lineTension: 0.3,
        borderColor: colorPallete[index],
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: colorPallete[index],
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: colorPallete[index],
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: val
      };
    })
  };

  const options = {
    scales: {
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: props.yLabel
          }
        }
      ],
      xAxes: [
        {
          type: "time",
          distribution: "series",
          time: {
            unit: "minute"
          }
        }
      ]
    }
  };

  // with threshold
  if (props.threshold) {
    let t_value = Array(props.time.length).fill(props.threshold.value);
    let datasets = {
      ...data.datasets[0],
      label: props.threshold.name,
      data: t_value,
      borderColor: amber[500],
      borderDash: [10, 5],
      pointBorderColor: amber[500],
      pointHoverBackgroundColor: amber[500]
    };
    data.datasets = [...data.datasets, datasets];
  }

  if (props.total) {
    let t_value = props.value.reduce(
      (r, a) => a.map((b, i) => (r[i] || 0) + b),
      []
    );
    let datasets = {
      ...data.datasets[0],
      label: "Total",
      data: t_value,
      borderColor: "black",
      pointBorderColor: "black",
      pointHoverBackgroundColor: "black",
      fill: true
    };
    data.datasets = [...data.datasets, datasets];
  }

  return (
    <div>
      <Container className={classes.root}>
        <Paper>
          <Line data={data} options={options} id="canvas" />
        </Paper>
      </Container>
    </div>
  );
}

export default LineChart;
