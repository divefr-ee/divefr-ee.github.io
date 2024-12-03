function isWebGLSupported() {
    // Thanks https://stackoverflow.com/a/77480016
    try {
        let canvas = document.createElement('canvas');
        return !!(
            window.WebGLRenderingContext &&
            (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
        );
    } catch (e) {
        return false;
    }
}

function showGLElements() {
  let glArray = document.getElementsByClassName("gl-pane");
  for (let i = (glArray.length - 1); i >= 0; i--) {
    glArray[i].style.display = "block";
  }
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);  // Get full minutes
  const sec = seconds % 60;  // Get the fractional part of the seconds

  // Check if the fractional part is zero
  if (sec % 1 === 0) {
    return `${minutes.toString().padStart(2, "0")}:${Math.floor(sec).toString().padStart(2, "0")}`; // No decimal part if zero
  } else {
    return `${minutes.toString().padStart(2, "0")}:${sec.toFixed(2).padStart(5, "0")}`; // With fractional seconds
  }
}

function makePlot(dataset){
  const title = "";
  const xlabel = "time (s)";
  const ylabel1 = "-depth (m)";
  const ylabel2 = "rate (m/s)";
  const ylabel3 = "temp (C)";
  const color1 = "royalblue";
  const color2 = "grey";
  const color3 = "gold";

  // Calculate the time difference (dt) between the first two timestamps
  let dt = dataset.t[1] - dataset.t[0];
  let tickInterval = Math.round(5 / dt);
  let tickVals = null;
  let tickText = null;
  let colots = null;

  dataset.t = dataset.t.map(formatTime);

  // Calculate the number of samples needed to cover 5 seconds
  tickVals = dataset.t.filter((time, index) => index % tickInterval === 0);
  tickText = tickVals;


  colors = dataset.vertrate.map(rate => {
    if (rate < 0) {
      return "dark"+color2;
    } else return "light"+color2;
  });

  Plotly.react("dive-plot", [
    {
      x: dataset.t,
      y: dataset.height,
      mode: "lines",
      type: "scatter",
      name: ylabel1,
      yaxis: "y",
      line: { color: color1 },
      zorder: 10
    },
    {
      x: dataset.t,
      y: dataset.vertrate,
      mode: "lines",
      type: "bar",
      name: ylabel2,
      yaxis: "y2",
      marker: { color: colors },
      zorder: 5
    },
    {
      x: dataset.t,
      y: dataset.temperature,
      mode: "lines",
      type: "scatter",
      name: ylabel3,
      yaxis: "y3",
      marker: { color: color3 },
      zorder: 6
    }
  ], {
    title: "<b>" + dataset.date + " " + dataset.time + "</b><br><i>" + dataset.locname + "</i><br>" + dataset.divetime + " seconds :: " + dataset.maxdepth + " meters<br>&nbsp;",
    showlegend: false,
    xaxis: {
      title: xlabel,
      tickvals: tickVals,
      ticktext: tickText
    },
    yaxis: { title: ylabel1, side: "left", titlefont: { color: color1 }, tickfont: { color: color1 } },
    yaxis2: {
      title: ylabel2,
      overlaying: "y",
      side: "right",
      titlefont: { color: color2 },
      tickfont: { color: color2 },
      showgrid: false
    },
    yaxis3: {
      showticklabels: false,
      overlaying: "y",
      showgrid: false
    }
  });
}

window.onload = function() {
  if (isWebGLSupported()){
    showGLElements();
  }
}

window.addEventListener("resize", function() {
  Plotly.Plots.resize(document.getElementById("dive-plot"));
});
