# Template Issue: Corny Preambles

Every preamble below fails the checklist we now enforce: name the learner’s choices, restate the table values, and connect those values to the rule. Each section lists (1) the exact text the template currently emits, (2) why it is unacceptable, and (3) a corrected, parameterised version that would pass review.

## FB__A
**Bad preamble**
> You named the two changing categories and used the reason “changed.” Their rows show … which are not all equal across Month 1, Month 2, and Month 3.

**Why it fails**
- Never mentions which categories the learner selected.
- Talks about “their rows” without quoting the actual values, so the learner cannot see the evidence.

**Fixed preamble**
```
You selected **${var1Label}** and **${var2Label}**, and you were right to say the amounts changed. Those are the only two rows whose dollar amounts differ across the months, so you identified the variable expenses correctly.
```

## FB__B
**Bad preamble**
> One category you selected does not match the changing pattern. Compare with the variable rows: …

**Why it fails**
- Hides the actual mistaken category; the learner has to guess which row was wrong.
- Mentions the “variable rows” but never cites the dollars in the row the learner picked.

**Fixed preamble**
```
You chose **${fixedLabel}** together with **${var1Label}**. **${fixedLabel}** keeps the same amount every month, so it is fixed—the variable rows are **${var1Label}** and **${var2Label}**, which are the ones that change.
```

## FB__C
**Bad preamble**
> One of your categories is fixed. The rows that vary are …

**Why it fails**
- Again withholds the specific row the learner picked.
- Ignores the learner’s own data, instead talking about the correct rows.

**Fixed preamble**
```
You selected **${var1Label}** and **${fixedLabel}**. Because **${fixedLabel}** stays the same, it can’t be variable—pick two categories that change, like **${var1Label}** and **${var2Label}**.
```

## FB__D
**Bad preamble**
> Your categories align with variability, but the explanation should describe that the amounts changed across the months, not that they stayed the same.

**Why it fails**
- Never confirms which categories were chosen.
- Still does not restate the numbers that prove the amounts changed.

**Fixed preamble**
```
You picked **${var1Label}** and **${var2Label}**, both of which change. The explanation just needs to say “changed” instead of “stayed the same” to match what you selected.
```

## FB__E
**Bad preamble**
> Both chosen categories miss the pattern. The changing rows are …

**Why it fails**
- Talks only about the correct rows, never the ones the learner actually picked.
- Offers zero evidence for why the learner’s rows are wrong.

**Fixed preamble**
```
You chose **${fixed1Label}** and **${fixed2Label}**, but both rows stay constant every month. The variable expenses are the rows that change, such as **${var1Label}** or **${var2Label}**.
```

## FB__F
**Bad preamble**
> One category is fixed and the reason conflicts with variability. Variable expenses are the ones whose amounts changed across the months in the table.

**Why it fails**
- Doesn’t name either category the learner chose.
- Tells the learner to “look at the table” instead of quoting the data.

**Fixed preamble**
```
You selected **${fixedLabel}** and **${var1Label}** but said the amounts changed. **${fixedLabel}** never changes, so pairing it with the reason “changed” makes the explanation incorrect.
```

## FB__G
**Bad preamble**
> One category is fixed and the reason describes no change. Use the rows that differ across months …

**Why it fails**
- Same issue: the learner never hears which row was wrong.
- No numbers are quoted, so the learner cannot verify the advice.

**Fixed preamble**
```
You chose **${var1Label}** and **${fixedLabel}** but wrote that the amounts stayed the same. Only **${fixedLabel}** stays constant—**${var1Label}** is one of the rows that does change, so the reason should be “changed.”
```

## FB__H
**Bad preamble**
> Neither the categories nor the reason match the data. Variable expenses have different amounts across …

**Why it fails**
- Completely generic; it could apply to any wrong answer.
- Still refuses to reference the learner’s picks or the numbers that contradict them.

**Fixed preamble**
```
You chose **${fixed1Label}** and **${fixed2Label}** and said they changed. Both stay the same each month, so these aren’t variable expenses—look for rows like **${var1Label}** that actually change.
```

**Action item:** rewrite each preamble in the template to follow the “bad ➜ fixed” pattern above—name the learner’s selections, state why that exact choice fails, and connect the explanation to the variability rule without dumping raw table data back at the student.
