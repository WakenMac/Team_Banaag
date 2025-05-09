// This is a temporary javascript file to prepare methods to be pasted in the mainHandler.js

// ======================================================================================================================================
// Methods for Unit Type

/**
 * Method to get all of the records on the unit type table
 * @returns A record consisting of 4 columns (Item ID, Name, Type, Quantity)
 */
export async function getAllItemMasterListRecords(){
    try{
        const {data, error: supabaseError} = await supabaseClient.rpc('get_all_item_master_list_records');
        
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
 * Method to get a record from the item master list table based on the item id
 * @param {integer} itemId The primary key of the item master list table
 * @returns A record consisting of 4 columns (Item ID, Name, Type, Quantity)
 */
export async function getItemMasterListRecordByItemID(itemId){
    try{
        const [ iItemId ] = converter('int', itemId);

        if (typeof iItemId !== 'number' || iItemId < 1){
            console.error("PARAMETER ERROR: get_item_master_list_record_by_item_id's unitTypeId parameter must be a positive non-zero integer.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('get_item_master_list_record_by_item_id', {
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
 * Method to get a record from the item master list table via the item's name
 * @param {string} itemName The name of the item to find in the table
 * @returns A record consisting of 2 columns (Location ID, Location Name)
 */
export async function getItemMasterListRecordByName(itemName){
    try{
        const [ sItemName ] = converter('string', itemName);

        if (typeof sItemName !== 'string'){
            console.error("PARAMETER ERROR: getItemMasterListRecordByName's unitTypeName parameter must be a string.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('get_item_master_list_record_by_name', {
            input_item_name : sItemName
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
 * Method to add a record to the item master list table
 * @param {string} itemName The name of the item to be added 
 * @param {string} itemType The type of item to be added (Chemicals, Consumable Items, Glasswares, Lab Apparatus, Lab Equipment) 
 * @returns A string containing the status of the added record (Success or Error). Moreover, this returns the ID of the newly added row
 */
export async function addItemMasterListRecord(itemName, itemType){
    try{
        const [ sItemName, sItemType ] = converter('string', itemName, itemType);

        if (typeof sItemName !== 'string' || typeof sItemType !== 'string'){
            console.error("PARAMETER ERROR: addItemMasterListRecord's parameters must be a string.")
            return null;
        }

        if (itemType !== 'Chemicals' || itemType !== 'Consumable Items' || itemType !== 'Glasswares' || itemType !== 'Lab Apparatus' || itemType !== 'Lab Equipment'){
            console.error("PARAMETER ERROR: addItemMasterListRecord's itemType selected must be either: Chemicals, Consumable Items, Glasswares, Lab Apparatus, or Lab Equipment.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('add_item_master_list_record', {
            input_item_name : sItemName,
            input_item_type : sItemType
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
 * Method to update a record to the location table
 * @param {int} unitTypeId The primary key of the unit type table
 * @param {string} unitTypeName The name to be changed in the unit type table based on the unit type id
 * @returns A string containing the status of the updated record (Success or Error)
 */
export async function updateItemMasterListRecord(unitTypeId = 0, unitTypeName = ''){
    try{
        const [ sUnitTypeName ] = converter('string', unitTypeName);
        const [ iUnitTypeId ] = converter('int', unitTypeId)

        if (typeof iUnitTypeId !== 'number' || iUnitTypeId < 1){
            console.error("PARAMETER ERROR: updateUnitTypeRecordName's unitTypeId parameter must be a positive non-zero integer.")
            return null;
        } else if (typeof sUnitTypeName !== 'string'){
            console.error("PARAMETER ERROR: updateUnitTypeRecordName's unitTypeName parameter must be a string.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('update_unit_type_record_name', {
            input_location_id : iUnitTypeId,
            input_location_name : sUnitTypeName
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

// TODO: Implement removeUnitTypeRecord

/**
 * Method to remove a record to the location table
 * @param {int} unitTypeId The primary key of the unit type table
 * @returns A string containing the status of the deleted record (Success or Error)
 */
export async function removeUnitTypeRecordByUnitTypeId(unitTypeId = 0){
    try{
        const [ iUnitTypeId ] = converter('int', unitTypeId)

        if (typeof iUnitTypeId !== 'number' || iUnitTypeId < 1){
            console.error("PARAMETER ERROR: update_location_record_name's locationId parameter must be a positive non-zero integer.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('remove_unit_type_record_by_unit_type_id', {
            input_unit_type_id : iUnitTypeId,
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
 * Method to return the number of times a specific location record (based on location id) is referenced in different 
 * item_type tables (Chemicals, Consumable Items, Equipments, Apparatus, Glassware)
 * 
 * @param {int} unitTypeId The primary key of the unit type table
 * @returns The number of times a specific location is referenced by specific item ids
 */
export async function getUnitTypeReferencesByUnitTypeId(unitTypeId = 0){
    try{
        const [ iUnitTypeId ] = converter('int', unitTypeId)

        if (typeof iUnitTypeId !== 'number' || iUnitTypeId < 1){
            console.error("PARAMETER ERROR: getUnitTypeReferencesByUnitTypeId's unitTypeId parameter must be a positive non-zero integer.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('get_unit_type_references_by_unit_type_id', {
            input_unit_type_id : iUnitTypeId
        });
        
        if (supabaseError){
            console.error(`Supabase Error:`, error.message);
            return null;
        }

        return data;
        
    } catch (generalError) {
        console.error("General error", error)
        return null;
    }
}

/**
 * Method to determine if a location exists based on its id
 * @param {int} unitTypeId The primary key of the unit type table
 * @returns The number of times a specific location is referenced by specific item ids
 */
export async function unitTypeExists(locationId = 0){
    try{
        const [ iUnitTypeId ] = converter('int', unitTypeId)

        if (typeof iUnitTypeId !== 'number' || iUnitTypeId < 1){
            console.error("PARAMETER ERROR: update_location_record_name's locationId parameter must be a positive non-zero integer.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('location_exists', {
            input_unit_type_id : iUnitTypeId,
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
