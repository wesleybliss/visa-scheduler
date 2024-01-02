
export const getBaseUrl = req => {
    
    // @todo figure out how to get the correct protocol
    const index = req.rawHeaders.indexOf('Host') + 1
    const proto = 'http'
    const host = req.rawHeaders[index]
    
    return `${proto}://${host}`
    
}
