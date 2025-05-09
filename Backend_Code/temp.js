// This is a temporary javascript file to prepare methods to be pasted in the mainHandler.js

// ======================================================================================================================================
// Methods for Unit Type

/**
 * Method to get all of the records on the unit type table
 * @returns A record consisting of 2 columns (Unit Type ID, Name)
 */
export async function getAllItemMasterListRecords(){
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

// ===============================================================================================
// FRONT END-RELATED METHODS

/**
 * Method to add a new row to the table
 * @param {int} itemId Primary key of the itemType table
 * @param {string} itemName Name of the item 
 * @param {string} quantity Amount or quantity of said item (Combination of quantity + unit) 
 */
function createNewItemMasterListRow(itemId, itemName, quantity){
  // Create new row
  const tr = document.createElement("tr");
  tr.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-gray-900">${itemId}</td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-900">${itemName}</td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-900">${quantity}</td>
  
                <td class="px-6 py-4 whitespace-nowrap text-right space-x-3">
                  <button aria-label="Edit unit type" class="text-yellow-400 hover:text-yellow-500">
                    <i class="fas fa-pencil-alt"></i>
                  </button>
                  <button aria-label="Delete unit type" class="text-red-600 hover:text-red-700">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </td>
              `;

  tbody.appendChild(tr);
}

// ===============================================================================================
// BACK END-RELATED METHODS

async function prepareItemMasterListTable(){
  try{
    let data = await dbhandler.getAllItemMasterListRecords();

    if (data.length == 0){
      console.error('Unit type table has no records.')
      return;
    }

    for (let i = 0; i < data.length; i++){
      createNewItemMasterListRow(
        data[i]['Item ID'],
        data[i]['Name'],
        data[i]['Quantity'] 
      )
    }

  } catch (generalError){
      console.error(generalError);
  }
}
