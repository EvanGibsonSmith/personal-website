---
title: Clue Solver
layout: blogLayout.html
---

# Clue Solver

Similar to the [bananagrams solver](/bananagrams_solver/), I wanted to make a solver for a game where I thought I could do better. In this case, I thought an interesting problem to solve would be the best "note taking" strategy in clue. I always tried to come up with clever ways to keep track of everything in clue, but have ultimately given up in lieu of coding it! This project was done entirely in Java.

Clue (or Cluedo) is a strategy and deduction game in which players are attempting to deduce a killer. The basic principle is that each player has a few cards that other players do not know, while there are some center cards that everybody knows. These cards are labeled with a person, room, or weapon. At the beginning of the game, three unknown cards, a person, a room, and a weapon, are hidden. Then, by process of elimination (as well as a few other ways to gather information, discussed below), as players learn about other cards, they can eventually deduce what the hidden cards are. These hidden cards are the "killer." This is a very brief description of the game, see the [rules](https://www.thesprucecrafts.com/how-to-play-clue-cluedo-411240) for more information.

Currently, this solver doesn't determine the best guess to make on your turn, but this could be a future possibility for the project. This solver deduces the correct answer as efficiently as possible, based on the gathered information. So, given a set up information gathered (players revealing/not revealing cards to you and other players), this solver can determine the answer as soon as possible. If you've ever played Clue and tried to determine a good note taking strategy to gather the most information, this solver is a "perfect" note taking strategy.

The GitHub repository for this project can be found [here](https://github.com/EvanGibsonSmith/clue-solver).

## How Does It Work?

From this point forward, I will be assuming knowledge of the [rules](https://www.thesprucecrafts.com/how-to-play-clue-cluedo-411240) of Clue.

While there are many ways of doing this, the basic approach I went with initially was creating a tree of information representing all of the possibilities. An initial flaw in my thinking was that this would create a large tree of possibilities, branching outward and outward. But first, what types of "information" can be collected, and what does that even mean? Why would the tree branch at all? 

### Types of Information

For this project, all the possible information that could be used for a deduction needs to be collected in some data structure. In this case, that data structure ends up being a tree. If you are familiar with clue, I invite you to pause for a moment and consider what information needs to be collected, and what "types" of information there are.[^1]

I came up with four types of information. The first three I thought of initially, while the fourth is a small afterthought that is rarely of importance, but is technically needed to make the deduction perfect. They are as follows: information revealed (directly) to the player, information revealed to another player, and information from cards not revealed based on a guess, and last and certainly least, another player failing a final guess. 

To clarify, by "the player" or "this player" I mean the player that the solver is from the perspective of, and by "another player" I mean other players at the table with information to which the solver is not privy.

#### Aside About ClueInfo Class
This section just informs the last sentence or two about how specifically the idea of each type of information is stored in a class. As a small low level detail, feel free to skip this section, as it's not of great importance for the overall idea.

To encode all needed information, a ClueInfo class stores five things, which player guessed, what the guess was (as a simple ClueGuess object), which player revealed a card, the card, and if the player has that card. Based on what is known, these values can be null. For example if a card is revealed to another player and we do not see which card it is, the revealed card will be null. The importance of hasCard (if the player has this card), is for the type of information in which a player is known to NOT have a card.
```java
// one of the constructors for the ClueInfo class
public ClueInfo(CluePlayer guessingPlayer, ClueGuess guess, CluePlayer revealingPlayer, ClueCard card) {
    this.guessingPlayer = guessingPlayer;
    this.revealingPlayer = revealingPlayer;
    this.guess = guess;
    this.card = card;
}

public ClueInfo(CluePlayer guessingPlayer, ClueGuess guess, CluePlayer revealingPlayer, ClueCard card, boolean hasCard) {
    this(guessingPlayer, guess, revealingPlayer, card);
    this.hasCard = hasCard;
}
```

#### Information Revealed To The Player

This type of information is the simplest. This player makes a guess, and another player at the table reveals a card. We now know that the player that revealed the card to this player has a specific card.

##### Example
Consider a game with 3 players, Alice, Bob, and Eve, where we are Alice (and the solver is solving from that perspective)
Alice guesses "Scarlett, Bathroom, Dagger",
Then Bob passes (this is a *different* type of information, mentioned later).
**Then Eve shows Alice the card Bathroom**

When Eve shows Alice the card Bathroom from the guess "Scarlett, Bathroom, Dagger." 
The information revealed to Alice is this form of information. 
A card was directly revealed to this player (Alice in this case), from another player (Eve).

This type of information is added to the tree by taking the bottom of the tree and adding a singular new child to the bottom of the tree. This node will contain a guessingPlayer of this player, and a revealingPlayer of the other player that revealed, and the card shown. Since the revealingPlayer has a card, hasCard is true.

#### Information Revealed to Another Player

This type of information is the trickiest, because it creates multiple possibilities. When a guess is made, say by Player A, and another player reveals a card, say Player B, to the guessing player Player A. This creates three possibilities, one for each element of the guess, since we know for certain that the card Player B revealed a card from the guess that Player A made, but not *which* card they showed from that set. This is where the crux of optimal deduction occurs, when having to consider multiple of these possibilities. 

##### Example
Consider a game with 3 players, Alice, Bob, and Eve, where we are Alice (and the solver is solving from that perspective)
Bob guesses "Scarlett, Bathroom, Dagger",
**Then Eve the shows Bob a card that we do not see**
We do not know what card this is, but we know the shown card must be Scarlett, Bathroom, or Dagger.

This type of information is added to the tree by taking the bottom of the tree and creating three children, one for each possibility of the guess. The revealingPlayer and guessingPlayer are as you would expect, with the card being one of the possibilities for each child while hasCard is true.

#### Information Through Unrevealed Cards

This type of information occurs when a player "passes" on a guess. When a guess is made, and another player passes, it means that the passing player does not have any of the cards in the guess. Otherwise, they would be required to show that card to the guessing player. Note that for this type of information, it does not matter if the guessing player is "this player" that the solver has knowledge of or "another player", since the same knowledge is imparted to all players.

##### Example 
Consider a game with 3 players, Alice, Bob, and Eve
Alice guesses "Scarlett, Bathroom, Dagger",
**Bob then passes on this guess**

Bob passing on this guess indicates that Bob does not have Scarlett, Bathroom, or Dagger.

This type of information is added by having the expected revealingPlayer and guessingPlayer, but card is the card that was NOT revealed and hasCard is set to false. To add this to the tree of ClueInfo, three nodes are added from the bottom of the tree. They are added downward and do not branch out. Each of the three nodes contain the same revealingPlayer and guessingPlayer, and have hasCard set to false. Each of the three nodes has a card corresponding to the three cards in the guess. 

#### Information Through Failed Final Guesses
If a player makes a final guess and looks into the manila envelope to confirm that their guess is correct, and tells the table that they were incorrect, this player knows that exact guess is incorrect, but no more.

##### Example 
Consider a game with 3 players, Alice, Bob, and Eve
Alice makes a final guess "Scarlett, Bathroom, Dagger", opens the envelope, and tells everybody she was incorrect

We now know that the exact guess "Scarlett, Bathroom, Dagger" is incorrect.

### Solver Tree Object

The SolverTree object stores all of the information that is needed to deduce an answer. It uses getAnswer to determine an answer, and prune to get rid of contradictions. Prune is just the term I used to determine the process of eliminating these contradictions on the tree object.

This information is ordered by the time it was put into the tree, but for the purposes of deducing a final answer, this order does not matter. Because this order does not matter, the three possibilities that result in "Information Revealed to Another Player" can be rejoined before adding another node. Thus, the tree does not ever grow in width greater than size 3.  

#### Solver Tree Pruning

Assuming all of the information is entered correctly (which is an assumption I'm MORE than happy to make), the only contradictions that can occur on the tree are from the multiple possibilities that occur from "Information Revealed to Another Player". I call these possibilities "unknown nodes". When the number of possibilities narrows to one, we know that information for sure, and it can be used in the answer deduction. There are three contradictions that can occur and cause pruning.
    1. An unknown node asserts the same card another player is known to have.
    2. An unknown node asserts that a player has a card that a known node states they do not have.
        NOTE: An unknown node cannot assert that a player does not have a card, since unknown nodes
                    occur when the tree branches, which only occurs when a card is revealed.
    3. An unknown node, if a player had it, would cause them to have too many cards in hand including known nodes.

These three are checked for, and the possibility of creating a contradiction is removed (since the other node is known for certain). Since this prune creates another known node that may cascade into another contradiction, these three checks are run recursively until no more pruning occurs. A single pass through this is called pruneOnce() in the code.

```java
public void prune() {
    boolean pruneSuccess = true;
    while (pruneSuccess) { // prune until nothing more to prune
        pruneSuccess = pruneOnce();
    }
}
```

#### Answer Deduction

To deduce the answer based on the given information, a getAnswer function is called on the tree of nodes (the SolverTree class).
The first key insight to deducing the answer is to realize that deducing the person who committed the crime, the location of the crime, and the weapon for the crime are independent with a very small exception of eliminated final guesses, which I will mention later. 

Given a pruned information tree, there are two main ways to deduce the answer for a given category (person, room, or weapon).

The first way is to determine the answer for a category by process of elimination. If every possible card except one in a category has been revealed by other players, is in this player's hand, or is in the center of the board, we can deduce that the final possibility must be the correct answer.

The second way of doing this is by confirming that all players do not have a card, and that this card is not present in the center of the board (or in this player's hand). The card must therefore be the correct answer.

The edge case for getting the answer is from the 4th type of information, considering failed final guesses. After running getAnswer and figuring out which people, rooms, and weapons, we consider the number of possible answers using simple combinatorics from the remaining cards after the process of elimination. If this number is EXACTLY one more than the number of final guesses that have failed, then it is possible that the failed final guesses can narrow down the real answer to a known set of cards. Otherwise, there is no need to even check individually. 

Note that if this check were not done intelligently (checking all possibilities every time) it would be extremely slow (very likely intractable).

## Conclusion

I have unfortunately not gotten the chance to play Clue with a group of people using this, because nobody wants to play Clue against somebody with a solver. The approach I took over the course of this project to solve this problem changed significantly. I initially thought that it would be a branching tree structure that gets larger and larger, until I realized that wasn't needed in any way. In fact, since the order of information doesn't matter, the tree structure isn't technically needed at all. That said, it could be useful for making a bot that makes guesses instead of just deducing. 

Going into it, I *severely* underestimated just how many ways there are to figure things out in Clue. Not only does it matter which cards you see and don't see, but which players might have which cards. In practice, I'm sure many of these edge case wrinkles improve the performance very little. For example, deducing a player's cards based on their hand size?! There is no way that comes in handy often. Using a failed final guess to narrow down the final possibility might be more useful, but is still an incredibly tricky wrinkle. In the end, there were 4 ways to gather information, 3 ways to prune a tree of information, and 2 (or 3 if you consider narrowing down the final guess) ways of deducing the final answer from a pruned tree. I was not expecting so much complexity hidden within this, although I always seem to find there is for everything.

## Future Possibilities

The tree structure wasn't needed for the deduction, but I think it would be needed for making good guesses, based on what you think about the other players. To continue this project, I would hope to make a bot that makes the guess with the highest likelihood of getting a lot of new information. I think this would be very difficult, and require some assumptions about how other players play. That said, I think it's a great direction to explore, and feel free to fork the [repository](https://github.com/EvanGibsonSmith/clue-solver) if you want to take a stab at it! 


