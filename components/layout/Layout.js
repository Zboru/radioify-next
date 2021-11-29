import Head from "next/head";
import Link from "next/link";
import GithubLink from "./GithubLink";

export default function Layout({children}) {
    return (
        <>
            <Head>
                <title>Radioify</title>
            </Head>
            <div className='h-screen'>
                <div className='container h-full flex flex-col'>
                    <div
                        className='flex items-center px-5 justify-between md:px-0 pt-2 dark:text-white border-b border-gray-700 pb-2'>
                        <Link href="/">Radioify dla Spotify</Link>
                        <div className="flex">
                            <GithubLink/>
                        </div>
                    </div>
                    <div className='flex-grow sm:flex-grow-0'>{children}</div>
                </div>
            </div>
        </>
    )
}
