---
date: 2026-04-18
agent: cline
category: execution-template
tags: [experiment, validation, testing, template]
---

# Experiment Log Entry Template

## How To Use

Copy this template for each new experiment. Fill in the setup before launching.
Fill in results and decisions after the experiment completes.
Log in `11-validation-experiments.md` under "Active Experiments" or "Completed Experiments."

---

## Experiment: [Name]

### Setup

**Date range:** YYYY-MM-DD to YYYY-MM-DD
**Hypothesis tested:** H1 (demand exists) / H2 (personal brand sufficient) / H3 (workflow language resonates) / H4 (diagnostic bridge works)
**Channel:** LinkedIn / Website / Outbound / Sales / Other
**What is being tested:** [Clear description of the variable being tested]
**Control:** [What is the baseline / current approach]
**Variant(s):** [What is being changed]
**Audience:** [Who will see this — be specific about ICP relevance]
**Primary metric:** [One metric that determines success]
**Secondary metric(s):** [Supporting metrics]
**Minimum sample size:** [Number needed for a meaningful signal]
**Success threshold:** [What result means "winner"?]
**Duration:** [How long will this run before making a decision?]

### Tracking Table

| Variant | [Metric 1] | [Metric 2] | [Metric 3] | Notes |
|---------|-----------|-----------|-----------|-------|
| Control | | | | |
| Variant A | | | | |
| Variant B | | | | |

### Results

**Data collected:** [Fill in after experiment completes]

**Statistical significance:** Significant / Directional / Inconclusive

**Primary metric result:**
- Control: 
- Winner: 
- Difference: %

### Interpretation

**What happened:** [1–2 sentences on what the data shows]

**Why (hypothesis):** [Why do you think this result occurred?]

**Caveats:** [Any issues with the data, sample size, or external factors]

### Decision

**Decision:** Continue as-is / Implement winner / Iterate with new variant / Stop testing this

**Next action:** [Specific next step based on the decision]

**Applied to:** [Where will this learning be applied? E.g., "Updated homepage headline to Variant B"]

---

## Experiment Quality Checklist

Before launching, verify:

- [ ] Is this testing a real business question (not just curiosity)?
- [ ] Is the hypothesis tied to H1, H2, H3, or H4?
- [ ] Is the primary metric clearly defined?
- [ ] Is the success threshold defined before running?
- [ ] Is the sample size realistic for the timeframe?
- [ ] Will the result change what you do? (If not, don't run the experiment)
