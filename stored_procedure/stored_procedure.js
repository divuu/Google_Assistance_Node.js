const storedProcedure = {
    getPinVerificationQuery: function (PIN) {
        return "CALL sp_rga_pin_verification('" + PIN + "')";
    },
    getBusStopDetails: function (busName) {
        return "CALL sp_rga_vehicle_location_nearby_stop('" + busName + "')";
    },
    getBusAddressDetails: function (lat, long) {

        return "CALL sp_rga_location_nearby_address(" + lat + "," + long + ")";
    },
    getMultipleSchoolSysuserStop: function (finalStr) {
        return "CALL sp_rga_vehicle_location_nearby_stop('" + finalStr + "')";
    },
    getMultipleSchoolSysuserAddress: function (lat, long) {
        return "CALL sp_rga_location_nearby_address(" + lat + "," + long + ")";
    },
    getSingleSchoolSysuserStop: function (finalStr) {
        return "CALL sp_rga_vehicle_location_nearby_stop('" + finalStr + "')";
    },
    getSingleSchoolSysuserAddress: function (lat, long) {
        return "CALL sp_rga_location_nearby_address(" + lat + "," + long + ")";
    }
}

module.exports = storedProcedure