import React from "react";
import "./Table.css";
import numeral from "numeral";

function Table({ countries }) {
    return (
        <div className="table">
            <table cellSpacing="0">
                <tbody>
                    {countries.map(({ country, cases }) => {
                        return (
                            <tr key={country + cases}>
                                <td>{country}</td>
                                <td>
                                    <strong>
                                        {numeral(cases).format("0,0")}
                                    </strong>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default Table;
