import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

export const config = {
    runtime: 'edge',
}

/**
 * @param {NextRequest} req
 * @return {Promise<NextResponse<Body>|Response>}
 */
export default async function handler(req) {
    
    const cron = req.nextUrl.pathname.split('/')[3]
    
    console.log('cron', cron)
    
    if (!cron) return new Response('No cron provided', { status: 400 })
    
    const response = await update(cron)
    
    console.log('response', response)
    
    return new NextResponse(JSON.stringify(response), {
        status: 200,
    })
    
}

/**
 *
 * @param {string} interval
 * @return {Promise<'OK'|{fetchedAt: number, id: *}>}
 */
async function update(interval) {
    
    const topstories = await fetch(
        'https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty'
    ).then((res) => res.json())
    
    console.log('topstories', topstories)
    
    return await kv.set(interval, {
        fetchedAt: Date.now(),
        id: topstories[0],
    })
    
}
