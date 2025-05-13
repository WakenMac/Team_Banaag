// This is a temporary javascript file to prepare methods to be pasted in the mainHandler.js

// ======================================================================================================================================
// Methods for Lab Equipments

/**
 * Method to get all of the records on the Lab Equipments table
 * @returns A record consisting of 10 columns (Item ID, Name, Unit, Location, Brand, Quantity, Serial No, 
 *  Calibration Date, Frequency of Calibration, and Remarks)
 */
export async function getAllLabEquipmentsRecords(){
    try{
        const {data, error: supabaseError} = await supabaseClient.rpc('get_all_lab_equipments_records');
        
        if (supabaseError){
            console.error(`Supabase Error:`, supabaseError.message);
            return null;
        }
        
        return data;
        
    } catch (generalError) {
        console.error("General error", generalError)
        return null;
    }
}

/**
 * Method to get one record from the Lab Equipments table based on its item ID
 * @param {integer} itemId The primary key of the Lab Equipments table
 * @returns A record consisting of 10 columns (Item ID, Name, Unit, Location, Brand, Quantity, Serial No, 
 *  Calibration Date, Frequency of Calibration, and Remarks)
 */
export async function getLabEquipmentsRecordByItetmId(itemId = 0){
    try{
        const [ iItemId ] = converter('int', itemId);

        if (typeof iItemId !== 'number' || iItemId < 1){
            console.error("PARAMETER ERROR: getLabEquipmentsRecordByItetmId's itermID parameter must be a positive non-zero integer.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('get_lab_equipments_record_by_item_id', {
            input_item_id : iItemId
        });
        
        if (supabaseError){
            console.error(`Supabase Error:`, supabaseError.message);
            return null;
        }
        
        return data;
        
    } catch (generalError) {
        console.error("General error", generalError)
        return null;
    }
}

/**
 * Method to add a new row to the Lab Equipments Table
 * @param {string} itemName                 Name of the lab equipment to be added
 * @param {string} unitTypeName             Unit Type of the lab apparatus (e.g. Unit, Piece)
 * @param {string} locationName             Location where the lab equipment will be stored
 * @param {string} brandModel               Brand of the lab equipment to be added
 * @param {string} serialNo                 Serial Number (Primary Key from the Producer) of the Lab Equipment to be added
 * @param {string} calibrationDate          Date when the equipment was last tuned
 * @param {string} frequencyOfCalibration   How frequent the equipment is tuned
 * @param {string} remarks                  Remarks of the equipment to be added
 */
export async function addLabEquipmentsRecord(
    itemName, locationName, unitTypeName, brandModel = '', serialNo, calibrationDate, frequencyOfCalibration, remarks = ''
){
    try{
        const [ sItemName, sLocationName, sUnitTypeName, sBrandModel, sSerialNo, sCalibraitonDate, sFrequencyOfCalibration, sRemarks ] = converter('string', 
            itemName, locationName, unitTypeName, brandModel, serialNo, calibrationDate, frequencyOfCalibration, remarks);

        if (typeof sItemName !== 'string'){
            console.error("PARAMETER ERROR: addLabEquipmentsRecord's Location Name parameter must be a string.")
            return null;
        } else if (typeof sLocationName !== 'string'){
            console.error("PARAMETER ERROR: addLabEquipmentsRecord's Unit Type Name parameter must be a string.")
            return null;
        } else if (typeof sUnitTypeName !== 'string'){
            console.error("PARAMETER ERROR: addLabEquipmentsRecord's Item Name parameter must be a string.")
            return null;
        } else if (typeof sBrandModel !== 'string'){
            console.error("PARAMETER ERROR: addLabEquipmentsRecord's Brand/Model parameter must be a string.")
            return null;
        } else if (typeof sSerialNo !== 'string'){
            console.error("PARAMETER ERROR: addLabEquipmentsRecord's Remarks parameter must be a string.")
            return null;
        } else if (typeof sCalibraitonDate !== 'string'){
            console.error("PARAMETER ERROR: addLabEquipmentsRecord's Item Name parameter must be a string.")
            return null;
        } else if (typeof sFrequencyOfCalibration !== 'string'){
            console.error("PARAMETER ERROR: addLabEquipmentsRecord's Brand/Model parameter must be a string.")
            return null;
        } else if (typeof sRemarks !== 'string'){
            console.error("PARAMETER ERROR: addLabEquipmentsRecord's Remarks parameter must be a string.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('main_add_lab_equipments_record', {
            input_item_name : sItemName,
            input_location_name : sLocationName,
            input_unit_type_name : sUnitTypeName,
            input_brand_model : sBrandModel,
            input_serial_no : sSerialNo,
            input_calibration_date : sCalibraitonDate,
            input_frequency_of_calibration : sFrequencyOfCalibration,
            input_remarks : sRemarks
        });
        
        if (supabaseError){
            console.error(`Supabase Error:`, supabaseError.message);
            return null;
        }
        
        return data;
        
    } catch (generalError) {
        console.error("General error", generalError)
        return null;
    }
}

