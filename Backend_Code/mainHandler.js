// Prepares the connection to the database:
// import { createClient } from '@supabase/supabase-js';
const url = "https://tkuqbdxvokhgfoipyoyr.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrdXFiZHh2b2toZ2ZvaXB5b3lyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3NDk4ODQsImV4cCI6MjA1NjMyNTg4NH0.zrNLQjJ7VUnHj2wLhxDxWzpN22b_tAOYPneyeh332gE";
const supabaseClient = supabase.createClient(url, key);
// const supabaseClient = createClient(url, key);

/**
 * Method used to test if we can access the mainHandler javascript file.
 */
export async function testPresence(){
    console.log("Main Handler is alive.");
}

// ======================================================================================================================================
// Methods for admins

/**
 * Method to get all of the records on the Admin table
 * @returns Multiple records consisting of 4 columns (Admin ID, First Name, Middle Name, Last Name)
 */
export async function getAllAdmins(){
    try{
        const {data, error: supabaseError} = await supabaseClient.rpc('get_all_admin_records')
        
        if (supabaseError){
            console.error(`Supabase Error:`, supabaseError.message);
            return null;
        }   else {
            return data;
        }
        
    } catch (generalError) {
        console.error("General error", generalError)
        return null;
    }
}

/**
 * Method to get all of the records on the Admin table
 * @param {string} adminId Primary key of the Admin table used to find specific records
 * @returns A record consisting of 4 columns (Admin ID, First Name, Middle Name, Last Name)
 */
