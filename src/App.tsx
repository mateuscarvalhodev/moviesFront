import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <div className="bg-brand text-fg p-4 rounded-lg">Cor da marca</div>
      <div className="bg-purple-9 text-mauve-1 p-4 rounded-lg">Contraste</div>
      <p className="text-muted">Texto secundário</p>
      <div className="card"></div>
    </>
  );
}

export default App;
