# bci-calendar
BCI Calendar is a Power BI custom visual that allows you to view your aggregated data in a month view. It offers many customization features ranging from basic formatting options like font size, color, etc, to more advanced features such as divergent data color scales, data labels, tooltips, and selection interaction.

# Table of Contents
* [Features](#features)
  * [Supported Fields](#supported-fields) 
    * [Date Field](#date-field)
    * [Measure Data](#measure-data)
    * [Tooltip](#tooltip)
* [Usage](#usage)
  * [Download Custom Visual](#download-custom-visual)
  * [Install Custom Visual](#install-custom-visual)
  * [Customize Visual](#customize-visual)
    * [Fields](#fields)
    * [Format](#format)
      * [Calendar Format](#calendar-format)
      * [Data Colors](#data-colors)
      * [Data Labels](#data-labels)
* [Known Limitations](#limitations)
# Features
## Supported Fields
### Date Field
Choose a date field from your dataset to use as the Date Field in the visual (also known as the Category field). Please note that this visual does not currently support date hierarchies. See [Known Limitations](#known-limitations) below for details. If you are having issues viewing your data in the visual, make sure your Date Field is not displaying as "Date Hierarchy".
### Measure Data
Choose a value field from your dataset to display in the calendar. You can choose the appropriate aggregation type to be displayed for each day where data exists. `Sum` is the default aggregation type. 
### Tooltip
By default, the [Date Field](#date-field) will be displayed as the tooltip header and the [Measure Data](#measure-data) will be displayed in the tooltip body. You can use the Tooltip setting to add any number of additional data fields that will be displayed in the tooltip body area.
# Usage
## Download Custom Visual
The Power BI custom visual is available in the [Office Store](https://store.office.com/en-us/appshome.aspx) here: [Link coming soon]. Follow the instructions to download the visual to your computer, and optionally download a sample Power BI report containing the visual and providing examples of using and customizing it.
## Install Custom Visual 
1. If editing a report using the Power BI Service, be sure to first be in edit mode on your desired report.
2. From the visualizations fly-out, choose `Import from file`. [Screenshot] _Note: If using older versions of Power BI, this may be labeled `Import custom visual`._
3. Browse to the location where you downloaded the custom visual to and choose the `BciCalendar.1.0.0.0.pbiviz` file. _Note: The version number may vary from what's shown in this document. Be sure to select the correct file._
4. Once installed, you will see the BciCalendar icon ![BciCalendar icon](https://github.com/mannymerino/bci-calendar/blob/master/assets/icon.png "BciCalendar icon") in the Visualizations pane's toolbox area.
## Customize Visual
### Fields
Select your `Date Field`, `Measure Data`, and `Tooltip` fields as necessary for your reporting needs. Please see [Known Limitations](#known-limitations) for an explanation on a limitation with using the `Date Field`. _Note: You are limited to one `Date Field` and one `Measure Data` field. You can choose as many `Tooltip` fields as desired._
### Format
The following customization and formatting options are available for this custom visual.
#### Calendar Format
[Screenshot]
* `Month/Year Display`: 
* `Weekday Format`:
* `Border Thickness`:
* `Border Color`:
* `Font Color`:
* `Font Weight`:
* `Text Size`:
* `Month Alignment`:
* `Week Alignment`:
* `Day Alignment`:
#### Data Colors
[Screenshot]
* `Diverging`:
* `Minimum Color`:
* `Center Color`:
* `Maximum Color`:
* `Minimum Value`:
* `Center Value`:
* `Maximum Value`:
* `No Data Color`:
#### Data Labels
[Screenshot]
* `On/Off`:
* `Display Unit`:
* `Decimal Places`:
* `Font Color`:
* `Font Weight`:
* `Text Size`:
* `Alignment`:
#### Title, Background, Lock aspect, Border, General
These are all default Power BI visual formatting options.
# Known Limitations
* The visual doesn't support date hierarchies. If you are having issues viewing your data in the visual, make sure your Date Field is not displaying as "Date Hierarchy". [Screenshot]
* The visual will use the month/year from the first date in the selected dataset. If your dataset spans multiple months or years, the visual will only show the first month/year.
* The optimal experience for visualizing your data using this visual is when your report or page is filtered to view one month at a time. For example, using a month/year slicer or page filter.
* Selection interaction is only one-way in this current version. In other words, you can select a day in the month and other visuals will update accordingly but selecting a data point in another visual will not affect the calendar visual. Stay tuned for a future update that will include this functionality!