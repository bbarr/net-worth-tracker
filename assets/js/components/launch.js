
import { html, hooks } from '../deps.js'
import { id, prevDef } from '../util.js'
import { goTo } from '../router.js'

import { getDataFromFileSystem, createFile } from '../db.js'

export default ({ state, actions }) => {

  const onCreate = async e => {
    e.preventDefault()
    await createFile()
    goTo('/dashboard')
  }

  const onOpen = async e => {
    e.preventDefault()
    await getDataFromFileSystem()
    goTo('/dashboard')
  };
  
  return html`
    <div class="">
      <div class="pt-20 max-w-xl mx-auto dark:text-white text-center">
        <div class="text-4xl text-center font-semibold">Net Worth Tracker</div>
        <div class="mt-10 md:hidden dark:text-white prose">
          <p>Mobile browsers not yet supported. Please check it out on Desktop!</p>
        </div>
        <div class="mt-10 hidden md:block">
          <div class="text-xl text-center prose dark:text-white">
            <p>This is a <span class="font-semibold">100% free</span> and <span class="font-semibold">private</span> web app.</p>
            <p class="mt-10">
              <img src="/ss.png" class="mt-6 w-full h-auto shadow border border-gray-400" />
            </p>
            <p>Although you may be loading this site from a public domain, no data is ever transmitted off of your computer. Instead, Net Worth Tracker uses a relatively new browser API for reading and writing to a local file on your computer.</p>
            <p>Just add your assets and liabilities and then check back next month or maybe next quarter and update any values that are "out of date". Over time, your net worth calculation will stabalize and give you a sense of whether you are on the right financial path.</p>
            <p>It is also a helpful reminder to occasionally log in to your various accounts to make sure you are on top of them.</p>
            <p class="text-base upercase">(Browser support: Chrome, Edge, and Opera)</p>
          </div>
          <div class="mt-10 flex justify-center">
            <button onClick=${onOpen} type="file" class="button flex items-center" placeholder="">
              <svg class="mr-2 dark:text-white" width="24px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor"><path d="M6 20L18 20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 16V4M12 4L15.5 7.5M12 4L8.5 7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
              Select your database file
            </button>
          </div>
          <div class="mt-4 flex justify-center">
            <button onClick=${onCreate} type="file" class="button-passive flex items-center" placeholder="">
              <svg class="mr-2 light:text-white" width="24px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor"><path d="M6 12H12M18 12H12M12 12V6M12 12V18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
              Create a new database file
            </button>
          </div>
        </div>
      </div>
    </div>
  `
}
