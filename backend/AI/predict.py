import pandas as pd
import joblib

model = joblib.load(
    "company_predictor.pkl"
)

cgpa = float(
    input("CGPA: ")
)

department = input(
    "Department: "
)

sample = pd.DataFrame(
{
    "cgpa":[cgpa],

    "department":[department]
}
)

probs = model.predict_proba(sample)[0]

classes = model.classes_

results = list(
    zip(classes, probs)
)

results.sort(
    key=lambda x: x[1],
    reverse=True
)

print("\nTop 5 Predictions:\n")

for company, prob in results[:5]:
    print(
        f"{company}: {prob*100:.2f}%"
    )