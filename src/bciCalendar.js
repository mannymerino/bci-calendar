!function() {
    var bciCalendar = {};
    var self = {};

    consts = {
        monthNames: [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ],
        dayNames: [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
        ]
    };

    // would be better to share this between this JS file and visual.ts
    const defaultSettings = {
        monthYearDisplay: 'monthYear',
        weekdayFormat: 'short',
        weekStartDay: 0,
        borderWidth: 1,
        borderColor: {
            solid: {
                color: '#000'
            }
        },
        fontColor: {
            solid: {
                color: '#000'
            }
        },
        fontWeight: 100,
        textSize: 10,
        monthAlignment: 'center',
        weekAlignment: 'center',
        dayAlignment: 'right',
        calendarColors: {
            colorType: 'gradient',
            diverging: false,
            startColor: {
                solid: {
                    color: null
                }
            },
            centerColor: {
                solid: {
                    color: null
                }
            },
            endColor: {
                solid: {
                    color: null
                }
            },
            minValue: null,
            centerValue: null,
            maxValue: null,
            noDataColor: {
                solid: {
                    color: null
                }
            }
        },
        dataLabels: {
            show: true,
            unit: 0,
            fontColor: {
                solid: {
                    color: '#000'
                }
            },
            fontWeight: 100,
            textSize: 8,
            alignment: 'center'
        },
        weekNumbers: {
            show: false,
            useIso: false,
            placement: 'left',
            fontColor: {
                solid: {
                    color: '#000'
                }
            },
            fontWeight: 100,
            textSize: 8,
            alignment: 'center'
        }
    };

    bciCalendar.loadCalendar = function (element, viewModel, settings, selectionManager, allowInteractions) {
        const {
            calendarColors = defaultSettings.calendarColors,
            weekNumbers = defaultSettings.weekNumbers,
            dataLabels = defaultSettings.dataLabels,
        } = settings;
        self = {
            calendar: element,
            viewModel: viewModel,
            settings: settings,
            selectionManager: selectionManager,
            allowInteractions: allowInteractions,
            minValue: calendarColors.minValue || d3.min(viewModel.dataPoints.map(function(d) {
                return d.value;
            })),
            centerValue: calendarColors.centerValue || d3.mean(viewModel.dataPoints.map(function(d) {
                return d.value;
            })),
            maxValue: calendarColors.maxValue || d3.max(viewModel.dataPoints.map(function(d) {
                return d.value;
            }))
        };

        var calendar = element;
        var className = calendar.attr("class");
        var colspan = (weekNumbers && weekNumbers.show) ? 8 : 7;

        if (viewModel.error.hasError) {
            noData(calendar, viewModel.error.errorMessage);
            return;
        }

        if (viewModel.dataPoints.length == 0) {
            noData(calendar, 'No data for selected Year and Month.');
            return;
        }

        var month = viewModel.month;
        var year = viewModel.year;

        // resequence dayNames[] based on settings.weekStartDay
        var dayNames = consts.dayNames.slice(settings.weekStartDay, consts.dayNames.length).concat(consts.dayNames.slice(0, settings.weekStartDay));

        var weeks = monthDays(year, month, { 
            weekStartDay: settings.weekStartDay,
            showWeekNumbers: weekNumbers.show,
            useIso: weekNumbers.useIso
        });

        var thead = calendar.append('thead');
        var tbody = calendar.append('tbody');

        mapData(weeks, viewModel);
        
        if (weekNumbers.show) {
            // add blank element to start or end  of dayNames[]
            weekNumbers.placement === 'left' ? dayNames.unshift('') : dayNames.push('');
            // add week numbers for each week[] in weeks[]
            addWeekNumbers(weeks, weekNumbers.placement);
        }

        // set month header row
        if (settings.monthYearDisplay !== 'none') {
            thead 
                .append('tr')
                .append('td')
                .attr('colspan', colspan)
                .style({
                    'text-align': 'center',
                    'color': settings.fontColor.solid.color,
                    'font-size': settings.textSize + 'px',
                    'font-weight': settings.fontWeight,
                    'text-align': settings.monthAlignment
                })
                .text(consts.monthNames[month] + (settings.monthYearDisplay === 'monthYear' ? ' ' + year : ''));
        }

        // set weekday header row
        thead 
            .append('tr')
            .selectAll('td')
            .data((settings.weekdayFormat === 'short' ? dayNames.map(d => d.substr(0,3)) : dayNames))
            .enter()
            .append('td')
            .style({
                'text-align': 'center',
                'color': settings.fontColor.solid.color,
                'font-size': settings.textSize + 'px',
                'font-weight': settings.fontWeight,
                'text-align': settings.weekAlignment
            })
            .text(function (d) {
                return d;
            });

        self.linear = d3.scale.linear();

        if (calendarColors.diverging) {
            self.linear
                .domain([self.minValue, self.centerValue, self.maxValue])
                .range([calendarColors.startColor.solid.color, 
                    calendarColors.centerColor.solid.color,
                    calendarColors.endColor.solid.color]);
        } else {
            self.linear
                .domain([self.minValue, self.maxValue])
                .range([calendarColors.startColor.solid.color, calendarColors.endColor.solid.color]);
        }

        // build calendar days for selected month
        for (var i = 0; i < weeks.length; i++) {
            var week = weeks[i];
            tbody
                .append('tr')
                .style('height', 100/weeks.length + '%')
                .selectAll('td')
                .data(week)
                .enter()
                .append('td')
                .attr('class', function (d) {
                    let className = 'notempty';
                    if (d.day <= 0) {
                        className = 'empty';
                    } else if (!d.day && d.week && d.week > 0) {
                        className = 'week';
                    }
                    return className;
                })
                .attr('id', function(d) {
                    return d.day > 0 ? className + '-' + viewModel.year.toString() + viewModel.month.toString() + d.day.toString() : '';
                })
                .style('color', function(d) {
                    let color = '';
                    if (d.day > 0) {
                        color = settings.fontColor.solid.color;
                    } else if (!d.day && d.week > 0) {
                        color = weekNumbers.fontColor.solid.color;
                    }
                    return color;
                })
                .style('font-size', function(d) {
                    let size = '';
                    if (d.day > 0) {
                        size = settings.textSize + 'px';
                    } else if (!d.day && d.week > 0) {
                        size = weekNumbers.textSize + 'px';
                    }
                    return size;
                })
                .style('font-weight', function(d) {
                    let weight = '';
                    if (d.day > 0) {
                        weight = settings.fontWeight;
                    } else if (!d.day && d.week > 0) {
                        weight = weekNumbers.fontWeight;
                    }
                    return weight;
                })
                .style('text-align', function(d) {
                    let align = '';
                    if (d.day > 0) {
                        align = settings.dayAlignment;
                    } else if (!d.day && d.week > 0) {
                        align = weekNumbers.alignment;
                    }
                    return align;
                })
                .style({
                    'border-width': settings.borderWidth + 'px',
                    'border-color': settings.borderColor.solid.color
                })
                .style('background-color', function(d) {
                    var noDataColor = calendarColors.noDataColor.solid.color;
                    return (noDataColor && (noDataColor !== null) && d.day > 0) ? noDataColor : '';
                })
                .append('div')
                .attr('class', function(d) {
                    return d.day > 0 ? className + '-parent' : '';
                })
                .append('div')
                .attr('class', function(d) {
                    return d.day > 0 ? className + '-day' : '';
                })
                .text(function (d) {
                    let label = '';
                    if (d.day > 0) {
                        label = d.day;
                    } else if (!d.day && d.week > 0) {
                        label = d.week;
                    }
                    return label;
                });
        }

        var height;

        // add data points to calendar
        for (var i = 0; i < viewModel.dataPoints.length; i++) {
            var dataPoint = viewModel.dataPoints[i];
            var dataValue = dataPoint.value;
            var dataLabel = dataPoint.valueText;
            var date = new Date(dataPoint.category);
            var year = date.getFullYear();
            var month = date.getMonth();
            var day = date.getDate();
            var id = className + '-' + year.toString() + month.toString() + day.toString();
            var td = d3.select('#' + id)
            td.style('background-color', getColor(dataValue));

            height = height || td.node().getBoundingClientRect().height;

            if (dataLabels.show && !isNaN(dataValue)) {
                d3.select('#' + id + ' .' + className + '-parent')
                    .append('div')
                    .attr('class', className + '-dataLabel')
                    .style({
                        'color': dataLabels.fontColor.solid.color,
                        'font-size': dataLabels.textSize + 'px',
                        'font-weight': dataLabels.fontWeight,
                        'text-align': dataLabels.alignment,
                        'height': parseInt(dataLabels.textSize) + (parseInt(dataLabels.textSize) * .5) + '%'
                    })
                    .text(dataLabel);
            }
        }

    }

    function noData (calendar, message) {
        var thead = calendar.append('thead')
                        .append('tr')
                        .append('td')
                        .attr('colspan', 7)
                        .style('text-align', 'center')
                        .text('*** {0} ***'.replace(/\{0\}/g, message));
    };

    function mapData (weeks, viewModel) {
        for (var w = 0; w < weeks.length; w++) {
            weeks[w] = weeks[w].map(function(d) {
                var data = { day: d.day, week: d.week };
                if (d.day > 0) {
                    var date = new Date(viewModel.year, viewModel.month, d.day);
                    // attempt to find matching date in viewModel.dataPoints
                    for (var i = 0; i < viewModel.dataPoints.length; i++) {
                        var dp = viewModel.dataPoints[i];
                        if (date.getTime() === dp.category.getTime()) {
                            data.data = dp;
                            break;
                        }
                    }
                }
                return data;
            });
        }
    };

    function addWeekNumbers(weeks, placement) {
        for (let x = 0; x < weeks.length; x++) {
            let week = weeks[x];
            // get first non-0 week number
            for (let y = 0; y < week.length; y++) {
                let item = week[y];
                if (item.week !== 0) {
                    // add this to the start or end of the week[] array
                    placement === 'left' ? week.unshift({ week: item.week }) : week.push({ week: item.week });
                    break;
                }
            }
        }
    };

    function getColor(dataValue) {
        const { settings } = self;
        const { calendarColors = defaultSettings.calendarColors } = settings; 
        let color;
        if (calendarColors.colorType === 'fixed') {
            if (calendarColors.diverging) {
                if (dataValue <= self.maxValue && dataValue > self.centerValue) color = calendarColors.endColor.solid.color;
                else if (dataValue > self.minValue && dataValue <= self.centerValue) color = calendarColors.centerColor.solid.color;
                else color = calendarColors.startColor.solid.color;
            } else {
                if (dataValue < self.centerValue) color = calendarColors.startColor.solid.color;
                else color = calendarColors.endColor.solid.color;                
            }
        } else {
            color = self.linear(dataValue);
        }
        return color;
    }

    /**
     * Credit: Ported from npm package 'calendar' 
     * https://www.npmjs.com/package/calendar
     */
    let _firstWeekDay = 0;
    let _options = {};
    var weekStartDate = function (date) {
        var startDate = new Date(date.getTime());
        while (startDate.getDay() !== _firstWeekDay) {
            startDate.setDate(startDate.getDate() - 1);
        }
        return startDate;
    };
    function monthDates (year, month, dayFormatter, weekFormatter) {
        if ((typeof year !== "number") || (year < 1970)) {
            throw new CalendarException('year must be a number >= 1970');
        };
        if ((typeof month !== "number") || (month < 0) || (month > 11)) {
            throw new CalendarException('month must be a number (Jan is 0)');
        };
        var weeks = [],
            week = [],
            i = 0,
            date = weekStartDate(new Date(year, month, 1)),
            weekNum = 0;
        do {
            for (i=0; i<7; i++) {
                weekNum = weekFormatter ? weekFormatter(date) : 0;
                week.push({
                    day: dayFormatter ? dayFormatter(date) : date,
                    week: weekNum
                });
                date = new Date(date.getTime());
                date.setDate(date.getDate() + 1);
            }
            weeks.push(week);
            week = [];
        } while ((date.getMonth()<=month) && (date.getFullYear()===year));
        return weeks;
    };
    function monthDays (year, month, options) {
        _firstWeekDay = options.weekStartDay || 0;
        _options = options || {};
        var getDayOrZero = function getDayOrZero(date) {
            return date.getMonth() === month ? date.getDate() : 0;
        };
        var getWeekOrZero = function getWeekOrZero(date) {
            return date.getMonth() === month ? date.getWeek(_options.showWeekNumbers && _options.useIso) : 0;
        }
        return monthDates(year, month, getDayOrZero, getWeekOrZero);
    };

    if (typeof define === 'function' && define.amd) {
        define(bciCalendar);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = bciCalendar;
    }
    this.bciCalendar = bciCalendar;
}();

Date.prototype.getWeek = function(useIso) {
    if (useIso) {
        let target = new Date(this.valueOf());
        let dayNr =  (this.getDay() + 6) % 7;
        target.setDate(target.getDate() - dayNr + 3);
        let firstThursday = target.valueOf();
        target.setMonth(0, 1);
        if (target.getDay() != 4) {
            target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
        }
        return 1 + Math.ceil((firstThursday - target) / 604800000);
    } else {
        let onejan = new Date(this.getFullYear(), 0, 1);
        return Math.ceil((((this.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
    }
};
