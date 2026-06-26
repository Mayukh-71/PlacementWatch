import pandas as pd
import joblib

from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# Load dataset
df = pd.read_csv("placements.csv")

# Remove rows with missing values
df = df.dropna(
    subset=[
        "cgpa",
        "department",
        "company"
    ]
)

# Features
X = df[
    [
        "cgpa",
        "department"
    ]
]

# Target
y = df["company"]

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# Preprocessing
preprocessor = ColumnTransformer(
[
(
    "department",
    OneHotEncoder(
        handle_unknown="ignore"
    ),
    ["department"]
)
],
remainder="passthrough"
)

# Model
model = Pipeline(
[
    (
        "preprocessor",
        preprocessor
    ),

    (
        "classifier",
        RandomForestClassifier(
            n_estimators=200,
            random_state=42
        )
    )
]
)

# Train
model.fit(
    X_train,
    y_train
)

# Test
predictions = model.predict(
    X_test
)

accuracy = accuracy_score(
    y_test,
    predictions
)

print(
    f"Accuracy: {accuracy:.2f}"
)

# Save model
joblib.dump(
    model,
    "company_predictor.pkl"
)

print(
    "Model saved."
)