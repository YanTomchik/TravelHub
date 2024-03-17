"use strict";

// Class definition
var KTWidgets = function () {
    // Private properties

    var _initStatsWidget1 = function () {
        var element = document.getElementById("kt_stats_widget_1_chart");
        if (!element) {
            return;
        }

        var weekdayStr = element.getAttribute('data-weekday');
        var weekday = weekdayStr.split('.');

        var options = {
            series: [{
                name: 'Количество',
                data: [weekday[0].split('-')[0], weekday[1].split('-')[0], weekday[2].split('-')[0], weekday[3].split('-')[0], weekday[4].split('-')[0], weekday[5].split('-')[0], weekday[6].split('-')[0]]
            }],
            chart: {
                type: 'area',
                height: 150,
                toolbar: {
                    show: false
                },
                zoom: {
                    enabled: false
                },
                sparkline: {
                    enabled: true
                }
            },
            plotOptions: {},
            legend: {
                show: false
            },
            dataLabels: {
                enabled: false
            },
            fill: {
                type: 'solid',
                opacity: 1
            },
            stroke: {
                curve: 'smooth',
                show: true,
                width: 3,
                colors: [KTApp.getSettings()['colors']['theme']['base']['primary']]
            },
            xaxis: {
                categories: [weekday[0].split('-')[1], weekday[1].split('-')[1], weekday[2].split('-')[1], weekday[3].split('-')[1], weekday[4].split('-')[1], weekday[5].split('-')[1], weekday[6].split('-')[1]],
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false
                },
                labels: {
                    show: false,
                    style: {
                        colors: KTApp.getSettings()['colors']['gray']['gray-500'],
                        fontSize: '12px',
                        fontFamily: KTApp.getSettings()['font-family']
                    }
                },
                crosshairs: {
                    show: false,
                    position: 'front',
                    stroke: {
                        color: KTApp.getSettings()['colors']['gray']['gray-300'],
                        width: 1,
                        dashArray: 3
                    }
                },
                tooltip: {
                    enabled: true,
                    formatter: undefined,
                    offsetY: 0,
                    style: {
                        fontSize: '12px',
                        fontFamily: KTApp.getSettings()['font-family']
                    }
                }
            },
            yaxis: {
                labels: {
                    show: false,
                    style: {
                        colors: KTApp.getSettings()['colors']['gray']['gray-500'],
                        fontSize: '12px',
                        fontFamily: KTApp.getSettings()['font-family']
                    }
                }
            },
            states: {
                normal: {
                    filter: {
                        type: 'none',
                        value: 0
                    }
                },
                hover: {
                    filter: {
                        type: 'none',
                        value: 0
                    }
                },
                active: {
                    allowMultipleDataPointsSelection: false,
                    filter: {
                        type: 'none',
                        value: 0
                    }
                }
            },
            tooltip: {
                style: {
                    fontSize: '12px',
                    fontFamily: KTApp.getSettings()['font-family']
                },
                y: {
                    formatter: function (val) {
                        return val
                    }
                }
            },
            colors: [KTApp.getSettings()['colors']['theme']['light']['primary']],
            markers: {
                colors: [KTApp.getSettings()['colors']['theme']['light']['primary']],
                strokeColor: [KTApp.getSettings()['colors']['theme']['base']['primary']],
                strokeWidth: 3
            }
        };

        var chart = new ApexCharts(element, options);
        chart.render();
    }

    var _initStatsWidget2 = function () {
        var element = document.getElementById("kt_stats_widget_2_chart");
        if (!element) {
            return;
        }

        var weekdayStr = element.getAttribute('data-weekday');
        var weekday = weekdayStr.split('.');

        var options = {
            series: [{
                name: 'Количество',
                data: [weekday[0].split('-')[0], weekday[1].split('-')[0], weekday[2].split('-')[0], weekday[3].split('-')[0], weekday[4].split('-')[0], weekday[5].split('-')[0], weekday[6].split('-')[0]]
            }],
            chart: {
                type: 'area',
                height: 150,
                toolbar: {
                    show: false
                },
                zoom: {
                    enabled: false
                },
                sparkline: {
                    enabled: true
                }
            },
            plotOptions: {},
            legend: {
                show: false
            },
            dataLabels: {
                enabled: false
            },
            fill: {
                type: 'solid',
                opacity: 1
            },
            stroke: {
                curve: 'smooth',
                show: true,
                width: 3,
                colors: [KTApp.getSettings()['colors']['theme']['base']['primary']]
            },
            xaxis: {
                categories: [weekday[0].split('-')[1], weekday[1].split('-')[1], weekday[2].split('-')[1], weekday[3].split('-')[1], weekday[4].split('-')[1], weekday[5].split('-')[1], weekday[6].split('-')[1]],
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false
                },
                labels: {
                    show: false,
                    style: {
                        colors: KTApp.getSettings()['colors']['gray']['gray-500'],
                        fontSize: '12px',
                        fontFamily: KTApp.getSettings()['font-family']
                    }
                },
                crosshairs: {
                    show: false,
                    position: 'front',
                    stroke: {
                        color: KTApp.getSettings()['colors']['gray']['gray-300'],
                        width: 1,
                        dashArray: 3
                    }
                },
                tooltip: {
                    enabled: true,
                    formatter: undefined,
                    offsetY: 0,
                    style: {
                        fontSize: '12px',
                        fontFamily: KTApp.getSettings()['font-family']
                    }
                }
            },
            yaxis: {
                labels: {
                    show: false,
                    style: {
                        colors: KTApp.getSettings()['colors']['gray']['gray-500'],
                        fontSize: '12px',
                        fontFamily: KTApp.getSettings()['font-family']
                    }
                }
            },
            states: {
                normal: {
                    filter: {
                        type: 'none',
                        value: 0
                    }
                },
                hover: {
                    filter: {
                        type: 'none',
                        value: 0
                    }
                },
                active: {
                    allowMultipleDataPointsSelection: false,
                    filter: {
                        type: 'none',
                        value: 0
                    }
                }
            },
            tooltip: {
                style: {
                    fontSize: '12px',
                    fontFamily: KTApp.getSettings()['font-family']
                },
                y: {
                    formatter: function (val) {
                        return val
                    }
                }
            },
            colors: [KTApp.getSettings()['colors']['theme']['light']['primary']],
            markers: {
                colors: [KTApp.getSettings()['colors']['theme']['light']['primary']],
                strokeColor: [KTApp.getSettings()['colors']['theme']['base']['primary']],
                strokeWidth: 3
            }
        };

        var chart = new ApexCharts(element, options);
        chart.render();
    }

    var _initChartsWidget2 = function () {
        var element = document.getElementById("kt_charts_widget_2_chart");

        if (!element) {
            return;
        }

        var options = {
            series: [{
                name: 'Количество публикаций',
                data: JSON.parse($('#weekday-publications-count').val())
            }],
            chart: {
                type: 'bar',
                height: 200,
                toolbar: {
                    show: false
                }
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: ['30%'],
                    endingShape: 'rounded'
                },
            },
            legend: {
                show: false
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent']
            },
            xaxis: {
                categories: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вск'],
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false
                },
                labels: {
                    style: {
                        colors: KTApp.getSettings()['colors']['gray']['gray-500'],
                        fontSize: '12px',
                        fontFamily: KTApp.getSettings()['font-family']
                    }
                }
            },
            yaxis: {
                labels: {
                    style: {
                        colors: KTApp.getSettings()['colors']['gray']['gray-500'],
                        fontSize: '12px',
                        fontFamily: KTApp.getSettings()['font-family']
                    }
                }
            },
            fill: {
                opacity: 1
            },
            states: {
                normal: {
                    filter: {
                        type: 'none',
                        value: 0
                    }
                },
                hover: {
                    filter: {
                        type: 'none',
                        value: 0
                    }
                },
                active: {
                    allowMultipleDataPointsSelection: false,
                    filter: {
                        type: 'none',
                        value: 0
                    }
                }
            },
            tooltip: {
                style: {
                    fontSize: '12px',
                    fontFamily: KTApp.getSettings()['font-family']
                },
                y: {
                    formatter: function (val) {
                        return val
                    }
                }
            },
            colors: [KTApp.getSettings()['colors']['theme']['base']['warning']],
            grid: {
                borderColor: KTApp.getSettings()['colors']['gray']['gray-200'],
                strokeDashArray: 4,
                yaxis: {
                    lines: {
                        show: true
                    }
                }
            }
        };

        var chart = new ApexCharts(element, options);
        chart.render();
    }

    // Public methods
    return {
        init: function () {
            // Stats Widgets
            _initStatsWidget1();
            _initStatsWidget2();
            _initChartsWidget2();
        }
    }
}();

// Webpack support
if (typeof module !== 'undefined') {
    module.exports = KTWidgets;
}

jQuery(document).ready(function () {
    KTWidgets.init();
});
