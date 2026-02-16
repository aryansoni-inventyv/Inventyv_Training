import { ChangeDetectionStrategy, Component } from "@angular/core";

import type { ICellRendererAngularComp } from "ag-grid-angular";
import { AgGridAngular } from "ag-grid-angular";
import type {
  ColDef,
  ICellRendererParams,
  RowSelectionMode,
  RowSelectionOptions,
  ValueGetterParams,
} from "ag-grid-community";
import { themeQuartz } from "ag-grid-community";


const myTheme = themeQuartz.withParams({
    /* Low spacing = very compact */
    spacing: 10, 
    /* Changes the colour of the grid text */
    foregroundColor: 'rgb(14, 68, 145)',
    /* Changes the colour of the grid background */
    backgroundColor: 'rgb(241, 247, 255)',
    /* Changes the header colour of the top row */
    headerBackgroundColor: 'rgb(228, 237, 250)',
    /* Changes the hover colour of the row*/
    rowHoverColor: 'rgb(216, 226, 255)',
});



interface IRow{
  make: string;
  model: string;
  price: number;
  electric: boolean;
}


@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<button (click)="buttonClicked()">Push Me!</button>`,
})
export class CustomButtonComponent implements ICellRendererAngularComp {
  agInit(params: ICellRendererParams): void {}
  refresh(params: ICellRendererParams) {
    return true;
  }
  buttonClicked() {
    console.log("clicked");
  }
}

@Component({
  selector: 'app-ag-grid',
  standalone: true, 
  imports: [AgGridAngular],
  templateUrl: './ag-grid.html',
  styleUrl: './ag-grid.css',
})
export class AgGrid {
  rowData: any[] | null = [
    {
      make: "Tesla",
      model: "Model Y",
      price: 64950,
      electric: true,
      month: "June",
    },
    {
      make: "Ford",
      model: "F-Series",
      price: 33850,
      electric: false,
      month: "October",
    },
    {
      make: "Toyota",
      model: "Corolla",
      price: 29600,
      electric: false,
      month: "August",
    },
    {
      make: "Mercedes",
      model: "EQA",
      price: 48890,
      electric: true,
      month: "February",
    },
    {
      make: "Fiat",
      model: "500",
      price: 15774,
      electric: false,
      month: "January",
    },
    {
      make: "Nissan",
      model: "Juke",
      price: 20675,
      electric: false,
      month: "March",
    },
    {
      make: "Vauxhall",
      model: "Corsa",
      price: 18460,
      electric: false,
      month: "July",
    },
    {
      make: "Volvo",
      model: "EX30",
      price: 33795,
      electric: true,
      month: "September",
    },
    {
      make: "Mercedes",
      model: "Maybach",
      price: 175720,
      electric: false,
      month: "December",
    },
    {
      make: "Vauxhall",
      model: "Astra",
      price: 25795,
      electric: false,
      month: "April",
    },
    {
      make: "Fiat",
      model: "Panda",
      price: 13724,
      electric: false,
      month: "November",
    },
    {
      make: "Jaguar",
      model: "I-PACE",
      price: 69425,
      electric: true,
      month: "May",
    },
    {
      make: "Tesla",
      model: "Model Y",
      price: 64950,
      electric: true,
      month: "June",
    },
    {
      make: "Ford",
      model: "F-Series",
      price: 33850,
      electric: false,
      month: "October",
    },
    {
      make: "Toyota",
      model: "Corolla",
      price: 29600,
      electric: false,
      month: "August",
    },
    {
      make: "Mercedes",
      model: "EQA",
      price: 48890,
      electric: true,
      month: "February",
    },
    {
      make: "Fiat",
      model: "500",
      price: 15774,
      electric: false,
      month: "January",
    },
    {
      make: "Nissan",
      model: "Juke",
      price: 20675,
      electric: false,
      month: "March",
    },
    {
      make: "Vauxhall",
      model: "Corsa",
      price: 18460,
      electric: false,
      month: "July",
    },
    {
      make: "Volvo",
      model: "EX30",
      price: 33795,
      electric: true,
      month: "September",
    },
    {
      make: "Mercedes",
      model: "Maybach",
      price: 175720,
      electric: false,
      month: "December",
    },
    {
      make: "Vauxhall",
      model: "Astra",
      price: 25795,
      electric: false,
      month: "April",
    },
    {
      make: "Fiat",
      model: "Panda",
      price: 13724,
      electric: false,
      month: "November",
    },
    {
      make: "Jaguar",
      model: "I-PACE",
      price: 69425,
      electric: true,
      month: "May",
    },
    {
      make: "Tesla",
      model: "Model Y",
      price: 64950,
      electric: true,
      month: "June",
    },
    {
      make: "Ford",
      model: "F-Series",
      price: 33850,
      electric: false,
      month: "October",
    },
    {
      make: "Toyota",
      model: "Corolla",
      price: 29600,
      electric: false,
      month: "August",
    },
    {
      make: "Mercedes",
      model: "EQA",
      price: 48890,
      electric: true,
      month: "February",
    },
    {
      make: "Fiat",
      model: "500",
      price: 15774,
      electric: false,
      month: "January",
    },
    {
      make: "Nissan",
      model: "Juke",
      price: 20675,
      electric: false,
      month: "March",
    },
    {
      make: "Vauxhall",
      model: "Corsa",
      price: 18460,
      electric: false,
      month: "July",
    },
    {
      make: "Volvo",
      model: "EX30",
      price: 33795,
      electric: true,
      month: "September",
    },
    {
      make: "Mercedes",
      model: "Maybach",
      price: 175720,
      electric: false,
      month: "December",
    },
    {
      make: "Vauxhall",
      model: "Astra",
      price: 25795,
      electric: false,
      month: "April",
    },
    {
      make: "Fiat",
      model: "Panda",
      price: 13724,
      electric: false,
      month: "November",
    },
    {
      make: "Jaguar",
      model: "I-PACE",
      price: 69425,
      electric: true,
      month: "May",
    },
  ];

  public theme = myTheme;

  // Column Definitions: Defines & controls grid columns.
  columnDefs: ColDef[] = [
    {
      field: "make",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: [
          "Tesla",
          "Ford",
          "Toyota",
          "Mercedes",
          "Fiat",
          "Nissan",
          "Vauxhall",
          "Volvo",
          "Jaguar",
        ],
      },
    },
    { field: "model" },
    { field: "price", filter: "agNumberColumnFilter" },
    { field: "electric" },
    {
      field: "month",
      comparator: (valueA, valueB) => {
        const months = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        const idxA = months.indexOf(valueA);
        const idxB = months.indexOf(valueB);
        return idxA - idxB;
      },
    },
  ];


 rowSelection : RowSelectionOptions  = {
  mode: 'multiRow',
  headerCheckbox: true
 };

 defaultColDef: ColDef = {
    filter: "agTextColumnFilter",
    floatingFilter: true,
  };

  paginationPageSize = 10;
  paginationPageSizeSelector: number[] | boolean = [10, 25, 50];

}
