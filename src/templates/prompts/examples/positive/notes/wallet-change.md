Highlights:
- Seeded randomness drives the wallet makeup, guarantees at least one bill and some coin value, and selects a purchase price strictly below both the total cash and bill-only subtotal so regrouping remains meaningful.
- Choice generation tags every distractor with a misconception (`IGNORE_COINS`, `NO_BORROW`, `MISVALUE_COINS`, offsets), filters duplicates, and keeps all amounts positive—making the diagnostic space both intentional and deterministic.
- Math helpers (`mathDollar`, `mathMoneyExpr`, `formatCents`) unify how amounts render in the stem, interactions, and feedback, ensuring the same values appear in both MathML and text narration.
- Feedback preambles quote the learner’s computed dollar amount and explain the misconception, while the shared three-step plan mirrors the subtraction algorithm: tally starting cash, set up subtraction with regrouping logic, then compute cents and dollars before revealing the solution.
