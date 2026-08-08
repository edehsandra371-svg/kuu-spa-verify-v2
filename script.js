/*

KUU SPA+ PRODUCT VERIFICATION SYSTEM
Version 2.0
Daisy Creative Studio

*/

/* =======================================================
DATABASE
======================================================= */

let serialDatabase = [];

let databaseLoaded = false;

/* =======================================================
PAGE ELEMENTS
======================================================= */

const serialInput = document.getElementById("serial");

const verifyButton = document.getElementById("verifyButton");

const buttonText = document.getElementById("buttonText");

const statusMessage = document.getElementById("status");

const resultContainer = document.getElementById("result");

const currentYear = document.getElementById("currentYear");

/* =======================================================
CURRENT YEAR
======================================================= */

if (currentYear) {

currentYear.textContent = new Date().getFullYear();

}

/* =======================================================
LOAD SERIAL DATABASE
======================================================= */

async function loadSerialDatabase() {

try {

    statusMessage.textContent =
        "Loading verification database...";

    const response =
        await fetch("batch1_serials.json", {
            cache: "no-store"
        });


    if (!response.ok) {

        throw new Error(
            "Database could not be loaded."
        );

    }


    const data = await response.json();


    if (!Array.isArray(data)) {

        throw new Error(
            "Invalid database format."
        );

    }


    serialDatabase = data
        .map(serial =>
            String(serial)
                .trim()
                .toUpperCase()
        )
        .filter(Boolean);


    databaseLoaded = true;


    statusMessage.innerHTML =
        "✅ Verification database ready.";


} catch (error) {

    databaseLoaded = false;


    statusMessage.innerHTML =
        "❌ Verification database could not be loaded.";


    console.error(
        "Database error:",
        error
    );

}

}

/* =======================================================
NORMALIZE SERIAL NUMBER
======================================================= */

function normalizeSerial(value) {

return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "");

}

/* =======================================================
VERIFY PRODUCT
======================================================= */

function verifyProduct() {

const code =
    normalizeSerial(
        serialInput.value
    );


/* Clear previous result */

resultContainer.innerHTML = "";


/* Empty input */

if (!code) {

    resultContainer.innerHTML = `

        <div class="result-card error">

            <div class="badge">⚠️</div>

            <h2>ENTER SERIAL NUMBER</h2>

            <p>
                Please enter the serial number
                printed on your KUU SPA+ product.
            </p>

        </div>

    `;

    serialInput.focus();

    return;

}


/* Database not ready */

if (!databaseLoaded) {

    resultContainer.innerHTML = `

        <div class="result-card error">

            <div class="badge">⚠️</div>

            <h2>SYSTEM NOT READY</h2>

            <p>
                The verification database has not
                finished loading. Please try again
                in a moment.
            </p>

        </div>

    `;

    return;

}


/* Show loading state */

setLoadingState(true);


/*
Small delay gives the user visual feedback
and keeps the interface feeling responsive.
*/

setTimeout(() => {

    const isAuthentic =
        serialDatabase.includes(code);


    if (isAuthentic) {

        showAuthenticProduct(code);

    } else {

        showInvalidProduct(code);

    }


    setLoadingState(false);

}, 350);

}

/* =======================================================
AUTHENTIC PRODUCT RESULT
======================================================= */

function showAuthenticProduct(code) {

const batch =
    getBatchFromSerial(code);


const verificationTime =
    new Date().toLocaleString();


resultContainer.innerHTML = `

    <div class="result-card success">

        <div class="badge">✅</div>

        <h2>AUTHENTIC PRODUCT</h2>

        <p>
            This serial number has been successfully
            verified.
        </p>


        <div class="product-details">

            <p>
                <strong>Product:</strong><br>
                KUU SPA+ Turmeric Whitening Serum
            </p>


            <p>
                <strong>Serial Number:</strong><br>
                ${escapeHTML(code)}
            </p>


            <p>
                <strong>Batch:</strong><br>
                ${escapeHTML(batch)}
            </p>


            <p>
                <strong>Verification Time:</strong><br>
                ${escapeHTML(verificationTime)}
            </p>

        </div>


        <p>
            This product is registered in the
            official KUU SPA+ verification database.
        </p>


        <button
            type="button"
            class="verify-again"
            onclick="resetVerification()"
        >
            Verify Another Product
        </button>

    </div>

`;

}

/* =======================================================
INVALID PRODUCT RESULT
======================================================= */

function showInvalidProduct(code) {

resultContainer.innerHTML = `

    <div class="result-card error">

        <div class="badge">❌</div>

        <h2>INVALID SERIAL NUMBER</h2>


        <p>
            The serial number entered was not found
            in the official KUU SPA+ database.
        </p>


        <div class="product-details">

            <p>
                <strong>Serial Entered:</strong><br>
                ${escapeHTML(code)}
            </p>

        </div>


        <p>
            Please check the serial number carefully.
            If you believe this product is genuine,
            contact your authorized distributor.
        </p>


        <button
            type="button"
            class="verify-again"
            onclick="resetVerification()"
        >
            Try Again
        </button>

    </div>

`;

}

/* =======================================================
EXTRACT BATCH
======================================================= */

function getBatchFromSerial(code) {

const parts =
    code.split("-");


if (
    parts.length >= 3 &&
    parts[1]
) {

    return parts[1];

}


return "B1";

}

/* =======================================================
RESET VERIFICATION
======================================================= */

function resetVerification() {

serialInput.value = "";

resultContainer.innerHTML = "";

statusMessage.innerHTML =
    databaseLoaded
        ? "✅ Verification database ready."
        : "Loading verification database...";

serialInput.focus();

}

/* =======================================================
LOADING STATE
======================================================= */

function setLoadingState(isLoading) {

if (!verifyButton) {
    return;
}


verifyButton.disabled =
    isLoading;


if (isLoading) {

    buttonText.innerHTML =
        `<span class="loading">Verifying...</span>`;

} else {

    buttonText.textContent =
        "Verify Product";

}

}

/* =======================================================
ENTER KEY SUPPORT
======================================================= */

if (serialInput) {

serialInput.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Enter"
        ) {

            event.preventDefault();

            verifyProduct();

        }

    }
);

}

/* =======================================================
SAFE HTML OUTPUT
======================================================= */

function escapeHTML(value) {

return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}

/* =======================================================
START DATABASE LOADING
======================================================= */

loadSerialDatabase();
