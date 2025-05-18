export const title = "Comparing RRL methods and adversarial search methods: game examples";
export const date = "2024-03-19";
export const slug = "rrl-vs-adversarial";
export const summary = "Miniature example to show the importance of understanding Problem Structure.";
export const content = `# Comparing RRL methods and adversarial search methods: game examples

### Why don't we use RRL to play 2048?

The operation of Reinforcement learning dependents heavily on repeated visits to states. For 2048, even if we know the "ground truth" (the probabilities), the state space is still too huge, and we will have an infinity amount of bellman equations. In this case, adversarial search is simply a better method. If we already know the game tree, therefore already know the best way to play, we don't NEED calculation. 

> **Learning is something we do only we have good amount of resources. (RRL summary: small # states with the need of a large # of visits.)**

### Why don't we use Adversarial search methods to play blackjack?

Adversarial search involves explicit lookahead, simulating future move trees with alternate player turns (like in chess or 2048). In Blackjack, this would mean simulating all possible card draws for the player and all possible dealer outcomes, which is computationally wasteful since we already know the dealer's fixed behavior and the card distribution. Instead, RL can implicitly learn expected values from these branches without building the whole tree.

**State space of Blackjack**

- Player's sum: 12–21 (since under 12 the optimal move is always \`hit\`)
- Dealer's visible card: 1–10 (Ace to 10)
- Usable ace: True/False (whether the player has an ace that can count as 11 without busting)

\`\`\`math
10 \\text{ (player sums)} \\times 10 \\text{ (dealer cards)} \\times 2 \\text{ (usable ace)} \\rightarrow 200 \\text{ total states}
\`\`\`

(Common simplified representation (like in Sutton & Barto's Reinforcement Learning book))

**State space in 2048** 

- Each tile can be: Empty (0), 2, 4, 8, … up to \`$2^{17} = 131072$\` (in extremely rare cases)
- Estimating the state space: Board size = \`$4 \\times 4 = 16$\` tiles
- Each tile can be in ~18 possible states (\`$\\log_2(131072) + 1 = 18$\`)

\`\`\`math
\\text{Upper bound on state space} = 18^{16} \\approx 1.3 \\times 10^{20} \\text{ possible states}
\`\`\`

(But many of these are unreachable due to gameplay constraints.)`; 