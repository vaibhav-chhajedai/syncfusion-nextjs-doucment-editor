// app/_components/SyncfusionDemo.tsx
"use client";

import * as React from "react";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Inject,
  Page,
} from "@syncfusion/ej2-react-grids";
import { DataManager, Query } from "@syncfusion/ej2-data";

type Order = { OrderID: number; CustomerName: string; Freight: number; City: string };

const data: Order[] = [
  { OrderID: 10248, CustomerName: "Paul Henriot", Freight: 32.38, City: "Reims" },
  { OrderID: 10249, CustomerName: "Karin Josephs", Freight: 11.61, City: "Münster" },
  { OrderID: 10250, CustomerName: "Mario Pontes", Freight: 65.83, City: "Rio" },
];

export default function SyncfusionDemo() {
  const dm = new DataManager(data);
  const query = new Query();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ButtonComponent cssClass="e-primary">Syncfusion Button</ButtonComponent>
      </div>

      <GridComponent dataSource={dm} query={query} allowPaging height={300}>
        <ColumnsDirective>
          <ColumnDirective field="OrderID" headerText="Order ID" width="120" textAlign="Right" />
          <ColumnDirective field="CustomerName" headerText="Customer" width="200" />
          <ColumnDirective field="City" headerText="City" width="140" />
          <ColumnDirective field="Freight" headerText="Freight" format="C2" textAlign="Right" width="120" />
        </ColumnsDirective>
        <Inject services={[Page]} />
      </GridComponent>
    </div>
  );
}
