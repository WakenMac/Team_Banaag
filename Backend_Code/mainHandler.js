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
 * Method to get all of the records on the location table, and are ordered by Location ID (Ascending)
 * @returns A record consisting of 4 columns (Location ID, Location Name)
 */
export async function getAllLocationRecordsOrderById(){
    try{
        const {data, error: supabaseError} = await supabaseClient.rpc('get_all_location_records_order_by_id');
        
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
 * Method to get all of the records on the location table, and are ordered alphabetically
 * @returns A record consisting of 4 columns (Location ID, Location Name)
 */
export async function getAllLocationRecordsOrderByName(){
    try{
        const {data, error: supabaseError} = await supabaseClient.rpc('get_all_location_records_order_by_name');
        
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
 * Method to get all of the records on the unit type table, ordered by their Unit Type ID
 * @returns A record consisting of 2 columns (Unit Type ID, Name)
 */
export async function getAllUnitTypeRecordsOrderById(){
    try{
        const {data, error: supabaseError} = await supabaseClient.rpc('get_all_unit_type_records_order_by_id');
        
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
 * Method to get all of the records on the unit type table, and are ordered alphabetically
 * @returns A record consisting of 2 columns (Unit Type ID, Name)
 */
export async function getAllUnitTypeRecordsOrderByName(){
    try{
        const {data, error: supabaseError} = await supabaseClient.rpc('get_all_unit_type_records_order_by_name');
        
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

/**
 * Method to get all of the records on the unit type table
 * @returns A record consisting of 4 columns (Item ID, Name, Type, Quantity)
 */
export async function   getAllItemMasterListRecords(){
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
 * Method to get all of the records from the Item Master List table
 * @returns A record consisting of 1 column (Name)
 */
export async function   getAllItemMasterListNameRecords(){
    try{
        const {data, error: supabaseError} = await supabaseClient.rpc('get_all_item_master_list_name_records');
        
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
 * Method to get all of the records from the Item Master List table
 * @returns A record consisting of 2 columns (Name, Brand)
 */
export async function   getAllItemMasterListNameBrandRecords(){
    try{
        const {data, error: supabaseError} = await supabaseClient.rpc('get_all_item_master_list_name_brand_records');
        
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
 * @param {string} itemName           Name of the chemical to be added
 * @param {string} unitTypeName       Unit Type of the chemical (e.g. Millimeters, Grams)
 * @param {string} locationName       Location where the chemical will be stored
 * @param {string} brandModel         Brand of the chemical to be added
 * @param {string} CASNo              CAS number of the chemical to be added
 * @param {string} MSDS               MSDS of the chemical to be added
 * @param {string} barcode            Barcode of the chemical to be added
 * @param {string} remarks            Remarks of the chemical to be added
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
export async function updateChemicalsRecordByAll(
        itemId, 
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
        console.log(barcode, CASNo, MSDS);

        const [ sItemName, sLocationName, sUnitTypeName, sBrandModel, sBarcode, sCASNo, sMSDS, sRemarks ] = converter('string', 
            itemName, locationName, unitTypeName, brandModel, barcode, CASNo, MSDS, remarks);
        const [ iItemId ] = converter('int', itemId);
        const [ iContainerSize ] = converter('float', containerSize);
        
        if (typeof sItemName !== 'string'){
            console.error("PARAMETER ERROR: updateChemicalsRecordByAll's Item Name parameter must be a string.")
            return null;
        } else if (typeof sLocationName !== 'string'){
            console.error("PARAMETER ERROR: updateChemicalsRecordByAll's Location Name parameter must be a string.")
            return null;
        } else if (typeof sUnitTypeName !== 'string'){
            console.error("PARAMETER ERROR: updateChemicalsRecordByAll's Unit Type Name parameter must be a string.")
            return null;
        } else if (typeof sBrandModel !== 'string'){
            console.error("PARAMETER ERROR: updateChemicalsRecordByAll's Brand/Model parameter must be a string.")
            return null;
        } else if (typeof sBarcode !== 'string'){
            console.error("PARAMETER ERROR: updateChemicalsRecordByAll's Barcode parameter must be a string.")
            return null;
        } else if (typeof sCASNo !== 'string'){
            console.error("PARAMETER ERROR: updateChemicalsRecordByAll's CAS No. parameter must be a string.")
            return null;
        } else if (typeof sMSDS !== 'string'){
            console.error("PARAMETER ERROR: updateChemicalsRecordByAll's MSDS parameter must be a string.")
            return null;
        } else if (typeof sRemarks !== 'string'){
            console.error("PARAMETER ERROR: updateChemicalsRecordByAll's Remarks parameter must be a string.")
            return null;
        }

        if ((typeof iItemId !== 'number' || iItemId < 1) || (typeof iContainerSize !== 'number' || iContainerSize < 1)){
            console.error("PARAMETER ERROR: updateChemicalsRecordByAll's Item ID & Container Size parameter must be a positive non-zero integer.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('update_chemicals_record_by_all', {
            input_item_id : iItemId,
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
 /**
 * Method to update an existing record's remarks in the Chemicals Table based on its Item ID
 * 
 * @param {int} chemicalId                      Primary key of the Chemicals table
 * @param {string} chemicalBarCode              Barcode of the chemical to be added
 * 
 * @returns A string containing the status of the deleted record (Success or Error)
 */
export async function updateChemicalRemarkByItemId(itemId, remarks = ''){
    try{
        const [ sRemarks ] = converter('string', remarks);
        const [ iItemId ] = converter('int', itemId);
        
        if (typeof sRemarks !== 'string'){
            console.error("PARAMETER ERROR: updateChemicalsRecordByAll's Remarks parameter must be a string.")
            return null;
        }

        if (typeof iItemId !== 'number' || iItemId < 1){
            console.error("PARAMETER ERROR: updateChemicalsRecordByAll's Item ID & Container Size parameter must be a positive non-zero integer.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('update_chemicals_remark_by_item_id', {
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
export async function getGlasswaresRecordByItemId(itemId = 0){
    try{
        const [ iItemId ] = converter('int', itemId);

        if (typeof iItemId !== 'number' || iItemId < 1){
            console.error("PARAMETER ERROR: getGlasswaresRecordByItemmId's itermID parameter must be a positive non-zero integer.")
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

        const {data, error: supabaseError} = await supabaseClient.rpc('main_add_glassware_record', {
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
            console.error("PARAMETER ERROR: updateGlasswaresRecordByAll's Location Name parameter must be a string.")
            return null;
        } else if (typeof sUnitTypeName !== 'string'){
            console.error("PARAMETER ERROR: updateGlasswaresRecordByAll's Unit Type Name parameter must be a string.")
            return null;
        } else if (typeof sItemName !== 'string'){
            console.error("PARAMETER ERROR: updateGlasswaresRecordByAll's Item Name parameter must be a string.")
            return null;
        } else if (typeof sBrandModel !== 'string'){
            console.error("PARAMETER ERROR: updateGlasswaresRecordByAll's Brand/Model parameter must be a string.")
            return null;
        } else if (typeof sRemarks !== 'string'){
            console.error("PARAMETER ERROR: updateGlasswaresRecordByAll's Remarks parameter must be a string.")
            return null;
        }

        if (typeof iItemId !== 'number' || iItemId < 1){
            console.error("PARAMETER ERROR: updateGlasswaresRecordByAll's itemID parameter must be a positive non-zero integer.")
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
 /**
 * Method to update an existing record's remarks in the Glasswares Table based on its Item ID
 * 
 * @param {int} itemId                          Primary key of the Glasswares table
 * @param {string} chemicalBarCode              Barcode of the chemical to be added
 * 
 * @returns A string containing the status of the deleted record (Success or Error)
 */
export async function updateGlasswaresRemarkByItemId(itemId, remarks = ''){
    try{
        const [ sRemarks ] = converter('string', remarks);
        const [ iItemId ] = converter('int', itemId);
        
        if (typeof sRemarks !== 'string'){
            console.error("PARAMETER ERROR: updateGlasswaresRemarkByItemId's Remarks parameter must be a string.")
            return null;
        }

        if (typeof iItemId !== 'number' || iItemId < 1){
            console.error("PARAMETER ERROR: updateGlasswaresRemarkByItemId's Item ID & Container Size parameter must be a positive non-zero integer.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('update_glasswares_remark_by_item_id', {
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
 * Method to remove a record to the Glasswares table
 * @param {int} itemId The primary key of the Glasswares table
 * @returns A string containing the status of the deleted record (Success or Error)
 */
export async function deleteGlasswaresRecordByItemId(itemId = 0){
    try{
        const [ iItemId ] = converter('int', itemId);

        if (typeof iItemId !== 'number' || iItemId < 1){
            console.error("PARAMETER ERROR: deleteGlasswaresRecordByItemId's itermID parameter must be a positive non-zero integer.")
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

// ======================================================================================================================================
// Methods for Lab Apparatus

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
export async function getLabApparatusRecordByItemId(itemId = 0){
    try{
        const [ iItemId ] = converter('int', itemId);

        if (typeof iItemId !== 'number' || iItemId < 1){
            console.error("PARAMETER ERROR: getLabApparatusRecordByItemId's itermID parameter must be a positive non-zero integer.")
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
            console.error("PARAMETER ERROR: updateLabApparatusRecordByAll's Location Name parameter must be a string.")
            return null;
        } else if (typeof sUnitTypeName !== 'string'){
            console.error("PARAMETER ERROR: updateLabApparatusRecordByAll's Unit Type Name parameter must be a string.")
            return null;
        } else if (typeof sItemName !== 'string'){
            console.error("PARAMETER ERROR: updateLabApparatusRecordByAll's Item Name parameter must be a string.")
            return null;
        } else if (typeof sBrandModel !== 'string'){
            console.error("PARAMETER ERROR: updateLabApparatusRecordByAll's Brand/Model parameter must be a string.")
            return null;
        } else if (typeof sRemarks !== 'string'){
            console.error("PARAMETER ERROR: updateLabApparatusRecordByAll's Remarks parameter must be a string.")
            return null;
        }

        if (typeof iItemId !== 'number' || iItemId < 1){
            console.error("PARAMETER ERROR: updateLabApparatusRecordByAll's itermID parameter must be a positive non-zero integer.")
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
            console.error("PARAMETER ERROR: deleteLabApparatusRecordByItemId's itermID parameter must be a positive non-zero integer.")
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
export async function getLabEquipmentsRecordByItemId(itemId = 0){
    try{
        const [ iItemId ] = converter('int', itemId);

        if (typeof iItemId !== 'number' || iItemId < 1){
            console.error("PARAMETER ERROR: getLabEquipmentsRecordByItemId's itermID parameter must be a positive non-zero integer.")
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
        var [ sItemName, sLocationName, sUnitTypeName, sBrandModel, sSerialNo, sCalibraitonDate, sFrequencyOfCalibration, sRemarks ] = converter('string', 
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

        if (sCalibraitonDate === '')
            sCalibraitonDate = null;

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
    itemId, itemName, locationName, unitTypeName, brandModel = '', serialNo, calibrationDate, frequencyOfCalibration, remarks = ''
){
    try{
        const [ sItemName, sLocationName, sUnitTypeName, sBrandModel, sSerialNo, sCalibraitonDate, sFrequencyOfCalibration, sRemarks ] = converter('string', 
            itemName, locationName, unitTypeName, brandModel, serialNo, calibrationDate, frequencyOfCalibration, remarks);
        const [ iItemId ] = converter('int', itemId);

        if (typeof iItemId !== 'number' || iItemId < 1){
            console.error("PARAMETER ERROR: addLabEquipmentsRecord's Item ID parameter must be a positive non-zero integer.")
            return null;
        } else if (typeof sItemName !== 'string'){
            console.error("PARAMETER ERROR: addLabEquipmentsRecord's Item Name parameter must be a string.")
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

// ======================================================================================================================================
// Methods for Consumable Items

/**
 * Method to get all of the records on the Consumable Items table
 * @returns A record consisting of 7 columns (Item ID, Name, Unit, Location, Brand, Quantity, and Remarks)
 */
export async function getAllConsumableItemsRecords(){
    try{
        const {data, error: supabaseError} = await supabaseClient.rpc('get_all_consumable_items_records');
        
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
 * Method to get one record from the Consumable Items table based on its item ID
 * @param {integer} itemId The primary key of the Consumable Items table
 * @returns A record consisting of 7 columns (Item ID, Name, Unit, Location, Brand, Quantity, and Remarks)
 */
export async function getAllConsumableItemsRecordsByItemId(itemId = 0){
    try{
        const [ iItemId ] = converter('int', itemId);

        if (typeof iItemId !== 'number' || iItemId < 1){
            console.error("PARAMETER ERROR: getAllConsumableItemsRecordsByItemId's itermID parameter must be a positive non-zero integer.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('get_consumable_items_record_by_item_id', {
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
 * Method to add a new row to the Consumable Items Table
 * @param {string} itemName                 Name of the consumable item to be added
 * @param {string} unitTypeName             Unit Type of the consumable item (e.g. Unit, Piece)
 * @param {string} locationName             Location where the item will be stored
 * @param {string} brandModel               Brand of the item to be added
 * @param {string} remarks                  Remarks of the item
 */
export async function addConsumableItemsRecord(
    itemName, locationName, unitTypeName, brandModel = '', remarks = ''
){
    try{
        const [ sItemName, sLocationName, sUnitTypeName, sBrandModel, sRemarks ] = converter('string', 
            itemName, locationName, unitTypeName, brandModel, remarks);

        if (typeof sItemName !== 'string'){
            console.error("PARAMETER ERROR: addConsumableItemsRecord's Location Name parameter must be a string.")
            return null;
        } else if (typeof sLocationName !== 'string'){
            console.error("PARAMETER ERROR: addConsumableItemsRecord's Unit Type Name parameter must be a string.")
            return null;
        } else if (typeof sUnitTypeName !== 'string'){
            console.error("PARAMETER ERROR: addConsumableItemsRecord's Item Name parameter must be a string.")
            return null;
        } else if (typeof sBrandModel !== 'string'){
            console.error("PARAMETER ERROR: addConsumableItemsRecord's Brand/Model parameter must be a string.")
            return null;
        } else if (typeof sRemarks !== 'string'){
            console.error("PARAMETER ERROR: addConsumableItemsRecord's Remarks parameter must be a string.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('main_add_consumable_items_record', {
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
 * Method to add a update a record from the Lab Equipments Table based on thier Item ID
 * @param {int} itemId                      ID of the item to be updated
 * @param {string} itemName                 Name of the consumable item to be added
 * @param {string} unitTypeName             Unit Type of the consumable item (e.g. Unit, Piece)
 * @param {string} locationName             Location where the item will be stored
 * @param {string} brandModel               Brand of the item to be added
 * @param {string} remarks                  Remarks of the item
 */
export async function updateConsumableItemsRecordByAll(
    itemId, itemName, locationName, unitTypeName, brandModel = '', remarks = ''
){
    try{
        const [ sItemName, sLocationName, sUnitTypeName, sBrandModel, sRemarks ] = converter('string', 
            itemName, locationName, unitTypeName, brandModel, remarks);
        const [ iItemId ] = converter('int', itemId);

        if (typeof iItemId !== 'number' || iItemId < 1){
            console.error("PARAMETER ERROR: updateLabEquipmentsRecordByAll's Item ID parameter must be a positive non-zero integer.")
            return null;
        } else if (typeof sItemName !== 'string'){
            console.error("PARAMETER ERROR: updateLabEquipmentsRecordByAll's Item Name parameter must be a string.")
            return null;
        } else if (typeof sLocationName !== 'string'){
            console.error("PARAMETER ERROR: updateLabEquipmentsRecordByAll's Location Name parameter must be a string.")
            return null;
        } else if (typeof sUnitTypeName !== 'string'){
            console.error("PARAMETER ERROR: updateLabEquipmentsRecordByAll's Unit Type parameter must be a string.")
            return null;
        } else if (typeof sBrandModel !== 'string'){
            console.error("PARAMETER ERROR: updateLabEquipmentsRecordByAll's Brand/Model parameter must be a string.")
            return null;
        } else if (typeof sRemarks !== 'string'){
            console.error("PARAMETER ERROR: updateLabEquipmentsRecordByAll's Remarks parameter must be a string.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('update_consumable_items_record_by_all', {
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
 * Method to update an existing record's remarks in the Lab Equipments Table based on its Item ID
 * 
 * @param {int} itemId                  Primary key of the Consumable Items table
 * @param {string} remarks              Remarks of one specific item
 * 
 * @returns A string containing the status of the deleted record (Success or Error)
 */
export async function updateConsumableItemsRemarkByItemId(itemId, remarks = ''){
    try{
        const [ sRemarks ] = converter('string', remarks);
        const [ iItemId ] = converter('int', itemId);
        
        if (typeof sRemarks !== 'string'){
            console.error("PARAMETER ERROR: updateLabConsumableItemsRemarkByItemId's Remarks parameter must be a string.")
            return null;
        }

        if (typeof iItemId !== 'number' || iItemId < 1){
            console.error("PARAMETER ERROR: updateLabConsumableItemsRemarkByItemId's Item ID must be a positive non-zero integer.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('update_consumable_items_remark_by_item_id', {
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
export async function deleteConsumableItemsRecordByItemId(itemId = 0){
    try{
        const [ iItemId ] = converter('int', itemId);

        if (typeof iItemId !== 'number' || iItemId < 1){
            console.error("PARAMETER ERROR: deleteConsumableItemsRecordByItemId's itemID parameter must be a positive non-zero integer.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('delete_consumable_items_record_by_item_id', {
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

// ======================================================================================================================================
// Methods for Restocks

/**
 * Method to get all of the records on the Consumable Items table
 * @returns A record consisting of 7 columns (Restock ID, Name, Initial Quantity, Used Quantity, Brand, Restock Date, and Expiry Date)
 */
export async function getAllRestocksRecords(){
    try{
        const {data, error: supabaseError} = await supabaseClient.rpc('get_all_restocks_records');
        
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
 * Method to get one record from the Consumable Items table based on its item ID
 * @param {integer} itemId The primary key of the Consumable Items table
 * @returns A record consisting of 7 columns (Restock ID, Name, Initial Quantity, Used Quantity, Brand, Restock Date, and Expiry Date)
 */
export async function getRestocksRecordsByItemId(itemId = 0){
    try{
        const [ iItemId ] = converter('int', itemId);

        if (typeof iItemId !== 'number' || iItemId < 1){
            console.error("PARAMETER ERROR: getAllRestocksRecordsByItetmId's itermID parameter must be a positive non-zero integer.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('get_restocks_record_by_restock_id', {
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
 * Gets all valid restocks to set to the restocks table (Front End)
 * @param {integer} itemId The primary key of the Consumable Items table
 * @returns A record consisting of 7 columns (Restock ID, Name, Initial Quantity, Used Quantity, Brand, Restock Date, and Expiry Date)
 */
export async function getAllValidRestocksRecords(){
    try{
        const {data, error: supabaseError} = await supabaseClient.rpc('get_all_valid_restocks_record_view', {
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
 * Method to add a new row to the Restocks Table
 * @param {number} itemId               Primary Key of the item, to determince which item will be restocked
 * @param {string} restockDate          When you received the restock
 * @param {string} expiryDate           Expiration date of the restock
 * @param {number} initialQuantity      Quantity of the restock
 */
export async function addRestocksRecord(
    itemId, restockDate, expiryDate, initialQuantity, remarks
){
    try{
        const [ sRestockDate, sExpiryDate, sRemarks ] = converter('string', restockDate, expiryDate, remarks);
        const [ iItemId ] = converter('int', itemId);
        const [ iInitialQuantity ] = converter('float', initialQuantity);

        if (typeof sRestockDate !== 'string'){
            console.error("PARAMETER ERROR: addRestocksRecord's Brand/Model parameter must be a date.") // Must be a string
            return null;
        } else if (typeof sExpiryDate !== 'string'){
            console.error("PARAMETER ERROR: addRestocksRecord's Expiry Date must be a date.") // Must be a string
            return null;
        } else if (typeof sRemarks !== 'string'){
            console.error("PARAMETER ERROR: addRestocksRecord's Remarks parameter must be a date.") // Must be a string
            return null;
        } else if (typeof iInitialQuantity !== 'number' || iInitialQuantity < 1){
            console.error("PARAMETER ERROR: addRestocksRecord's Initial Quantity must be a positive non-zero integer.")
            return null;
        } else if (typeof iItemId !== 'number' || iItemId < 1){
            console.error("PARAMETER ERROR: addRestocksRecord's Item ID must be a positive non-zero integer.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('main_add_restocks_record', {
            input_item_id : iItemId,
            input_restock_date : sRestockDate,
            input_expiry_date : sExpiryDate, 
            initial_quantity : iInitialQuantity,
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
 * @param {number} itemId               Primary Key of the item, to determince which item will be restocked
 * @param {string} restockDate          When you received the restock
 * @param {string} expiryDate           Expiration date of the restock
 * @param {number} initialQuantity      Quantity of the restock
 */
export async function updateRestocksRecordByAll(
    itemId, restockDate, expiryDate, initial_quantity
){
    try{
        const [ sRestockDate, sExpiryDate ] = converter('string', restockDate, expiryDate);
        const [ iItemId ] = converter('int', itemId);
        const [ iInitialQuantity ] = converter('float', iInitialQuantity);

        if (typeof sRestockDate !== 'string'){
            console.error("PARAMETER ERROR: updateRestocksRecordByAll's Brand/Model parameter must be a date.") // Must be a string
            return null;
        } else if (typeof sExpiryDate !== 'string'){
            console.error("PARAMETER ERROR: updateRestocksRecordByAll's Expiry Date must be a date.") // Must be a string
            return null;
        } else if (typeof iInitialQuantity !== 'number' || iInitialQuantity < 1){
            console.error("PARAMETER ERROR: updateRestocksRecordByAll's Initial Quantity must be a positive non-zero integer.")
            return null;
        } else if (typeof iItemId !== 'number' || iItemId < 1){
            console.error("PARAMETER ERROR: updateRestocksRecordByAll's Item ID must be a positive non-zero integer.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('updateRestocksRecordByAll', {
            input_item_id : iItemId,
            input_restock_date : sRestockDate,
            input_expiry_date : sExpiryDate, 
            initial_quantity : iInitialQuantity
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
 * Method to update an existing record's remarks in the Restocks Table based on its restock ID
 * 
 * @param {int} restockId               Primary key of the Restocks table
 * @param {string} remarks              Remarks of one specific item
 * 
 * @returns A string containing the status of the deleted record (Success or Error)
 */
export async function updateRestocksRemarksByRestockId(restockId, remarks = ''){
    try{
        const [ sRemarks ] = converter('string', remarks);
        const [ iRestockId ] = converter('int', restockId);
        
        if (typeof sRemarks !== 'string'){
            console.error("PARAMETER ERROR: updateRestocksRemarksByItemId's Remarks parameter must be a string.")
            return null;
        }

        if (typeof iRestockId !== 'number' || iRestockId < 1){
            console.error("PARAMETER ERROR: updateRestocksRemarksByItemId's Restock ID must be a positive non-zero integer.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('update_restocks_remarks_by_restock_id', {
            input_restock_id : iRestockId,
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
 * @param {int} restockId The primary key of the Lab Equipments table
 * @returns A string containing the status of the deleted record (Success or Error)
 */
export async function removeRestocksRecordByRestockId(restockId = 0){
    try{
        const [ iRestockId ] = converter('int', restockId);

        if (typeof iRestockId !== 'number' || iRestockId < 1){
            console.error("PARAMETER ERROR: removeRestocksRecordByRestockId's Restock ID's parameter must be a positive non-zero integer.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('remove_restocks_record_by_restock_id', {
            input_restock_id : iRestockId
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

    // TODO: Remove once everything is implemented.
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

    return newArray;
}