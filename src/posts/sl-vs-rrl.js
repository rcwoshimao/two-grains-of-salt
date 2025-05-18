export const title = "Supervised learning v.s. RRL: the difference";
export const date = "2024-03-19";
export const slug = "sl-vs-rrl";
export const summary = "Everything can be anything.";
export const content = `# Supervised learning v.s. RRL: the difference

Q: Both SL and RRL are trained based on some input, learning the patterns, and giving an output. So what is the difference? 

A: They are very differenent. Supervised learning is done by direct input and labels, but RRL is trained based on a model-free environment on delated rewards. 

We can, however, think about SL as a special case of a very constrained RRL, that there's only one learning step per episode, the reward is given immediately after the action, and we are just trying to predict the correct action for a given state like a label. 

\`\`\`math
\\text{Input (state)} \\rightarrow \\text{Output (action/label)} \\rightarrow \\text{Immediate reward (correct or not)}
\`\`\`

This basically collapses into supervised learning: given pairs of \`(state, correct action)\`, trying to make a function/policy for it. 

But, gradient descent people can also say that SL is a special case of gradient descent…there are many ways and perspectives to see a certain concept.

> **💡 Everything can be anything.**`; 