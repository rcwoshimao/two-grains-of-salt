export const title = "The Math Behind Dynamic Programming: Fibonacci Sequence";
export const date = "2024-03-21";
export const slug = "dynamic-programming-proof";
export const hidden = true;
export const content = `# The Math Behind Dynamic Programming: Fibonacci Sequence

Have you ever wondered why dynamic programming solutions are correct? Let's explore this through everyone's favorite sequence: Fibonacci numbers!

### The Problem

The Fibonacci sequence is defined recursively as:

\`$F_n = F_{n-1} + F_{n-2}$\` where \`$F_0 = 0$\` and \`$F_1 = 1$\`

A naive recursive implementation would look like:

\`\`\`python
def fib_recursive(n):
    if n <= 1:
        return n
    return fib_recursive(n-1) + fib_recursive(n-2)
\`\`\`

But this has a time complexity of \`$O(2^n)$\` because each call branches into two more calls.

### The Dynamic Programming Solution

Here's the optimized version:

\`\`\`python
def fib_dp(n):
    if n <= 1:
        return n
    
    dp = [0] * (n + 1)
    dp[1] = 1
    
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    
    return dp[n]
\`\`\`

This runs in \`$O(n)$\` time. But why is it correct?

### The Mathematical Proof

Let's prove that our DP solution gives the same results as the recursive definition using induction.

**Base Cases:**
- For \`$n = 0$\`: dp[0] = 0 = \`$F_0$\`
- For \`$n = 1$\`: dp[1] = 1 = \`$F_1$\`

**Inductive Step:**
Assume dp[k] = \`$F_k$\` for all k < n. Then:

\`\`\`math
\\begin{align*}
dp[n] &= dp[n-1] + dp[n-2] \\\\
&= F_{n-1} + F_{n-2} \\text{ (by inductive hypothesis)} \\\\
&= F_n \\text{ (by definition of Fibonacci)}
\\end{align*}
\`\`\`

Therefore, by mathematical induction, dp[n] = \`$F_n$\` for all n ≥ 0.

### Time Complexity Analysis

The time complexity improvement comes from storing intermediate results. Let's visualize the number of operations:

\`\`\`math
\\text{Operations in recursive} = 2^n \\text{ (branching factor of 2, depth of n)}
\`\`\`

\`\`\`math
\\text{Operations in DP} = n \\text{ (one operation per number up to n)}
\`\`\`

For n = 100:
- Recursive: \`$2^{100} \\approx 1.27 \\times 10^{30}$\` operations
- DP: 100 operations

### Bonus: Matrix Form

There's an even faster way using matrix exponentiation! The Fibonacci sequence can be represented as:

\`\`\`math
\\begin{bmatrix} F_{n+1} \\\\ F_n \\end{bmatrix} = 
\\begin{bmatrix} 1 & 1 \\\\ 1 & 0 \\end{bmatrix}^n
\\begin{bmatrix} 1 \\\\ 0 \\end{bmatrix}
\`\`\`

This leads to an \`$O(\\log n)$\` solution:

\`\`\`python
def fib_matrix(n):
    if n <= 1:
        return n
        
    def matrix_multiply(A, B):
        return [
            [A[0][0]*B[0][0] + A[0][1]*B[1][0], A[0][0]*B[0][1] + A[0][1]*B[1][1]],
            [A[1][0]*B[0][0] + A[1][1]*B[1][0], A[1][0]*B[0][1] + A[1][1]*B[1][1]]
        ]
        
    def matrix_power(M, p):
        if p == 0:
            return [[1,0],[0,1]]
        if p == 1:
            return M
        if p % 2 == 0:
            temp = matrix_power(M, p//2)
            return matrix_multiply(temp, temp)
        return matrix_multiply(M, matrix_power(M, p-1))
    
    base = [[1,1],[1,0]]
    result = matrix_power(base, n-1)
    return result[0][0]
\`\`\`

This is why math is beautiful - it helps us transform an exponential problem into a logarithmic one!

> **💡 Key Insight**: Dynamic programming trades space for time by storing intermediate results, while mathematical insights like the matrix form can sometimes eliminate the need for storage altogether.`; 