
function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("./service-worker.js")
      .then((reg) => {
        console.log("Registration successful", reg);
      })
      .catch((e) =>
        console.error("Error during service worker registration:", e)
      );
  } else {
    console.warn("Service Worker is not supported");
  }
}
registerServiceWorker();

$(".copyButton").click(() => {
    $("#codeSnippet").removeAttr("disabled");
    $("#codeSnippet").select();
    document.execCommand("copy");
    $("#codeSnippet").attr("disabled", "true");
})

fetch("./deviceData.json")
  .then((response) => response.json())
  .then((data) => getData(data, ".deviceList"));

fetch("./deviceDataTablet.json")
  .then((response) => response.json())
  .then((data) => getData(data, ".deviceListTablet"));

  fetch("./deviceDataLaptop.json")
  .then((response) => response.json())
  .then((data) => getData(data, ".deviceListLaptop"));

  fetch("./deviceDataWearables.json")
  .then((response) => response.json())
  .then((data) => getData(data, ".deviceListWearables"));

function getData(data,className) {
  const devices = Object.keys(data);
  devices.forEach((device) => {
    const seperateDevices = device.split(",");
    seperateDevices.forEach((device) => {
        let deviceName = $.trim(device);
        let deviceNameTrimmed = deviceName.split(" ").join("");
        // console.log(deviceNameTrimmed)
      $(className).append(`<li class="device-button" id="${deviceNameTrimmed}" data-name="${deviceName}">${deviceName}</li>`);
      $(`#${deviceNameTrimmed}`).click(function (e) { 
          e.preventDefault();
          let deviceNameClicked = $(`#${e.target.id}`)[0].dataset.name
          if(deviceNameClicked === "Laptop Non-Retina" || deviceNameClicked === "Laptop Retina" || deviceNameClicked === "Moto 360 Watch") {
            const rule = createLaptopAndWearableRule({data : data[deviceNameClicked]});
            $("#codeSnippet").text(rule, null, 2)
          }
          else {
            const rule = createRules({potraitData : data[deviceNameClicked].potrait, landscapeData : data[deviceNameClicked].landscape, bothData : data[deviceNameClicked].landscapePotrait})
          $("#codeSnippet").text(rule, null, 2)
          }
          // console.log(data[deviceNameClicked])
          // console.log(data[deviceNameClicked].device === undefined)
          
      });
    });
  });
}

function createLaptopAndWearableRule({data}) {
  let rule = `
    @media screen
    ${data["min-width"] !== undefined ? ("and (min-device-width : " + data["min-width"] + ")") : ""}
    ${data["max-width"] !== undefined ? ("and (max-device-width : " + data["max-width"] + ")") : ""}
    ${data["max-height"] !== undefined ? ("and (max-device-height : " + data["max-height"] + ")") : ""}
    ${data["pixel-ratio"] !== undefined ? ("and (-webkit-min-device-pixel-ratio : " + data["pixel-ratio"] + ")") : ""}
    ${data["resolution"] !== undefined ? ("and (min-resolution : " + data["resolution"] + ")") : ""}
    {}`;

    let prettyString = prettier.format(rule, {
      parser: "css",
      plugins : prettierPlugins
    });
    return prettyString
}

function createRules({potraitData, landscapeData, bothData}) {
    let potraitRule = `
    /* Potrait */
    @media screen
    ${potraitData["min-width"] !== undefined ? ("and (min-device-width : " + potraitData["min-width"] + ")") : ""}
    ${potraitData["max-width"] !== undefined ? ("and (max-device-width : " + potraitData["max-width"] + ")") : ""}
    ${potraitData["pixel-ratio"] !== undefined ? ("and (-webkit-min-device-pixel-ratio : " + potraitData["pixel-ratio"] + ")") : ""}
    ${potraitData["orientation"] !== undefined ? ("and (orientation : " + potraitData["orientation"] + ")") : ""}
    ${potraitData["device-width"] !== undefined ? ("and (device-width : " + potraitData["device-width"] + ")") : ""}
    ${potraitData["device-height"] !== undefined ? ("and (device-height : " + potraitData["device-height"] + ")") : ""}
    ${potraitData["device-pixel-ratio"] !== undefined ? ("and (-webkit-device-pixel-ratio : " + potraitData["device-pixel-ratio"] + ")") : ""}
    ${potraitData["max-pixel-ratio"] !== undefined ? ("and (-webkit-max-device-pixel-ratio : " + potraitData["max-pixel-ratio"] + ")") : ""}
    {}`;

    let landscapeRule = `

    /* Landscape */
    @media screen
    ${landscapeData["min-width"] !== undefined ? ("and (min-device-width : " + landscapeData["min-width"] + ")") : ""}
    ${landscapeData["max-width"] !== undefined ? ("and (max-device-width : " + landscapeData["max-width"] + ")") : ""}
    ${landscapeData["pixel-ratio"] !== undefined ? ("and (-webkit-min-device-pixel-ratio : " + landscapeData["pixel-ratio"] + ")") : ""}
    ${landscapeData["orientation"] !== undefined ? ("and (orientation : " + landscapeData["orientation"] + ")") : ""}
    ${landscapeData["device-width"] !== undefined ? ("and (device-width : " + landscapeData["device-width"] + ")") : ""}
    ${landscapeData["device-height"] !== undefined ? ("and (device-height : " + landscapeData["device-height"] + ")") : ""}
    ${landscapeData["device-pixel-ratio"] !== undefined ? ("and (-webkit-device-pixel-ratio : " + landscapeData["device-pixel-ratio"] + ")") : ""}
    ${landscapeData["max-pixel-ratio"] !== undefined ? ("and (-webkit-max-device-pixel-ratio : " + landscapeData["max-pixel-ratio"] + ")") : ""}
    {}`;

    let bothRule = `

    /* Potrait & Landscape */
    @media screen
    ${bothData["min-width"] !== undefined ? ("and (min-device-width : " + bothData["min-width"] + ")") : ""}
    ${bothData["max-width"] !== undefined ? ("and (max-device-width : " + bothData["max-width"] + ")") : ""}
    ${bothData["pixel-ratio"] !== undefined ? ("and (-webkit-min-device-pixel-ratio : " + bothData["pixel-ratio"] + ")") : ""}
    ${bothData["orientation"] !== undefined ? ("and (orientation : " + bothData["orientation"] + ")") : ""}
    ${bothData["device-width"] !== undefined ? ("and (device-width : " + bothData["device-width"] + ")") : ""}
    ${bothData["device-height"] !== undefined ? ("and (device-height : " + bothData["device-height"] + ")") : ""}
    ${bothData["device-pixel-ratio"] !== undefined ? ("and (-webkit-device-pixel-ratio : " + bothData["device-pixel-ratio"] + ")") : ""}
    ${bothData["max-pixel-ratio"] !== undefined ? ("and (-webkit-max-device-pixel-ratio : " + bothData["max-pixel-ratio"] + ")") : ""}
    {}`;

    let finalString = potraitRule + landscapeRule + bothRule;
    let prettyString = prettier.format(finalString, {
      parser: "css",
      plugins : prettierPlugins
    });
    return prettyString
}

$(".collapse-button").click(() => {
  $("#sidebar").toggleClass("sidebarHidden")
})

$(window).resize(() => {
  if($(window).width() > 425) {
    if($("#sidebar").hasClass("sidebarHidden") === true) {
      $("#sidebar").removeClass("sidebarHidden")
    }
  }
})