/**
 * Method to add a update a record from the Lab Equipments Table based on thier Item ID
 * @param {string} itemName                 Name of the lab equipment to be added
 * @param {string} unitTypeName             Unit Type of the lab apparatus (e.g. Unit, Piece)
 * @param {string} locationName             Location where the lab equipment will be stored
 * @param {string} brandModel               Brand of the lab equipment to be added
 * @param {string} serialNo                 Serial Number (Primary Key from the Producer) of the Lab Equipment to be added
 * @param {string} calibrationDate          Date when the equipment was last tuned
 * @param {string} frequencyOfCalibration   How frequent the equipment is tuned
 * @param {string} remarks                  Remarks of the equipment to be added
 */
export async function updateLabEquipmentsRecordByAll(
    itemId, locationName, unitTypeName, brandModel = '', serialNo, calibrationDate, frequencyOfCalibration, remarks = ''
){
    try{
        const [ sLocationName, sUnitTypeName, sBrandModel, sSerialNo, sCalibraitonDate, sFrequencyOfCalibration, sRemarks ] = converter('string', 
            locationName, unitTypeName, brandModel, serialNo, calibrationDate, frequencyOfCalibration, remarks);
        const [ iItemId ] = converter('int', itemId);

        if (typeof iItemId !== 'number' || iItemId < 1){
            console.error("PARAMETER ERROR: addLabEquipmentsRecord's Item ID parameter must be a positive non-zero integer.")
            return null;
        } else if (typeof sLocationName !== 'string'){
            console.error("PARAMETER ERROR: addLabEquipmentsRecord's Location Name parameter must be a string.")
            return null;
        } else if (typeof sUnitTypeName !== 'string'){
            console.error("PARAMETER ERROR: addLabEquipmentsRecord's Unit Type parameter must be a string.")
            return null;
        } else if (typeof sBrandModel !== 'string'){
            console.error("PARAMETER ERROR: addLabEquipmentsRecord's Brand/Model parameter must be a string.")
            return null;
        } else if (typeof sSerialNo !== 'string'){
            console.error("PARAMETER ERROR: addLabEquipmentsRecord's Serial Number parameter must be a string.")
            return null;
        } else if (typeof sCalibraitonDate !== 'string'){
            console.error("PARAMETER ERROR: addLabEquipmentsRecord's Calibration Date parameter must be a a valid date.")
            return null;
        } else if (typeof sFrequencyOfCalibration !== 'string'){
            console.error("PARAMETER ERROR: addLabEquipmentsRecord's Frequency of Calibration parameter must be a string.")
            return null;
        } else if (typeof sRemarks !== 'string'){
            console.error("PARAMETER ERROR: addLabEquipmentsRecord's Remarks parameter must be a string.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('update_lab_equipment_record_by_all', {
            input_item_id : iItemId,
            input_location_name : sLocationName,
            input_unit_type_name : sUnitTypeName,
            input_brand_model : sBrandModel,
            input_serial_no : sSerialNo,
            input_calibration_date : sCalibraitonDate,
            input_frequency_of_calibration : sFrequencyOfCalibration,
            input_remarks : sRemarks
        });
        
        if (supabaseError){
            console.error(`Supabase Error:`, supabaseError.message);
            return null;
        }
        
        return data;
        
    } catch (generalError) {
        console.error("General error", generalError)
        return null;
    }
}

/**
 /**
 * Method to update an existing record's remarks in the Lab Equipments Table based on its Item ID
 * 
 * @param {int} itemId                  Primary key of the Lab Equipments table
 * @param {string} remarks              Remarks of the lab equipment
 * 
 * @returns A string containing the status of the deleted record (Success or Error)
 */
export async function updateLabEquipmentsRemarkByItemId(itemId, remarks = ''){
    try{
        const [ sRemarks ] = converter('string', remarks);
        const [ iItemId ] = converter('int', itemId);
        
        if (typeof sRemarks !== 'string'){
            console.error("PARAMETER ERROR: updateLabEquipmentsRemarkByItemId's Remarks parameter must be a string.")
            return null;
        }

        if (typeof iItemId !== 'number' || iItemId < 1){
            console.error("PARAMETER ERROR: updateLabEquipmentsRemarkByItemId's Item ID & Container Size parameter must be a positive non-zero integer.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('update_lab_equipments_remark_by_item_id', {
            input_item_id : iItemId,
            input_remarks : sRemarks
        });
        
        if (supabaseError){
            console.error(`Supabase Error:`, supabaseError.message);
            return null;
        }
        
        return data;
        
    } catch (generalError) {
        console.error("General error", generalError)
        return null;
    }
}

/**
 * Method to remove a record to the Lab Equipments table
 * @param {int} itemId The primary key of the Lab Equipments table
 * @returns A string containing the status of the deleted record (Success or Error)
 */
export async function deleteLabEquipmentsRecordByItemId(itemId = 0){
    try{
        const [ iItemId ] = converter('int', itemId);

        if (typeof iItemId !== 'number' || iItemId < 1){
            console.error("PARAMETER ERROR: deleteLabEquipmentsRecordByItemId's itemID parameter must be a positive non-zero integer.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('delete_lab_equipments_record_by_item_id', {
            input_item_id : iItemId
        });
        
        if (supabaseError){
            console.error(`Supabase Error:`, supabaseError.message);
            return null;
        }
        
        return data;
        
    } catch (generalError) {
        console.error("General error", generalError)
        return null;
    }
}
