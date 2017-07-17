# bci-calendar
BCI Calendar is a Power BI custom visual that allows you to view your aggregated data in a month view. It offers many customization features ranging from basic formatting options like font size, color, etc, to more advanced features such as divergent data color scales, data labels, tooltips, and selection interaction.

# Table of Contents
* [Features](#features)
  * [Supported Fields](#supported-fields) 
    * [Date Field](#date-field)
    * [Measure Data](#measure-data)
    * [Tooltip](#tooltip)
  * [Formatting and Customization](#formatting-and-customization)
    * [Data-driven Colors](#data-driven-colors)
    * [Diverging Colors](#diverging-colors)
    * [Selection Interaction](#selection-interaction)
    * [Tooltips](#tooltips)
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
## Formatting and Customization
### Data-driven Colors
Choose a minimum and maximum color value and the visual will display a color gradient based on the [Measure Data](#measure-data) field supplied. By default, the visual will use the minimum and maximum values from the data, however you can also specify `Minimum Value` and/or `Maximum Value` to supply your own min/max for the colors to be based on.
![Data Colors](https://github.com/mannymerino/bci-calendar/blob/master/assets/bci-calendar-data-colors.png "Data Colors")
### Diverging Colors
If you would like to include a center color, toggle the `Diverging` slider to `On` and specify a `Center Color`. You can also specify a `Center Value` if desired.
![Diverging Colors](https://github.com/mannymerino/bci-calendar/blob/master/assets/bci-calendar-diverging-colors.png "Diverging Colors")
### Selection Interaction
The visual includes selection interaction functionality. Clicking on a particular day in the calendar visual will update the selection in other visuals on the page accordingly.
![Selection Interaction](https://github.com/mannymerino/bci-calendar/blob/master/assets/bci-calendar-selection-interaction.png "Selection Interaction")
### Tooltips
As described in the [Tooltip](#tooltip) section above, this visual supports tooltips and allows customization by adding additional data fields to the `Tooltip` field.

![Tooltips](https://github.com/mannymerino/bci-calendar/blob/master/assets/bci-calendar-tooltips.png "Tooltips")
# Usage
## Download Custom Visual
The Power BI custom visual is available in the [Office Store](https://store.office.com/en-us/appshome.aspx) here: [Link coming soon]. Follow the instructions to download the visual to your computer, and optionally download a sample Power BI report containing the visual and providing examples of using and customizing it.
## Install Custom Visual 
1. If editing a report using the Power BI Service, be sure to first be in edit mode on your desired report.
2. From the visualizations fly-out, choose `Import from file`.
   
   ![Import Visual](https://github.com/mannymerino/bci-calendar/blob/master/assets/bci-calendar-import-visual.png "Import Visual")
   _Note: If using older versions of Power BI, this may be labeled `Import custom visual`._
3. Browse to the location where you downloaded the custom visual to and choose the `BciCalendar.1.0.0.0.pbiviz` file. _Note: The version number may vary from what's shown in this document. Be sure to select the correct file._
4. Once installed, you will see the BciCalendar icon ![BciCalendar icon](https://github.com/mannymerino/bci-calendar/blob/master/assets/icon.png "BciCalendar icon") in the Visualizations pane's toolbox area.
## Customize Visual
### Fields
Select your `Date Field`, `Measure Data`, and `Tooltip` fields as necessary for your reporting needs. Please see [Known Limitations](#known-limitations) for an explanation on a limitation with using the `Date Field`. _Note: You are limited to one `Date Field` and one `Measure Data` field. You can choose as many `Tooltip` fields as desired._
### Format
The following customization and formatting options are available for this custom visual.
#### Calendar Format
![Calendar Format](https://github.com/mannymerino/bci-calendar/blob/master/assets/bci-calendar-format-calendar-format.png "Calendar Format")
* `Month/Year Display`: Choose from `None`, `Month Only`, and `Month and Year` to customize how the month and/or year are displayed in the visual.
* `Weekday Format`: Choose from `Short` or `Long` to customize how the weekday labels are displayed. `Short` displays the first three letters of the weekday. `Long` displays the full weekday name.
* `Border Thickness`: Specify the thickness, in pixels, of the border displayed around each day.
* `Border Color`: Use the color picker to choose a color for the border displayed around each day.
* `Font Color`: Use the color picker to choose a color for the font displaying the Month/Year, Weekdays, and Days.
* `Font Weight`: Enter a value, between 100 and 900, to specify the weight of the font (i.e., level of boldness) displaying the Month/Year, Weekdays, and Days.
* `Text Size`: Use the slider to choose a size, in pixels, of the text displaying the Month/Year, Weekdays, and Days.
* `Month Alignment`: Choose the desired alignment for the Month/Year.
* `Week Alignment`: Choose the desired alignment for the Weekdays.
* `Day Alignment`: Choose the desired alignment for the Days.
#### Data Colors
![Data Colors](https://github.com/mannymerino/bci-calendar/blob/master/assets/bci-calendar-format-data-colors.png "Data Colors")
* `Diverging`: Toggle this slider to control whether the data colors use a center color and value.
* `Minimum Color`: Use the color picker to choose a color for the either minimum data value, or if specified, for the `Minimum Value`.
* `Center Color`: Use the color picker to choose a color for the either median data value, or if specified, for the `Center Value`. This value is nulled out if `Diverging` is set to `Off`.
* `Maximum Color`: Use the color picker to choose a color for the either maximum data value, or if specified, for the `Maximum Value`.
* `Minimum Value`: If specified, the `Minimum Color` will be based on this value. Leave blank to have the `Minimum Color` be based on the minimum value of the `Measure Data` field.
* `Center Value`: If specified, the `Center Color` will be based on this value. Leave blank to have the `Center Color` be based on the median value of the `Measure Data` field. This value is nulled out if `Diverging` is set to `Off`.
* `Maximum Value`: If specified, the `Maximum Color` will be based on this value. Leave blank to have the `Maximum Color` be based on the maximum value of the `Measure Data` field.
* `No Data Color`: Use the color picker to choose a color for days with no data.
#### Data Labels
![Data Labels](https://github.com/mannymerino/bci-calendar/blob/master/assets/bci-calendar-format-data-labels.png "Data Labels")
* `On/Off`: Toggle this slider to control whether the aggregated data values from the `Measure Data` field are displayed for each day.
* `Display Unit`: Use this dropdown to choose a desired display unit to convert the data labels to.
* `Decimal Places`: Enter the number of desired number of decimal places to be displayed in the data labels.
* `Font Color`: Use the color picker to select a font color for the data labels.
* `Font Weight`: Enter a value, between 100 and 900, to specify the weight of the data labels font (i.e., level of boldnesss).
* `Text Size`: Use the slider to choose a size, in pixels, of the text displaying the data labels.
* `Alignment`: Choose the desired data label alignment.
#### Title, Background, Lock aspect, Border, General
These are all default Power BI visual formatting options.
# Known Limitations
* The visual doesn't support date hierarchies. If you are having issues viewing your data in the visual, make sure your Date Field is not displaying as "Date Hierarchy".
  
  ![Date Hierarchy](https://github.com/mannymerino/bci-calendar/blob/master/assets/bci-calendar-date-hierarchy.png "Date Hierarchy")
* The visual will use the month/year from the first date in the selected dataset. If your dataset spans multiple months or years, the visual will only show the first month/year.
* The optimal experience for visualizing your data using this visual is when your report or page is filtered to view one month at a time. For example, using a month/year slicer or page filter.
* Selection interaction is only one-way in this current version. In other words, you can select a day in the month and other visuals will update accordingly but selecting a data point in another visual will not affect the calendar visual. Stay tuned for a future update that will include this functionality!