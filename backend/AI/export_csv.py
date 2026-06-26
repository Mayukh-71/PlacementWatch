from pymongo import MongoClient
import pandas as pd

MONGO_URI = "mongodb+srv://mayukh_71:ILoveC123@cluster0.meg3dzn.mongodb.net/PlacementWatch?retryWrites=true&w=majority&appName=Cluster0"

client = MongoClient(MONGO_URI)

db = client["PlacementWatch"]

placements = list(
    db.placements.find()
)

data = []

for p in placements:

    data.append({
        "company":
            p.get("company"),

        "role":
            p.get("role"),

        "ctc":
            p.get("ctc"),

        "cgpa":
            p.get("cgpa"),

        "department":
            p.get("department"),

        "year":
            p.get("year"),

        "difficulty":
            p.get("difficulty"),

        "submittedBy":
            p.get("submittedBy")
    })

df = pd.DataFrame(data)

df.to_csv(
    "placements.csv",
    index=False
)

print(
    f"{len(df)} rows exported."
)