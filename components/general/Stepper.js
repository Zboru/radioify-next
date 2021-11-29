import clsx from "clsx";

export default function Stepper({children, className}) {
    return (
        <div className={clsx(className, `grid grid-cols-3 sm:grid-cols-5 gap-4`)}>
            {children}
        </div>
    )
}
