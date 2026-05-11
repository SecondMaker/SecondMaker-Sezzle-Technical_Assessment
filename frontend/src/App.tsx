import { useState, type FormEvent } from "react";
import { calculate } from "./api";
import "./App.css";

export default function App() {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const operations = {
    "add": "+",
    "sub": "−",
    "mul": "×",
    "div": "÷",
    "pow": "^",
    "sqrt": "√",
    "pct": "%",
  };

  const handleNumber = (num: string) => {
    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
    setError("");
  };

  const handleDecimal = () => {
    if (waitingForNewValue) {
      setDisplay("0.");
      setWaitingForNewValue(false);
    } else if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const handleOperation = async (op: string) => {
    if (op === "sqrt") {
      try {
        setLoading(true);
        const result = await calculate({ operation: "sqrt", a: parseFloat(display), b: 0 });
        if (result.error) throw new Error(result.error);
        setDisplay(String(result.result));
        setError("");
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    } else if (op === "pct") {
      try {
        setLoading(true);
        const result = await calculate({ operation: "pct", a: parseFloat(display), b: 1 });
        if (result.error) throw new Error(result.error);
        setDisplay(String(result.result));
        setError("");
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    } else if (previousValue && operation && !waitingForNewValue) {
      try {
        setLoading(true);
        const result = await calculate({
          operation,
          a: parseFloat(previousValue),
          b: parseFloat(display),
        });
        if (result.error) throw new Error(result.error);
        setDisplay(String(result.result));
        setPreviousValue(String(result.result));
        setOperation(op);
        setWaitingForNewValue(true);
        setError("");
      } catch (err: any) {
        setError(err.message);
        setPreviousValue(null);
        setOperation(null);
      } finally {
        setLoading(false);
      }
    } else {
      setPreviousValue(display);
      setOperation(op);
      setWaitingForNewValue(true);
    }
  };

  const handleEquals = async () => {
    if (previousValue && operation) {
      try {
        setLoading(true);
        const result = await calculate({
          operation,
          a: parseFloat(previousValue),
          b: parseFloat(display),
        });
        if (result.error) throw new Error(result.error);
        setDisplay(String(result.result));
        setPreviousValue(null);
        setOperation(null);
        setWaitingForNewValue(true);
        setError("");
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
    setError("");
  };

  const handleClearEntry = () => {
    setDisplay("0");
    setError("");
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay("0");
    }
  };

  const handlePlusMinus = () => {
    setDisplay(String(parseFloat(display) * -1));
  };

  const handleReciprocal = async () => {
    try {
      setLoading(true);
      const result = await calculate({ operation: "div", a: 1, b: parseFloat(display) });
      if (result.error) throw new Error(result.error);
      setDisplay(String(result.result));
      setError("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSquare = async () => {
    try {
      setLoading(true);
      const result = await calculate({ operation: "pow", a: parseFloat(display), b: 2 });
      if (result.error) throw new Error(result.error);
      setDisplay(String(result.result));
      setError("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const Button = ({ 
    label, 
    onClick, 
    className = "", 
    disabled = false 
  }: { 
    label: string; 
    onClick: () => void; 
    className?: string;
    disabled?: boolean;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`calc-button ${className}`}
    >
      {label}
    </button>
  );

  return (
    <div className="calculator">
      <div className="calculator-header">
        {/* <div className="hamburger-menu">☰</div> */}
        <div className="history-icon">🕐</div>
        <div className="calculator-mode">Calculator</div>
      </div>
      
      <div className="calculator-display">
        <div className="display-expression">
          {previousValue && operation ? `${previousValue} ${operations[operation as keyof typeof operations] || operation}` : ""}
        </div>
        <div className="display-value">{loading ? "..." : display}</div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="memory-buttons">
        {/* {["MC", "MR", "M+", "M−", "MS", "M⌄"].map((btn) => (
          <Button key={btn} label={btn} onClick={() => {}} className="memory" disabled />
        ))} */}
      </div>

      <div className="calculator-grid">
        <Button label="%" onClick={() => handleOperation("pct")} className="function" />
        <Button label="CE" onClick={handleClearEntry} className="function" />
        <Button label="C" onClick={handleClear} className="function" />
        <Button label="⌫" onClick={handleBackspace} className="function" />

        <Button label="¹/ₓ" onClick={handleReciprocal} className="function" />
        <Button label="x²" onClick={handleSquare} className="function" />
        <Button label="²√x" onClick={() => handleOperation("sqrt")} className="function" />
        <Button label="÷" onClick={() => handleOperation("div")} className="operator" />

        <Button label="7" onClick={() => handleNumber("7")} />
        <Button label="8" onClick={() => handleNumber("8")} />
        <Button label="9" onClick={() => handleNumber("9")} />
        <Button label="×" onClick={() => handleOperation("mul")} className="operator" />

        <Button label="4" onClick={() => handleNumber("4")} />
        <Button label="5" onClick={() => handleNumber("5")} />
        <Button label="6" onClick={() => handleNumber("6")} />
        <Button label="−" onClick={() => handleOperation("sub")} className="operator" />

        <Button label="1" onClick={() => handleNumber("1")} />
        <Button label="2" onClick={() => handleNumber("2")} />
        <Button label="3" onClick={() => handleNumber("3")} />
        <Button label="+" onClick={() => handleOperation("add")} className="operator" />

        <Button label="+/−" onClick={handlePlusMinus} />
        <Button label="0" onClick={() => handleNumber("0")} />
        <Button label="," onClick={handleDecimal} />
        <Button label="=" onClick={handleEquals} className="equals" />
      </div>
    </div>
  );
}