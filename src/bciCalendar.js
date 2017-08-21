!function() {
    var bciCalendar = {};
    var _this = {};

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

    bciCalendar.loadCalendar = function (element, viewModel, settings, selectionManager, allowInteractions) {
        _this = {
            calendar: element,
            viewModel: viewModel,
            settings: settings,
            selectionManager: selectionManager,
            allowInteractions: allowInteractions
        };

        // var cal = new Calendar();
        var calendar = element;
        var className = calendar.attr("class");

        if (viewModel.dataPoints.length == 0) {
            noData(calendar);
            return;
        }

        var month = viewModel.month;
        var year = viewModel.year;

        // resequence dayNames[] based on settings.weekStartDay
        var dayNames = consts.dayNames.slice(settings.weekStartDay, consts.dayNames.length).concat(consts.dayNames.slice(0, settings.weekStartDay));

        var weeks = monthDays(year, month, settings.weekStartDay);
        var thead = calendar.append('thead');
        var tbody = calendar.append('tbody');

        mapData(weeks, viewModel);

        if (settings.monthYearDisplay !== 'none') {
            thead 
                .append('tr')
                .append('td')
                .attr('colspan', 7)
                .style({
                    'text-align': 'center',
                    'color': settings.fontColor.solid.color,
                    'font-size': settings.textSize + 'px',
                    'font-weight': settings.fontWeight,
                    'text-align': settings.monthAlignment
                })
                .text(consts.monthNames[month] + (settings.monthYearDisplay === 'monthYear' ? ' ' + year : ''));
        }

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

        var minValue = settings.calendarColors.minValue,
            centerValue = settings.calendarColors.centerValue,
            maxValue = settings.calendarColors.maxValue,
            color = d3.scale.linear();

        if (settings.calendarColors.diverging) {
            color
                .domain([minValue || d3.min(viewModel.dataPoints.map(function(d) {
                    return d.value;
                })), 
                centerValue || d3.mean(viewModel.dataPoints.map(function(d) {
                    return d.value;
                })), 
                maxValue || d3.max(viewModel.dataPoints.map(function(d) {
                    return d.value;
                }))])
                .range([settings.calendarColors.startColor.solid.color, 
                settings.calendarColors.centerColor.solid.color,
                settings.calendarColors.endColor.solid.color]);
        } else {
            color
                .domain([minValue || d3.min(viewModel.dataPoints.map(function(d) {
                    return d.value;
                })), 
                maxValue || d3.max(viewModel.dataPoints.map(function(d) {
                    return d.value;
                }))])
                .range([settings.calendarColors.startColor.solid.color, settings.calendarColors.endColor.solid.color]);
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
                    return d.day > 0 ? '' : 'empty';
                })
                .attr('id', function(d) {
                    return d.day > 0 ? className + '-' + viewModel.year.toString() + viewModel.month.toString() + d.day.toString() : '';
                })
                .style({
                    'color': settings.fontColor.solid.color,
                    'font-size': settings.textSize + 'px',
                    'font-weight': settings.fontWeight,
                    'text-align': settings.dayAlignment
                })
                .style({
                    'border-width': settings.borderWidth + 'px',
                    'border-color': settings.borderColor.solid.color
                })
                .style('background-color', function(d) {
                    var noDataColor = settings.calendarColors.noDataColor.solid.color;
                    return (noDataColor && (noDataColor !== null) && d.day > 0) ? noDataColor : '';
                })
                .append('div')
                .attr('class', className + '-parent')
                .append('div')
                .attr('class', className + '-day')
                .text(function (d) {
                    return d.day > 0 ? d.day : '';
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
            td
                .style('background-color', color(dataValue))
                .on('click', itemSelect);

            height = height || td.node().getBoundingClientRect().height;

            if (settings.dataLabels.show && !isNaN(dataValue)) {
                d3.select('#' + id + ' .' + className + '-parent')
                    .append('div')
                    .attr('class', className + '-dataLabel')
                    .style({
                        'color': settings.dataLabels.fontColor.solid.color,
                        'font-size': settings.dataLabels.textSize + 'px',
                        'font-weight': settings.dataLabels.fontWeight,
                        'text-align': settings.dataLabels.alignment,
                        'height': parseInt(settings.dataLabels.textSize) + (parseInt(settings.dataLabels.textSize) * .5) + '%'
                    })
                    .text(dataLabel);
            }
        }

    }

    function noData (calendar) {
        var thead = calendar.append('thead')
                        .append('tr')
                        .append('td')
                        .attr('colspan', 7)
                        .style('text-align', 'center')
                        .text('*** No data for selected Year and Month ***');
    };

    function mapData (weeks, viewModel) {
        for (var w = 0; w < weeks.length; w++) {
            weeks[w] = weeks[w].map(function(d) {
                var data = { day: d };
                if (d > 0) {
                    var date = new Date(viewModel.year, viewModel.month, d);
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

    function itemSelect(d) {
        var className = _this.calendar.attr('class');
        var id = '#' + className + '-' 
            + _this.viewModel.year.toString() 
            + _this.viewModel.month.toString() 
            + d.day.toString();
        // allow selection only if the visual is rendered in a view that supports interactivity (e.g., Reports)
        if (_this.allowInteractions) {
            _this.selectionManager.select(d.data.selectionId).then(function(ids) {
                d3.selectAll('[id^=' + className + ']').style({
                    'opacity': ids.length > 0 ? .5 : 1
                });

                d3.select(id).style({
                    'opacity': 1
                });
            });

            d3.event.stopPropagation();
        }
    };
    
    /**
     * Credit: Ported from npm package 'calendar' 
     * https://www.npmjs.com/package/calendar
     */
    let firstWeekDay = 0;
    var weekStartDate = function (date) {
        var startDate = new Date(date.getTime());
        while (startDate.getDay() !== firstWeekDay) {
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
            date = weekStartDate(new Date(year, month, 1));
        do {
            for (i=0; i<7; i++) {
                week.push(dayFormatter ? dayFormatter(date) : date);
                date = new Date(date.getTime());
                date.setDate(date.getDate() + 1);
            }
            weeks.push(weekFormatter ? weekFormatter(week) : week);
            week = [];
        } while ((date.getMonth()<=month) && (date.getFullYear()===year));
        return weeks;
    };
    function monthDays (year, month, weekStartDay) {
        firstWeekDay = weekStartDay || 0;
        var getDayOrZero = function getDayOrZero(date) {
            return date.getMonth() === month ? date.getDate() : 0;
        };
        return monthDates(year, month, getDayOrZero);
    };

    if (typeof define === 'function' && define.amd) {
        define(bciCalendar);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = bciCalendar;
    }
    this.bciCalendar = bciCalendar;
}();
