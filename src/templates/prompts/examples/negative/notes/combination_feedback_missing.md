# Template issue: binary feedback dimension on a multi-select interaction

## What’s wrong
- The response declaration allows multiple identifiers, but the feedback plan uses a `binary` dimension (`CORRECT` / `INCORRECT`).  
- Because we only have two buckets, all incorrect combinations collapse into the same message, so learners never see targeted guidance for the pair they actually chose.
- To compensate, the incorrect preamble gets overloaded with every possible mistake, becoming noisy and hard to parse.

## How to fix
- Change the feedback dimension to `kind: "combination"` and enumerate the allowable selection keys (e.g. `A__B`, `A__C`, …).  
- Generate feedback blocks for each combination so the response processing can assign precise, minimal guidance.
- Once the dimension is switched, trim the preamble back to the specific misconception tied to that combination—the shared steps already hold the general explanation.
