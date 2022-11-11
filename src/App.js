import './App.css';
import { useReducer } from 'react';
import { evaluate, pi } from 'mathjs';

function Opperand({ symbol, dispatch }) {
  return (
    <button
      onClick={() => dispatch({ type: ACTIONS.APPEND, payload: { symbol }})}
    >
      {symbol}
    </button>
  ) 
}

function Opperator({ symbol, dispatch }) {
  return (
    <button
      onClick={() => dispatch({ type: ACTIONS.OPPERATE, payload: { symbol }})}
    >
      {symbol}
    </button>
  )
}

function Parentheses({ symbol, dispatch }) {
  return (
    <button
      onClick={() => dispatch({ type: ACTIONS.PAREN, payload: { symbol }})}
    >
      { symbol }
    </button>
  )
}

function Clear({ symbol, dispatch }) {
  return (
    <button
      onClick={() => dispatch({ type: ACTIONS.CLEAR, payload: { symbol }})}
    >
      {symbol}
    </button>
  )
}

function ClearEntry({ symbol, dispatch }) {
  return (
    <button
      onClick={() => dispatch({ type: ACTIONS.CLEAR_ENTRY, payload: { symbol }})}
    >
      {symbol}
    </button>
  )
}

function Del({ symbol, dispatch }) {
  return (
    <button
      onClick={() => dispatch({ type: ACTIONS.DEL, payload: { symbol }})}
    >
      {symbol}
    </button>
  )
}

function Decimal({ symbol, dispatch }) {
  return (
    <button
      onClick={() => dispatch({ type: ACTIONS.DECIMAL, payload: { symbol }})}
    >
      {symbol}
    </button>
  ) 
}

function Equals({ symbol, dispatch }) {
  return (
    <button
      onClick={() => dispatch({ type: ACTIONS.EVALUATE, payload: { symbol }})}
    >
      {symbol}
    </button>
  ) 
}

const ACTIONS = {
  APPEND : 'append',
  OPPERATE : 'opperate',
  CLEAR : 'clear',
  CLEAR_ENTRY : 'clear_entry',
  DEL : 'del',
  EVALUATE: 'evaluate',
  PAREN : 'paren',
  DECIMAL : 'decimal',
};

