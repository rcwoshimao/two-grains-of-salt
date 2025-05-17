export const title = "Comparing RRL methods and adversarial search methods: game examples";
export const date = "2024-03-19";
export const slug = "ml-methods-comparison";
export const content = `# Comparing RRL methods and adversarial search methods: game examples

### Why don't we use RRL to play 2048?

The operation of Reinforcement learning dependents heavily on repeated visits to states. For 2048, even if we know the "ground truth" (the probabilities), the state space is still too huge, and we will have an infinity amount of bellman equations. In this case, adversarial search is simply a better method. If we already know the game tree, therefore already know the best way to play, we don't NEED calculation. 

> **Learning is something we do only we have good amount of resources. (RRL summary: small # states with the need of a large # of visits.)**

### Why don't we use Adversarial search methods to play blackjack?

Adversarial search involves explicit lookahead, simulating future move trees with alternate player turns (like in chess or 2048). In Blackjack, this would mean simulating all possible card draws for the player and all possible dealer outcomes, which is computationally wasteful since we already know the dealer's fixed behavior and the card distribution. Instead, RL can implicitly learn expected values from these branches without building the whole tree.

**State space of Blackjack**

- Player's sum: 12–21 (since under 12 the optimal move is always "hit")
- Dealer's visible card: 1–10 (Ace to 10)
- Usable ace: True/False (whether the player has an ace that can count as 11 without busting)

**10 (player sums) × 10 (dealer cards) × 2 (usable ace) → 200 total states**

(Common simplified representation (like in Sutton & Barto's Reinforcement Learning book))

**State space in 2048** 

- Each tile can be: Empty (0), 2, 4, 8, … up to 2¹⁷ = 131072 (in extremely rare cases)
- Estimating the state space: Board size = 4×4 = 16 tiles
- Each tile can be in ~18 possible states (log₂(131072) + 1 = 18)

**Upper bound on state space = 18¹⁶ ≈ 1.3 × 10²⁰ possible states**

(But many of these are unreachable due to gameplay constraints.)

# Supervised learning v.s. RRL: the difference

Q: Both SL and RRL are trained based on some input, learning the patterns, and giving an output. So what is the difference? 

A: They are very differenent. Supervised learning is done by direct input and labels, but RRL is trained based on a model-free environment on delated rewards. 

We can, however, think about SL as a special case of a very constrained RRL, that there's only one learning step per episode, the reward is given immediately after the action, and we are just trying to predict the correct action for a given state like a label. 

$$
\\text{Input (state)} → \\text{Output (action/label)} → \\text{Immediate reward (correct or not})
$$

This basically collapses into supervised learning: given pairs of \`(state, correct action)\`, trying to make a function/policy for it. 

But, gradient descent people can also say that SL is a special case of gradient descent…there are many ways and perspectives to see a certain concept.

> **💡 Anything can be everything.**

# Understanding the actual reason for current bottleneck in ML problem solving

May 14th, 2025 

To most people, the field of ML consists of two broad problems: algorithm and data. The algorithm side requires a good understanding of the problem we are trying to solve, and data side is currently facing a problem: big companies have exhausted all data sources on the internet(some purposed the solution of generating synthetic data), but we don't know if products are getting better. We are facing a bottleneck— it's like there's nothing more we can do, other than waiting for more data to be made. 

A common pitfall here is to think about those two fields as completely separate from each other, as algorithm people are supposed to create some "castle in the air", while the data people trying to fine tune it. Already, we need to amend the knowledge of those two fields. 

$$
\\text{Algorithm v.s. Data} \\rightarrow \\text{Algorithm} \\times \\text{Data}
$$

But even outside of that, we are missing a crucial aspect of problem solving- it is to ask ourselves about an understanding of the **problem structure**.  

So it's more like: 

$$
\\text{Algorithm} \\times \\text{Data} \\times \\text{Problem Structure}
$$

People, in general, don't talk about this; but it's actually very important, and not many are putting an effort into exploring it, at least not as much as algorithm and data. Take this example: Blackjack and Go have very different MDPs as environmental setups. This means finding the optimal policy (or way to play the game) for those two games will look ***very*** different. 

People have at least realized that there are no generic algorithm that is "the answer"; Conquering important problems need vertical integration, and some sort of "**algorithm specific domain knowledge**": Sure, we do need field-specific domain knowledge unrelated to the model, but that only comes after the problem itself has been structured; before that,  we need people who can find out what algorithm is the best for the specific field. 

**Thus, our generation's task is to foster a deeper appreciation for the importance of identifying the right problem structure.**`; 