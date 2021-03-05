var myConfig = {
  type: "bubble-pie",
  legend: {
    "highlight-plot": true,
  },

  plotarea: {
    //main chart area
    margin: "0% 3% 20% 100%",
  },

  legend: {
    x: "20%",
    y: "8%",
    item: {
      text: "%data-pie",
    },
    align: "center",
    "vertical-align": "bottom",
  },
  title: {
    text: "Speakers",
  },
  subtitle: {
    text: "",
  },
  plot: {
    "data-bubble": ["Sam D.", "Oscar C.", "Lisa A.", "Selma J.", "Sumati F."],

    values: [
      [3085, 27567127, 25620],
      [1384, 12559364, 12783],
      [773, 9988660, 1565],
      [951, 13356940, 3132],
      [1593, 6250431, 3926],
    ],

    "value-box": {
      text: "%data-bubble",
      placement: "bottom",
      "font-color": "black",
      "font-weight": "normal",
    },
    tooltip: {
      text: "%data-pv% %data-pie %comments",
    },
    "min-size": 25,
    "max-size": 50,
  },
  "scale-x": {
    values: "700:3300:200",
    label: {
      text: "Comments",
    },
  },
  "scale-y": {
    //"values": "0:30000000:428571",

    tick: {},

    label: {
      text: "Views",
    },
  },

  title: {
    text: "",
    adjustLayout: true,
  },
  series: [
    {
      "data-v": [61260, 18299, 12610, 15978, 11545],
      comments: [3085, 1384, 773, 951, 1593],
      "data-pie": "Positive",
      marker: {
        "background-color": "#2074A0",
      },
    },
    {
      "data-v": [1701, 1480, 1705, 1686, 725],
      "data-pie": "Negative",
      marker: {
        "background-color": "#e32143",
      },
    },
  ],
};

zingchart.render({
  id: "myChart",
  data: myConfig,
  height: 500,
  width: "70%",
  output: "canvas",
});
