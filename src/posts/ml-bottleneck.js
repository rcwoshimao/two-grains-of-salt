export const title = "Understanding the actual reason for current bottleneck in ML problem solving";
export const date = "2024-03-19";
export const slug = "ml-bottleneck";
export const content = `# Understanding the actual reason for current bottleneck in ML problem solving

To most people, the field of ML consists of two broad problems: algorithm and data. The algorithm side requires a good understanding of the problem we are trying to solve, and data side is currently facing a problem: big companies have exhausted all data sources on the internet(some purposed the solution of generating synthetic data), but we don't know if products are getting better. We are facing a bottleneck— it's like there's nothing more we can do, other than waiting for more data to be made. 

A common pitfall here is to think about those two fields as completely separate from each other, as algorithm people are supposed to create some "castle in the air", while the data people trying to fine tune it. Already, we need to amend the knowledge of those two fields. 

\`\`\`math
\\text{Algorithm v.s. Data} \\rightarrow \\text{Algorithm} \\times \\text{Data}
\`\`\`

But even outside of that, we are missing a crucial aspect of problem solving- it is to ask ourselves about an understanding of the **problem structure**.  

So it's more like: 

\`\`\`math
\\text{Algorithm} \\times \\text{Data} \\times \\text{Problem Structure}
\`\`\`

People, in general, don't talk about this; but it's actually very important, and not many are putting an effort into exploring it, at least not as much as algorithm and data. Take this example: Blackjack and Go have **very** different MDPs as environmental setups. This means finding the optimal policy (or way to play the game) for those two games will look ***very*** different.

We have at least realized that there are no generic algorithm that is "the answer"; Conquering important problems need vertical integration, and some sort of "algorithm specific domain knowledge": Sure, we do need field-specific domain knowledge unrelated to the model, but that only comes after the problem itself has been structured; before that,  we need people who can find out what algorithm is the best for the specific field. 

![ML Problem Solving Steps](ml-bottleneck1.png "A systematic approach to ML problem solving, showing the importance of understanding problem structure")

Thus, our generation's task is to foster a deeper appreciation for the importance of identifying the right problem structure.
`; 