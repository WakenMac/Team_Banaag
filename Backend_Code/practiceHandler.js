/**
 * Details on handler.js
 * It is a file used to practice making CRUD operations
 * 
 * Methods:
 *  main()
 *  addTest() - Create
 *  getTestByID() - Retrieve / Read
 *  getTestByTitle() - Retrieve / Read
 *  getAllTest() - Retrieve / Read
 *  updateTestByID() - Update
 *  updateTestIs_CompletedByID() - Update
 *  deleteByID() - Delete
 * 
 * Extra Retrieval Functions:
 *  getFirst() - Gets the first record in the Test table based on their ID
 *  getLast() - Gets the last record in the Test table based on their ID
 *  getTotalCount() - Gets the total number of records
 */

// Imports supabase
// Similar to "import java.util.Scanner;"
// Requires to run `npm install @supabase/supabase-js` before using the import
import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
const url = "https://tkuqbdxvokhgfoipyoyr.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrdXFiZHh2b2toZ2ZvaXB5b3lyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3NDk4ODQsImV4cCI6MjA1NjMyNTg4NH0.zrNLQjJ7VUnHj2wLhxDxWzpN22b_tAOYPneyeh332gE";
const supabase = createClient(url, key);

//main();

/** 
 * This method serves as our main method. <br>
 * All other functions within this class will then be called only if its call stack roots from main()
*/
export async function main(){
    await prepareUser();
    await printUserDetails();
    
    // await addTest(`Set up the restocks table's functions`, true);
    // await addTest(`Set up the item_master_list's functions`, false);
    // await updateTextByID(2, `Learn CRUD in Supabase via JS`);
    // await deleteTextByID(5);
    // await getTestByID(100); // Returns null, no record exists with an ID of 100.
    // await updateTestIs_CompletedByID(12, true)
    // await updateTitleByID(7, `Get a life.`);
    // await getTestByID(7);
    // await getFirst();
    // await getLast();
    await getAllTest();
    await getTestCount();

    // Methods for item_master_list
    // await getAllItems();
    // await getItemMasterListByItemID("Banana");

    // Methods for restocks
    // await getAllRestocksRecords();
    // await getRestocksRecordByRestockID(3);
}

export async function prepareUser(){
    try {
        const {data, error} = await supabase.auth.signInWithPassword({
            email: `maclangw26@gmail.com`,
            password: `2023-00570`
        })
        
    } catch (error){
        console.error(error)
    }
}

export async function printUserDetails(){
    const {data: { user }, error} = await supabase.auth.getUser();
    
      if (error || !user) {
        console.log("No authenticated user.");
        return null;
      }
    
      const uid = user.id;
      const role = 'authenticated';
      console.log("UID: ", uid, `\nRole: `, role);
}

/**
 * Adds a record to the Test table
 * @param titleParam            Contains the description of the task in the to-do list (text / String)
 * @param is_completedParam     Indicates if the task is completed or not (boolean)
 */
export async function addTest(titleParam, is_completedParam){
    const {data, error} = await supabase
        .from(`test`)
        // Uses an object as its parameter
        // You can pass it as an object array
        .insert([
            {title : titleParam, is_completed : is_completedParam}
        ]);

    console.log(data, error);
}

/**
 * Method to retrieve a record from the Test table based on its ID
 * @param idParam   Primary key of the Test table used to find the record
 */
export async function getTestByID(idParam){
    const {data, error} = await supabase
        .from(`test`)
        .select(`*`)
        .eq(`id`, idParam);
    
    console.log(data, error);
}

/**
 * Method to retrieve a record from the Test table based on its title
 * @param titleParam   Description of the task in the Test table
 */
export async function getTestByTitle(titleParam){
    const {data, error} = await supabase
        .from(`test`)
        .select(`*`)
        .eq(`title`, titleParam);

    console.log(data, error);
}

/**
 * Method to retrieve all records  from the Test table. Note that this method returns up to 1,000 records.
 */
