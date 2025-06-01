import { initializeSupabaseClient, getSupabaseClient } from "../config/database.js";

//=======================================================================================================================================
// HELPER METHODS

// Instantiates the supabase client (ALWAYS RUN FIRST)
const start = () => {    
    initializeSupabaseClient();
    let client = getSupabaseClient();
    console.log(client)
    return client;
}

// Code to handle supabase errors
const handleSupabaseError = (res, error) => {
    console.error('Supabase Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
};

// For transaction-related stuff
const prepareUser = async () => {
    try {
        const {data, error} = await start().auth.signInWithPassword({
            email: `maclangw26@gmail.com`,
            password: `2023-00570`
        })

        if (error)
            throw error
        return data;
    } catch (error){
        console.error(error);
        return;
    }
}

const mainHandler = {

    /**
     * Method used to test if we can access the mainHandler javascript file.
     */
    async testPresence(req, res){
        console.log("Buhi pako.");
    },

    // ======================================================================================================================================
    // Methods for admins

    /**
     * Method to get all of the records on the Admin table
     * @returns Multiple records consisting of 4 columns (Admin ID, First Name, Middle Name, Last Name)
     */
    async getAllAdmins(req, res){
        try{
            const {data, error} = await start().rpc('get_all_admin_records')
            
            if (error)
                throw error;
            res.status(200).json({ success : true, data})
            
        } catch (generalError) {
            handleSupabaseError(res, generalError);
        }
    },

    /**
     * Adds a new record to the Admin table
     * @param {string} adminId User-defined primary key of the Admin table
     * @param {string} adminPassword Password of the admin to be using the database
     * @param {string} fName First name of the admin
     * @param {string} mName Middle name of the admin
     * @param {string} lName Last name of the admin
     * @returns A string containing the status of the newly added record (Success or Error)
     */
    async addAdminRecord(req, res){
        try{
            let { adminId, fName, mName, lName, adminPassword } = req.body;

            const {data, error} = await start().rpc('add_admin_record', {
                input_admin_id: adminId, 
                input_f_name: fName, 
                input_m_name: mName, 
                input_l_name: lName, 
                input_admin_password: adminPassword
            })
            
            if (error)
                throw error;
            res.status(201).json({ success : true, message : 'Admin record added successfully', data })
            
        } catch (error) {
            handleSupabaseError(res, error);
        }
    },

    /**
     * Method to get all of the records on the Admin table
     * @param {string} adminId Primary key of the Admin table used to find specific records
     * @returns A record consisting of 4 columns (Admin ID, First Name, Middle Name, Last Name)
     */
    async getAdminRecordByAdminID(req, res){
        try{
            let { adminId } = req.body;

            const {data, error: supabaseError} = await supabaseClient.rpc('get_admin_record_by_admin_id', {
                input_admin_id: adminId
            })
            
            if (supabaseError)
                throw supabaseError;
            res.status(200).json({ success : true, data })
            
        } catch (generalError) {
            handleSupabaseError(res, generalError)
        }
    },

    /**
     * Updates most of the attributes of an Admin record based on their adminId
     * @param {string} oldAdminId       User-defined old primary key of the Admin table
     * @param {string} newAdminId       User-defined updated primary key of the old admin id in the Admin table
     * @param {string} oldAdminPassword The old password of the admin to be using the database
     * @param {string} newAdminPassword The new password of the admin to be using the database
     * @param {string} fName            First name of the admin
     * @param {string} mName            Middle name of the admin
     * @param {string} lName            Last name of the admin
     * @returns A string containing the status of the updated record (Success or Error)
     */
    async updateAdminRecord(req, res){
        try{
            let { oldAdminId, newAdminId, fName, mName, lName, oldAdminPassword, newAdminPassword } = req.body;

            const {data, error: supabaseError} = await start().rpc('update_admin_record', {
                input_old_admin_id: oldAdminId, 
                input_new_admin_id : newAdminId,
                input_f_name: fName, 
                input_m_name: mName, 
                input_l_name: lName, 
                input_current_admin_password: oldAdminPassword,
                input_new_password : newAdminPassword
            })
            
            if (supabaseError)
                throw supabaseError;
            res.status(200).json({ success : true, message : 'Updated admin successfully', data : data[0] });
        } catch (generalError) {
            handleSupabaseError(res, generalError);
        }
    },
    
    /**
     * Checks if an admin with a id and password combination exists in the database
     * @param {string} adminId          User-defined primary key of the Admin table
     * @param {string} adminPassword    The old assword of the admin to be using the database
     * @returns A string containing the status of the updated record (Success or Error)
     */
    async adminExists(req, res){
        try{
            let { adminId, adminPassword } = req.body;

            const {data, error: supabaseError} = await start().rpc('admin_exists', {
                input_admin_id: adminId, 
                input_admin_password: adminPassword,
            })
            
            if (supabaseError)
                throw supabaseError;

            const adminValidity = data;
            if (adminValidity)
                res.status(200).json({ success : true, exists : true, data : adminValidity })
            else
                res.status(200).json({ success : true, exists : false, message : 'Invalid user credentials' })
        } catch (generalError) {
            handleSupabaseError(res, generalError)
        }
    },

    /**
     * Removes a record from the Admin table, whose admin has not made any transaction yet.
     * @param {string} adminId User-defined primary key of the Admin table
     * @returns A string containing the status of the deleted record (Success or Error)
     */
    async removeAdminRecordByAdminId(req, res){
        try{
            let { adminId } = req.body;

            const {data, error: supabaseError} = await start().rpc('remove_admin_record_by_admin_id', {
                input_admin_id: adminId
            })
            
            if (supabaseError)
                throw supabaseError
            res.status(200).json({ success : true, message : 'Removed admin successfully', data})
        } catch (generalError) {
            handleSupabaseError(res, generalError);
        }
    },

    // ======================================================================================================================================
    // Methods for location

    /**
     * Method to get all of the records on the location table, and are ordered by Location ID (Ascending)
     * @returns A record consisting of 4 columns (Location ID, Location Name)
     */
    async getAllLocationRecordsOrderById(req, res){
        try{
            const {data, error: supabaseError} = await start().rpc('get_all_location_records_order_by_id');
            
            if (supabaseError)
                throw supabaseError;
            res.status(200).json({success : true, data});
            
        } catch (generalError) {
            handleSupabaseError(res, generalError)
        }
    },

    /**
     * Method to get all of the records on the location table, and are ordered alphabetically
     * @returns A record consisting of 4 columns (Location ID, Location Name)
     */
    async getAllLocationRecordsOrderByName(req, res){
        try{
            const {data, error: supabaseError} = await start().rpc('get_all_location_records_order_by_name');
            
            if (supabaseError)
                throw supabaseError;
            res.status(200).json({success : true, data});
            
        } catch (generalError) {
            handleSupabaseError(res, generalError);
        }
    },

    /**
     * Method to get all of the records on the location table
     * @param {integer} locationId The primary key of the location table
     * @returns A record consisting of 2 columns (Location ID, Location Name)
     */
    async getLocationRecordByLocationId(req, res){
        try{
            const { locationId } = req.param;

            const {data, error: supabaseError} = await start().rpc('get_location_record_by_location_id', {
                input_location_id : locationId
            });
            
            if (supabaseError)
                throw supabaseError;
            res.status(200).json({success : true, data});
            
        } catch (generalError) {
            handleSupabaseError(res, generalError)
        }
    },

    /**
     * Method to add a record to the location table
     * @param {string} locationName The name of the location to be added
     * @returns A string containing the status of the added record (Success or Error). Moreover, this returns the ID of the newly added row
     */
    async addLocationRecord(req, res){
        try{
            const { locationName } = req.body;

            const {data, error: supabaseError} = await start().rpc('add_location_record', {
                input_location_name : locationName
            });

            if (supabaseError)
                throw supabaseError;
            res.status(200).json({success : true, message:'Added a new location successfully', data});
            
        } catch (generalError) {
            handleSupabaseError(res, generalError);
        }
    },

    /**
     * Method to update a record to the location table
     * @param {int} locationId The primary key of the location table
     * @param {string} locationName The name to be changed in the location table based on the location id
     * @returns A string containing the status of the updated record (Success or Error)
     */
    async updateLocationRecordName(req, res){
        try{
            const { locationId, locationName } = req.body;

            const {data, error: supabaseError} = await start().rpc('update_location_record_name', {
                input_location_id : locationId,
                input_location_name : locationName
            });
            
            if (supabaseError)
                throw supabaseError;
            res.status(200).json({success : true, message:'Updated location successfully', data});
            
        } catch (generalError) {
            handleSupabaseError(res, generalError);
        }
    },

    /**
     * Method to remove a record to the location table
     * @param {int} locationId The primary key of the location table
     * @returns A string containing the status of the deleted record (Success or Error)
     */
    async removeLocationRecordByLocationId(req, res){
        try{
            const { locationId } = req.body

            const {data, error: supabaseError} = await start().rpc('remove_location_record_by_location_id', {
                input_location_id : locationId,
            });
            
            if (supabaseError)
                throw supabaseError;
            res.status(200).json({success : true, message:'Added a new location successfully', data});
            
        } catch (generalError) {
            handleSupabaseError(res, generalError);
        }
    },

    // ======================================================================================================================================
    // Methods for Unit Type

    /**
     * Method to get all of the records on the unit type table, ordered by their Unit Type ID
     * @returns A record consisting of 2 columns (Unit Type ID, Name)
     */
    async getAllUnitTypeRecordsOrderById(req, res){
        try{
            const {data, error: supabaseError} = await start().rpc('get_all_unit_type_records_order_by_id');
            
            if (supabaseError)
                throw supabaseError;
            res.status(200).json({success : true, data});
            
        } catch (generalError) {
            handleSupabaseError(res, generalError);
        }
    },

    /**
     * Method to get all of the records on the unit type table, and are ordered alphabetically
     * @returns A record consisting of 2 columns (Unit Type ID, Name)
     */
    async getAllUnitTypeRecordsOrderByName(req, res){
        try{
            const {data, error: supabaseError} = await start().rpc('get_all_unit_type_records_order_by_name');
            
            if (supabaseError)
                throw supabaseError;
            res.status(200).json({success : true, data});
            
        } catch (generalError) {
            handleSupabaseError(res, generalError);
        }
    },

    /**
     * Method to add a record to the unit type table
     * @param {string} unitTypeName The name of the unit type to be added 
     * @returns A string containing the status of the added record (Success or Error). Moreover, this returns the ID of the newly added row
     */
    async addUnitTypeRecord(req, res){
        try{
            const {unitTypeName} = req.body;

            const {data, error: supabaseError} = await start().rpc('add_unit_type_record', {
                input_unit_type_name : unitTypeName
            });
            
            if (supabaseError)
                throw supabaseError;
            res.status(201).json({success : true, message:'Added a new unit type successfully', data});
            
        } catch (generalError) {
            handleSupabaseError(res, generalError);
        }
    },

    /**
     * Method to update a record to the location table
     * @param {int} unitTypeId The primary key of the unit type table
     * @param {string} unitTypeName The name to be changed in the unit type table based on the unit type id
     * @returns A string containing the status of the updated record (Success or Error)
     */
    async updateUnitTypeRecordName(req, res){
        try{
            const { unitTypeId, unitTypeName } = req.body;

            const {data, error: supabaseError} = await start().rpc('update_unit_type_record_name', {
                input_unit_type_id : unitTypeId,
                input_unit_type_name : unitTypeName
            });
            
            if (supabaseError)
                throw supabaseError;
            res.status(200).json({success : true, message:'Updated a unit type successfully', data});
            
        } catch (generalError) {
            handleSupabaseError(res, generalError);
        }
    },

    /**
     * Method to remove a record to the location table
     * @param {int} unitTypeId The primary key of the unit type table
     * @returns A string containing the status of the deleted record (Success or Error)
     */
    async removeUnitTypeRecordByUnitTypeId(req, res){
        try{
            const { unitTypeId } = req.param;

            const {data, error: supabaseError} = await start().rpc('remove_unit_type_record_by_unit_type_id', {
                input_unit_type_id : unitTypeId,
            });
            
            if (supabaseError)
                throw supabaseError;
            res.status(200).json({success : true, message:'Removed unit type successfully', data});
            
        } catch (generalError) {
            handleSupabaseError(res, generalError);
        }
    },

    
    // ======================================================================================================================================
    // Methods for Item Master List

    /**
     * Method to get all of the records on the unit type table
     * @returns A record consisting of 4 columns (Item ID, Name, Type, Quantity)
     */
    async getAllItemMasterListRecords(req, res){
        try{
            const {data, error: supabaseError} = await start().rpc('get_all_item_master_list_records');
            
            if (supabaseError)
                throw supabaseError;
            res.status(200).json({success : true, message:'Removed unit type successfully', data});
            
        } catch (generalError) {
            handleSupabaseError(res, generalError);
        }
    },

    /**
     * Method to get all of the records from the Item Master List table
     * @returns A record consisting of 1 column (Name)
     */
    async getAllItemMasterListNameRecords(req, res){
        try{
            const {data, error: supabaseError} = await start().rpc('get_all_item_master_list_name_records');
            
            if (supabaseError)
                throw supabaseError;
            res.status(200).json({success : true, message:'Removed unit type successfully', data});
            
        } catch (generalError) {
            handleSupabaseError(res, generalError);
        }
    },

    /**
     * Method to get all of the records from the Item Master List table
     * @returns A record consisting of 2 columns (Item ID, Name, Brand, Unit Type, Item Type, Remaining Quantity)
     */
    async getAllItemMasterListNameBrandRecords(req, res){
        try{
            const {data, error: supabaseError} = await start().rpc('get_all_item_master_list_name_brand_records');
            
            if (supabaseError)
                throw supabaseError;
            res.status(200).json({success : true, message:'Removed unit type successfully', data});
            
        } catch (generalError) {
            handleSupabaseError(res, generalError);
        }
    },

    /**
     * Method to get a record from the item master list table based on the item id
     * @param {integer} itemId The primary key of the item master list table
     * @returns A record consisting of 4 columns (Item ID, Name, Type, Quantity)
     */
    async getItemMasterListRecordByItemID(req, res){
        try{
            const {itemId} = req.body;

            const {data, error: supabaseError} = await start().rpc('get_item_master_list_record_by_item_id', {
                input_item_id : itemId
            });
            
            if (supabaseError)
                throw supabaseError;
            res.status(200).json({success : true, data});
            
        } catch (generalError) {
            handleSupabaseError(res, generalError);
        }
    },

    /**
     * Method to get a record from the item master list table via the item's name
     * @param {string} itemName The name of the item to find in the table
     * @returns A record consisting of 2 columns (Location ID, Location Name)
     */
    async getItemMasterListRecordByName(req, res){
        try{
            const {itemName} = req.body
            const {data, error: supabaseError} = await start().rpc('get_item_master_list_record_by_name', {
                input_item_name : itemName
            });
            
            if (supabaseError)
                throw supabaseError;
            res.status(200).json({success : true, data});
            
        } catch (generalError) {
            handleSupabaseError(res, generalError);
        }
    },

    /**
     * Method to add a record to the item master list table
     * @param {string} itemName The name of the item to be added 
     * @param {string} itemType The type of item to be added (Chemicals, Consumable Items, Glasswares, Lab Apparatus, Lab Equipment) 
     * @returns A string containing the status of the added record (Success or Error). Moreover, this returns the ID of the newly added row
     */
    async addItemMasterListRecord(req, res){
        try{
            const {itemName, itemType} = req.body
            const {data, error: supabaseError} = await start().rpc('add_item_master_list_record', {
                input_item_name : itemName,
                input_item_type : itemType
            });
            
            if (supabaseError)
                throw supabaseError;
            res.status(200).json({success : true, message : 'Added a new item successfully', data});
            
        } catch (generalError) {
            handleSupabaseError(res, generalError);
        }
    },

    /**
     * Method to update a record to the item master list table
     * @param {int} itemId The primary key of the item master list table
     * @param {string} itemName The name to be changed in the item master list table based on the item id
     * @param {string} itemType The name to be changed in the item master list table based on the item id
     * @returns A string containing the status of the updated record (Success or Error)
     */
    async updateItemMasterListRecord(req, res){
        try{
            const {itemId, itemName, itemType} = req.body;

            const {data, error: supabaseError} = await start().rpc('update_unit_type_record_name', {
                input_item_id : itemId,
                input_item_name : itemName,
                input_item_type : itemType
            });
            
            if (supabaseError)
                throw supabaseError;
            res.status(200).json({success : true, messge : 'Updated item successfully', data});
            
        } catch (generalError) {
            handleSupabaseError(res, generalError);
        }
    },

    /**
     * Method to remove a record to the item master list table
     * @param {int} itemId The primary key of the item master list table
     * @returns A string containing the status of the deleted record (Success or Error)
     */
    async removeItemMasterListRecordByItemId(req, res){
        try{
            const {itemId} = req.body
            const {data, error: supabaseError} = await start().rpc('remove_item_master_list_record_by_item_id', {
                input_item_id : itemId
            });
            
            if (supabaseError)
                throw supabaseError;
            res.status(200).json({success : true, message : 'Removed item successfully', data});
            
        } catch (generalError) {
            handleSupabaseError(res, generalError);
        }
    },

    // ======================================================================================================================================
    // Methods for Chemicals

    /**
     * Method to get all of the records on the unit type table
     * @returns A record consisting of 12 columns ()
     */
    async getAllChemicalRecords(req, res){
        try{
            const {data, error: supabaseError} = await start().rpc('get_all_chemicals_records');
            
            if (supabaseError)
                throw supabaseError;
            res.status(200).json({success : true, data});
            
        } catch (generalError) {
            handleSupabaseError(res, generalError);
        }
    },

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
    async addChemicalsRecord(req, res){
        try{
            const {itemName, locationName, unitTypeName, containerSize, brandModel, barcode, CASNo, MSDS, remarks } = req.body;

            const {data, error: supabaseError} = await start().rpc('main_add_chemicals_record', {
                input_item_name : itemName,
                input_location_name : locationName,
                input_unit_type_name : unitTypeName,
                input_brand_model : brandModel,
                input_container_size : containerSize,
                input_barcode : barcode,
                input_cas_no : CASNo,
                input_msds : MSDS,
                input_remarks : remarks
            });
            
            if (supabaseError)
                throw supabaseError;
            res.status(201).json({success : true, message : 'Added a chemical successfully', data});
            
        } catch (generalError) {
            handleSupabaseError(res, generalError);
        }
    },

    /**
     * Method to remove a record to the Chemicals table
     * @param {int} itemId The primary key of the Chemicals table
     * @returns A string containing the status of the deleted record (Success or Error)
     */
    async deleteChemicalsRecordByItemId(req, res){
        try{
            const {itemId} = req.body
            const {data, error: supabaseError} = await start().rpc('delete_chemicals_record_by_item_id', {
                input_item_id : itemId
            });
            
            if (supabaseError)
                throw supabaseError;
            res.status(200).json({success : true, message : 'Deleted a Chemical successfully', data});
            
        } catch (generalError) {
            handleSupabaseError(res, generalError);
        }
    },

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
    async updateChemicalsRecordByAll(req, res){
        try{
            const {itemId, itemName, locationName, unitTypeName, brandModel, containerSize, barcode, CASNo, MSDS, remarks } = req.body;
            const {data, error: supabaseError} = await start().rpc('update_chemicals_record_by_all', {
                input_item_id : itemId,
                input_item_name : itemName,
                input_location_name : locationName,
                input_unit_type_name : unitTypeName,
                input_brand_model : brandModel,
                input_container_size : containerSize,
                input_barcode : barcode,
                input_cas_no : CASNo,
                input_msds : MSDS,
                input_remarks : remarks
            });
            
            if (supabaseError)
                throw supabaseError;
            res.status(200).json({success : true, messsage: 'Updated chemicals successfully', data});
            
        } catch (generalError) {
            handleSupabaseError(res, generalError);
        }
    },

    /**
     /**
     * Method to update an existing record's remarks in the Chemicals Table based on its Item ID
     * 
     * @param {int} chemicalId                      Primary key of the Chemicals table
     * @param {string} chemicalBarCode              Barcode of the chemical to be added
     * 
     * @returns A string containing the status of the deleted record (Success or Error)
     */
    async updateChemicalRemarkByItemId(req, res){
        try{
           const {itemId, remarks} = req.body

            const {data, error: supabaseError} = await start().rpc('update_chemicals_remark_by_item_id', {
                input_item_id : itemId,
                input_remarks : remarks
            });
            
            if (supabaseError)
                throw supabaseError;
            res.status(200).json({success : true, data});
            
        } catch (generalError) {
            handleSupabaseError(res, generalError);
        }
    },

    // ======================================================================================================================================
    // Methods for Glasswares

    /**
     * Method to get all of the records on the Glasswares table
     * @returns A record consisting of 7 columns (Item ID, Name, Unit, Location, Brand, Quantity, Remarks)
     */
    async getAllGlasswaresRecords(req, res){
        try{
            const {data, error: supabaseError} = await start().rpc('get_all_glasswares_records');
            
            if (supabaseError)
                throw supabaseError;
            res.status(200).json({success : true, data});
            
        } catch (generalError) {
            handleSupabaseError(res, generalError);
        }
    },

    /**
     * Method to add a new row to the Chemicals Table
     * @param {string} itemName           Name of the glassware to be added
     * @param {string} unitTypeName       Unit Type of the glassware (e.g. Unit, Piece)
     * @param {string} locationName       Location where the chemical will be stored
     * @param {string} brandModel         Brand of the glassware to be added
     * @param {string} remarks            Remarks of the chemical to be added
     */
    async addGlasswaresRecord(req, res){
        try{
            const {itemName, locationName, unitTypeName, brandModel, remarks} = req.body

            const {data, error: supabaseError} = await start().rpc('main_add_glassware_record', {
                input_item_name : itemName,
                input_location_name : locationName,
                input_unit_type_name : unitTypeName,
                input_brand_model : brandModel,
                input_remarks : remarks
            });
            
            if (supabaseError)
                throw supabaseError;
            res.status(201).json({success : true, message : 'Added glassware record successfully', data});
            
        } catch (generalError) {
            handleSupabaseError(res, generalError);
        }
    },

    /**
     * Method to add a update a record from the Glasswares Table based on thier Item ID
     * @param {string} itemName           Name of the glassware to be added
     * @param {string} unitTypeName       Unit Type of the glassware (e.g. Unit, Piece)
     * @param {string} locationName       Location where the chemical will be stored
     * @param {string} brandModel         Brand of the glassware to be added
     * @param {string} remarks            Remarks of the chemical to be added
     */
    async updateGlasswaresRecordByAll(req, res){
        try{
            const {itemId, itemName, locationName, unitTypeName, brandModel, remarks} = req.body

            const {data, error: supabaseError} = await start().rpc('update_glasswares_record_by_all', {
                input_item_id : itemId,
                input_item_name : itemName,
                input_location_name : locationName,
                input_unit_type_name : unitTypeName,
                input_brand_model : brandModel,
                input_remarks : remarks
            });
            
            if (supabaseError)
                throw supabaseError;
            res.status(200).json({success : true, message : 'Updated glassware record successfully',  data});
            
        } catch (generalError) {
            handleSupabaseError(res, generalError);
        }
    },

    /**
     /**
     * Method to update an existing record's remarks in the Glasswares Table based on its Item ID
     * 
     * @param {int} itemId                          Primary key of the Glasswares table
     * @param {string} chemicalBarCode              Barcode of the chemical to be added
     * 
     * @returns A string containing the status of the deleted record (Success or Error)
     */
    async updateGlasswaresRemarkByItemId(req, res){
        try{
            const {itemId, remarks} = req.body;

            const {data, error: supabaseError} = await start().rpc('update_glasswares_remark_by_item_id', {
                input_item_id : itemId,
                input_remarks : remarks
            });
            
            if (supabaseError)
                throw supabaseError;
            res.status(200).json({success : true, message: 'Updated glassware remarks succesfully',  data});
            
        } catch (generalError) {
            handleSupabaseError(res, generalError);
        }
    },

    /**
     * Method to remove a record to the Glasswares table
     * @param {int} itemId The primary key of the Glasswares table
     * @returns A string containing the status of the deleted record (Success or Error)
     */
    async deleteGlasswaresRecordByItemId(req, res){
        try{
            const {itemId} = req.body
            const {data, error: supabaseError} = await start().rpc('delete_glasswares_record_by_item_id', {
                input_item_id : itemId
            });
            
            if (supabaseError)
                throw supabaseError;
            res.status(200).json({success : true, message : 'Deleted glassware successfully',  data});
            
        } catch (generalError) {
            handleSupabaseError(res, generalError);
        }
    },

    // ======================================================================================================================================
    // Methods for Lab Apparatus

    /**
     * Method to get all of the records on the Lab Apparatus table
     * @returns A record consisting of 7 columns (Item ID, Name, Unit, Location, Brand, Quantity, Remarks)
     */
    async getAllLabApparatusRecords(req, res){
        try{
            const {data, error: supabaseError} = await start().rpc('get_all_lab_apparatus_records');
            
            if (supabaseError)
                throw supabaseError;
            res.status(200).json({success : true, data});
            
        } catch (generalError) {
            handleSupabaseError(res, generalError);
        }
    },

    /**
     * Method to add a new row to the Chemicals Table
     * @param {string} itemName           Name of the lab apparatus to be added
     * @param {string} unitTypeName       Unit Type of the lab apparatus (e.g. Unit, Piece)
     * @param {string} locationName       Location where the chemical will be stored
     * @param {string} brandModel         Brand of the lab apparatus to be added
     * @param {string} remarks            Remarks of the chemical to be added
     */
    async addLabApparatusRecord(req, res){
        try{
            const {itemName, locationName, unitTypeName, brandModel, remarks} = req.body
            const {data, error: supabaseError} = await start().rpc('main_add_lab_apparatus_record', {
                input_item_name : itemName,
                input_location_name : locationName,
                input_unit_type_name : unitTypeName,
                input_brand_model : brandModel,
                input_remarks : remarks
            });
            
            if (supabaseError)
                throw supabaseError;
            res.status(201).json({success : true, message:'Added lab apparatus successfully', data});
            
        } catch (generalError) {
            handleSupabaseError(res, generalError);
        }
    },

    /**
     * Method to add a update a record from the Lab Apparatus Table based on thier Item ID
     * @param {string} itemId             Primary key of the lab apparatus table
     * @param {string} itemName           Name of the lab apparatus to be added
     * @param {string} unitTypeName       Unit Type of the lab apparatus (e.g. Unit, Piece)
     * @param {string} locationName       Location where the chemical will be stored
     * @param {string} brandModel         Brand of the lab apparatus to be added
     * @param {string} remarks            Remarks of the chemical to be added
     */
    async updateLabApparatusRecordByAll(req, res){
        try{
            const {itemId, itemName, locationName, unitTypeName, brandModel, remarks} = req.body
            const {data, error: supabaseError} = await start().rpc('update_lab_apparatus_record_by_all', {
                input_item_id : itemId,
                input_item_name : itemName,
                input_location_name : locationName,
                input_unit_type_name : unitTypeName,
                input_brand_model : brandModel,
                input_remarks : remarks
            });
            
            if (supabaseError)
                throw supabaseError;
            res.status(200).json({success : true, message: 'Updated lab apparatus record successfully',  data});
            
        } catch (generalError) {
            handleSupabaseError(res, generalError);
        }
    },

    /**
     /**
     * Method to update an existing record's remarks in the Lab Apparatus Table based on its Item ID
     * 
     * @param {int} itemId                          Primary key of the Lab Apparatus table
     * @param {string} chemicalBarCode              Barcode of the chemical to be added
     * 
     * @returns A string containing the status of the deleted record (Success or Error)
     */
    async updateLabApparatusRemarkByItemId(req, res){
        try{
            const {itemId, remarks} = req.body
            const {data, error: supabaseError} = await start().rpc('update_lab_apparatus_remark_by_item_id', {
                input_item_id : itemId,
                input_remarks : remarks
            });
            
            if (supabaseError)
                throw supabaseError;
            res.status(200).json({success : true, message: 'Updated lab apparatus record successfully',  data});
            
        } catch (generalError) {
            handleSupabaseError(res, generalError);
        }
    },

    /**
     * Method to remove a record to the Lab Apparatus table
     * @param {int} itemId The primary key of the Lab Apparatus table
     * @returns A string containing the status of the deleted record (Success or Error)
     */
    async deleteLabApparatusRecordByItemId(req, res){
        try{
            const {itemId} = req.body;
            const {data, error: supabaseError} = await start().rpc('delete_lab_apparatus_record_by_item_id', {
                input_item_id : itemId
            });
            
            if (supabaseError)
                throw supabaseError;
            res.status(200).json({success : true, message: 'Deleted lab apparatus record successfully',  data});
            
        } catch (generalError) {
            handleSupabaseError(res, generalError);
        }
    },

    // ======================================================================================================================================
    // Methods for Lab Equipments

    /**
     * Method to get all of the records on the Lab Equipments table
     * @returns A record consisting of 10 columns (Item ID, Name, Unit, Location, Brand, Quantity, Serial No, 
     *  Calibration Date, Frequency of Calibration, and Remarks)
     */
    async getAllLabEquipmentsRecords(req, res){
        try{
            const {data, error: supabaseError} = await start().rpc('get_all_lab_equipments_records');
            
            if (supabaseError)
                throw supabaseError;
            res.status(200).json({success : true,  data});
            
        } catch (generalError) {
            handleSupabaseError(res, generalError);
        }
    },

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
    async addLabEquipmentsRecord(req, res){
        try{
            const {itemName, locationName, unitTypeName, brandModel, serialNo, calibrationDate, frequencyOfCalibration, remarks} = req.body
            const {data, error: supabaseError} = await start().rpc('main_add_lab_equipments_record', {
                input_item_name : itemName,
                input_location_name : locationName,
                input_unit_type_name : unitTypeName,
                input_brand_model : brandModel,
                input_serial_no : serialNo,
                input_calibration_date : calibrationDate,
                input_frequency_of_calibration : frequencyOfCalibration,
                input_remarks : remarks
            });
            
            if (supabaseError)
                throw supabaseError;
            res.status(201).json({success : true, message: 'Added lab equipment record successfully',  data});
            
        } catch (generalError) {
            handleSupabaseError(res, generalError);
        }
    },

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
    async updateLabEquipmentsRecordByAll(req, res){
        try{
            const { itemId, itemName, locationName, unitTypeName, brandModel, serialNo, calibrationDate, frequencyOfCalibration, remarks } = req.body 
            const {data, error: supabaseError} = await start().rpc('update_lab_equipment_record_by_all', {
                input_item_id : itemId,
                input_item_name : itemName,
                input_location_name : locationName,
                input_unit_type_name : unitTypeName,
                input_brand_model : brandModel,
                input_serial_no : serialNo,
                input_calibration_date : calibrationDate,
                input_frequency_of_calibration : frequencyOfCalibration,
                input_remarks : remarks
            });
            
            if (supabaseError)
                throw supabaseError;
            res.status(200).json({success : true, message: 'Updated lab equipment record successfully',  data});
            
        } catch (generalError) {
            handleSupabaseError(res, generalError);
        }
    },

    /**
     /**
     * Method to update an existing record's remarks in the Lab Equipments Table based on its Item ID
     * 
     * @param {int} itemId                  Primary key of the Lab Equipments table
     * @param {string} remarks              Remarks of the lab equipment
     * 
     * @returns A string containing the status of the deleted record (Success or Error)
     */
    async updateLabEquipmentsRemarkByItemId(req, res){
        try{
            const {itemId, remarks} = req.body; 
            const {data, error: supabaseError} = await start().rpc('update_lab_equipments_remark_by_item_id', {
                input_item_id : itemId,
                input_remarks : remarks
            });
            
            if (supabaseError)
                throw supabaseError;
            res.status(200).json({success : true, message: 'Updated lab equipment record successfully',  data});
            
        } catch (generalError) {
            handleSupabaseError(res, generalError);
        }
    },

    /**
     * Method to remove a record to the Lab Equipments table
     * @param {int} itemId The primary key of the Lab Equipments table
     * @returns A string containing the status of the deleted record (Success or Error)
     */
    async deleteLabEquipmentsRecordByItemId(req, res){
        try{
            const {itemId} = req.body
            const {data, error: supabaseError} = await start().rpc('delete_lab_equipments_record_by_item_id', {
                input_item_id : itemId
            });
            
            if (supabaseError)
                throw supabaseError;
            res.status(200).json({success : true, message: 'Deleted lab equipment record successfully',  data});
            
        } catch (generalError) {
            handleSupabaseError(res, generalError);
        }
    },

    // ======================================================================================================================================
    // Methods for Consumable Items

    /**
     * Method to get all of the records on the Consumable Items table
     * @returns A record consisting of 7 columns (Item ID, Name, Unit, Location, Brand, Quantity, and Remarks)
     */
    async getAllConsumableItemsRecords(req, res){
        try{
            const {data, error: supabaseError} = await start().rpc('get_all_consumable_items_records');
            
            if (supabaseError)
                throw supabaseError;
            res.status(200).json({success : true,  data});
            
        } catch (generalError) {
            handleSupabaseError(res, generalError);
        }
    },

    /**
     * Method to add a new row to the Consumable Items Table
     * @param {string} itemName                 Name of the consumable item to be added
     * @param {string} unitTypeName             Unit Type of the consumable item (e.g. Unit, Piece)
     * @param {string} locationName             Location where the item will be stored
     * @param {string} brandModel               Brand of the item to be added
     * @param {string} remarks                  Remarks of the item
     */
    async addConsumableItemsRecord(req, res){
        try{
            const {itemName, locationName, unitTypeName, brandModel, remarks} = req.body
            const {data, error: supabaseError} = await start().rpc('main_add_consumable_items_record', {
                input_item_name : itemName,
                input_location_name : locationName,
                input_unit_type_name : unitTypeName,
                input_brand_model : brandModel,
                input_remarks : remarks
            });
            
            if (supabaseError)
                throw supabaseError;
            res.status(201).json({success : true, message: 'Added a consumable item record successfully',  data});
            
        } catch (generalError) {
            handleSupabaseError(res, generalError);
        }
    },

    /**
     * Method to add a update a record from the Lab Equipments Table based on thier Item ID
     * @param {int} itemId                      ID of the item to be updated
     * @param {string} itemName                 Name of the consumable item to be added
     * @param {string} unitTypeName             Unit Type of the consumable item (e.g. Unit, Piece)
     * @param {string} locationName             Location where the item will be stored
     * @param {string} brandModel               Brand of the item to be added
     * @param {string} remarks                  Remarks of the item
     */
    async updateConsumableItemsRecordByAll(req, res){
        try{
            const {itemId, itemName, locationName, unitTypeName, brandModel, remarks} = req.body;
            const {data, error: supabaseError} = await start().rpc('update_consumable_items_record_by_all', {
                input_item_id : itemId,
                input_item_name : itemName,
                input_location_name : locationName,
                input_unit_type_name : unitTypeName,
                input_brand_model : brandModel,
                input_remarks : remarks
            });
            
            if (supabaseError)
                throw supabaseError;
            res.status(200).json({success : true, message: 'Updated a consumable item record successfully',  data});
            
        } catch (generalError) {
            handleSupabaseError(res, generalError);
        }
    },

    /**
     /**
     * Method to update an existing record's remarks in the Lab Equipments Table based on its Item ID
     * 
     * @param {int} itemId                  Primary key of the Consumable Items table
     * @param {string} remarks              Remarks of one specific item
     * 
     * @returns A string containing the status of the deleted record (Success or Error)
     */
    async updateConsumableItemsRemarkByItemId(req, res){
        try{
            const {itemId, remarks} = req.body
            const {data, error: supabaseError} = await start().rpc('update_consumable_items_remark_by_item_id', {
                input_item_id : itemId,
                input_remarks : remarks
            });
            
            if (supabaseError)
                throw supabaseError;
            res.status(200).json({success : true, message: 'Updated a consumable item record successfully',  data});
            
        } catch (generalError) {
            handleSupabaseError(res, generalError);
        }
    },

    /**
     * Method to remove a record to the Lab Equipments table
     * @param {int} itemId The primary key of the Lab Equipments table
     * @returns A string containing the status of the deleted record (Success or Error)
     */
    async deleteConsumableItemsRecordByItemId(req, res){
        try{
            const {itemId} = req.body
            const {data, error: supabaseError} = await start().rpc('delete_consumable_items_record_by_item_id', {
                input_item_id : itemId
            });
            
            if (supabaseError)
                throw supabaseError;
            res.status(200).json({success : true, message: 'Deleted a consumable item record successfully',  data});
            
        } catch (generalError) {
            handleSupabaseError(res, generalError);
        }
    },

    // ======================================================================================================================================
    // Methods for Restocks

    /**
     * Method to get all of the records on the Consumable Items table
     * @returns A record consisting of 7 columns (Restock ID, Name, Initial Quantity, Used Quantity, Brand, Restock Date, and Expiry Date)
     */
    async getAllRestocksRecords(req, res){
        try{
            const {data, error: supabaseError} = await start().rpc('get_all_restocks_records');
            
            if (supabaseError)
                throw supabaseError;
            res.status(200).json({success : true,  data});
            
        } catch (generalError) {
            handleSupabaseError(res, generalError);
        }
    },

    /**
     * Gets all valid restocks to set to the restocks table (Front End)
     * @param {integer} itemId The primary key of the Consumable Items table
     * @returns A record consisting of 7 columns (Restock ID, Name, Initial Quantity, Used Quantity, Brand, Restock Date, and Expiry Date)
     */
    async getAllValidRestocksRecords(req, res){
        try{
            const {data, error: supabaseError} = await start().rpc('get_all_valid_restocks_record_view', {
                input_item_id : iItemId
            });
            
            if (supabaseError)
                throw supabaseError;
            res.status(200).json({success : true, data});
            
        } catch (generalError) {
            handleSupabaseError(res, generalError);
        }
    },

    /**
     * Method to add a new row to the Restocks Table
     * @param {number} itemId               Primary Key of the item, to determince which item will be restocked
     * @param {string} restockDate          When you received the restock
     * @param {string} expiryDate           Expiration date of the restock
     * @param {number} initialQuantity      Quantity of the restock
     */
    async addRestocksRecord(req, res){
        try{
            const {itemId, restockDate, expiryDate, initialQuantity, remarks} = req.body
            const {data, error: supabaseError} = await start().rpc('main_add_restocks_record', {
                input_item_id : itemId,
                input_restock_date : restockDate,
                input_expiry_date : expiryDate, 
                initial_quantity : initialQuantity,
                input_remarks : remarks
            });
            
            if (supabaseError)
                throw supabaseError;
            res.status(201).json({success : true, message: 'Added a restock record successfully',  data});
            
        } catch (generalError) {
            handleSupabaseError(res, generalError);
        }
    },

    /**
     * Method to add a update a record from the Lab Equipments Table based on thier Item ID
     * @param {number} itemId               Primary Key of the item, to determince which item will be restocked
     * @param {string} restockDate          When you received the restock
     * @param {string} expiryDate           Expiration date of the restock
     * @param {number} initialQuantity      Quantity of the restock
     */
    async updateRestocksRecordByAll(req, res){
        try{
            const {itemId, restockDate, expiryDate, initialQuantity, remarks} = req.body
            const {data, error: supabaseError} = await start().rpc('update_restocks_record_by_all', {
                input_restock_id : itemId,
                input_restock_date : restockDate,
                input_expiry_date : expiryDate, 
                input_initial_quantity : initialQuantity,
                input_remarks : remarks
            });
            
            if (supabaseError)
                throw supabaseError;
            res.status(200).json({success : true, message: 'Updated a restock record successfully',  data});
            
        } catch (generalError) {
            handleSupabaseError(res, generalError);
        }
    },

    /**
     /**
     * Method to update an existing record's remarks in the Restocks Table based on its restock ID
     * 
     * @param {int} restockId               Primary key of the Restocks table
     * @param {string} remarks              Remarks of one specific item
     * 
     * @returns A string containing the status of the deleted record (Success or Error)
     */
    async updateRestocksRemarksByRestockId(req, res){
        try{
            const {restockId, remarks} = req.body
            const {data, error: supabaseError} = await start().rpc('update_restocks_remarks_by_restock_id', {
                input_restock_id : restockId,
                input_remarks : remarks
            });
            
            if (supabaseError)
                throw supabaseError;
            res.status(200).json({success : true, message: 'Added a restock record successfully',  data});
            
        } catch (generalError) {
            handleSupabaseError(res, generalError);
        }
    },

    /**
     * Method to remove a record to the Lab Equipments table
     * @param {int} restockId The primary key of the Lab Equipments table
     * @returns A string containing the status of the deleted record (Success or Error)
     */
    async removeRestocksRecordByRestockId(req, res){
        try{
            const {restockId} = req.body
            const {data, error: supabaseError} = await start().rpc('remove_restocks_record_by_restock_id', {
                input_restock_id : restockId
            });

            if (supabaseError)
                throw supabaseError;

            res.status(200).json({success : true, message: 'Deleted a restock record successfully',  data});
            
        } catch (generalError) {
            handleSupabaseError(res, generalError);
        }
    },

    //=======================================================================================================================================
    // Methods for Transactions and Items Transacted

    /**
     * Method to get all of the records on the Transactions table
     * @returns The next ID of the transaction ID in the sequence
     */
    async getNextTransactionId(req, res){
        try{
            const {data, error: supabaseError} = await start().rpc('get_next_transaction_id');
            
            if (supabaseError)
                throw supabaseError;
            res.status(200).json({success : true, data});
            
        } catch (generalError) {
            handleSupabaseError(res, generalError);
        }
    },

    /**
     * Method to get all of the records on the Transactions table
     * @returns A record consisting of 5 columns (Transaction ID, Admin Name, Transaction Date, Status, Remarks)
     */
    async getAllTransactionRecords(req, res){
        try{
            await prepareUser();
            const {data, error: supabaseError} = await start().rpc('get_all_transaction_records');
            
            if (supabaseError)
                throw supabaseError;
            res.status(200).json({success : true, data});
            
        } catch (generalError) {
            handleSupabaseError(res, generalError);
        }
    },

    /**
     * Method to add a new Transaction
     * @param {string} adminId                 Admin ID to conduct the transaction
     * @param {int []} itemIdArray             Array of item ids
     * @param {float4} borrowQuantityArray     Array of borrowed quantities
     */
    async addTransactionRecord (req, res){
        try{
            await prepareUser();
            const {adminId, remarks, itemIdArray, borrowQuantityArray} = req.body
            const {data, error: supabaseError} = await start().rpc('main_add_transaction', {
                admin_id : adminId,
                remarks : remarks, 
                item_id_array : itemIdArray,
                borrow_quantity_array : borrowQuantityArray
            });
            
            if (supabaseError)
                throw supabaseError;
            res.status(201).json({success : true, message: 'Added a transaction record successfully',  data});
            return;
        } catch (generalError) {
            handleSupabaseError(res, generalError);
        }
    },

    /**
     * @description Method to get all of the records on the Transactions table
     * @returns A record consisting of 10 columns: (Transaction ID, Item ID, Item Name, Initial Borrow Quantity, Current Borrow Quantity, Unit Type, Item Type, Status, Returnable, Remarks)
    */
    async getAllItemsTransactedRecords(req, res){
        try{
            await prepareUser();
            const {data, error: supabaseError} = await start().rpc('get_all_items_transacted_records');
            
            if (supabaseError)
                throw supabaseError;
            res.status(200).json({success : true, data});
            
        } catch (generalError) {
            handleSupabaseError(res, generalError);
        }
    },

    /**
     * Method to add a new Transaction
     * @param {int} transactionId         Transaction where the item was borrowed
     * @param {int} itemId                ID of the item to be returned
     * @param {float4} returnQuantity     Amount to return
     * @param {string} remarks            Remark to the returned item
     */
    async returnItemTransacted(req, res){
        try{
            const {transactionId, itemId, returnQuantity, remarks} = req.body
            await prepareUser();
            const {data, error: supabaseError} = await start().rpc('main_return_item', {
                input_transaction_id : transactionId,
                input_item_id : itemId,
                return_quantity : Number(returnQuantity),
                input_remarks : remarks
            });
            
            if (supabaseError)
                throw supabaseError;
            res.status(200).json({success : true, message: 'Returned an item successfully',  data});
            
        } catch (generalError) {
            handleSupabaseError(res, generalError);
        }
    }
};

export default mainHandler;