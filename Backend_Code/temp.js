// This is a temporary javascript file to prepare methods to be pasted in the mainHandler.js

// ======================================================================================================================================
// Methods for Lab Equipments

/**
 * Method to get all of the records on the Lab Apparatus table
 * @returns A record consisting of 7 columns (Item ID, Name, Unit, Location, Brand, Quantity, Remarks)
 */
export async function getAllLabApparatusRecords(){
    try{
        const {data, error: supabaseError} = await supabaseClient.rpc('get_all_lab_apparatus_records');
        
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
 * Method to get one record from the Lab Apparatus table based on its item ID
 * @param {integer} itemId The primary key of the Lab Apparatus table
 * @returns A record consisting of 7 columns (Item ID, Name, Unit, Location, Brand, Quantity, Remarks)
 */
export async function getLabApparatusRecordByItetmId(itemId = 0){
    try{
        const [ iItemId ] = converter('int', itemId);

        if (typeof iItemId !== 'number' || iItemId < 1){
            console.error("PARAMETER ERROR: getLabApparatusRecordByItetmId's itermID parameter must be a positive non-zero integer.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('get_lab_apparatus_record_by_item_id', {
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
 * Method to add a new row to the Chemicals Table
 * @param {string} itemName           Name of the lab apparatus to be added
 * @param {string} unitTypeName       Unit Type of the lab apparatus (e.g. Unit, Piece)
 * @param {string} locationName       Location where the chemical will be stored
 * @param {string} brandModel         Brand of the lab apparatus to be added
 * @param {string} remarks            Remarks of the chemical to be added
 */
export async function addLabApparatusRecord(itemName, locationName, unitTypeName, brandModel = '', remarks = ''){
    try{
        const [ sItemName, sLocationName, sUnitTypeName, sBrandModel, sRemarks ] = converter('string', 
            itemName, locationName, unitTypeName, brandModel, remarks);

        if (typeof sLocationName !== 'string'){
            console.error("PARAMETER ERROR: addLabApparatusRecord's Location Name parameter must be a string.")
            return null;
        } else if (typeof sUnitTypeName !== 'string'){
            console.error("PARAMETER ERROR: addLabApparatusRecord's Unit Type Name parameter must be a string.")
            return null;
        } else if (typeof sItemName !== 'string'){
            console.error("PARAMETER ERROR: addLabApparatusRecord's Item Name parameter must be a string.")
            return null;
        } else if (typeof sBrandModel !== 'string'){
            console.error("PARAMETER ERROR: addLabApparatusRecord's Brand/Model parameter must be a string.")
            return null;
        } else if (typeof sRemarks !== 'string'){
            console.error("PARAMETER ERROR: addLabApparatusRecord's Remarks parameter must be a string.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('main_add_lab_apparatus_record', {
            input_item_name : sItemName,
            input_location_name : sLocationName,
            input_unit_type_name : sUnitTypeName,
            input_brand_model : sBrandModel,
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
 * Method to add a update a record from the Lab Apparatus Table based on thier Item ID
 * @param {string} itemId             Primary key of the lab apparatus table
 * @param {string} itemName           Name of the lab apparatus to be added
 * @param {string} unitTypeName       Unit Type of the lab apparatus (e.g. Unit, Piece)
 * @param {string} locationName       Location where the chemical will be stored
 * @param {string} brandModel         Brand of the lab apparatus to be added
 * @param {string} remarks            Remarks of the chemical to be added
 */
export async function updateLabApparatusRecordByAll(itemId = 0, itemName, locationName, unitTypeName, brandModel = '', remarks = ''){
    try{
        const [ sItemName, sLocationName, sUnitTypeName, sBrandModel, sRemarks ] = converter('string', 
            itemName, locationName, unitTypeName, brandModel, remarks);
        const [ iItemId ] = converter('int', itemId);

        if (typeof sLocationName !== 'string'){
            console.error("PARAMETER ERROR: addChemicalsRecord's Location Name parameter must be a string.")
            return null;
        } else if (typeof sUnitTypeName !== 'string'){
            console.error("PARAMETER ERROR: addChemicalsRecord's Unit Type Name parameter must be a string.")
            return null;
        } else if (typeof sItemName !== 'string'){
            console.error("PARAMETER ERROR: addChemicalsRecord's Item Name parameter must be a string.")
            return null;
        } else if (typeof sBrandModel !== 'string'){
            console.error("PARAMETER ERROR: addChemicalsRecord's Brand/Model parameter must be a string.")
            return null;
        } else if (typeof sRemarks !== 'string'){
            console.error("PARAMETER ERROR: addChemicalsRecord's Remarks parameter must be a string.")
            return null;
        }

        if (typeof iItemId !== 'number' || iItemId < 1){
            console.error("PARAMETER ERROR: getLabApparatusRecordByItetmId's itermID parameter must be a positive non-zero integer.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('update_lab_apparatus_record_by_all', {
            input_item_id : iItemId,
            input_item_name : sItemName,
            input_location_name : sLocationName,
            input_unit_type_name : sUnitTypeName,
            input_brand_model : sBrandModel,
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
 * Method to update an existing record's remarks in the Lab Apparatus Table based on its Item ID
 * 
 * @param {int} itemId                          Primary key of the Lab Apparatus table
 * @param {string} chemicalBarCode              Barcode of the chemical to be added
 * 
 * @returns A string containing the status of the deleted record (Success or Error)
 */
export async function updateLabApparatusRemarkByItemId(itemId, remarks = ''){
    try{
        const [ sRemarks ] = converter('string', remarks);
        const [ iItemId ] = converter('int', itemId);
        
        if (typeof sRemarks !== 'string'){
            console.error("PARAMETER ERROR: updateLabApparatusRemarkByItemId's Remarks parameter must be a string.")
            return null;
        }

        if (typeof iItemId !== 'number' || iItemId < 1){
            console.error("PARAMETER ERROR: updateLabApparatusRemarkByItemId's Item ID & Container Size parameter must be a positive non-zero integer.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('update_lab_apparatus_remark_by_item_id', {
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
 * Method to remove a record to the Lab Apparatus table
 * @param {int} itemId The primary key of the Lab Apparatus table
 * @returns A string containing the status of the deleted record (Success or Error)
 */
export async function deleteLabApparatusRecordByItemId(itemId = 0){
    try{
        const [ iItemId ] = converter('int', itemId);

        if (typeof iItemId !== 'number' || iItemId < 1){
            console.error("PARAMETER ERROR: getLabApparatusRecordByItetmId's itermID parameter must be a positive non-zero integer.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('delete_lab_apparatus_record_by_item_id', {
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