export async function getAllTest(){
    try{
        const {data, error} = await supabase.rpc('get_all_test_records')
        
        if (error){
            console.error(`Supabase Error:`, error.message);
            return;
        }

        return data;
        
    } catch (error) {
        console.error("General error", error)
    }
}

/**
 * Method to retrieve the first record from the Test table based on its ID.
 */
export async function getFirst(){
    const {data, error} = await supabase
        .from(`test`)
        .select(`*`)
        .order(`id`, {ascending : true})
        .limit(1);

    console.log(data, error);
}

/**
 * Method to retrieve the last record from the Test table based on its ID.
 */
export async function getLast(){
    const {data, error} = await supabase
        .from(`test`)
        .select(`*`)
        .order(`id`, {ascending : false})
        .limit(1);

    console.log(data, error);
}

/**
 * Gets the total number of records in the test table
 */
export async function getTestCount(){
    try{
        const {data : test_count, error} = await supabase
            .rpc('get_all_test_count')

        if (error){
            console.error(`Supabase Error`, error.message);
            return;
        }

        console.log(test_count);
        return test_count;

    } catch (error) {
        console.error('General Error:', error)
    }
}

/**
 * Method to update the Title of a record from the Test table based on its ID.
 * @param idParam       Primary key of the Test table, serves as the identifier for which record will be updated.
 * @param titleParam    The new description of the record that will be updated.
 */
export async function updateTitleByID(idParam, titleParam){
    try{
        const {data, error} = await supabase
            .from(`test`)
            .update({title : titleParam})
            .eq(`id`, idParam);

        if (error)
            console.error(`Supabase Error`, error);

        console.log(data, error);

    } catch (error) {
        console.error('General Error:', error)
    }
}

/**
 * Method to update the is_completed status of a record from the Test table based on its ID.
 * @param idParam       Primary key of the Test table, serves as the identifier for which record will be updated.
 * @param is_completedParam    The status of a task (boolean).
 */
export async function updateTestIs_CompletedByID(idParam, is_completedParam){
    try{
        
        // TODO: Try implementing type checking and a method to efficiently check them.
        // if (!isValidType(idParam, `string`))
        //     throw new Error(`Type Error: idParam must be a STRING`);
        
        // if (!isValidType(is_completedParam, 'bool'))
        //     throw new Error(`Type Error: is_completedParam must be a BOOLEAN`);

        const {data, error} = await supabase
            .from(`test`)
            .update({is_completed : is_completedParam})
            .eq(`id`, idParam);

        if (error)
            console.error(`Supabase Error`, error);

        console.log(data, error);

    } catch (error) {
        console.error('General Error:', error)
    }
}

/**
 * Method to delete a record from the Test table based on its ID.
 * @param idParam       Primary key of the Test table, serves as the identifier for which record will be deleted.
 */
export async function deleteTextByID(idParam){
    try{
        const {data, error} = await supabase
            .from(`test`)
            .delete()
            .eq(`id`, idParam);

        if (error)
            console.error(`Supabase Error`, error);

        console.log(data, error);

    } catch (error) {
        console.error('General Error:', error)
    }
}


function isValidType(variable, correctType){
    if (typeof correctType !== `string`){
        throw new Error(`Type Error: The correctType param must be a "STRING" in isValidType()"`);
    }

    return (typeof variable === correctType)? true : false;
}

// ======================================================================================================================================
// Methods for Item Master List

export async function getAllItems(){
    try{
        const {data, error} = await supabase.rpc('get_all_item_master_list_records')
        
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

export async function getItemMasterListByItemID(item_id = 0){
    try{
        if (typeof item_id !== "number"){
            console.error("PARAMETER ERROR: getItemMasterListByID's item_id parameter must be a positive integer from 1 onwards.")
            return;
        }
        
        const {data, error} = await supabase.rpc('get_item_master_list_record_by_item_id', {
            input_item_id : item_id
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

// ======================================================================================================================================
// Methods for Restocks

export async function getAllRestocksRecords(){
    try{
        const {data, error} = await supabase.rpc('get_all_restocks_records');
        
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

        const {data, error} = await supabase.rpc('get_restocks_record_by_restock_id', {
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
