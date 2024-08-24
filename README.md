# :green_apple:SYNCSHACKAppleCidra:beverage_box:

## Members
| Name    | Github Repo |
| -------- | ------- |
| Jiacheng Yu :tangerine:  | https://github.com/mryu888-plus    |
| Yangqing Zheng :pig_nose: | https://github.com/zyqgrace     |
| Micheal Fang :snowflake:    | https://github.com/KnightFizz    |
| James Zhao :moyai: | https://github.com/cheese-zj |
| Xinyi Chen :jellyfish: | https://github.com/OrangeJellyfishCHEN |

## Project Description
**Name: Not decided yet**   
Inspiration
Our project draws inspiration from Nintendo's Pokémon Card Game and Ring Fit Adventure. We aim to blend fitness with competitive gameplay, using exercise to power players' abilities in a virtual card battle. This hybrid approach engages users physically while fostering social interaction and healthy competition.

Fitness Battle Game is an innovative multiplayer game that leverages webcam-based exercise tracking to reward players with in-game attributes. These attributes, represented as game icons, can be used in a turn-based battle system where players compete to defeat each other. The project aligns with the theme, "Software that brings people together," by encouraging collaboration and friendly competition through physical activity, blending fitness and entertainment in a fun, social experience.

### Technology Stack
- Python packages && repos:
  - https://github.com/tocoteron/joycon-python
  - https://github.com/google/mediapipe
- Flask
- Next.js
- Procreate

#### Models
The pose detection used in this project is based on Google's Mediapipe framework, which is a cross-platform machine learning library designed to identify multiple pose positions. Mediapipe provides robust tools for real-time pose tracking and recognition, enabling applications that rely on accurate body pose estimations to identify various body positions and movements.

### Functions:
- Players use their webcam to detect and track their exercise postures(squat && curl currently). Each successful posture grants a player an icon with specific attributes that can be used in a battle.
- The game requires at least two players, each participating from their own computer.
- Players can compete against each other using the icons they have earned. The icons grant abilities or attacks during the battle, similar to a Pokémon card competition.
- A Hit Points（HP）bar is displayed for each player, and the game ends when one player's HP reaches zero.
- (Optional) Before entering the game, players can customize their avatar or character.

## Informal Reference
- For squat GIF: https://www.youtube.com/watch?v=xqvCmoLULNY
- For curl GIF: https://www.youtube.com/watch?v=TVflFTempWA