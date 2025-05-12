// This is a temporary javascript file to prepare methods to be pasted in the mainHandler.js

// ======================================================================================================================================
// Methods for Glasswares

/**
 * Method to get all of the records on the Glasswares table
 * @returns A record consisting of 7 columns (Item ID, Name, Unit, Location, Brand, Quantity, Remarks)
 */
export async function getAllGlasswaresRecords(){
    try{
        const {data, error: supabaseError} = await supabaseClient.rpc('get_all_glasswares_records');
        
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
 * Method to get one record from the Glasswares table based on its item ID
 * @param {integer} itemId The primary key of the Glasswares table
 * @returns A record consisting of  columns (Item ID, Name, Unit, Location, Brand, Quantity, Remarks)
 */
export async function getGlasswaresRecordByItetmId(itemId = 0){
    try{
        const [ iItemId ] = converter('int', itemId);

        if (typeof iItemId !== 'number' || iItemId < 1){
            console.error("PARAMETER ERROR: getGlasswaresRecordByItetmId's itermID parameter must be a positive non-zero integer.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('get_glasswares_record_by_item_id', {
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
 * @param {string} itemName           Name of the glassware to be added
 * @param {string} unitTypeName       Unit Type of the glassware (e.g. Unit, Piece)
 * @param {string} locationName       Location where the chemical will be stored
 * @param {string} brandModel         Brand of the glassware to be added
 * @param {string} remarks            Remarks of the chemical to be added
 */
export async function addGlasswaresRecord(itemName, locationName, unitTypeName, brandModel = '', remarks = ''){
    try{
        const [ sItemName, sLocationName, sUnitTypeName, sBrandModel, sRemarks ] = converter('string', 
            itemName, locationName, unitTypeName, brandModel, remarks);

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

        const {data, error: supabaseError} = await supabaseClient.rpc('add_glasswares_record', {
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
 * Method to add a update a record from the Glasswares Table based on thier Item ID
 * @param {string} itemName           Name of the glassware to be added
 * @param {string} unitTypeName       Unit Type of the glassware (e.g. Unit, Piece)
 * @param {string} locationName       Location where the chemical will be stored
 * @param {string} brandModel         Brand of the glassware to be added
 * @param {string} remarks            Remarks of the chemical to be added
 */
export async function updateGlasswaresRecordByAll(itemId = 0, itemName, locationName, unitTypeName, brandModel = '', remarks = ''){
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
            console.error("PARAMETER ERROR: getGlasswaresRecordByItetmId's itermID parameter must be a positive non-zero integer.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('update_glasswares_record_by_all', {
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
 * Method to remove a record to the Glasswares table
 * @param {int} itemId The primary key of the Glasswares table
 * @returns A string containing the status of the deleted record (Success or Error)
 */
export async function deleteGlasswaresRecordByItemId(itemId = 0){
    try{
        const [ iItemId ] = converter('int', itemId);

        if (typeof iItemId !== 'number' || iItemId < 1){
            console.error("PARAMETER ERROR: getGlasswaresRecordByItetmId's itermID parameter must be a positive non-zero integer.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('delete_glasswares_record_by_item_id', {
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