export async function getAdminRecordByAdminID(adminId){
    try{
        let [ sAdminId ] = converter('string', adminId);

        if (typeof sAdminId !== 'string'){
            throw new Error('ERROR: Admin ID must be a string.')
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('get_admin_record_by_admin_id', {
            input_admin_id: adminId
        })
        
        if (supabaseError){
            console.error(`Supabase Error:`, supabaseError.message);
            return null;
        }   else {
            return data;
        }
        
    } catch (generalError) {
        console.error("General error", generalError)
        return null;
    }
}

/**
 * Method to get a record on the Admin table based on their name
 * @param {string} fName First name of the admin
 * @param {string} mName Middle name of the admin
 * @param {string} lName Last name of the admin
 * @returns A record consisting of 4 columns (Admin ID, First Name, Middle Name, Last Name)
 */
export async function getAdminRecordByName(fName, mName, lName){
    try{
        let [ sFName, sMName, sLName ] = converter('string', fName, mName, lName );

        if (typeof sFName !== 'string' || typeof sMName !== 'string' || typeof sLName !== 'string')
            throw new Error(`ERROR: getAdminRecordByName's parameters must be strings.`);

        const {data, error: supabaseError} = await supabaseClient.rpc('get_admin_record_by_name', {
            input_f_name: fName,
            input_m_name: mName,
            input_l_id: lName
        })
        
        if (supabaseError){
            console.error(`Supabase Error:`, supabaseError.message);
            return null;
        }   else {
            return data;
        }
        
    } catch (generalError) {
        console.error("General error", generalError)
        return null;
    }
}

/**
 * Adds a new record to the Admin table
 * @param {string} adminId User-defined primary key of the Admin table
 * @param {string} adminPassword Password of the admin to be using the database
 * @param {string} fName First name of the admin
 * @param {string} mName Middle name of the admin
 * @param {string} lName Last name of the admin
 * @returns A string containing the status of the newly added record (Success or Error)
 */
export async function addAdminRecord(adminId, fName, mName, lName, adminPassword){
    try{
        console.log(adminPassword);
        let [ sAdminId, sFName, sMName, sLName, sAdminPassword ] = converter('string', adminId, fName, mName, lName, adminPassword);

        if (typeof sAdminId !== 'string' || typeof sFName !== 'string' || typeof sMName !== 'string' ||
            typeof sLName !== 'string' || typeof sAdminPassword !== 'string')
            throw new Error(`ERROR: addAdminRecord's parameters must be strings.`);

        const {data, error: supabaseError} = await supabaseClient.rpc('add_admin_record', {
            input_admin_id: adminId, 
            input_f_name: fName, 
            input_m_name: mName, 
            input_l_name: lName, 
            input_admin_password: adminPassword
        })
        
        if (supabaseError){
            console.error(`Supabase Error:`, error.message);
            return null;
        }   else {
            return data;
        }
        
    } catch (generalError) {
        console.error("General error", generalError)
        return null;
    }
}

/**
 * Updates the password of a record in the Admin table based on the adminId
 * @param {string} adminId User-defined primary key of the Admin table
 * @param {string} adminPassword Password of the admin to be using the database
 * @returns A string containing the status of the updated record (Success or Error)
 */
export async function updateAdminRecordPassword(adminId, adminPassword){
    try{
        let [ sAdminId, sAdminPassword ] = converter('string', adminId, adminPassword);

        if (typeof sAdminId !== 'string' || typeof sAdminPassword !== 'string')
            throw new Error(`ERROR: updateAdminRecord's parameters must be strings.`);

        const {data, error: supabaseError} = await supabaseClient.rpc('update_admin_record_password', {
            input_admin_id: adminId, 
            input_admin_password: adminPassword
        })
        
        if (supabaseError){
            console.error(`Supabase Error:`, error.message);
            return null;
        }   else {
            return data;
        }
        
    } catch (generalError) {
        console.error("General error", generalError)
        return null;
    }
}

/**
 * Updates most of the attributes of an Admin record based on their adminId
 * @param {string} adminId User-defined primary key of the Admin table
 * @param {string} adminPassword Password of the admin to be using the database
 * @param {string} fName First name of the admin
 * @param {string} mName Middle name of the admin
 * @param {string} lName Last name of the admin
 * @returns A string containing the status of the updated record (Success or Error)
 */
export async function updateAdminRecord(adminId, fName, mName, lName, adminPassword){
    try{
        let [ sAdminId, sFName, sMName, sLName, sAdminPassword ] = converter('string', adminId, fName, mName, lName, adminPassword);

        if (typeof sAdminId !== 'string' || typeof sFName !== 'string' || typeof sMName !== 'string' ||
            typeof sLName !== 'string' || typeof sAdminPassword !== 'string')
            throw new Error(`ERROR: updateAdminRecord's parameters must be strings.`);

        const {data, error: supabaseError} = await supabaseClient.rpc('update_admin_record', {
            input_admin_id: adminId, 
            input_f_name: fName, 
            input_m_name: mName, 
            input_l_name: lName, 
            input_admin_password: adminPassword
        })
        
        if (supabaseError){
            console.error(`Supabase Error:`, error.message);
            return null;
        }   else {
            return data;
        }
        
    } catch (generalError) {
        console.error("General error", generalError)
        return null;
    }
}

/**
 * Removes a record from the Admin table, whose admin has not made any transaction yet.
 * @param {string} adminId User-defined primary key of the Admin table
 * @returns A string containing the status of the deleted record (Success or Error)
 */
export async function removeAdminRecordByAdminId(adminId){
    try{
        const [ sAdminId ] = converter('string', adminId);

        if (typeof sAdminId !== 'string')
            throw new Error(`ERROR: removeAdminRecordByAdminId's parameters must be strings.`);

        const {data, error: supabaseError} = await supabaseClient.rpc('remove_admin_record_by_admin_id', {
            input_admin_id: adminId
        })
        
        if (supabaseError){
            console.error(`Supabase Error:`, error.message);
            return null;
        }   else {
            return data;
        }
        
    } catch (generalError) {
        console.error("General error", generalError)
        return null;
    }
}

// ======================================================================================================================================
// Methods for location

/**
 * Method to get all of the records on the location table
 * @returns A record consisting of 4 columns (Location ID, Location Name)
 */
export async function getAllLocationRecords(){
    try{
        const {data, error: supabaseError} = await supabaseClient.rpc('get_all_location_records');
        
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
 * Method to get all of the records on the location table
 * @param {integer} locationId The primary key of the location table
 * @returns A record consisting of 2 columns (Location ID, Location Name)
 */
export async function getLocationRecordByLocationId(locationId){
    try{
        const [ sLocationId ] = converter('string', locationId);

        if (typeof sLocationId !== 'string'){
            console.error("PARAMETER ERROR: getLocationRecordByLocationId's locationId parameter must be a string.")
            return null;
        }
        

        const {data, error: supabaseError} = await supabaseClient.rpc('get_location_record_by_location_id', {
            input_location_id : sLocationId
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
 * Method to get the  record of the location table
 * @param {integer} locationId The primary key of the location table
 * @returns A record consisting of 2 columns (Location ID, Location Name)
 */
export async function getLocationRecordByName(locationName){
    try{
        const [ sLocationName ] = converter('string', locationName);

        if (typeof sLocationId !== 'string'){
            console.error("PARAMETER ERROR: add_location_record's locationName parameter must be a string.")
            return null;
        }
        

        const {data, error: supabaseError} = await supabaseClient.rpc('add_location_record', {
            input_location_name : sLocationName
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
 * Method to add a record to the location table
 * @param {string} locationName The name of the location to be added
 * @returns A string containing the status of the added record (Success or Error). Moreover, this returns the ID of the newly added row
 */
export async function addLocationRecord(locationName){
    try{
        const [ sLocationName ] = converter('string', locationName);

        if (typeof sLocationName !== 'string'){
            console.error("PARAMETER ERROR: add_location_record's locationName parameter must be a string.")
            return null;
        }
        

        const {data, error: supabaseError} = await supabaseClient.rpc('add_location_record', {
            input_location_name : sLocationName
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
 * @param {int} locationId The primary key of the location table
 * @param {string} locationName The name to be changed in the location table based on the location id
 * @returns A string containing the status of the updated record (Success or Error)
 */
export async function updateLocationRecordName(locationId = 0, locationName = ''){
    try{
        const [ sLocationName ] = converter('string', locationName);
        const [ iLocationId ] = converter('int', locationId)

        if (typeof iLocationId !== 'number'){
            console.error("PARAMETER ERROR: update_location_record_name's locationId parameter must be a positive integer.")
            return null;
        } else if (typeof sLocationName !== 'string'){
            console.error("PARAMETER ERROR: update_location_record_name's locationName parameter must be a string.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('update_location_record_name', {
            input_location_id : iLocationId,
            input_location_name : sLocationName
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
 * Method to remove a record to the location table
 * @param {int} locationId The primary key of the location table
 * @returns A string containing the status of the deleted record (Success or Error)
 */
export async function removeLocationRecordByLocationId(locationId = 0){
    try{
        const [ iLocationId ] = converter('int', locationId)

        if (typeof iLocationId !== 'number'){
            console.error("PARAMETER ERROR: update_location_record_name's locationId parameter must be a positive integer.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('remove_location_record_by_location_id', {
            input_location_id : iLocationId,
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
 * @param {int} locationId The primary key of the location table
 * @returns The number of times a specific location is referenced by specific item ids
 */
export async function getLocationReferencesByLocationId(locationId = 0){
    try{
        const [ iLocationId ] = converter('int', locationId)

        if (typeof iLocationId !== 'number'){
            console.error("PARAMETER ERROR: update_location_record_name's locationId parameter must be a positive integer.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('get_location_references_by_location_id', {
            input_location_id : iLocationId,
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
 * @param {int} locationId The primary key of the location table
 * @returns The number of times a specific location is referenced by specific item ids
 */
export async function locationExists(locationId = 0){
    try{
        const [ iLocationId ] = converter('int', locationId)

        if (typeof iLocationId !== 'number'){
            console.error("PARAMETER ERROR: update_location_record_name's locationId parameter must be a positive integer.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('location_exists', {
            input_location_id : iLocationId,
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

// ======================================================================================================================================
// Methods for Unit Type

/**
 * Method to get all of the records on the unit type table
 * @returns A record consisting of 2 columns (Unit Type ID, Name)
 */
export async function getAllUnitTypeRecords(){
    try{
        const {data, error: supabaseError} = await supabaseClient.rpc('get_all_unit_type_records');
        
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
 * Method to get all of the records on the location table
 * @param {integer} unitTypeId The primary key of the location table
 * @returns A record consisting of 2 columns (Unit Type ID, Name)
 */
export async function getUnitTypeRecordByUnitTypeId(unitTypeId){
    try{
        const [ iUnitTypeId ] = converter('int', unitTypeId);

        if (typeof iUnitTypeId !== 'number' || iUnitTypeId < 1){
            console.error("PARAMETER ERROR: getUnitTypeRecordByUnitTypeId's unitTypeId parameter must be a positive non-zero integer.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('get_unit_type_record_by_unit_type_id', {
            input_unit_type_id : iUnitTypeId
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
 * Method to get a record from the unit type table via the unit type name
 * @param {integer} unitTypeName The name of the unit type to find in the table
 * @returns A record consisting of 2 columns (Location ID, Location Name)
 */
export async function getUnitTypeRecordByName(unitTypeName){
    try{
        const [ sUnitTypeName ] = converter('string', unitTypeName);

        if (typeof sUnitTypeName !== 'string'){
            console.error("PARAMETER ERROR: getUnitTypeRecordByName's unitTypeName parameter must be a string.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('get_unit_type_record_by_name', {
            input_unit_type_name : sUnitTypeName
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
 * Method to add a record to the unit type table
 * @param {string} unitTypeName The name of the unit type to be added 
 * @returns A string containing the status of the added record (Success or Error). Moreover, this returns the ID of the newly added row
 */
export async function addUnitTypeRecord(unitTypeName){
    try{
        const [ sUnitTypeName ] = converter('string', unitTypeName);

        if (typeof sUnitTypeName !== 'string'){
            console.error("PARAMETER ERROR: addUnitTypeRecord's unitTypeName parameter must be a string.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('add_unit_type_record', {
            input_unit_type_name : sUnitTypeName
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
export async function updateUnitTypeRecordName(unitTypeId = 0, unitTypeName = ''){
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
            input_unit_type_id : iUnitTypeId,
            input_unit_type_name : sUnitTypeName
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

// ======================================================================================================================================
// Methods for Item Master List

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
 * Method to update a record to the item master list table
 * @param {int} itemId The primary key of the item master list table
 * @param {string} itemName The name to be changed in the item master list table based on the item id
 * @param {string} itemType The name to be changed in the item master list table based on the item id
 * @returns A string containing the status of the updated record (Success or Error)
 */
export async function updateItemMasterListRecord(itemId = 0, itemName = '', itemType){
    try{
        const [ sItemName, sItemType ] = converter('string', itemName, itemType);
        const [ iItemId ] = converter('int', itemId)

        if (typeof iUnitTypeId !== 'number' || iUnitTypeId < 1){
            console.error("PARAMETER ERROR: updateItemMasterListRecord's itemId parameter must be a positive non-zero integer.")
            return null;
        } else if (typeof sUnitTypeName !== 'string'){
            console.error("PARAMETER ERROR: updateItemMasterListRecord's itemName parameter must be a string.")
            return null;
        } else if (
            typeof itemType !== 'string' || (
            itemType !== 'Lab Equipment' || itemType !== 'Lab Apparatus' || itemType !== 'Glasswares' || itemType !== 'Chemicals' || itemType !== 'Consumable Items' 
        )){
            console.error("PARAMETER ERROR: updateItemMasterListRecord's itemType parameter must be a string and either of the following: Chemicals, Lab Equipment, Lab Apparatus, Glasswares, Consumable Items");
            return null;

        }

        const {data, error: supabaseError} = await supabaseClient.rpc('update_unit_type_record_name', {
            input_item_id : iItemId,
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

// TODO: Implement removeUnitTypeRecord

/**
 * Method to remove a record to the item master list table
 * @param {int} itemId The primary key of the item master list table
 * @returns A string containing the status of the deleted record (Success or Error)
 */
export async function removeItemMasterListRecordByItemId(itemId = 0){
    try{
        const [ iItemId ] = converter('int', itemId)

        if (typeof iItemId !== 'number' || iItemId < 1){
            console.error("PARAMETER ERROR: removeItemMasterListRecordByItemId's itemId parameter must be a positive non-zero integer.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('remove_item_master_list_record_by_item_id', {
            input_item_id : itemId
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
 * Method to return the number of times a specific item master list record (based on Item id) is referenced in different 
 * item_type tables (Chemicals, Consumable Items, Equipments, Apparatus, Glassware)
 * 
 * @param {int} itemId The primary key of the item master list table
 * @returns The number of times a specific location is referenced by specific item ids
 */
export async function getItemMasterListReferencesByItemId(itemId = 0){
    try{
        const [ iItemId ] = converter('int', itemId)

        if (typeof iItemId !== 'number' || iItemId < 1){
            console.error("PARAMETER ERROR: getItemMasterListReferencesByItemId's itemId parameter must be a positive non-zero integer.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('get_item_master_list_references_by_item_id', {
            input_item_id : iItemId
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
 * Method to determine if a item master list record exists based on its item name
 * @param {string} itemName Name of the item to be searched for
 * @returns A boolean (True or False) if said item exists in the item master list table
 */
export async function itemTypeExistsByItemName(itemName = 0){
    try{
        const [ sItemName ] = converter('string', itemName)

        if (typeof sItemName !== 'string'){
            console.error("PARAMETER ERROR: itemTypeExistsByItemName's itemName parameter must be a string.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('item_master_list_exists_by_item_id', {
            input_item_name : sItemName,
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
 * Method to determine if a item master list record exists based on the item ID
 * @param {int} itemId The primary key of the item master list table
 * @returns A boolean (True or False) if said item exists in the item master list table
 */
export async function itemTypeExistsByItemId(itemId = 0){
    try{
        const [ iItemId ] = converter('int', itemId)

        if (typeof iItemId !== 'number' || iItemId < 1){
            console.error("PARAMETER ERROR: itemTypeExistsByItemName's itemName parameter must be a positive non-zero integer.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('item_master_list_exists_by_item_id', {
            input_item_name : sItemName,
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

// ======================================================================================================================================
// Methods for Chemicals

/**
 * Method to get all of the records on the unit type table
 * @returns A record consisting of 12 columns ()
 */
export async function getAllChemicalRecords(){
    try{
        const {data, error: supabaseError} = await supabaseClient.rpc('get_all_chemicals_records');
        
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
 * Method to get a record from the Chemicals table based on the item id
 * @param {integer} itemId The primary key of the Chemicals table
 * @returns A record consisting of 4 columns (Item ID, Name, Type, Quantity)
 */
export async function getChemicalsRecordByItemID(itemId){
    try{
        const [ iItemId ] = converter('int', itemId);

        if (typeof iItemId !== 'number' || iItemId < 1){
            console.error("PARAMETER ERROR: get_item_master_list_record_by_item_id's unitTypeId parameter must be a positive non-zero integer.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('get_chemicals_record_by_item_id', {
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
 * @param {int} chemicalId                    Primary key of the Chemicals table
 * @param {string} chemicalName               Name of the chemical to be added
 * @param {string} chemicalUnit               Unit Type of the chemical (e.g. Millimeters, Grams)
 * @param {string} chemicalLocation           Location where the chemical will be stored
 * @param {string} chemicalBrand              Brand of the chemical to be added
 * @param {float} chemicalInitialQuantity    Initial quantity of the chemical
 * @param {float} chemicalRemainingQuantity  Remaining quantity of the chemical
 * @param {string} chemicalCASNo              CAS number of the chemical to be added
 * @param {string} chemicalMSDS               MSDS of the chemical to be added
 * @param {string} chemicalBarCode            Barcode of the chemical to be added
 */
export async function addChemicalsRecord( 
        itemName,
        locationName, 
        unitTypeName, 
        brandModel,
        containerSize,
        barcode = '',
        CASNo = '',
        MSDS = '',
        remarks = ''
    ){
    try{
        const [ sItemName, sLocationName, sUnitTypeName, sBrandModel, sBarcode, sCASNo, sMSDS, sRemarks ] = converter('string', 
            itemName, locationName, unitTypeName, brandModel, barcode, CASNo, MSDS, remarks);
        const [ iContainerSize ] = converter('float', containerSize);

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
        } else if (typeof sBarcode !== 'string'){
            console.error("PARAMETER ERROR: addChemicalsRecord's Barcode parameter must be a string.")
            return null;
        } else if (typeof sCASNo !== 'string'){
            console.error("PARAMETER ERROR: addChemicalsRecord's CAS No. parameter must be a string.")
            return null;
        } else if (typeof sMSDS !== 'string'){
            console.error("PARAMETER ERROR: addChemicalsRecord's MSDS parameter must be a string.")
            return null;
        } else if (typeof sRemarks !== 'string'){
            console.error("PARAMETER ERROR: addChemicalsRecord's Remarks parameter must be a string.")
            return null;
        }

        if (typeof iContainerSize !== 'number' || iContainerSize < 1){
            console.error("PARAMETER ERROR: addChemicalsRecord's Item ID & Container Size parameter must be a positive non-zero integer.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('main_add_chemicals_record', {
            input_item_name : sItemName,
            input_location_name : sLocationName,
            input_unit_type_name : sUnitTypeName,
            input_brand_model : sBrandModel,
            input_container_size : iContainerSize,
            input_barcode : sBarcode,
            input_cas_no : sCASNo,
            input_msds : sMSDS,
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
 * Method to remove a record to the Chemicals table
 * @param {int} itemId The primary key of the Chemicals table
 * @returns A string containing the status of the deleted record (Success or Error)
 */
export async function deleteChemicalsRecordByItemId(itemId = 0){
    try{
        const [ iItemId ] = converter('int', itemId)

        if (typeof iItemId !== 'number' || iItemId < 1){
            console.error("PARAMETER ERROR: removeItemMasterListRecordByItemId's itemId parameter must be a positive non-zero integer.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('delete_chemicals_record_by_item_id', {
            input_item_id : itemId
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
 * Method to update an existing record in the Chemicals Table based on its Item ID
 * 
 * @param {int} chemicalId                      Primary key of the Chemicals table
 * @param {string} chemicalName                 Name of the chemical to be added
 * @param {string} chemicalUnit                 Unit Type of the chemical (e.g. Millimeters, Grams)
 * @param {string} chemicalLocation             Location where the chemical will be stored
 * @param {string} chemicalBrand                Brand of the chemical to be added
 * @param {float} chemicalInitialQuantity       Initial quantity of the chemical
 * @param {float} chemicalRemainingQuantity     Remaining quantity of the chemical
 * @param {string} chemicalCASNo                CAS number of the chemical to be added
 * @param {string} chemicalMSDS                 MSDS of the chemical to be added
 * @param {string} chemicalBarCode              Barcode of the chemical to be added
 * 
 * @returns A string containing the status of the deleted record (Success or Error)
 */
export async function update_chemicals_record_by_all(
        itemId, 
        locationName, 
        unitTypeName, 
        brandModel,
        containerSize,
        barcode,
        CASNo,
        MSDS,
        remarks
    ){
    try{
        const [ sLocationName, sUnitTypeName, sBrandModel, sBarcode, sCASNo, sMSDS, sRemarks ] = converter('string', 
            locationName, unitTypeName, brandModel, barcode, CASNo, MSDS, remarks);
        const [ iItemId ] = converter('string', itemId);
        const [ iContainerSize ] = converter('float', containerSize);

        if (typeof sLocationName !== 'string'){
            console.error("PARAMETER ERROR: addChemicalsRecord's Location Name parameter must be a string.")
            return null;
        } else if (typeof sUnitTypeName !== 'string'){
            console.error("PARAMETER ERROR: addChemicalsRecord's Unit Type Name parameter must be a string.")
            return null;
        } else if (typeof sBrandModel !== 'string'){
            console.error("PARAMETER ERROR: addChemicalsRecord's Brand/Model parameter must be a string.")
            return null;
        } else if (typeof sBarcode !== 'string'){
            console.error("PARAMETER ERROR: addChemicalsRecord's Barcode parameter must be a string.")
            return null;
        } else if (typeof sCASNo !== 'string'){
            console.error("PARAMETER ERROR: addChemicalsRecord's CAS No. parameter must be a string.")
            return null;
        } else if (typeof sMSDS !== 'string'){
            console.error("PARAMETER ERROR: addChemicalsRecord's MSDS parameter must be a string.")
            return null;
        } else if (typeof sRemarks !== 'string'){
            console.error("PARAMETER ERROR: addChemicalsRecord's Remarks parameter must be a string.")
            return null;
        }

        if ((typeof iItemId !== 'number' || iItemId < 1) || (typeof iContainerSize !== 'number' || iContainerSize < 1)){
            console.error("PARAMETER ERROR: addChemicalsRecord's Item ID & Container Size parameter must be a positive non-zero integer.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('update_chemicals_record_by_all', {
            input_item_id : iItemId,
            input_location_name : sLocationName,
            input_unit_type_name : sUnitTypeName,
            input_brand_model : sBrandModel,
            input_container_size : iContainerSize,
            input_barcode : sBarcode,
            input_cas_no : sCASNo,
            input_msds : sMSDS,
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


// ======================================================================================================================================
// Methods for Restocks

export async function getAllRestocksRecords(){
    try{
        const {data, error} = await supabaseClient.rpc('get_all_restocks_records');
        
        if (error){
            console.error(`Supabase Error:`, error.message);
            return;
        }

        console.log(data);
        return data;
        
    } catch (error) {
        console.error("General error", error)
    }
}

export async function getRestocksRecordByRestockID(restockID = 0){
    try{
        if (typeof restockID !== "number"){
            console.error("PARAMETER ERROR: getItemMasterListByID's item_id parameter must be a positive integer from 1 onwards.")
            return;
        }

        const {data, error} = await supabaseClient.rpc('get_restocks_record_by_restock_id', {
            input_restock_id : restockID
        });
        
        if (error){
            console.error(`Supabase Error:`, error.message);
            return;
        }

        console.log(data);
        return data;
        
    } catch (error) {
        console.error("General error", error)
    }
}

//=======================================================================================================================================
// HELPER METHODS

/**
 * Converts the array of objects into strings
 * @param {string} [condition=''] The data type you want your data to be converted to (string, int, bigint, float)
 * @param {...*} objectArray The array of objects to be converted
 */
export function converter(condition = '', ...objectArray){
    if (!condition === 'string' || !condition === 'int' || !condition === 'bigint' || !condition === 'float'){
        throw new Error('Kindly specify the condition for this method')
    }

    console.log(objectArray);
    let newArray = new Array(objectArray.length);

    for (let i = 0; i < objectArray.length; i++){
        if (condition === 'string')
            newArray[i] = String(objectArray[i])
        else if (condition === 'int')
            newArray[i] = Number(objectArray[i])
        else if (condition === 'bigint')
            newArray[i] = BigInt(objectArray[i])
        else if (condition === 'float')
            newArray[i] = parseFloat(String(objectArray[i]))

    }

    console.log(newArray);
    return newArray;
}