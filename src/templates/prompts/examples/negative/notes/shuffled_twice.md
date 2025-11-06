### Why this is wrong
- The template already applies a deterministic Fisher–Yates shuffle.
- Setting `shuffle: true` on the interaction causes the runtime to reshuffle again.
- Result: the order seen by the learner no longer matches the order used to compute `correctChoiceIdentifier` and build the feedback map.
- Symptoms: wrong choice marked correct, feedback attached to the wrong answer.

### Fix
- Keep `shuffle: true` and let the player/runtime randomize.
- Remove the manual Fisher–Yates logic so there is only one shuffle.
