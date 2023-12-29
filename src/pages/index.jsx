import Post from '@components/post'
import Head from 'next/head'

const intervals = [
    {
        id: '1m',
        name: 'Every Minute',
        cron: '* * * * *',
    },
    {
        id: '10m',
        name: 'Every 10 mins',
        cron: '*/10 * * * *',
    },
    {
        id: '1h',
        name: 'Every Hour',
        cron: '0 * * * *',
    },
    {
        id: '12h',
        name: 'Every 12 hours',
        cron: '0 */12 * * *',
    },
    {
        id: '1d',
        name: 'Every Day',
        cron: '0 0 * * *',
    },
    {
        id: '1w',
        name: 'Every Week',
        cron: '0 0 * * 0',
    },
    {
        id: '1mo',
        name: 'Every Month',
        cron: '0 0 1 * *',
    },
]

const Home = ({ data }) => {
    
    return (
        
        <div className="Page">
            
            <Head>
                <title>TODO</title>
            </Head>
            
            <section className="flex flex-col gap-6">
                <p variant="h1">Vercel Cron Jobs Example</p>
                <p>
                    This example shows you how you can use{' '}
                    <a
                        href="https://vercel.com/docs/cron-jobs"
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        Vercel Cron Jobs
                    </a>{' '}
                    to update data at different intervals.
                </p>
                <p>
                    Each of the following sections are the{' '}
                    <a
                        href="https://github.com/HackerNews/API#new-top-and-best-stories"
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        newest stories on Hacker News
                    </a>{' '}
                    retrieved at different intervals using{' '}
                    <a
                        href="https://vercel.com/docs/cron-jobs"
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        Vercel Cron Jobs
                    </a>{' '}
                    and stored in{' '}
                    <a
                        href="https://vercel.com/kv"
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        Vercel KV
                    </a>
                    .
                </p>
            </section>
            
            <section className="grid gap-6 mt-10 pt-10 border-t border-gray-300">
                <div className="flex flex-col gap-12">
                    {intervals.map((interval) => (
                        <div key={interval.id} className="flex flex-col gap-6">
                            <div className="flex justify-between items-center">
                                <p variant="h2">{interval.name}</p>
                                <code>{interval.cron}</code>
                            </div>
                            <Post interval={interval.id}/>
                        </div>
                    ))}
                </div>
            </section>
            
        </div>
        
    )
    
}

export default Home
