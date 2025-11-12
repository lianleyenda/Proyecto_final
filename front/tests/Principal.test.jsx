import { render, screen, fireEvent } from "@testing-library/react";
import Inicio from "../componetes/principal";

describe(<Inicio />, () => {
  test("Render del componenete", () => {
    render(<Inicio />);
  });
});
