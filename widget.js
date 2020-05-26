var form = document.querySelector("#nhs_Form");
var stateSelect = document.querySelector("#state");
var input = document.querySelector("#searchtext");

// validate that the input field is not empty
form.addEventListener("submit", function(event){
    var error = document.querySelector("#formError");
    if(input.value === ""){
        error.style.display = "block";
        event.preventDefault();
    }
})

// hide error on input change
input.addEventListener("input", function(event){
    var error = document.querySelector("#formError");

    if(error.style.display === "block"){
        error.style.display = "none";
    }
})

// if default, add it to the select
if (DEFAULT_STATE) {
    var firstOption = stateSelect.querySelector("option");
    firstOption.value = DEFAULT_STATE;
}

// if refer, add it to the url
if(REFER){
    var referInput = document.createElement("input");
    referInput.setAttribute("type", "hidden");
    referInput.setAttribute("name", "refer");
    referInput.id ="refer";
    referInput.value = REFER;
    form.appendChild(referInput);
}

//open in a new tab if correctly set in the parameters
if (NEW_WINDOW) {
    form.target = "_blank";
}

//Create an XHR Request to obtain the states and 
if (PARTNER_ID) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            var partnerInfo = getInfoFromResponse(JSON.parse(xhr.response));
            changeSiteUrl(partnerInfo);
            addStates(partnerInfo.states);
        }
    };
    xhr.open("GET", "https://mvc.newhomesource.com/getpartnerinfo?id=9101", true);
    xhr.send();
}

function changeSiteUrl(partnerInfo) {
    form.action = form.action.replace("newhomesource.com", "newhomesource.com/" + partnerInfo.siteUrl)
}

function addStates(states) {
    for (var index = 0; index < states.length; index++) {
        var state = states[index];

        var newOption = document.createElement("option");
        newOption.value = state.abbr;
        newOption.innerText = state.name;

        stateSelect.appendChild(newOption);
    }
}

function getInfoFromResponse(response) {
    var states = getStates(response.States);
    var siteUrl = "";
    if (PARTNER_ID !== 1 && PARTNER_ID !== 600) {
        siteUrl = response.PartnerDetails.SiteUrl;
    }

    return {
        states,
        siteUrl
    }
}

function getStates(states) {
    var parsedStates = [];

    for (var index = 0; index < states.length; index++) {
        var element = states[index];

        parsedStates.push({
            name: element.StateName,
            abbr: element.StateAbbr
        })
    }
    return parsedStates;
}