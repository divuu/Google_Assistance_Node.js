var db = require("../connection");
const errorMsg = require("../error/error_messages")
const storedProc = require("../stored_procedure/stored_procedure")
const Response = require("../response/response_creator")
const ConvoController = require("../conversion_controller/convo_controller")
const Utils = require("../utils/utils")

const ActionHandlers = {
    handleWelcomeAction: function (convoId, PIN) {
        return new Promise((resolve, reject) => {
            db.query(storedProc.getPinVerificationQuery(PIN), true, (error, results, fields) => {
                if (error) {
                    reject(error.message)
                }

                console.log("Result", results);
                console.log("Result[0]", results[0]);

                if (results[0].length == 0) {
                    resolve(Response.getBasicResponse(false, errorMsg.INVALID_PIN))
                } else {

                    var tabledata_json = JSON.parse(JSON.stringify(results[0]));

                    console.log("tabledat_json", tabledata_json);

                    // Check data values for sysuser or Parent
                    if (tabledata_json[0].passenger_id) {
                        console.log("PIN Verfication Passenger master");

                        //Store User Data With Session
                        ConvoController.addConversationId(convoId, tabledata_json);

                        resolve(Response.getBasicResponse(true, `Welcome ${tabledata_json[0].name} of ${tabledata_json[0].org_name}. Do you want to know the location of your school bus ? `))

                    } else {
                        console.log("PIN Verfication SysUser Master");

                        //Check for sysUser Organization
                        if (tabledata_json.length > 1) {
                            console.log("In multiple School");

                            //Store User Data With Session
                            ConvoController.addConversationId(convoId, tabledata_json);
                            resolve(Response.getBasicResponse(true, `Hi ${tabledata_json[0].user_name}. Welcome to Route Alert. Which School's information do you want to know about ?`))
                        } else {
                            if (tabledata_json.length == 1) {
                                console.log("In Single School");
                                ConvoController.addConversationId(convoId, tabledata_json);

                                resolve(Response.getBasicResponse(true, `Hi ${tabledata_json[0].user_name}. Welcome to Route Alert. Which School Bus' location do you want to know about ?`))
                            }
                        }
                    }
                }
            });
        })
    },
    handlePassengerBusLocation: (convoId) => {

        return new Promise((resolve, reject) => {
            if (ConvoController.getConversationData(convoId)) {
                let runningData = ConvoController.getConversationData(convoId).payload.filter(val => { return val.running_route_id == val.route_id });
                if (runningData.length > 0) {

                    ConvoController.removeConversationId(convoId)
                    let textToSpeech = `Ok ! I found your Bus. Your Bus ${runningData[0].custom_name} was Last seen 2 Min Ago near ${runningData[0].user_stop_name}. Please Click the Link below to view in map.`
                    resolve(Response.getRichResponse(false, textToSpeech, Utils.getCarouselItemsArray(runningData[0].location)))
                } else {

                    let busName = ConvoController.getConversationData(convoId).payload[0].custom_name;
                    db.query(storedProc.getBusStopDetails(busName), true, (error, results, fields) => {
                        if (error) {
                            reject(error.message)
                        }

                        let passengerStopJsonData = JSON.parse(JSON.stringify(results[0]));

                        if (passengerStopJsonData[0].stop_id) {
                            ConvoController.removeConversationId(convoId)
                            let textToSpeech = `Ok ! I found your Bus. Your Bus ${passengerStopJsonData[0].custom_name} was Last seen 2 Min Ago near ${passengerStopJsonData[0].stop_name}. Please Click the Link below to view in map.`
                            resolve(Response.getRichResponse(false, textToSpeech, Utils.getCarouselItemsArray(passengerStopJsonData[0].location)))
                        } else {
                            let lat = passengerStopJsonData[0].last_seen_latitude;
                            let long = passengerStopJsonData[0].last_seen_longitude;

                            db.query(storedProc.getBusAddressDetails(lat, long), true, (error, results, fields) => {
                                if (error) {
                                    reject(error.message);
                                }
                                let location = ConvoController.getConversationData(convoId).payload[0].location
                                let passengerAddress = JSON.parse(JSON.stringify(results[0]));
                                if (passengerAddress.length > 0) {

                                    let textToSpeech = `Ok ! I found your Bus. Your Bus ${busName} was Last seen 2 Min Ago near ${passengerAddress[0].address}. Please Click the Link below to view in map.`;
                                    ConvoController.removeConversationId(convoId);
                                    resolve(Response.getRichResponse(false, textToSpeech, Utils.getCarouselItemsArray(location)))
                                } else {
                                    let textToSpeech = `Ok ! I found your Bus. Please Click the Link below to view in map.`
                                    ConvoController.removeConversationId(convoId);
                                    resolve(Response.getRichResponse(false, textToSpeech, Utils.getCarouselItemsArray(location)))
                                }
                            })
                        }
                    })
                }
            } else {

                ConvoController.removeConversationId(convoId);
                resolve(Response.getBasicResponse(false, "It Seems Your Bus is Not In Our Record."));
            }
        })
    },

    handleMultipleSchoolSysuser: function (convoId, schoolNameUser, busRouteNumber) {
        return new Promise((resolve, reject) => {
            let sysUserData = ConvoController.getConversationData(convoId).payload.filter(val => {
                return val.org_name == schoolNameUser;
            });
            console.log("sysUserData", sysUserData);
            let finalStr = null;
            if (sysUserData[0]) {
                if (typeof busRouteNumber == "number") {
                    finalStr = sysUserData[0].short_name + " " + "Route" + " " + busRouteNumber;
                    console.log("Bus String", finalStr);
                } else {
                    let strafter = busRouteNumber.replace(/[A-Za-z$-]/g, "");
                    finalStr = sysUserData[0].short_name + " " + "Route" + " " + strafter;
                    console.log("Bus String", finalStr);
                }
                db.query(storedProc.getMultipleSchoolSysuserStop(finalStr), true, (error, results, fields) => {
                    if (error) {
                        reject(error.message)
                    }
                    console.log("Result", results);
                    console.log("Result[0]", results[0]);
                    var tabledata_json = JSON.parse(JSON.stringify(results[0]));
                    console.log("tabledata_json", tabledata_json);
                    if (tabledata_json.length > 0) {
                        if (tabledata_json[0].stop_id) {
                            console.log("Stop Name found");
                            ConvoController.removeConversationId(convoId);
                            let textToSpeech = `Ok ! I found your Bus. Your Bus ${finalStr} was Last seen 2 Min Ago near ${tabledata_json[0].stop_name}. Please Click the Link below to view in map.`
                            resolve(Response.getRichResponse(false, textToSpeech, Utils.getCarouselItemsArray(tabledata_json[0].location)))
                        } else {
                            console.log("Stop Name Not found");
                            var lat = tabledata_json[0].last_seen_latitude;
                            var long = tabledata_json[0].last_seen_longitude;

                            db.query(storedProc.getMultipleSchoolSysuserAddress(lat, long), true, (error, results, fields) => {
                                if (error) {
                                    reject(error.message);
                                }
                                let location = ConvoController.getConversationData(convoId).payload[0].location
                                let sysuserAddress = JSON.parse(JSON.stringify(results[0]));
                                console.log("sysuserAddress", sysuserAddress);
                                if (sysuserAddress.length > 0) {
                                    console.log("Address Found");
                                    let textToSpeech = `Ok ! I found your Bus. Your Bus ${finalStr} was Last seen 2 Min Ago near ${sysuserAddress[0].address}. Please Click the Link below to view in map.`;
                                    ConvoController.removeConversationId(convoId);
                                    resolve(Response.getRichResponse(false, textToSpeech, Utils.getCarouselItemsArray(location)))
                                } else {
                                    console.log("Address Not Found");
                                    let textToSpeech = `Ok ! I found your Bus. Please Click the Link below to view in map.`
                                    ConvoController.removeConversationId(convoId);
                                    resolve(Response.getRichResponse(false, textToSpeech, Utils.getCarouselItemsArray(location)))
                                }
                            })
                        }
                    } else {
                        let textToSpeech = `It seems ${finalStr} is not in Your records`
                        ConvoController.removeConversationId(convoId);
                        resolve(Response.getBasicResponse(false, textToSpeech));
                    }
                });
            } else {
                let textToSpeech = `It seems ${schoolNameUser} is not in Your records`
                ConvoController.removeConversationId(convoId);
                resolve(Response.getBasicResponse(false, textToSpeech));
            }
        })
    },

    handleSingleSchoolSysuser: function (convoId, busRouteNumber) {
        return new Promise((resolve, reject) => {
            let prefix = ConvoController.getConversationData(convoId).payload[0].short_name;
            let finalStr;
            if (typeof busRouteNumber == "number") {
                finalStr = prefix + " " + "Route" + " " + busRouteNumber;
                console.log("Bus String", finalStr);
            } else {
                let strafter = busRouteNumber.replace(/[A-Za-z$-]/g, "");
                finalStr = prefix + " " + "Route" + " " + strafter;
                console.log("Bus String", finalStr);
            }

            db.query(storedProc.getSingleSchoolSysuserStop(finalStr), true, (error, results, fields) => {
                if (error) {
                    reject(error.message)
                }
                console.log("Result", results);
                console.log("Result[0]", results[0]);
                var tabledata_json = JSON.parse(JSON.stringify(results[0]));
                console.log("tabledata_json", tabledata_json);
                if (tabledata_json.length > 0) {
                    if (tabledata_json[0].stop_id) {
                        console.log("Stop Name found");
                        ConvoController.removeConversationId(convoId);
                        let textToSpeech = `Ok ! I found your Bus. Your Bus ${finalStr} was Last seen 2 Min Ago near ${tabledata_json[0].stop_name}. Please Click the Link below to view in map.`
                        resolve(Response.getRichResponse(false, textToSpeech, Utils.getCarouselItemsArray(tabledata_json[0].location)));
                    } else {
                        console.log("Stop Name Not found");
                        var lat = tabledata_json[0].last_seen_latitude;
                        var long = tabledata_json[0].last_seen_longitude;
                        var location = tabledata_json[0].location;

                        db.query(storedProc.getSingleSchoolSysuserAddress(lat, long), true, (error, results, fields) => {
                            if (error) {
                                reject(error.message);
                            }
                            let sysuserAddress = JSON.parse(JSON.stringify(results[0]));

                            if (sysuserAddress.length > 0) {
                                console.log("Address Found");
                                let textToSpeech = `Ok ! I found your Bus. Your Bus ${finalStr} was Last seen 2 Min Ago near ${sysuserAddress[0].address}. Please Click the Link below to view in map.`;
                                ConvoController.removeConversationId(convoId);
                                resolve(Response.getRichResponse(false, textToSpeech, Utils.getCarouselItemsArray(location)));
                            } else {
                                console.log("Address Not Found");
                                let textToSpeech = `Ok ! I found your Bus. Please Click the Link below to view in map.`
                                ConvoController.removeConversationId(convoId);
                                resolve(Response.getRichResponse(false, textToSpeech, Utils.getCarouselItemsArray(location)))
                            }
                        })
                    }
                } else {
                    let textToSpeech = `It seems Bus ${finalStr} is not in Your records.`
                    ConvoController.removeConversationId(convoId);
                    resolve(Response.getBasicResponse(false, textToSpeech));
                }
            });
        })
    }
}


module.exports = ActionHandlers