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

function showElement(idname) {
  let element = document.getElementById(idname);
  element.style.display = "block";
  element.style.height = "auto";
  element.style.opacity = 1;
}

function bgloadElement(idname) {
  let element = document.getElementById(idname);
  element.style.display = "block";
  element.style.height = 0;
  element.style.opacity = 0;
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

function isPageAvailable(url) {
  // Use fetch to send a request to the url
  return fetch(url, { method: 'HEAD' , cache: 'no-cache'})  // HEAD requests are faster than GET
  .then(response => {
    if (response.ok) {
        // If the response is successful (status code 200-299)
      return true;
    } else {
        // If the server responds with an error code (e.g., 404, 500, etc.)
      return false;
    }
  })
  .catch(error => {
      // If there is an error (e.g., network failure or url is unreachable)
    console.error('Error:', error);
    return false;
  });
}

window.onload = function() {
  // check if we are online. If not, don't load maps. 
  isPageAvailable("https://divefr.ee/")
  .then(pageExists => {
    if (pageExists) {
      // load in background but don't display
      bgloadElement("map-pane-OSM");
      // make visiable after some time
      setTimeout(function () {showElement("map-pane-OSM");},700);
      if (isWebGLSupported()) {
            bgloadElement("map-pane-GNC");
            setTimeout(function () {showElement("map-pane-GNC");},2000);
        }
      }
    });
}

window.addEventListener("resize", function() {
  Plotly.Plots.resize(document.getElementById("dive-plot"));
});
