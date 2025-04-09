import React from "react";

const TicketLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <h2>Tickets</h2>
      {children}
    </>
  );
};

export default TicketLayout;
