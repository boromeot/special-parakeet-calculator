import { ACTIONS } from "./App"

export function Opperand({ symbol, dispatch }) {
  return (
    <button
      onClick={() => dispatch({ type: ACTIONS.APPEND, payload: { symbol }})}
    >
      {symbol}
    </button>
  ) 
}

export function Opperator({ symbol, dispatch }) {
  return (
    <button
      onClick={() => dispatch({ type: ACTIONS.OPPERATE, payload: { symbol }})}
    >
      {symbol}
    </button>
  )
}

export function Parentheses({ symbol, dispatch }) {
  return (
    <button
      onClick={() => dispatch({ type: ACTIONS.PAREN, payload: { symbol }})}
    >
      { symbol }
    </button>
  )
}

export function Clear({ symbol, dispatch }) {
  return (
    <button
      onClick={() => dispatch({ type: ACTIONS.CLEAR, payload: { symbol }})}
    >
      {symbol}
    </button>
  )
}

export function ClearEntry({ symbol, dispatch }) {
  return (
    <button
      onClick={() => dispatch({ type: ACTIONS.CLEAR_ENTRY, payload: { symbol }})}
    >
      {symbol}
    </button>
  )
}

export function Del({ symbol, dispatch }) {
  return (
    <button
      onClick={() => dispatch({ type: ACTIONS.DEL, payload: { symbol }})}
    >
      {symbol}
    </button>
  )
}

export function Decimal({ symbol, dispatch }) {
  return (
    <button
      onClick={() => dispatch({ type: ACTIONS.DECIMAL, payload: { symbol }})}
    >
      {symbol}
    </button>
  ) 
}

export function Equals({ symbol, dispatch }) {
  return (
    <button
      onClick={() => dispatch({ type: ACTIONS.EVALUATE, payload: { symbol }})}
    >
      {symbol}
    </button>
  ) 
}
