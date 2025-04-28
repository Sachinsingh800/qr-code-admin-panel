import React from "react";
import QRTable from "../QRTable/QRTable";
import FileQRTable from "../FileQRTable/FileQRTable";
import Header from "../Header/Header";

function Detail() {
  return (
    <div>
      <Header />
      <br />
      <QRTable />
      <br />
      <FileQRTable />
    </div>
  );
}

export default Detail;
