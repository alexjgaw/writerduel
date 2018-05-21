## Writer Duel
### A multiplayer word jumble
#### Set up
1. Clone the repository
2. Open command prompt in the project directory
3. `npm install`
4. `npm start`
5. I guess you'd need my API key.
#### Challenge Requirements:
1. Players should be able to start a new game and be given an invitation link to share with other players (the links can be simply copy-and-pasted to other players outside the application)
2. The game creator should be able to press a play button whenever they're ready, and all players should be able to compete in real-time. It's fine to assume players will not reload the page once they go to it.
3. Once a word is entered, it cannot be entered again by ANYONE (including other players - i.e. only the first person to enter it gets credit).
4. The game ends after one minute.
5. Each game has nine randomly generated letters, with a minimum of two vowels and two consonants each time.
6. Scoring of your choice.
7. You can choose your own additional rules.
8. A dictionary reference is not necessary for this exercise.
9. Security of any kind is NOT necessary, but we may ask you afterwards about security holes and how you'd handle them in the real world.

#### Nice to have:
* Instead of random letters, pull 9-letter words from a dictionary somewhere and sort randomly. Takes care of vowel and consonant requirement and increases chances of multiple smaller words.
* Way better styling.
* Including animations.

#### TODO:
Pretty much everything.
* Implement initial prompt: Start a new game or join an existing game?
  * If start new, create a new `game` object, push it to firebase `games` object, and provide URL to share with other players
  * If join, copy game id into a text field, sync with that object from `games`
* Timer
* Waiting on other players message
* Connect with a dictionary API to validate word submissions
