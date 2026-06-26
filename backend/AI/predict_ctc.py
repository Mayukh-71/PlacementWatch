import sys
import json
import joblib
import pandas as pd
import sys
import os

current_dir = os.path.dirname(
    os.path.abspath(__file__)
)

model_path = os.path.join(
    current_dir,
    "ctc_predictor.pkl"
)

model = joblib.load(
    model_path
)
input_data = json.loads(
    sys.stdin.read()
)
print(input_data, file=sys.stderr)
sample = pd.DataFrame(
{
    "cgpa":
    [input_data["cgpa"]],

    "department":
    [input_data["department"]],

    "difficulty":
    [input_data["difficulty"]],

    "role":
    [input_data["role"]],

    "year":
    [input_data["year"]]
}
)

prediction = model.predict(
    sample
)

print(
    round(
        float(prediction[0]),
        2
    )
)