# Contagion-Simulation
Simulates disease propagation in a closed system and charts data in real time

This is my first project. It is intended to be an exercise in javascript. It is not intended to have portions of its code used in other applications, as full modularity had to yield before time constraints and my knowledge level. Therefore, if you're looking for a ready-made quadtree, a chart, or some other functionality, this is not the place to be searching.

[Live Website](https://amaralis.github.io/Contagion-Simulation/)

## What I proposed to achieve with this project

- [X] To build a quadtree
- [X] To use a library strictly by referring to its documentation
- [X] To simulate something with a visual component
- [X] To present simulated data to the user and give them control over data points
- [X] To spread awareness about the dangers of exponential disease spread
- [X] To make an awesome CSS animation with SVGs, because I like the biohazard symbol thingy
- [ ] To make a proper modal window
- [ ] To use Git properly

## What I learned from this project

* What meta tags are and how they work. An unexpected benefit, arisen only because I wanted a little preview thumbnail on Discord... I couldn't get it to work on Discord, but Twitter and Facebook worked fine!
* How to use the html5 canvas
* How *not* to run a simulation (looking at you, setTimeout and setInterval... how could I have known you're some sort of hybrid monstrosity browser API that's completely unrelated to my animation loop?)
* How to build and use a quadtree
  * Gotta pat myself in the back for this one. Recursion, coordinates, collision checking, a pretty major step for my first mildly deep foray into Javascript. Of *course* I got the idea and concept from the Coding Train, but hey, Dan uses P5.js, I didn't. And I'm really proud that I didn't have to copy-paste code in order to get it working. I learned about the concept, then implemented it. It really wasn't that hard, either. The worst part was debugging a 3000 line script when I didn't really understand the ins and outs of requires, imports, exports, and the whole plethora of options out there
* How to refer to documentation in order to use a library or other resource. Up until this point I had gone to great pains, googling everything under the Sun, from electric circuits to wireless networks, to understand the stuff on Mozilla Developers Network; It was worth it. But everything else, I relied on youtube tutorials and udemy courses. So for this project, I decided I would use a library and refer to its documentation without video tutorials. I grew a lot back then.
* How to write spaghetti code
  * Looking back at this project, I have to admit my chances at writing clean, maintainable code at the time were fewer than zero. But the concern remains.
* Git saves lives, even for a newbie who can barely git add . git commit -m without googling the syntax
