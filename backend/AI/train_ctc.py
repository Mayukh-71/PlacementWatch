import pandas as pd
import joblib

from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
from sklearn.metrics import r2_score

# Load dataset
df = pd.read_csv(
    "placements.csv"
)

# Remove rows with missing values
df = df.dropna(
    subset=
    [
        "cgpa",
        "department",
        "difficulty",
        "role",
        "year",
        "ctc"
    ]
)

# Features
X = df[
[
    "cgpa",
    "department",
    "difficulty",
    "role",
    "year"
]
]

# Target
y = df["ctc"]

# Train/Test Split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# Encode categorical columns
preprocessor = ColumnTransformer(
[
    (
        "department",
        OneHotEncoder(
            handle_unknown="ignore"
        ),
        ["department"]
    ),

    (
        "role",
        OneHotEncoder(
            handle_unknown="ignore"
        ),
        ["role"]
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
        "regressor",
        RandomForestRegressor(
            n_estimators=300,
            random_state=42,
            max_depth=12
        )
    )
]
)

# Train
model.fit(
    X_train,
    y_train
)

# Evaluate
preds = model.predict(
    X_test
)

mae = mean_absolute_error(
    y_test,
    preds
)

r2 = r2_score(
    y_test,
    preds
)

print(
    "MAE:",
    round(mae,2)
)

print(
    "R2:",
    round(r2,4)
)

# Save model
joblib.dump(
    model,
    "ctc_predictor.pkl"
)

print(
    "Model saved successfully."
)