const OPERATORS = new Set(['+', '-', '/', '*']);

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.APPEND: {
      return {
        ...state,
        res: [...state.res, payload.symbol]
      }
    }
    case ACTIONS.OPPERATE: {
      const newState = {...state, decimalCount:0, res:[]}
      let input = [...state.input, ...state.res, payload.symbol];
      if (state.res.length === 0) {
        if (OPERATORS.has(state.input.at(-1))) { // If input ending with valid operator
          newState['input'] = [...state.input.slice(0, state.input.length -1), payload.symbol]; // Modify the last operator inplace
          return newState;
        } 
        if (state.input.at(-1) === ')') {
          newState['input'] = [...state.input, payload.symbol];
          return newState;
        } 
        newState['input'] = [...state.input];
        return newState;
      }

      if (state.res.length === 1 && state.res[0] === '.') { // If res is just a singluar '.'
        newState['input'] = [...state.input, 0, payload.symbol]; // change res to 0 then append
        return newState;
      }

      if (state.input.at(-1) === ')' && state.res.length > 0 ) { // If input has trailing ')' and res has an input 
        newState['input'] = [...state.input, '*', ...state.res, payload.symbol]; // append an '*' 
        return newState;
      }

      return {
        ...state,
        input,
        decimalCount: 0,
        res: []
      }
    }
    case ACTIONS.CLEAR:
      return {
        ...state,
        input: [],
        res: [],
        openParenCount : 0,
        decimalCount: 0,
      }
    case ACTIONS.CLEAR_ENTRY:
      return {
        ...state,
        res: [],
        decimalCount: 0,
      }
    case ACTIONS.DEL: {
      let decimalCount = state.decimalCount;
      if (state.res.at(-1) === '.') {
        decimalCount--;
      }
      return {
        ...state,
        decimalCount,
        res: state.res.slice(0, state.res.length -1)
      }
    }
    case ACTIONS.PAREN: {
      let newState = {...state, decimalCount:0}
      let input = state.input.slice();
      let res = state.res.slice();
      let openParenCount = state.openParenCount;
      let decimalCount = 0;
      if (payload.symbol === ')' && state.openParenCount <= 0) {
        return state;
      }

      if (payload.symbol === ')' && state.res.length > 0) { // If ')' && res has something
        openParenCount--;
        newState['res'] = [];
        if (state.input.at(-1) === ')') {
          newState['input'] = [...state.input, '*', ...state.res, payload.symbol];
          return newState;
        }
        newState['input'] = [...state.input, ...state.res, payload.symbol];
        return newState;
      }

      if (payload.symbol === '(') {
        if (state.res.length > 0 || state.input.at(-1) === ')') {
          if (state.res.length === 1 && state.res[0] === '.') {
            input = [...state.input, 0, '*', payload.symbol];
          } else if (state.res.at(-1) === '.') {
            input = [...state.input, state.res.slice(0, state.res.length - 1), '*', payload.symbol];
          } else {
            input = [...state.input, ...state.res, '*', payload.symbol];
          }
          res = [];
        } else {
          input = [...state.input, payload.symbol];
        }
        openParenCount++;
      }
      return {
        ...state,
        input,
        res,
        openParenCount,
        decimalCount
      }
    }
    case ACTIONS.DECIMAL: {
      if (state.decimalCount <= 0) {
        return {
          ...state,
          decimalCount: 1,
          res: [...state.res, payload.symbol]
        }
      }
      return state;
    }
    case ACTIONS.EVALUATE: {
      let number = evaluate([...state.input, ...state.res].join(''));
      let res = String(number).split('');
      return {
        ...state,
        input : [],
        res
      }
    }
    default:
      return state;
  }
}

function Calculator() {
  const [{ input, res }, dispatch] = useReducer(reducer, {input: [], res: [], openParenCount: 0, decimalCount: 0});

  return (
    <div className='calculator'>
      <div className='display'>
        <div className='input'>{ input.join('') }</div>
        <div className='res'>{ res.join('') }</div>
      </div>
      <button></button>
      <ClearEntry symbol={'CE'} dispatch={dispatch} />
      <Clear symbol={'C'} dispatch={dispatch} />
      <Del symbol={'⌫'} dispatch={dispatch} />
      <Opperator symbol={'^'} dispatch={dispatch} />
      <Parentheses symbol={'('} dispatch={dispatch} />
      <Parentheses symbol={')'} dispatch={dispatch} />
      <Opperator symbol={'/'} dispatch={dispatch} />
      <Opperand symbol={7} dispatch={dispatch} />
      <Opperand symbol={8} dispatch={dispatch} />
      <Opperand symbol={9} dispatch={dispatch} />
      <Opperator symbol={'*'} dispatch={dispatch} />
      <Opperand symbol={4} dispatch={dispatch} />
      <Opperand symbol={5} dispatch={dispatch} />
      <Opperand symbol={6} dispatch={dispatch} />
      <Opperator symbol={'-'} dispatch={dispatch} />
      <Opperand symbol={1} dispatch={dispatch} />
      <Opperand symbol={2} dispatch={dispatch} />
      <Opperand symbol={3} dispatch={dispatch} />
      <Opperator symbol={'+'} dispatch={dispatch} />
      <button></button>
      <Opperand symbol={0} dispatch={dispatch} />
      <Decimal symbol={'.'} dispatch={dispatch} />
      <Equals symbol={'='} dispatch={dispatch} />
    </div>
  )
}

function App() {
  return (
    <div className="App">
      <Calculator />
    </div>
  );
}

export default App;
