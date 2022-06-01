"use strict";
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
//exports.__esModule = true;
// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script
// src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
function initMap() {
    var map = new google.maps.Map(document.getElementById("map"), {
        mapTypeControl: false,
        center: { lat: 37.7749, lng: -122.4194 },
        zoom: 13
    });
    new AutocompleteDirectionsHandler(map);
}
var AutocompleteDirectionsHandler = /** @class */ (function () {
    function AutocompleteDirectionsHandler(map) {
        this.map = map;
        this.originPlaceId = "";
        this.destinationPlaceId = "";
        this.travelMode = google.maps.TravelMode.WALKING;
        this.directionsService = new google.maps.DirectionsService();
        this.directionsRenderer = new google.maps.DirectionsRenderer();
        this.directionsRenderer.setMap(map);
        var originInput = document.getElementById("origin-input");
        var destinationInput = document.getElementById("destination-input");
        var modeSelector = document.getElementById("mode-selector");
        // Specify just the place data fields that you need.
        var originAutocomplete = new google.maps.places.Autocomplete(originInput, { fields: ["place_id"] });
        // Specify just the place data fields that you need.
        var destinationAutocomplete = new google.maps.places.Autocomplete(destinationInput, { fields: ["place_id"] });
        this.setupClickListener("changemode-walking", google.maps.TravelMode.WALKING);
        this.setupClickListener("changemode-transit", google.maps.TravelMode.TRANSIT);
        this.setupClickListener("changemode-driving", google.maps.TravelMode.DRIVING);
        this.setupPlaceChangedListener(originAutocomplete, "ORIG");
        this.setupPlaceChangedListener(destinationAutocomplete, "DEST");
        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(originInput);
        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(destinationInput);
        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(modeSelector);
    }
    // Sets a listener on a radio button to change the filter type on Places
    // Autocomplete.
    AutocompleteDirectionsHandler.prototype.setupClickListener = function (id, mode) {
        var _this = this;
        var radioButton = document.getElementById(id);
        radioButton.addEventListener("click", function () {
            _this.travelMode = mode;
            _this.route();
        });
    };
    AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function (autocomplete, mode) {
        var _this = this;
        autocomplete.bindTo("bounds", this.map);
        autocomplete.addListener("place_changed", function () {
            var place = autocomplete.getPlace();
            if (!place.place_id) {
                window.alert("Please select an option from the dropdown list.");
                return;
            }
            if (mode === "ORIG") {
                _this.originPlaceId = place.place_id;
            }
            else {
                _this.destinationPlaceId = place.place_id;
            }
            _this.route();
        });
    };
    AutocompleteDirectionsHandler.prototype.route = function () {
        if (!this.originPlaceId || !this.destinationPlaceId) {
            return;
        }
        var me = this;
        this.directionsService.route({
            origin: { placeId: this.originPlaceId },
            destination: { placeId: this.destinationPlaceId },
            travelMode: this.travelMode
        }, function (response, status) {
            if (status === "OK") {
                console.log(response);
                if (response != null) {
                    if (response.routes != null) {
                        var route_object = response.routes[0];
                        window.lat_lng_arr = route_object.overview_path;
                        console.log(window.lat_lng_arr.length)

                        //get post request browser side
                        async function sendPostRequest(url,data) {
                            let params = {
                              method: 'POST', 
                              headers: {'Content-Type': 'application/json'},
                              body: JSON.stringify(data) };
                            console.log("about to send post request", params);
                            document.getElementById("crimeWeight").innerHTML = "<h3>Crime score is: Loading</h3>"
                            document.getElementById("progressValue").style.width = "0%"
                            
                            let response = await fetch(url,params);
                            if (response.ok) {
                              let data = await response.text();
                              return data;
                            } else {
                              throw Error(response.status);
                            }
                          }
                        
                        //call the send post request method
                        sendPostRequest('/model', window.lat_lng_arr)
                        .then(function(crimeWeight) {
                            console.log("Crime Weight: ", crimeWeight)
                            document.getElementById("crimeWeight").innerHTML = "<h3>Crime score is: " + crimeWeight + "</h3>"
                            
                            var progressScore = (crimeWeight / 5) * 100
                            console.log("Progress score ", progressScore)
                            // Change the style of the progress bar to reflect the crime rate
                            var color = "w3-blue"
                            if (progressScore > 0 & progressScore < 1) {
                                color = "w3-green"
                            } else if (progressScore > 1 & progressScore < 2) {
                                color = "w3-darkGreen"
                            } else if (progressScore > 2 & progressScore < 3) {
                                color = "w3-yellow"
                            } else if (progressScore > 3 & progressScore < 4) {
                                color = "w3-red"
                            } else if (progressScore > 4) {
                                color = "w3-purple"
                            }
                            console.log(document.getElementById("progressValue"))
                            document.getElementById("progressValue").style.width = progressScore.toString() + '%'
                            document.getElementById("progressValue").classList.add(color);       
                    })
                    }
                }
                me.directionsRenderer.setDirections(response);
            }
            else {
                window.alert("Directions request failed due to " + status);
            }
        });
    };
    return AutocompleteDirectionsHandler;
}());
window.initMap = initMap;