import React, { useState, useEffect } from "react";
import "./App.css";
import {
    // Select,
    FormControl,
    // MenuItem,
    Card,
    CardContent,
} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import { sortData, preetyPrintStat } from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";

function App() {
    const [countries, setCountries] = useState([]);
    const [countryInfo, setCountryInfo] = useState({});
    const [tableData, setTableData] = useState([]);
    const [mapCenter, setMapCenter] = useState([24, -3.034721]);
    const [mapZoom, setMapZoom] = useState(3);
    const [mapCountries, setMapCountires] = useState([]);
    const [casesType, setCasesType] = useState("cases");
    const [mapCountry, setMapCountry] = useState();

    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const loading = open && options.length === 0;

    const worldwideAdd = {
        name: "Worldwide",
        value: "worldwide",
    };
    const worldwideAddMap = {
        country: "Worldwide",
        value: "worldwide",
    };
    // Running useEffect for first when components load and our Worldwide selected in select box
    useEffect(() => {
        fetch("https://disease.sh/v3/covid-19/all")
            .then((response) => response.json())
            .then((data) => {
                // All of the data for wolrdwide render initially...
                setCountryInfo(data);
            });
    }, []);
    // https://disease.sh/v3/covid-19/countries

    //State = How to write a variable in react

    //UseEffect = Runs a piece of code based on a given condition

    useEffect(() => {
        // The [blank square bracket] as second argument of useEffect is a condtion and if it is empty then the code inside here will run once when the component loads and not again.
        // async -> send a request, wait for it, do something with that info
        const getcountriesData = async () => {
            await fetch("https://disease.sh/v3/covid-19/countries")
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    const countries = data.map((country) => ({
                        name: country.country, //United States, India
                        value: country.countryInfo.iso2, //UK,IN
                    }));

                    countries.splice(0, 0, worldwideAdd);

                    const sortedData = sortData(data);
                    setTableData(sortedData);
                    let dataModified = [...data];
                    dataModified.splice(0, 0, worldwideAddMap);
                    setMapCountires(dataModified);
                    setCountries(countries);

                    setOptions(countries);
                });
        };
        getcountriesData();
    }, []);

    // const onSelectCountryChange = (index) => {
    //     setMapCountry(index);
    // }; //This code is used with matirial ui normal select box but now it is commented

    const onCountryChange = async (event, value) => {
        const countryCode = value ? { value }.value.value : "worldwide";
        if (countryCode) {
            const url =
                countryCode === "worldwide"
                    ? "https://disease.sh/v3/covid-19/all"
                    : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
            await fetch(url)
                .then((response) => response.json())
                .then((data) => {
                    // All of the data...
                    // from the country response
                    setCountryInfo(data);
                    if (countryCode === "worldwide") {
                        setMapCenter([25.165173, -3.034721]);
                        setMapZoom(2);
                    } else {
                        setMapCenter([
                            data.countryInfo.lat,
                            data.countryInfo.long,
                        ]);
                        setMapZoom(4);
                    }
                });

            countries.map((country, index) => {
                if (country === value) {
                    return setMapCountry(index);
                }
            });
        }
    };

    function countryToFlag(isoCode) {
        let isoFinal;
        if (isoCode === null) {
            isoCode = "";
        } else {
            isoFinal =
                isoCode !== "worldwide"
                    ? typeof String.fromCodePoint !== "undefined"
                        ? isoCode
                              .toUpperCase()
                              .replace(/./g, (char) =>
                                  String.fromCodePoint(
                                      char.charCodeAt(0) + 127397
                                  )
                              )
                        : isoCode
                    : "";
        }
        return isoFinal;
    }

    return (
        <div className="app">
            <div className="app__left">
                {/* Header  -->>> */}
                {/* Title + select input dropdown field -->>> */}
                <div className="app__header">
                    <h1>COVID-19 TRACKER</h1>
                    <FormControl className="app__dropdown">
                        <Autocomplete
                            id="allCountrySelectBox"
                            style={{ width: 300 }}
                            open={open}
                            onOpen={() => {
                                setOpen(true);
                            }}
                            onClose={() => {
                                setOpen(false);
                            }}
                            onChange={(e, v) => {
                                onCountryChange(e, v);
                            }}
                            getOptionSelected={(option, value) => {
                                return option.name === value.name;
                            }}
                            getOptionLabel={(option) => option.name}
                            options={options}
                            loading={loading}
                            renderOption={(option) => (
                                <>
                                    <span
                                        style={{
                                            paddingTop: "1px",
                                        }}
                                    >
                                        {countryToFlag(option.value)}
                                    </span>
                                    <span
                                        style={{
                                            paddingLeft: "10px",
                                            fontSize: "16px",
                                        }}
                                    >
                                        {option.name}
                                    </span>
                                </>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Select A Country"
                                    variant="outlined"
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <React.Fragment>
                                                {loading ? (
                                                    <CircularProgress
                                                        color="inherit"
                                                        size={20}
                                                    />
                                                ) : null}
                                                {params.InputProps.endAdornment}
                                            </React.Fragment>
                                        ),
                                    }}
                                />
                            )}
                        />

                        {/* <Select
                            variant="outlined"
                            onChange={onCountryChange}
                            value={country}
                        > */}
                        {/* <MenuItem value="worldwide">Worldwide</MenuItem> */}
                        {/* {countries.map((country, index) => (
                                <MenuItem
                                    value={country.value}
                                    key={country.value + index}
                                    onClick={(e) => {
                                        onSelectCountryChange(index);
                                    }}
                                >
                                    {country.name}
                                </MenuItem>
                            ))}
                        </Select> */}
                    </FormControl>
                </div>

                <div className="app__stats">
                    {/* Infoboxes title="Coronavirus cases" */}
                    {/* Infoboxes title="Coronavirus recoveries" */}
                    {/* Infoboxes title="Coronavirus deth" */}
                    <InfoBox
                        isRed
                        active={casesType === "cases"}
                        onClick={(e) => setCasesType("cases")}
                        title="Coronavirus Cases"
                        cases={preetyPrintStat(countryInfo.todayCases)}
                        total={preetyPrintStat(countryInfo.cases)}
                    />
                    <InfoBox
                        active={casesType === "recovered"}
                        onClick={(e) => setCasesType("recovered")}
                        title="Recoverd"
                        cases={preetyPrintStat(countryInfo.todayRecovered)}
                        total={preetyPrintStat(countryInfo.recovered)}
                    />
                    <InfoBox
                        isRed
                        active={casesType === "deaths"}
                        onClick={(e) => setCasesType("deaths")}
                        title="Deaths"
                        cases={preetyPrintStat(countryInfo.todayDeaths)}
                        total={preetyPrintStat(countryInfo.deaths)}
                    />
                </div>

                {/* Map */}
                <Map
                    casesType={casesType}
                    countries={mapCountries}
                    center={mapCenter}
                    zoom={mapZoom}
                    mapCountryRef={mapCountry}
                />
            </div>

            <Card className="app__right">
                <CardContent>
                    {/* Table */}
                    <h3>Live Cases by Country</h3>
                    <Table countries={tableData} />
                    {/* Graph */}
                    <h3 className="app__graphTitle">
                        Worldwide new {casesType}
                    </h3>
                    <LineGraph className="app__graph" casesType={casesType} />
                </CardContent>
            </Card>
        </div>
    );
}

export default App;
