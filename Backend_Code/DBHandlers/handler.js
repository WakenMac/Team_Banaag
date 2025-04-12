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

main();

/** 
 * This method serves as our main method. <br>
 * All other functions within this class will then be called only if its call stack roots from main()
*/
async function main(){
    // addTest(`Help Dave in finding a dataset`, false)
    // await updateTextByID(2, `Learn CRUD in Supabase via JS`);
    // await deleteTextByID(5);
    // await getTestByID(100); // Returns null, no record exists with an ID of 100.
    // await updateTestIs_CompletedByID(12, true)
    // await updateTitleByID(7, `Get a life.`);
    // await getTestByID(7);
    // await getFirst();
    // await getLast();
    await getAllTest();
    // await getTestCount();
}

/**
 * Adds a record to the Test table
 * @param titleParam            Contains the description of the task in the to-do list (text / String)
 * @param is_completedParam     Indicates if the task is completed or not (boolean)
 */
async function addTest(titleParam, is_completedParam){
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
async function getTestByID(idParam){
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
async function getTestByTitle(titleParam){
    const {data, error} = await supabase
        .from(`test`)
        .select(`*`)
        .eq(`title`, titleParam);

    console.log(data, error);
}

/**
 * Method to retrieve all records  from the Test table. Note that this method returns up to 1,000 records.
 */
async function getAllTest(){
    const {data, error} = await supabase
        .from(`test`)
        .select(`*`)
        .order(`id`, {ascending : true})
    
    console.log(data, error);
}

/**
 * Method to retrieve the first record from the Test table based on its ID.
 */
async function getFirst(){
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
async function getLast(){
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
async function getTestCount(){
    try{
        const {count, error} = await supabase
            .from(`test`)
            .select(`*`, {count : 'exact', head : true});

        if (error){
            console.error(`Supabase Error`, error.message);
            return;
        }

        const summary = [{total_count : count}];
        console.table(summary);
        return summary;

    } catch (error) {
        console.error('General Error:', error)
    }
}

/**
 * Method to update the Title of a record from the Test table based on its ID.
 * @param idParam       Primary key of the Test table, serves as the identifier for which record will be updated.
 * @param titleParam    The new description of the record that will be updated.
 */
async function updateTitleByID(idParam, titleParam){
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
async function updateTestIs_CompletedByID(idParam, is_completedParam){
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
async function deleteTextByID(idParam){
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