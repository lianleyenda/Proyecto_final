// tests/Login.test.jsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../componetes/Login";
import { MemoryRouter } from "react-router-dom";
import { CarritoProvider } from "../componentes/carritocontext";

// Mock de fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ usuario: { Usuario: "Valentin", rol: "usuario" } }),
  })
);

// Mock de useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Login Component", () => {
  beforeEach(() => {
    fetch.mockClear();
    mockNavigate.mockClear();
    localStorage.clear();
  });

  test("se renderiza correctamente", () => {
    render(
      <CarritoProvider>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </CarritoProvider>
    );

    expect(screen.getByPlaceholderText(/Correo/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Contraseña/i)).toBeInTheDocument();
    expect(screen.getByText(/Ingresar/i)).toBeInTheDocument();
  });

  test("muestra error si el email no es Gmail", async () => {
    render(
      <CarritoProvider>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </CarritoProvider>
    );

    fireEvent.change(screen.getByPlaceholderText(/Correo/i), { target: { value: "test@hotmail.com" } });
    fireEvent.change(screen.getByPlaceholderText(/Contraseña/i), { target: { value: "1234" } });

    fireEvent.click(screen.getByText(/Ingresar/i));

    expect(await screen.findByText(/El correo debe ser un Gmail válido/i)).toBeInTheDocument();
  });

  test("envía datos correctamente y guarda en localStorage", async () => {
    render(
      <CarritoProvider>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </CarritoProvider>
    );

    fireEvent.change(screen.getByPlaceholderText(/Correo/i), { target: { value: "usuario@gmail.com" } });
    fireEvent.change(screen.getByPlaceholderText(/Contraseña/i), { target: { value: "1234" } });

    fireEvent.click(screen.getByText(/Ingresar/i));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    // Verifica que localStorage se actualizó
    expect(localStorage.getItem("Email")).toBe(JSON.stringify("usuario@gmail.com"));
    expect(localStorage.getItem("Usuario")).toBe(JSON.stringify("Valentin"));
    expect(localStorage.getItem("Rol")).toBe(JSON.stringify("usuario"));

    // Verifica que navigate se llamó
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/inicio"));
  });
});
