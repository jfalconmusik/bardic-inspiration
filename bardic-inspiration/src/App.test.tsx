import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders learn react link", () => {
  // render(<App />, { store: {}, persistor: {} });
  // const linkElement = screen.getByText(/learn react/i);
  expect(screen.getByTestId("root")).toBeInTheDocument();
});
