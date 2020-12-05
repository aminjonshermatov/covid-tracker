import React, { useState, useEffect } from 'react';
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent
} from "@material-ui/core";
import './App.css';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import { sortData, prettyPrintStat, showDataOnMap } from "./util";
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countyInfo, setCountyInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState([
    34.80746,
    -40.4796
  ]);
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState('cases');

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
      .then(response => response.json())
      .then(data => {
        setCountyInfo(data)
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
        .then(response => response.json())
        .then(data => {
          const countries = data.map(country => ({
            name: country.country,
            value: country.countryInfo.iso2
          }));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countries);
          setMapCountries(data);
        });
    };

    getCountriesData();
  }, []);

  const onCountyChange = async ev => {
    const { value } = ev.target; 

    const url = value === 'worldwide'
      ? 'https://disease.sh/v3/covid-19/all'
      : `https://disease.sh/v3/covid-19/countries/${value}`;

    await fetch(url)
      .then(response => response.json())
      .then(data => {
        setCountry(value);
        setCountyInfo(data);

        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      })
  };

  const mapCircles = showDataOnMap(mapCountries, casesType);

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountyChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {
                countries.map(({ name, value }, index) => (
                  <MenuItem key={index} value={value}>{name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox
            onClick={() => setCasesType('cases')}
            title="Coronavirus Cases"
            cases={prettyPrintStat(countyInfo.todayCases)}
            total={prettyPrintStat(countyInfo.cases)}
          />
          <InfoBox
            onClick={() => setCasesType('recovered')}
            title="Recovered"
            cases={prettyPrintStat(countyInfo.todayRecovered)}
            total={prettyPrintStat(countyInfo.recovered)}
          />
          <InfoBox
            onClick={() => setCasesType('deaths')}
            title="Deaths"
            cases={prettyPrintStat(countyInfo.todayDeaths)}
            total={prettyPrintStat(countyInfo.deaths)}
          />
        </div>

        <Map
          mapCircles={mapCircles}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className="app_right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3>Worldwide new cases</h3>
          <LineGraph />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
