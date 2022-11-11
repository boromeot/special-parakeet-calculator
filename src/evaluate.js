export default function evaluate(s) {
    const calc = (i = 0) => {
        // Store calculation in progress
        // We use "prev" instead of a stack since we only ever need to inspect
        // the previous value in the stack, every other value can be simply
        // added to the result
        let result = 0;
        let num = 0;
        let prev = 0;
        let op = '+';
        
        for(; i < s.length; i++) {
            const c = s[i];

            // Simple numbers
            if(!isNaN(c)) {
                num = num * 10 + parseInt(c);
            } 
            
            // Symbols OR we have reached the end of the string
            if(isNaN(c) || i === s.length-1) {
                // Recurse for open brackets
                if(c === '(') {
                    // Need to skip i forward
                    // We're also discarding contents of num since otherwise 
                    // this would be an invalid calculation
                    ({num, i} = calc(i+1));
                }

                // Handle standard operations
                if(op === '+') {
                    // Equivalent to stack.push(num)
                    result += prev;
                    prev = num;
                } else if (op === '-') {
                    // Equivalent to stack.push(-num)
                    result += prev;
                    prev = -num;
                } else if (op === '/') {
                    // Equivalent to stack.push(Math.trunc(stack.pop() / num))
                    prev = prev / num;
                    // prev = Math.trunc(prev / num);
                } else if (op === '*') {
                    // Equivalent to stack.push(stack.pop() * num)
                    prev = prev * num;
                }
                num = 0;
                op = c;
                
                // Exit recursive operation when closing brackets are detected
                // Note that we add a level of recursion each time an open bracket
                // is detected, making this a guaranteed safe operation. 
                if(c === ')') {
                    return {i, num: result+prev};
                }
            }
        }
        return result + prev;
    }
    
    return String(calc());
};