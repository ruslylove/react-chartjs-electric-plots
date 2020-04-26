import React, { useState } from "react";
import "./styles.css";
import LineChart from "./components/LineChart";
import sd102 from "./variables/sd102.js";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(10)
  }
}));

function getValue(data) {
  var v = [[], [], []];
  var i = [[], [], []];
  var s = [[], [], []];
  var p = [[], [], []];
  var q = [[], [], []];
  var t = [];
  var time = [];

  data.map((item, index) => {
    time = [...time, item.recorded_date];
    v[0] = [...v[0], Number(item.V_A)];
    v[1] = [...v[1], Number(item.V_B)];
    v[2] = [...v[2], Number(item.V_C)];

    i[0] = [...i[0], Number(item.I_A)];
    i[1] = [...i[1], Number(item.I_B)];
    i[2] = [...i[2], Number(item.I_C)];

    s[0] = [...s[0], Number(item.S_A)];
    s[1] = [...s[1], Number(item.S_B)];
    s[2] = [...s[2], Number(item.S_C)];

    p[0] = [...p[0], Number(item.P_A)];
    p[1] = [...p[1], Number(item.P_B)];
    p[2] = [...p[2], Number(item.P_C)];

    q[0] = [...q[0], Number(item.Q_A)];
    q[1] = [...q[1], Number(item.Q_B)];
    q[2] = [...q[2], Number(item.Q_C)];

    t = [...t, Number(item.ambient_temp)];
    return null;
  });
  return [v, i, s, p, q, t, time];
}

var [v, i, s, p, q, t, time] = getValue(sd102);

const len = sd102.length;

export default function App() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    checkedV: true,
    checkedI: true,
    checkedS: false,
    checkedP: false,
    checkedQ: false,
    checkedT: false
  });

  const handleCBChange = event => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const [period, setPeriod] = useState(100);

  /*   const handleChange = event => {
    event.preventDefault();
    setPeriod(event.target.value);
  }; */

  const handleChange = (event, newValue) => {
    setPeriod(newValue);
  };

  function valuetext(value) {
    return `${value}°C`;
  }

  return (
    <div className="App">
      <FormControl className={classes.formControl}>
        {/* <InputLabel >Period (points)</InputLabel>
        <Select
          value={period}
          onChange={handleChange}
        >
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={50}>50</MenuItem>
          <MenuItem value={100}>100</MenuItem>
          <MenuItem value={200}>200</MenuItem>
          <MenuItem value={1000}>1000</MenuItem>
        </Select> */}
        <FormGroup row>
          <FormControlLabel
            control={
              <Checkbox
                checked={state.checkedV}
                onChange={handleCBChange}
                name="checkedV"
                color="primary"
              />
            }
            label="V"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={state.checkedI}
                onChange={handleCBChange}
                name="checkedI"
                color="primary"
              />
            }
            label="I"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={state.checkedS}
                onChange={handleCBChange}
                name="checkedS"
                color="primary"
              />
            }
            label="S"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={state.checkedP}
                onChange={handleCBChange}
                name="checkedP"
                color="primary"
              />
            }
            label="P"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={state.checkedQ}
                onChange={handleCBChange}
                name="checkedQ"
                color="primary"
              />
            }
            label="Q"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={state.checkedT}
                onChange={handleCBChange}
                name="checkedT"
                color="primary"
              />
            }
            label="Temperature"
          />
        </FormGroup>
        <Typography id="discrete-slider" gutterBottom>
          History values (last {period} points)
        </Typography>
        <Slider
          defaultValue={100}
          getAriaValueText={valuetext}
          aria-labelledby="discrete-slider"
          valueLabelDisplay="auto"
          step={10}
          marks
          min={10}
          max={450}
          value={period}
          onChange={handleChange}
        />
      </FormControl>

      {state.checkedV && (
        <LineChart
          time={time.slice(len - period, len - 1)}
          value={v.map(item => {
            return item.slice(len - period, len - 1);
          })}
          label={["Va", "Vb", "Vc"]}
          yLabel={["Voltage [V]"]}
          threshold={{ name: "over voltage threshold", value: 240 }}
          value={v.map(item => {
            return item.slice(len - period, len - 1);
          })}
          label={["Va", "Vb", "Vc"]}
          yLabel={["Voltage [V]"]}
          threshold={{ name: "over voltage threshold", value: 240 }}
        />
      )}
      {state.checkedI && (
        <LineChart
          time={time.slice(len - period, len - 1)}
          value={i.map(item => {
            return item.slice(len - period, len - 1);
          })}
          label={["Ia", "Ib", "Ic"]}
          yLabel={["Current [A]"]}
        />
      )}
      {state.checkedS && (
        <LineChart
          time={time.slice(len - period, len - 1)}
          value={s.map(item => {
            return item.slice(len - period, len - 1);
          })}
          label={["Sa", "Sb", "Sc"]}
          yLabel={["Apparent Power [kVA]"]}
          total
          threshold={{ name: "Power Rating", value: 500 }}
        />
      )}
      {state.checkedP && (
        <LineChart
          time={time.slice(len - period, len - 1)}
          value={p.map(item => {
            return item.slice(len - period, len - 1);
          })}
          label={["Pa", "Pb", "Pc"]}
          yLabel={["Active Power [kW]"]}
          total
        />
      )}
      {state.checkedQ && (
        <LineChart
          time={time.slice(len - period, len - 1)}
          value={q.map(item => {
            return item.slice(len - period, len - 1);
          })}
          label={["Qa", "Qb", "Qc"]}
          yLabel={["Reactive Power [kVAR]"]}
          total
        />
      )}
      {state.checkedT && (
        <LineChart
          time={time.slice(len - period, len - 1)}
          value={[t.slice(len - period, len - 1)]}
          label={["temperature"]}
          yLabel={["Temperature [Celcius]"]}
        />
      )}
    </div>
  );
}
