---
title: Misc
layout: blogLayout.njk
---
<div class="misc-intro" style="text-align:center;">
    <p>This section serves as a miscellaneous section for interesting projects that don't warrant a full section or post, or do not have one yet, but have interesting outcomes, deliverables, or goals.</p>
</div>

<section class="misc-section">
  <div class="misc-content">
    <div class="misc-text">
      <h4>Image to Haiku on Raspberry Pi 5 (Talking LLaMA)</h4>
      <p>
        This project, for On Device Deep Learning, involved taking three transformer based models and making them more suitable for deployment on a small device, in our case, the Raspberry Pi 5. 
        For each component, there was an element of model compression. Our ViT was trained from scratch and pruned on CIFAR-100, and used to determine a top five classes from the input image to our camera. For the purpose of a more extended project, this can definitely be improved to give more specific and granular results, that would work better in the context of a camera box. Our LLaMA model, which generated a haiku based on 5 input classes from CIFAR-100, was finetuned on a haiku dataset and pruned using LoRA. Lastly, our text to speech model used HiFi GAN with tacotron, which was pruned aggresively, with a pruning of 30% for the decoder and 20% for the encoder. By ablating pruning of different layers in the text to speech pipeline, only specific portions were pruned from the final model. 
      </p>
      <p>
        To the side is a demo of the setup, with an example output haiku. This takes around 85 seconds to run on the Raspberry Pi 5, with 5W for 0.18s for the ViT CIFAR-100 classification model, 7W over 16.16s for the LLaMA model, and 6.25W over 69s on the text to speech model. This causes the majority of time spent to be in the text to speech, which is pruned agressively enough that is already difficult to understand.
      </p>
    </div>
    <div class="misc-media">
        <div class="animation-container"> 
            <video class='hover-video' muted playsinline controls>
                <source src="/videos/Talking LLaMA.mp4" type="video/mp4">
                Your browser does not support the video tag.
            </video>
            <div class="misc-note">
              An example of Talking LLaMA being pointed to a computer. It generates and then says a haiku.
            </div>
        </div>
    </div>
  </div>
</section>

<section class="misc-section reverse">
  <div class="misc-content">
    <div class="misc-text">
      <h4>Neural Network Function Fitting</h4>
      <p>This project is from a while ago when I made a very minimal neural network library from scratch to understand how a neural network and backpropagation works at a fundemental level. To test the network and get a more visual understanding of how exactly momentum works in the context of SGD, I added a momentum argument to the optimizer. I then designed a task that could take an arbitrary function and train a small neural network from my library that fit this function in 3d, by making a synthetic training dataset from points of the underlying function. This allows the real ground truth to be seen and creates a "shrink wrap" effect for the network. It also makes the benefits of momentum a lot more clear. </p>
    </div>
    <div class="misc-media">
      <img src="/videos/sgd_momentum_function_fitting.gif" alt="SGD Momentum Function Fitting Example">
      <div class="misc-note">
      An example of SGD function fitting at learning rate of 0.1 for this toy example of function fitting. 
      The function chosen is the heat equation of a hot bar from -1 to 0, and a cold bar from 0 to 1 (<a href=https://en.wikipedia.org/wiki/Heat_equation#Fundamental_solutions>Heat Equation</a>). 
      </div>
    </div>
  </div>
</section>

<section class="misc-section">
  <div class="misc-content">
    <div class="misc-text">
      <h4>Kayak Game</h4>
      <p>This is a puzzle game I have been making in <a href="https://godotengine.org/">Godot</a> when I have free time or inspiration for a new puzzle. This has been an idea I came up with years ago but have just recently been designing into a playable game. The objective of this game is simple. You have a certain number of time, displayed in the top left corner, and a distribution of people, kayaks, and houses around a lake. In order to move a kayak, you need a person to paddle it. There are variants such as two person kayaks that can transport multiple people, and other quirks like "walking trails", but the simple premise is you need a person to paddle each kayak. The objective is to get every kayak to the house of its corresponding color before the number of moves runs out. As you may be able to see by the demo, I am not a particularly talented visual artist, so this serves currently as a proof of concept for the mechanics of the game. Eventually, I plan to flesh out the design and mechanics, as well as the artwork with help from those who have those skills. As a move along in the proces of designing this game, I may create a more in depth dev log of the progress and my thought process in designing these puzzles. </p>
    </div>
    <div class="misc-media">
      <img src="/videos/KayakGameLevel.gif" alt="Kayak Game GIF">
      <div class="misc-note">Early game level for the Kayak Game in Godot. Puzzles get much more interesting and difficult, but I wouldn't want a gif to spoil them!</div>
    </div>
  </div>
</section>

<section class="misc-section reverse">
  <div class="misc-content">
    <div class="misc-text">
      <h4>Git Workshop</h4>
      <p>This is a small workshop that I made for Upsilon Pi Epsilon (<a href=https://github.com/EvanGibsonSmith/git-workshop>repo</a>). In addition to the presentation we provide teaching the basics of Git, I designed a small game of Snake that was initially broken with some fun changes (wrap around like PacMan, cannot die, random direction changes) that need to be fixed. To do this you are instructed to make a branch, fix the issues, and then merge back into the main branch. The instructions then provide a nice minimal example of using git branch to add a new feature, or fix some bug, since I have found most git workshops don't provide background on branching and merging.
      </p>
    </div>
    <div class="misc-media">
      <img src="/videos/SnakeBugFixNeeded.gif" alt="Snake Game with needed bug fixes">
      <div class="misc-note">
      An example the snake game before the bugs are fixed. There is wrap around on the walls, the snake cannot die (it phases through itself), and your direction randomly changes. In a small game (8x8) here, it gets very chaotic and unplayable very quickly.
      </div>
    </div>
  </div>
</section>

