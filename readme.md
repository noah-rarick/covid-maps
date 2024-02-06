## Web Mapping for Covid-19#

Within this lab assignment I was tasked with creating two different maps to visualize Covid-19 data counts and rates using the Mapbox library. The first map is a choropleth map displaying the rate of covid cases in each U.S. county, the other is a proportional symbol map showing total case counts in 2020 for each county. 

The COVID-19 case/death data that was used was gathered from The New York Times. The data includes all the cases in 2020. The population data used for calculating the case rates are from the 2018 ACS 5 year estimates. Both data are at the county level. The U.S. county boundary shapefile was downloaded from the U.S. Census Bureau. The case rate is calculated as cases per thousand residents.

Both maps are interactive, allowing the user to zoom, scroll, and click or hover to gain more information about the counts/rates. 

Geojson data was obtained by using mapshaper.org to convert shapefiles into json data, in which unnecessary columns were removed. 

The first map is choropleth mapping of covid rates: <a href=''> </a>

The second map is proportional symbol mapping of covid counts: <a href=''> </a>

### Acknowledgement
The information/data used for this lab was shared and processed to us by Steven Bao. Lab instructions were provided by Professor Bo Zhao. TA Liz Peng provided assistance during the labs completion, answering questions and helping with problem solving and troubleshooting.