import sys
import json
import joblib
import pandas as pd
import os

current_dir = os.path.dirname(
    os.path.abspath(__file__)
)

model_path = os.path.join(
    current_dir,
    "company_predictor.pkl"
)

model = joblib.load(
    model_path
)

input_data = json.loads(
    sys.stdin.read()
)

sample = pd.DataFrame(
{
    "cgpa":
    [input_data["cgpa"]],

    "department":
    [input_data["department"]]
}
)

probs = model.predict_proba(
    sample
)[0]

classes = model.classes_

results = list(
    zip(
        classes,
        probs
    )
)

results.sort(
    key=lambda x:x[1],
    reverse=True
)

top5 = []

for company,prob in results[:5]:
    top5.append(
    {
        "company":
        company,

        "probability":
        round(
            prob*100,
            2
        )
    })

print(
    json.dumps(top5)
)