---
layout: blogLayout.html
---

 # Bananagrams Solver

I often play Bananagrams with my friends on weekends and Fridays. One night, I was losing more than I would like to (which is to say, losing at all) and decided it would be my mission over winter break to create a solver so my computer could play for me.

In the end, the act of typing in every letter and rearranging the board actually takes longer than just using your brain to play, at least for my friends. So, I still lose quite often, but we can pretend that isn't the case. I made a presentation on this for my induction to Upsilon Pi Epsilon, but the writeup below goes into more depth. 

The GitHub repository for this project can be found [here](https://github.com/EvanGibsonSmith/bananagrams_solver).

If are not familiar with the game Bananagrams, I'll briefly describe it below or you can read the [rules](https://bananagrams.com/blogs/news/how-to-play-bananagrams-instructions-for-getting-started) in greater depth. If you know Bananagrams, skip to the game section. Bananagrams is a real time (not turn based) game played with a bag of tiles. Each tile has a letter on it, as in scrabble. The difference is that each tile does not have an associated score, as in scrabble. All of the tiles are initially placed in the center. 

A certain number of tiles (usually around 15-20 depending on the number of players in the game) are handed out to each player. Each player then races to get rid of all of the tiles in their hand, placing them in a configuration where all of the vertical and horizontal connections are words (in the same way as scrabble, with the sole objective of getting rid of all tiles in your hand).

After a player completes their grid, they tell PEEL. Each player then grabs a tile from the center of the board, and tries with this extra tile to create a valid scrabble-like board with all of their tiles. This repeats until there are not enough tiles for every player to grab one. In this case, the player that completed their board wins the game.

The last thing to know about Bananagrams, is that if a player is struggling to complete their board, they can trade out any tile of their choosing for three random tiles in the middle. This is called a DUMP.

Moving past the basics of the rules, before we get to the intricacies of how the solver works, how is the game itself actually implemented?

## Game 

To create a Bananagrams solver, many of the critical elements of the game need to first be built. There are a few really basic classes that don't really need explanation such as the Hand, and the Tile. The TileBag object simply stores all of the tiles that can be grabbed from the center. It is essentially a set, but has the capability of grabbing a random tile as well as adding and removing from the TileBag.

More interesting is the "broker" object. The broker object is a small object that facilitates tile transfer between a given player and the tiles in the center. Given a specific player and a tile object, it allows a player to dump and peel. Each player has one of the brokers that they use. The broker object has a CheatBroker and NormalBroker variety. The NormalBroker works for a normal game of Bananagrams, drawing random tiles from a NormalTileBag object. The CheatBroker instead uses a CheatTileBag object. The CheatTileBag object instead of being random uses a queue, so that tiles can be placed and removed from the CheatTileBag in order. This allows the user to put in the tiles that they used for the solver later.[^1]

Of course, the most important part of the game is not the bag of tiles, but the board. The board is a Grid class, which allows tiles to be placed and removed from specific locations. This Grid class also has functionality to check if the current board state is valid, as well as methods that are used to find specific words within the grid. To check if a board state is valid, first all vertical and horizontal words must be checked as valid words, and second all tiles must be connected. The tricky part of using this board object is for branching with A*.

This grid class is used within a GridArranger that can adds tiles from a Hand to a Grid.

## A Star

This was done using a modified A* over the possibilities. From this, a general purpose A* was built in order to traverse the possible board states. The primary modification for this A* is that Bananagrams has many possible solutions for a given problem, and the heuristic hopes to find one of these many solutions. 

This A* implementation takes a starting point, any cost function for a step between two states, a heuristic that estimates the distance from a solution from the given node, and a function that takes a given state and outputs of counts as a goal, or a solution to A*.

This flexibility is needed for Bananagrams, where we do not know all possible goal states, but can test if a given state satisfies a needed requirement (in this case, every tile placed and the hand empty). For this reason, the extra flexibility of an arbitrary function to determine if a state is a goal is needed.

For the purposes of applying Bananagrams to the game, the specific cost function and heuristic are really important. I used the simplest heuristic function I could think of that would help, which was just estimating the "distance" to a solution as the number of tiles in the hand. This has the repercussions of trying the longest possible words first, and since there are many possible solutions to a given Bananagrams hand, the solutions it finds often have at least one very long word. 

```java
public AStarHashSets(T start, BiFunction<T, T, Double> cost, Function<T, Double> heuristic, Function<T, Boolean> isGoal) {
    super((T) start, cost, heuristic, isGoal); // implements from an abstract class, 
    this.pq = new DynamicIndexMinPQ<>();
}
```

### Branching Player

The object that is used for A* must have the method branch. This is done so that the graph of possibilities can be traversed and considered with a heuristic. This branching method is a generic method that can be used for A*. For example, if the task were searching a maze, the branch method would be a set of adjacent tiles (that are not blocked by a wall).

In the case of solving a Bananagrams board, the branching function would need to take a player with a specific hand, and generate a set of valid board states from that. For this task a BranchingPlayer class is made that has this functionality.[^2] 

#### Branch Method

The branch method, to get all possible adjacent possible board states from the current board state, is a surprisingly tricky task. For every non empty board, new words can only be placed on existing tiles. In the case of a non-empty board, every possible word placement must be considered. This is done by considering every possible word that could be placed in the left to right direction or up to down direction. This is done by collecting word "fragments" that could be components of a word from left to right. This could be a single letter, or a word that can be expanded on, like "act" becoming "actor." To make this branch function more robust, backward possibilities are considered as well. This is because in the case that the starting state is a partially completed board, the only way to create a valid board may be to first remove an existing word on the board.

The last edge case that needs to be covered is when the grid is empty. In this case, all words that can be placed with the tiles in the player's hand are valid starting boards in either the horizontal or vertical orientation. 

## Conclusion

After all of this work, the solver, as I briefly mentioned in the introduction, doesn't actually help that much in a real game! If I am given twenty tiles, and I have to put all twenty letters in the terminal and then try and arrange a board of these tiles with my slow and clumsy hands, I don't get very far. Despite this I learned a lot implementing my own A* and working on the branching function for this particular game. I'm satisfied with the result I have, but there is a lot that could be done in the future.

## Future Possibilities 

I used a very basic heuristic function for Bananagrams. It is a much more complicated game than just playing the longest word that you possibly can. There is so much more to consider! For this reason I think better heuristics for A* can be developed in the future, taking into account these other elements of the game. I experimented with a heuristics that gave tiles a score either on the grid or in the hand of the player using Scrabble lettering, but this didn't seem to significantly help. With a better heuristic, it may alleviate a problem that sometimes occurs with the solver. If the solver is given very difficult tiles, for example a lot of the letter q, k, or x, it may not be able to find a solution (in a reasonable amount of time). A better heuristic may be able to find these trickier solutions faster. I will caution that it may be difficult to find a heuristic that captures something important about the game while being computationally cheap to run.

The branching function is very robust, but has some potential issues that could be improved on. It seems slow for a branching function within A*, based on all of the possibilities it considers. While this branching function does consider all possibilities, it may be more useful to get rid of symmetric positions, of which this branching function generates many. For instance, at the beginning of a game, it creates a board with a vertical and horizontal version of a word. These two boards are functionally identical and do not help for the sake of finding a solution.

[^1]: Technically speaking, the CheatBroker object doesn't need to have a CheatTileBag in order to function for the solver in the way that it is implemented. This is because all of the tiles that are manually added are immediately removed. Because of this they are grabbed and are not needed. That said, the general CheatBroker setup with a CheatTileBag allows a great deal of flexibility in constructing game situations, which is convenient. It is also useful for setting up tests (that to be perfectly honest, I have not set up yet).

[^2]: In the code for the project, there is no BranchingPlayer class. Instead there is a ParallelBranchingPlayer and SerialBranchingPlayer, each with slightly different implementations in the attempt to improve performance. This wasn't really successful.







