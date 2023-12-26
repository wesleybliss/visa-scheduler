import './typedefs'
import * as puppeteerTypes from 'puppeteer/lib/types.d.ts'
import axios from 'axios'

const baseUrl = 'https://ais.usvisa-info.com'

/**
 *
 * @returns {Config}
 */
export const readConfig = () => ({
    baseUrl,
    username: env('USERNAME'),
    password: env('PASSWORD'),
    countryCode: env('COUNTRY_CODE'),
    facilityId: env('FACILITY_ID'),
    dateUrl: `${baseUrl}/${config.countryCode}/niv/schedule/` +
        `${config.facilityId}/appointment/days.json?appointments[expedite]=false`,
    appointmentUrl: `${baseUrl}/${config.countryCode}/niv/schedule/` +
        `${config.facilityId}/appointment`,
})

const config = readConfig()

export const envString = (key, {
    required = true,
    defaultValue = undefined,
} = {}) => {
    
    if (!Object.hasOwn(process.env, key)) {
        
        if (required)
            throw new Error(`Missing required env var "${key}"`)
        
        return defaultValue
        
    }
    
    return process.env[key].toString()
    
}

export const env = (key, {
    type = String,
    ...props
} = {}) => {
    
    switch (type) {
        case String: return envString(key, props)
        case Number: return parseInt(envString(key, props), 10)
        case Boolean: return envString(key, props) === 'true'
        default: throw new Error(`Unknown env type "${type}"`)
    }
    
}

/**
 * Logs into the scheduling website using provided credentials
 *
 * @param {puppeteerTypes.Page} page
 * @param {String} countryCode
 * @param {String} username
 * @param {String} password
 * @returns {Promise<void>}
 */
export const login = async (page, countryCode, username, password) => {
    
    await page.goto(`https://ais.usvisa-info.com/${countryCode}/niv`)
    await page.click('a.down-arrow.bounce')
    await page.waitForTimeout(500)
    await page.click('a.down-arrow.bounce')
    await page.waitForTimeout(500)
    await page.type('#user_email', username)
    await page.type('#user_password', password)
    await page.click('.icheckbox')
    await page.click('input[name="commit"]')
    await page.waitForXPath('//a[contains(text(),"Continuar")]')
    
}

/**
 * 
 * @param {puppeteerTypes.Page} page
 * @param {string} dateUrl
 * @returns {Promise<Object>}
 */
export const getAvailableDates = async page => {
    
    await page.goto(config.dateUrl)
    
    const content = await page.content()
    
    return JSON.parse(content)
    
}

/**
 * 
 * @todo reported not working in the python version this was adapted from
 * @todo needs testing
 * 
 * @param {puppeteerTypes.Page} page
 * @param date
 * @param time
 * @returns {Promise<*>}
 */
export const reschedule = async (page, date, time) => {
    
    const data = {
        "utf8": await page.$eval('input[name="utf8"]', el => el.value),
        "authenticity_token": await page.$eval('input[name="authenticity_token"]', el => el.value),
        "appointments[consulate_appointment][facility_id]": config.facilityId,
        "appointments[consulate_appointment][date]": date,
        "appointments[consulate_appointment][time]": time
    }
    const headers = {
        "User-Agent": await page.evaluate(() => navigator.userAgent),
        "Referer": APPOINTMENT_URL,
        "Cookie": (await page.cookies()).map(c => `${c.name}=${c.value}`).join(' ')
    }
    const response = await axios.post(APPOINTMENT_URL, data, { headers })
    return response.data.includes('Successfully Scheduled')
}
