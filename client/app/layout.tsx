import React from "react";
import StyledComponentsRegistry from "../lib/AntdRegistry";
import Image from "next/image";

import "../styles/styles.scss";

export const metadata = {
  title: "Check24 Craftsmen Finder",
  description: "Find the best craftsmen in your area",
};

const RootLayout = ({ children }: React.PropsWithChildren) => {


  return (
    <html lang="en" className="root">
      <body className="body">
        <header className="header">
          <Image
            className="image"
            src="/check24Logo.svg"
            alt="Logo"
            width={150}
            height={60}
          />
        </header>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
};

export default RootLayout;
