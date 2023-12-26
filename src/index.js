import fs from 'fs'
import axios from 'axios'
import puppeteer from 'puppeteer'
import * as puppeteerTypes from 'puppeteer/lib/types.d.ts'
import * as lib from './lib'

const config = lib.readConfig()

(async () => {
    
    /**
     * @type {puppeteerTypes.Browser}
     */
    const browser = await puppeteer.launch()
    
    /**
     * @type {puppeteerTypes.Page}
     */
    const page = await browser.newPage()
    
    await lib.login(page)
    
    let retryCount = 0
    while (retryCount <= 6) {
        try {
            const dates = await lib.getAvailableDates(page)
            if (!dates || dates.length === 0) {
                console.log('List is empty')
                break
            }
            const date = dates[0].date  // Modify as needed
            const time = dates[0].available_times[0]  // Modify as needed
            const isSuccess = await lib.reschedule(page, date, time)
            if (isSuccess) {
                console.log(`Successfully rescheduled for ${date} ${time}`)
                break
            }
            retryCount++
            await page.waitForTimeout(600000) // 10 minutes
        } catch (error) {
            retryCount++
            await page.waitForTimeout(1800000) // 30 minutes
        }
    }
    
    await browser.close()
})()
