### Why this is wrong
- The QTI source asks learners to populate a table via three `inlineChoiceInteraction` dropdowns; that structure is the core skill being assessed.
- This template discards the table entirely and replaces the activity with a single `choiceInteraction`, collapsing the task into a basic multiple-choice guess.
- By remapping the interaction type we hide the data-reading workflow, so the generated items no longer exercise the intended procedural reasoning.

### Source item
```json
{
  "body": [
    {
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "content": "Maddie asked farmers how many cows they own. The dot plot shows her results."
        }
      ]
    },
    {
      "type": "widgetRef",
      "widgetId": "dot_plot_results",
      "widgetType": "dotPlot"
    },
    {
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "content": "Complete the table using the data from the dot plot."
        }
      ]
    },
    {
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "content": "Select the number of farmers for each number of cows. You may use an answer more than once. Not all options will be used."
        }
      ]
    },
    {
      "rows": [
        [
          [
            {
              "type": "text",
              "content": "Number of Farmers"
            }
          ],
          [
            {
              "type": "text",
              "content": "1"
            }
          ],
          [
            {
              "type": "inlineInteractionRef",
              "interactionId": "dropdown_35"
            }
          ],
          [
            {
              "type": "inlineInteractionRef",
              "interactionId": "dropdown_40"
            }
          ],
          [
            {
              "type": "text",
              "content": "1"
            }
          ],
          [
            {
              "type": "inlineInteractionRef",
              "interactionId": "dropdown_47"
            }
          ],
          [
            {
              "type": "text",
              "content": "4"
            }
          ]
        ],
        [
          [
            {
              "type": "text",
              "content": "Number of Cows"
            }
          ],
          [
            {
              "type": "text",
              "content": "31"
            }
          ],
          [
            {
              "type": "text",
              "content": "35"
            }
          ],
          [
            {
              "type": "text",
              "content": "40"
            }
          ],
          [
            {
              "type": "text",
              "content": "43"
            }
          ],
          [
            {
              "type": "text",
              "content": "47"
            }
          ],
          [
            {
              "type": "text",
              "content": "50"
            }
          ]
        ]
      ],
      "type": "tableRich",
      "header": null
    }
  ],
  "title": "Complete the table from a dot plot",
  "widgets": {
    "dot_plot_results": {
      "axis": {
        "max": 50,
        "min": 30,
        "label": "Number of Cows",
        "tickInterval": 5
      },
      "data": [
        {
          "count": 1,
          "value": 31
        },
        {
          "count": 3,
          "value": 35
        },
        {
          "count": 2,
          "value": 40
        },
        {
          "count": 1,
          "value": 43
        },
        {
          "count": 4,
          "value": 50
        }
      ],
      "type": "dotPlot",
      "width": 420,
      "height": 320,
      "dotColor": "#4472C4",
      "dotRadius": 5
    }
  },
  "feedback": {
    "FEEDBACK__OVERALL": {
      "CORRECT": {
        "content": {
          "steps": [
            {
              "type": "step",
              "title": [
                {
                  "type": "text",
                  "content": "Recall what each dot means"
                }
              ],
              "content": [
                {
                  "type": "paragraph",
                  "content": [
                    {
                      "type": "text",
                      "content": "In a dot plot, each dot represents one data point. Here, each dot stands for one farmer, and the label on the axis shows that farmer’s number of cows."
                    }
                  ]
                }
              ]
            },
            {
              "type": "step",
              "title": [
                {
                  "type": "text",
                  "content": "Use consistent counting to read frequencies"
                }
              ],
              "content": [
                {
                  "type": "paragraph",
                  "content": [
                    {
                      "type": "text",
                      "content": "Align your eyes with a label on the axis, then count only the dots directly above that label."
                    }
                  ]
                },
                {
                  "type": "paragraph",
                  "content": [
                    {
                      "type": "text",
                      "content": "If there are no dots above a label, record zero. If there is one dot, record one; if there are multiple stacked dots, record that total."
                    }
                  ]
                }
              ]
            },
            {
              "type": "step",
              "title": [
                {
                  "type": "text",
                  "content": "Do quick self-checks"
                }
              ],
              "content": [
                {
                  "type": "paragraph",
                  "content": [
                    {
                      "type": "text",
                      "content": "Add up all the counts in your row to see if they equal the total number of dots shown in the plot."
                    }
                  ]
                },
                {
                  "type": "paragraph",
                  "content": [
                    {
                      "type": "text",
                      "content": "Scan across the axis and confirm that every counted dot is assigned to exactly one label with no extras or omissions."
                    }
                  ]
                }
              ]
            }
          ],
          "preamble": {
            "summary": [
              {
                "type": "text",
                "content": "You accurately read the dot plot by matching each labeled number of cows to the number of dots above it."
              },
              {
                "type": "text",
                "content": " Your table entries correctly represent the frequency of farmers for those categories."
              }
            ],
            "correctness": "correct"
          }
        }
      },
      "INCORRECT": {
        "content": {
          "steps": [
            {
              "type": "step",
              "title": [
                {
                  "type": "text",
                  "content": "Read the dot plot by column"
                }
              ],
              "content": [
                {
                  "type": "widgetRef",
                  "widgetId": "dot_plot_results",
                  "widgetType": "dotPlot"
                },
                {
                  "type": "paragraph",
                  "content": [
                    {
                      "type": "text",
                      "content": "For each label (31, 35, 40, 43, 47, 50), trace a vertical line above the label and count the dots in that column only."
                    }
                  ]
                },
                {
                  "type": "paragraph",
                  "content": [
                    {
                      "type": "text",
                      "content": "Do not combine dots from neighboring columns or from between tick marks."
                    }
                  ]
                }
              ]
            },
            {
              "type": "step",
              "title": [
                {
                  "type": "text",
                  "content": "Fill in the table for 35, 40, and 47"
                }
              ],
              "content": [
                {
                  "type": "paragraph",
                  "content": [
                    {
                      "type": "text",
                      "content": "Count the dots above 35 and record that count in the table under Number of Farmers for 35."
                    }
                  ]
                },
                {
                  "type": "paragraph",
                  "content": [
                    {
                      "type": "text",
                      "content": "Repeat for 40 and for 47. If a label has no dots above it, select 0."
                    }
                  ]
                },
                {
                  "type": "paragraph",
                  "content": [
                    {
                      "type": "text",
                      "content": "Use the given entries as a check: the columns for 31 and 43 each show 1 farmer, and 50 shows 4 farmers; your counts for those columns on the plot should match these."
                    }
                  ]
                }
              ]
            },
            {
              "type": "step",
              "title": [
                {
                  "type": "text",
                  "content": "Self-check your work"
                }
              ],
              "content": [
                {
                  "type": "paragraph",
                  "content": [
                    {
                      "type": "text",
                      "content": "Ask yourself: Did I count exactly the dots that sit directly above each label and no others?"
                    }
                  ]
                },
                {
                  "type": "paragraph",
                  "content": [
                    {
                      "type": "text",
                      "content": "Do my counts for the checked columns (31, 43, 50) match the numbers already filled in the table?"
                    }
                  ]
                }
              ]
            }
          ],
          "preamble": {
            "summary": [
              {
                "type": "text",
                "content": "The counts you entered do not match what the dot plot shows for one or more columns."
              },
              {
                "type": "text",
                "content": " Each dot represents one farmer; count only the dots directly above each labeled number of cows."
              }
            ],
            "correctness": "incorrect"
          }
        }
      }
    }
  },
  "identifier": "farmers-cows-dot-plot-table",
  "feedbackPlan": {
    "mode": "fallback",
    "dimensions": [
      {
        "keys": [
          "CNT_0",
          "CNT_1",
          "CNT_2",
          "CNT_3",
          "CNT_4",
          "CNT_5",
          "CNT_17"
        ],
        "kind": "enumerated",
        "responseIdentifier": "RESPONSE_DROPDOWN_35"
      },
      {
        "keys": [
          "CNT_0",
          "CNT_1",
          "CNT_2",
          "CNT_3",
          "CNT_4",
          "CNT_5",
          "CNT_17"
        ],
        "kind": "enumerated",
        "responseIdentifier": "RESPONSE_DROPDOWN_40"
      },
      {
        "keys": [
          "CNT_0",
          "CNT_1",
          "CNT_2",
          "CNT_3",
          "CNT_4",
          "CNT_5",
          "CNT_17"
        ],
        "kind": "enumerated",
        "responseIdentifier": "RESPONSE_DROPDOWN_47"
      }
    ],
    "combinations": [
      {
        "id": "CORRECT",
        "path": []
      },
      {
        "id": "INCORRECT",
        "path": []
      }
    ]
  },
  "interactions": {
    "dropdown_35": {
      "type": "inlineChoiceInteraction",
      "choices": [
        {
          "content": [
            {
              "type": "text",
              "content": "0"
            }
          ],
          "identifier": "CNT_0"
        },
        {
          "content": [
            {
              "type": "text",
              "content": "1"
            }
          ],
          "identifier": "CNT_1"
        },
        {
          "content": [
            {
              "type": "text",
              "content": "2"
            }
          ],
          "identifier": "CNT_2"
        },
        {
          "content": [
            {
              "type": "text",
              "content": "3"
            }
          ],
          "identifier": "CNT_3"
        },
        {
          "content": [
            {
              "type": "text",
              "content": "4"
            }
          ],
          "identifier": "CNT_4"
        },
        {
          "content": [
            {
              "type": "text",
              "content": "5"
            }
          ],
          "identifier": "CNT_5"
        },
        {
          "content": [
            {
              "type": "text",
              "content": "17"
            }
          ],
          "identifier": "CNT_17"
        }
      ],
      "shuffle": true,
      "responseIdentifier": "RESPONSE_DROPDOWN_35"
    },
    "dropdown_40": {
      "type": "inlineChoiceInteraction",
      "choices": [
        {
          "content": [
            {
              "type": "text",
              "content": "0"
            }
          ],
          "identifier": "CNT_0"
        },
        {
          "content": [
            {
              "type": "text",
              "content": "1"
            }
          ],
          "identifier": "CNT_1"
        },
        {
          "content": [
            {
              "type": "text",
              "content": "2"
            }
          ],
          "identifier": "CNT_2"
        },
        {
          "content": [
            {
              "type": "text",
              "content": "3"
            }
          ],
          "identifier": "CNT_3"
        },
        {
          "content": [
            {
              "type": "text",
              "content": "4"
            }
          ],
          "identifier": "CNT_4"
        },
        {
          "content": [
            {
              "type": "text",
              "content": "5"
            }
          ],
          "identifier": "CNT_5"
        },
        {
          "content": [
            {
              "type": "text",
              "content": "17"
            }
          ],
          "identifier": "CNT_17"
        }
      ],
      "shuffle": true,
      "responseIdentifier": "RESPONSE_DROPDOWN_40"
    },
    "dropdown_47": {
      "type": "inlineChoiceInteraction",
      "choices": [
        {
          "content": [
            {
              "type": "text",
              "content": "0"
            }
          ],
          "identifier": "CNT_0"
        },
        {
          "content": [
            {
              "type": "text",
              "content": "1"
            }
          ],
          "identifier": "CNT_1"
        },
        {
          "content": [
            {
              "type": "text",
              "content": "2"
            }
          ],
          "identifier": "CNT_2"
        },
        {
          "content": [
            {
              "type": "text",
              "content": "3"
            }
          ],
          "identifier": "CNT_3"
        },
        {
          "content": [
            {
              "type": "text",
              "content": "4"
            }
          ],
          "identifier": "CNT_4"
        },
        {
          "content": [
            {
              "type": "text",
              "content": "5"
            }
          ],
          "identifier": "CNT_5"
        },
        {
          "content": [
            {
              "type": "text",
              "content": "17"
            }
          ],
          "identifier": "CNT_17"
        }
      ],
      "shuffle": true,
      "responseIdentifier": "RESPONSE_DROPDOWN_47"
    }
  },
  "responseDeclarations": [
    {
      "correct": "CNT_3",
      "baseType": "identifier",
      "identifier": "RESPONSE_DROPDOWN_35",
      "cardinality": "single"
    },
    {
      "correct": "CNT_2",
      "baseType": "identifier",
      "identifier": "RESPONSE_DROPDOWN_40",
      "cardinality": "single"
    },
    {
      "correct": "CNT_0",
      "baseType": "identifier",
      "identifier": "RESPONSE_DROPDOWN_47",
      "cardinality": "single"
    }
  ]
}
```

### General rule
- Templates must clone the source item's interaction pattern exactly—interaction type, placement inside body structures, and interaction count all have to match. There is **no** fallback or alternate interaction allowed.

### Fix
- Mirror the table plus inline dropdown arrangement from the source item; only update the concrete numbers or text that populate that structure while keeping the interaction skeleton untouched.
