import React from 'react';
import { Button } from 'react-bootstrap';
import ExcelExport from 'react-export-excel';
const { ExcelFile, ExcelFile: { ExcelSheet } } = ExcelExport;

const multiDataSet = [
    {
        columns: ["Name", "Salary", "Sex"],
        data: [
            ["Johnson", 30000, "Male"],
            ["Monika", 355000, "Female"],
            ["Konstantina", 20000, "Female"],
            ["John", 250000, "Male"],
            ["Josef", 450500, "Male"],
        ]
    },
    {
        xSteps: 0, // Will start putting cell with 1 empty cell on left most
        ySteps: 0, //will put space of 5 rows,
        columns: ["Name", "Department"],
        data: [
            ["Johnson", "Finance"],
            ["Monika", "IT"],
            ["Konstantina", "IT Billing"],
            ["John", "HR"],
            ["Josef", "Testing"],
        ]
    }
];
const multiDataSet2 = [
  {
      columns: ["Headings", "Text Style", "Colors"],
      data: [
          [
              {value: "H1", style: {font: {sz: "24", bold: true}}},
              {value: "Bold", style: {font: {bold: true}}},
              {value: "Red", style: {fill: {patternType: "solid", fgColor: {rgb: "FFFF0000"}}}},
          ],
          [
              {value: "H2", style: {font: {sz: "18", bold: true}}},
              {value: "underline", style: {font: {underline: true}}},
              {value: "Blue", style: {fill: {patternType: "solid", fgColor: {rgb: "FF0000FF"}}}},
          ],
          [
              {value: "H3", style: {font: {sz: "14", bold: true}}},
              {value: "italic", style: {font: {italic: true}}},
              {value: "Green", style: {fill: {patternType: "solid", fgColor: {rgb: "FF00FF00"}}}},
          ],
          [
              {value: "H4", style: {font: {sz: "12", bold: true}}},
              {value: "strike", style: {font: {strike: true}}},
              {value: "Orange", style: {fill: {patternType: "solid", fgColor: {rgb: "FFF86B00"}}}},
          ],
          [
              {value: "H5", style: {font: {sz: "10.5", bold: true}}},
              {value: "outline", style: {font: {outline: true}}},
              {value: "Yellow", style: {fill: {patternType: "solid", fgColor: {rgb: "FFFFFF00"}}}},
          ],
          [
              {value: "H6", style: {font: {sz: "7.5", bold: true}}},
              {value: "shadow", style: {font: {shadow: true}}},
              {value: "Light Blue", style: {fill: {patternType: "solid", fgColor: {rgb: "FFCCEEFF"}}}}
          ]
      ]
  }
];

function Download({ data }) {
  function transformToTable(data) {

  };

  return (
    <ExcelFile element={<Button size='sm'><i className="fas fa-download"></i></Button>}>
      <ExcelSheet dataSet={multiDataSet2} name="Organization"/>
    </ExcelFile>
  );
}

export default Download;