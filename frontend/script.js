console.log("Hello PlacementWatch");
const API_BASE =
window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://placementwatch-production.up.railway.app";
function searchCompany()
{
    let searchText =document.getElementById("searchInput").value.toLowerCase();
    let filteredPlacements = [];
    for(let i=0;i<placements.length;i++)
    {
        if(placements[i].company.toLowerCase().includes(searchText))
            filteredPlacements.push(placements[i]);
    }
    console.log(filteredPlacements);
    displayPlacements(filteredPlacements);
}
function showMessage()
{
    alert("PlacementWatch helps students explore placement data.");
}
let placements=[];
function displayPlacements(data)
{
    let container =
        document.getElementById(
            "placementsContainer"
        );

    container.innerHTML = "";

    for(let i = 0; i < data.length; i++)
    {
        let card =
            document.createElement(
                "div"
            );

        card.classList.add(
            "placement-card"
        );

        card.innerHTML =

        "<h3>" +

        "<a href='company.html?company=" +
        encodeURIComponent(
            data[i].company
        ) +
        "'>" +

        data[i].company +

        "</a>" +

        "</h3>" +

        "<p><b>Role:</b> " +
        data[i].role +
        "</p>" +

        "<p><b>CTC:</b> " +
        data[i].ctc +
        " LPA</p>" +

        "<p><b>Department:</b> " +
        (data[i].department || "N/A") +
        "</p>" +

        "<p><b>Difficulty:</b> " +
        (data[i].difficulty || "N/A") +
        "/10</p>" +

        "<a href='placement.html?id=" +
        data[i]._id +
        "'>View Full Experience</a>";

        container.appendChild(
            card
        );
    }
}
function showAllPlacements()
{
    displayPlacements(placements);
}
async function addPlacement()
{
    const token =
    localStorage.getItem("token");

    if(!token)
    {
        alert(
            "Please login first"
        );

        window.location.href =
        "login.html";

        return;
    }
    let company =document.getElementById("companyInput").value;
    let role =document.getElementById("roleInput").value;
    let ctc =document.getElementById("ctcInput").value;
    let cgpa =document.getElementById("cgpaInput").value;
    let department =document.getElementById("departmentInput").value;
    let year =document.getElementById("yearInput").value;
    let difficulty =document.getElementById("difficultyInput").value;
    let oaExperience =document.getElementById("oaInput").value;
    let interviewExperience =document.getElementById("interviewInput").value;
    if(company === "" || role === "" || ctc === "")
    {
        alert("Please fill all fields marked with *");
        return;
    }
    let placement =
    {
        company: company,
        role: role,
        ctc: Number(ctc),
        cgpa: Number(cgpa),
        department,
        year: Number(year),
        difficulty:Number(difficulty),
        oaExperience,
        interviewExperience
    };
    const response =
        await fetch(
        API_BASE +"/placements",
        {
            method: "POST",
            headers:
            {
                "Content-Type":
                "application/json",

                "Authorization":
                "Bearer " +
                localStorage.getItem("token")
            },
            body:
            JSON.stringify(placement)
        }
    );
    const data =await response.json();
    alert(data.message);
    await loadPlacements();
}
async function loadPlacements()
{
    const response =
        await fetch(
            API_BASE +"/placements"
        );

    placements =
        await response.json();

    displayPlacements(placements);
}
if(
    document.getElementById("placementsContainer")
    &&
    !document.getElementById("companyName")
    &&
    !window.location.pathname.includes("myplacements")
)
{
    loadPlacements();
}
async function loadStats()
{
    const response =
        await fetch(
            API_BASE +"/stats"
        );

    const stats =
        await response.json();

    document.getElementById(
        "totalPlacements"
    ).innerHTML =
        stats.totalPlacements;

    document.getElementById(
        "averageCTC"
    ).innerHTML =
        stats.averageCTC.toFixed(2);

    document.getElementById(
        "highestCTC"
    ).innerHTML =
        stats.highestCTC;

    document.getElementById(
        "totalCompanies"
    ).innerHTML =
        stats.totalCompanies;
}
if(document.getElementById("totalPlacements"))
{
    loadStats();
}
async function loadChart()
{
    const response =
        await fetch(
            API_BASE +"/company-stats"
        );

    const data =
        await response.json();

    const labels = [];
    const values = [];

    for(let i=0;i<data.length;i++)
    {
        labels.push(
            data[i].company
        );

        values.push(
            data[i].avgCTC
        );
    }

    new Chart(
        document.getElementById(
            "ctcChart"
        ),
        {
            type: "bar",

            data:
            {
                labels: labels,

                datasets:
                [
                    {
                        label:
                        "Average CTC",

                        data:
                        values
                    }
                ]
            }
        }
    );
}
if(document.getElementById("ctcChart"))
{
    loadChart();
}
async function loginUser()
{
    let username =
    document.getElementById(
        "usernameInput"
    ).value;

    let password =
    document.getElementById(
        "passwordInput"
    ).value;

    const response =
    await fetch(
        API_BASE +"/login",
        {
            method:"POST",

            headers:
            {
                "Content-Type":
                "application/json"
            },

            body:
            JSON.stringify(
            {
                username,
                password
            })
        }
    );

    const data =
    await response.json();

    if(data.token)
    {
        localStorage.setItem(
            "token",
            data.token
        );

        alert(
            "Login Successful"
        );
        window.location.href = "index.html";
    }
    else
    {
        alert(
            data.error
        );
    }
}
function logout()
{
    localStorage.removeItem("token");

    alert("Logged Out Successfully");

    window.location.href =
        "login.html";
}
function updateNavbar()
{
    const authSection =
        document.getElementById(
            "authSection"
        );

    if(!authSection)
        return;

    const token =
        localStorage.getItem(
            "token"
        );

    if(token)
    {
        const user =
            parseJWT(token);

        authSection.innerHTML =
        `
        <span>
            Welcome, ${user.username}
        </span>

        <button
            type="button"
            onclick="logout()">
            Logout
        </button>

        <button
            type="button"
            onclick="deleteAccount()">
            Delete Account
        </button>
        `;
    }
    else
    {
        authSection.innerHTML =
        `
        <a href="login.html">
            Login
        </a>
        <a href="register.html">
            Register
        </a>
        `;
    }
}
updateNavbar();
function parseJWT(token)
{
    return JSON.parse(
        atob(
            token.split(".")[1]
        )
    );
}
async function loadMyPlacements()
{
    const token =
    localStorage.getItem(
        "token"
    );

    if(!token)
    {
        alert(
            "Please login"
        );

        window.location.href =
        "login.html";

        return;
    }

    const response =
    await fetch(
    API_BASE +"/my-placements",
    {
        headers:
        {
            Authorization:
            "Bearer " + token
        }
    });

    const data =
    await response.json();

    displayPlacements(
        data
    );
}
if(
document.getElementById(
    "placementsContainer"
)
&&
window.location.pathname
.includes(
    "myplacements"
))
{
    loadMyPlacements();
}
function searchPlacements()
{
    let searchText =
    document.getElementById(
        "searchInput"
    ).value.toLowerCase();

    let filtered = [];

    for(let i=0;i<placements.length;i++)
    {
        if(
        placements[i]
        .company
        .toLowerCase()
        .includes(searchText))
        {
            filtered.push(
                placements[i]
            );
        }
    }

    displayPlacements(
        filtered
    );
}
function filterDepartment()
{
    let dept =
    document.getElementById(
        "departmentFilter"
    ).value;

    let filtered = [];

    for(let i=0;i<placements.length;i++)
    {
        if(
        placements[i]
        .department === dept
        )
        {
            filtered.push(
                placements[i]
            );
        }
    }

    displayPlacements(
        filtered
    );
}
async function loadCompanyPage()
{
    const params =
        new URLSearchParams(
            window.location.search
        );

    const company =
        params.get("company");

    if(!company)
        return;

    document.getElementById(
        "companyName"
    ).innerHTML =
        company;

    const response =
        await fetch(
        API_BASE +"/company/" +
        company
        );

    const data =
        await response.json();

    displayPlacements(data);
    showCompanyStats(data);
    
    console.log("Loading company:", company);
}
if(
document.getElementById(
    "companyName"
))
{
    loadCompanyPage();
}
function showCompanyStats(data)
{
    let totalCTC = 0;
    let highestCTC = 0;
    let totalDifficulty = 0;
    let difficultyCount = 0;

    for(let i=0;i<data.length;i++)
    {
        totalCTC += data[i].ctc;

        highestCTC =
        Math.max(
            highestCTC,
            data[i].ctc
        );

        if(data[i].difficulty)
        {
            totalDifficulty +=
                data[i].difficulty;

            difficultyCount++;
        }
    }

    let averageCTC =
        data.length === 0
        ? 0
        : totalCTC / data.length;

    let averageDifficulty =
        difficultyCount === 0
        ? 0
        : totalDifficulty /
          difficultyCount;

    document.getElementById(
        "companyStats"
    ).innerHTML =

    "<p><b>Offers:</b> "
    + data.length +
    "</p>" +

    "<p><b>Average CTC:</b> "
    + averageCTC.toFixed(2)
    + " LPA</p>" +

    "<p><b>Highest CTC:</b> "
    + highestCTC
    + " LPA</p>" +

    "<p><b>Average Difficulty:</b> "
    + averageDifficulty.toFixed(1)
    + "/10</p>";
}
function sortPlacements()
{
    let option =
    document.getElementById(
        "sortSelect"
    ).value;

    let sorted =
        [...placements];

    if(option === "ctcHigh")
    {
        sorted.sort(
        (a,b) =>
        b.ctc - a.ctc
        );
    }

    else if(option === "ctcLow")
    {
        sorted.sort(
        (a,b) =>
        a.ctc - b.ctc
        );
    }

    else if(
    option ===
    "difficultyHigh")
    {
        sorted.sort(
        (a,b) =>
        (b.difficulty || 0)
        -
        (a.difficulty || 0)
        );
    }

    else if(
    option ===
    "difficultyLow")
    {
        sorted.sort(
        (a,b) =>
        (a.difficulty || 0)
        -
        (b.difficulty || 0)
        );
    }

    displayPlacements(
        sorted
    );
}
console.log("Script loaded");
async function loadPlacementPage()
{
    console.log("loadPlacementPage called");

    const params =
    new URLSearchParams(
        window.location.search
    );

    const id =
    params.get("id");

    console.log("ID =", id);

    if(!id)
        return;

    const response =
    await fetch(
        API_BASE +"/placement/" +
        id
    );

    console.log(
        "Response Status =",
        response.status
    );

    const data =
    await response.json();

    console.log("Data =", data);

    const token =
    localStorage.getItem("token");

    let controls = "";

    if(token)
    {
        const user =
        parseJWT(token);

        if(
        user.username ===
        data.submittedBy
        )
        {
            controls = `
            <button onclick="editPlacement('${data._id}')">
                Edit
            </button>

            <button onclick="deletePlacement('${data._id}')">
                Delete
            </button>
            `;
        }
    }

    document.getElementById(
        "placementTitle"
    ).innerHTML =
        data.company;

    document.getElementById(
        "placementDetails"
    ).innerHTML =
    `
    <p><b>Role:</b> ${data.role}</p>

    <p><b>CTC:</b> ${data.ctc} LPA</p>

    <p><b>CGPA:</b> ${data.cgpa || "N/A"}</p>

    <p><b>Department:</b>
    ${data.department || "N/A"}
    </p>

    <p><b>Difficulty:</b>
    ${data.difficulty || "N/A"}/10
    </p>

    <p><b>OA Experience:</b><br>
    ${data.oaExperience || "N/A"}
    </p>

    <p><b>Interview Experience:</b><br>
    ${data.interviewExperience || "N/A"}
    </p>

    <p><b>Submitted By:</b>
    ${data.submittedBy || "Anonymous"}
    </p>

    ${controls}
    `;
}
if(document.getElementById("placementTitle"))
{
    console.log("Calling loadPlacementPage");
    loadPlacementPage();
}
async function deletePlacement(id)
{
    if(!confirm("Delete this placement?"))
        return;

    const token =
        localStorage.getItem("token");

    const response =
    await fetch(
        API_BASE +"/placement/" + id,
        {
            method: "DELETE",

            headers:
            {
                Authorization:
                "Bearer " + token
            }
        }
    );

    const data =
        await response.json();

    alert(data.message);

    window.location.href =
        "index.html";
}
function editPlacement(id)
{
    window.location.href =
    "edit.html?id=" + id;
}
async function loadEditPage()
{
    const params =
    new URLSearchParams(
        window.location.search
    );

    const id =
    params.get("id");

    if(!id)
        return;

    const response =
    await fetch(
        API_BASE +"/placement/" +
        id
    );

    const data =
    await response.json();

    document.getElementById(
        "companyInput"
    ).value =
        data.company || "";

    document.getElementById(
        "roleInput"
    ).value =
        data.role || "";

    document.getElementById(
        "ctcInput"
    ).value =
        data.ctc || "";

    document.getElementById(
        "cgpaInput"
    ).value =
        data.cgpa || "";

    document.getElementById(
        "departmentInput"
    ).value =
        data.department || "";

    document.getElementById(
        "difficultyInput"
    ).value =
        data.difficulty || "";

    document.getElementById(
        "oaInput"
    ).value =
        data.oaExperience || "";

    document.getElementById(
        "interviewInput"
    ).value =
        data.interviewExperience || "";
}
async function updatePlacement()
{
    const params =
    new URLSearchParams(
        window.location.search
    );

    const id =
    params.get("id");

    const token =
    localStorage.getItem(
        "token"
    );

    const placement =
    {
        company:
        document.getElementById(
            "companyInput"
        ).value,

        role:
        document.getElementById(
            "roleInput"
        ).value,

        ctc:
        Number(
        document.getElementById(
            "ctcInput"
        ).value),

        cgpa:
        Number(
        document.getElementById(
            "cgpaInput"
        ).value),

        department:
        document.getElementById(
            "departmentInput"
        ).value,

        difficulty:
        Number(
        document.getElementById(
            "difficultyInput"
        ).value),

        oaExperience:
        document.getElementById(
            "oaInput"
        ).value,

        interviewExperience:
        document.getElementById(
            "interviewInput"
        ).value
    };

    const response =
    await fetch(
        API_BASE +"/placement/" +
        id,
        {
            method: "PUT",

            headers:
            {
                "Content-Type":
                "application/json",

                Authorization:
                "Bearer " + token
            },

            body:
            JSON.stringify(
                placement
            )
        }
    );

    const data =
    await response.json();

    alert(
        "Placement Updated"
    );

    window.location.href =
    "placement.html?id=" + id;
}
if(
document.getElementById(
    "companyInput"
)
&&
window.location.pathname
.includes("edit")
)
{
    loadEditPage();
}
async function registerUser()
{
    const username =
    document.getElementById(
        "usernameInput"
    ).value;

    const password =
    document.getElementById(
        "passwordInput"
    ).value;

    const response =
    await fetch(
        API_BASE +"/register",
        {
            method: "POST",

            headers:
            {
                "Content-Type":
                "application/json"
            },

            body:
            JSON.stringify(
            {
                username,
                password
            })
        }
    );

    const data =
    await response.json();

    if(data.message)
    {
        alert(
            "Registration Successful"
        );

        window.location.href =
        "login.html";
    }
    else
    {
        alert(
            data.error
        );
    }
}
async function deleteAccount()
{
    const confirmed =
    confirm(
        "This will permanently delete your account and ALL placement records submitted by you. Continue?"
    );

    if(!confirmed)
        return;

    const token =
    localStorage.getItem(
        "token"
    );

    const response =
    await fetch(
        API_BASE +"/user",
        {
            method: "DELETE",

            headers:
            {
                Authorization:
                "Bearer " + token
            }
        }
    );

    const data =
    await response.json();

    alert(
        data.message
    );

    localStorage.removeItem(
        "token"
    );

    window.location.href =
        "index.html";
}
async function loadHomeStats()
{
    const response =
    await fetch(
        API_BASE +"/stats"
    );

    const stats =
    await response.json();

    document.getElementById(
        "homeAverageCTC"
    ).innerHTML =
        stats.averageCTC.toFixed(2) +
        " LPA";

    document.getElementById(
        "homeCompanies"
    ).innerHTML =
        stats.totalCompanies;

    document.getElementById(
        "homeSubmissions"
    ).innerHTML =
        stats.totalPlacements;
}
if(
document.getElementById(
    "homeAverageCTC"
))
{
    loadHomeStats();
}
async function loadCompanySuggestions()
{
    const response =
    await fetch(
        API_BASE +"/placements"
    );

    const placements =
    await response.json();

    const companies =
    new Set();

    for(let i=0;i<placements.length;i++)
    {
        companies.add(
            placements[i].company
        );
    }

    const datalist =
    document.getElementById(
        "companyList"
    );

    datalist.innerHTML = "";

    companies.forEach(company =>
    {
        const option =
        document.createElement(
            "option"
        );

        option.value =
            company;

        datalist.appendChild(
            option
        );
    });
}
if(
document.getElementById(
    "companyList"
))
{
    loadCompanySuggestions();
}
async function sendOTP()
{
    const email =
    document.getElementById(
        "emailInput"
    ).value;

    const username =
    document.getElementById(
        "usernameInput"
    ).value;

    const response =
    await fetch(
    API_BASE +"/send-otp",
    {
        method:"POST",

        headers:
        {
            "Content-Type":
            "application/json"
        },

        body:
        JSON.stringify(
        {
            email,
            username
        })
    });

    const data =
    await response.json();

    if(response.ok)
    {
        alert(data.message);
    }
    else
    {
        alert(data.error);
    }
}
async function verifyAndRegister()
{
    const email =
    document.getElementById(
        "emailInput"
    ).value;

    const username =
    document.getElementById(
        "usernameInput"
    ).value;

    const password =
    document.getElementById(
        "passwordInput"
    ).value;

    const otp =
    document.getElementById(
        "otpInput"
    ).value;

    const response =
    await fetch(
    API_BASE +"/verify-register",
    {
        method:"POST",

        headers:
        {
            "Content-Type":
            "application/json"
        },

        body:
        JSON.stringify(
        {
            email,
            username,
            password,
            otp
        })
    });

    const data =
    await response.json();

    if(data.message)
    {
        alert(
            data.message
        );

        window.location.href =
            "login.html";
    }
    else
    {
        alert(
            data.error
        );
    }
}
async function sendResetOTP()
{
    const email =
    document.getElementById(
        "emailInput"
    ).value;

    const response =
    await fetch(
    API_BASE +"/forgot-password",
    {
        method:"POST",

        headers:
        {
            "Content-Type":
            "application/json"
        },

        body:
        JSON.stringify(
        {
            email
        })
    });

    const data =
    await response.json();

    alert(
        data.message ||
        data.error
    );
}
async function resetPassword()
{
    const email =
    document.getElementById(
        "emailInput"
    ).value;

    const otp =
    document.getElementById(
        "otpInput"
    ).value;

    const newPassword =
    document.getElementById(
        "newPasswordInput"
    ).value;

    const response =
    await fetch(
    API_BASE +"/reset-password",
    {
        method:"POST",

        headers:
        {
            "Content-Type":
            "application/json"
        },

        body:
        JSON.stringify(
        {
            email,
            otp,
            newPassword
        })
    });

    const data =
    await response.json();

    alert(
        data.message ||
        data.error
    );

    if(data.message)
    {
        window.location.href =
        "login.html";
    }
}
async function predictCTC()
{
    const cgpa =
    Number(
        document.getElementById(
            "cgpaPredict"
        ).value
    );

    const department =
    document.getElementById(
        "departmentPredict"
    ).value;

    const role =
    document.getElementById(
        "rolePredict"
    ).value;

    const difficulty =
    Number(
        document.getElementById(
            "difficultyPredict"
        ).value
    );

    const year =
    Number(
        document.getElementById(
            "yearPredict"
        ).value
    );

    const response =
    await fetch(
    API_BASE +"/predict-ctc",
    {
        method:"POST",

        headers:
        {
            "Content-Type":
            "application/json"
        },

        body:
        JSON.stringify(
        {
            cgpa,
            department,
            role,
            difficulty,
            year
        })
    });

    const data =
    await response.json();

    document.getElementById(
        "predictionResult"
    ).innerHTML =
    "Predicted CTC: ₹" +
    data.predictedCTC +
    " LPA";
    await predictCompanies();
}
async function predictCompanies()
{
    const cgpa =
    Number(
    document.getElementById(
    "cgpaPredict"
    ).value);

    const department =
    document.getElementById(
    "departmentPredict"
    ).value;

    const response =
    await fetch(
    API_BASE +"/predict-company",
    {
        method:"POST",

        headers:
        {
            "Content-Type":
            "application/json"
        },

        body:
        JSON.stringify(
        {
            cgpa,
            department
        })
    });

    const data =
    await response.json();

    let html =
    "<h3>Likely Companies</h3>";

    for(let i=0;i<data.length;i++)
    {
        html +=
        "<p>" +
        (i+1) +
        ". " +
        data[i].company +
        " (" +
        data[i].probability +
        "%)</p>";
    }

    document.getElementById(
        "companyPredictionResult"
    ).innerHTML =
    html;
}
function showAdminControls()
{
    console.log("showAdminControls running");

    const token =
    localStorage.getItem("token");

    console.log("Token:", token);

    if(!token)
        return;

    const user =
    parseJWT(token);

    console.log("User:", user);

    const btn =
    document.getElementById(
        "retrainButton"
    );

    console.log("Button:", btn);

    if(user.username === "Mayukh_27")
    {
        btn.style.display =
        "inline-block";

        console.log(
            "Button shown"
        );
    }
}
showAdminControls();
async function retrainModels()
{
    if(
    !confirm(
    "Retrain AI models?"
    ))
    {
        return;
    }

    const token =
    localStorage.getItem(
        "token"
    );

    const response =
    await fetch(
    API_BASE +"/retrain-models",
    {
        method:"POST",

        headers:
        {
            Authorization:
            "Bearer " + token
        }
    });

    const data =
    await response.json();

    alert(
        data.message ||
        data.error
    );
}