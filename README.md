## Writer Duel
### A multiplayer word jumble
#### Deployed
http://writer-duel.s3-website.us-east-2.amazonaws.com/
- Type to stage letters
- Enter to submit
- Space to shuffle unstaged letters
- Winner is the player with the greatest number of tiles from accepted words after the timer runs out.

#### Set up
1. Clone the repository
2. [Create a Firebase project and realtime database](https://firebase.google.com)
3. Find your project API key and messaging sender ID, paste into .env.template
4. Rename .env.template to .env
5. Open command prompt in the project directory
6. `npm install`
7. `npm start`
8. Go nuts

#### Challenge Requirements:
- [x] Players should be able to start a new game and be given an invitation link to share with other players (the links can be simply copy-and-pasted to other players outside the application)
- [x] The game creator should be able to press a play button whenever they're ready, and all players should be able to compete in real-time. It's fine to assume players will not reload the page once they go to it.
- [x] Once a word is entered, it cannot be entered again by ANYONE (including other players - i.e. only the first person to enter it gets credit).
- [x] The game ends after one minute.
- [x] Each game has nine randomly generated letters, with a minimum of two vowels and two consonants each time.
- [x] Scoring of your choice.
- You can choose your own additional rules.
- A dictionary reference is not necessary for this exercise.
- Security of any kind is NOT necessary, but we may ask you afterwards about security holes and how you'd handle them in the real world.

#### Nice to have:
* Instead of random letters, pull 9-letter words from a dictionary somewhere and sort randomly. Takes care of vowel and consonant requirement and increases chances of multiple smaller words.
* Way better styling.
  * Including animations.
* Eventually maybe use Google account authentication to keep track of users? Worth it?

#### TODO:
* Firebase functions
  * Destroy game when players are finished
* Deploy the damn thing!

#### Notes:
* Adding the shareId was interesting. Joining a game based on the FB key was easy. I just use games/gameId as the path, check the players for the submitted user name, and if it's free go ahead and join. Once I set up the shareId (creating the next ID and updating the database lastId property was trivial) it made less sense to get the entire list of games and check whether gameId was a member, so I got to learn about firebase.database.Query. I used orderByChild and equalTo to see whether there was a game with a matching shareId, if so save the FB key to use in the subsequent operations. There were some neat gotchas. For example, I momentarily forgot that Object.keys returns an array, and so I was surprised when firebase complained of an invalid path argument. Other than that it was straightforward, just new.
