// TODO: Complete this.
import * as handler from './DBHandlers/practiceHandler.js';

// File Caching

initialize();

async function initialize(){
    await handler.prepareUser();
    let data = await handler.getAllTest();

    console.log(data);
}