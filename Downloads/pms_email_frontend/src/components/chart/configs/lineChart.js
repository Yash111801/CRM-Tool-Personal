const lineChart = {
  series: [
    {
      name: "Completed",
      data: [350, 40, 300, 220, 500, 250, 400, 230, 500],
      offsetY: 0,
    },
    {
      name: "Ready to Create",
      data: [30, 90, 40, 140, 290, 290, 340, 230, 400],
      offsetY: 0,
    },
    {
      name: "Discrepancy",
      data: [50, 110, 60, 190, 170, 210, 310, 210, 420],
      offsetY: 0,
    },
  ],

  options: {
    chart: {
      width: "100%",
      height: 350,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    colors: ['#00E396', '#008FFB', '#FF0000'],
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "14px",
          fontWeight: 600,
          colors: ["#8c8c8c"],
        },
      },
      title: {
        text: 'Counts',
        style: {
          fontWeight: 600,
          fontSize: '14px',
        },
      },
    },

    xaxis: {
      labels: {
        style: {
          fontSize: "14px",
          fontWeight: 600,
          colors: [
            "#8c8c8c",
            "#8c8c8c",
            "#8c8c8c",
            "#8c8c8c",
            "#8c8c8c",
            "#8c8c8c",
            "#8c8c8c",
            "#8c8c8c",
            "#8c8c8c",
          ],
        },
      },
      categories: [
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
      ],
      title: {
        text: 'Months',
        style: {
          fontWeight: 600,
          fontSize: '14px',
        },
      },
    },

    tooltip: {
      y: {
        formatter: function (val) {
          return val;
        },
      },
    },
  },
};

export default lineChart;
