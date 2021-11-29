import clsx from "clsx";

export default function Card({children, active, className}) {
    return (
        <div
            className={clsx(
                className,
                'shadow p-4 bg-white w-full dark:bg-gray-800 rounded',
                active ? 'visible' : 'hidden',
            )}
        >{children}</div>
    )
}
