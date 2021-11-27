import clsx from "clsx";

export default function Btn({className, disabled, onClick, icon, children}) {
    const buttonClasses = ['rounded-md border transition bg-white dark:text-gray-200 text-sm font-medium flex px-4 py-2 text-gray-900 hover:bg-gray-100 hover:text-green-700 focus:z-10 focus:ring-2 focus:ring-green-600 focus:text-green-700']
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            className={clsx(
                buttonClasses,
                disabled && "cursor-not-allowed dark:text-gray-400 bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-800 text-gray-400 hover:text-gray-400",
                !disabled && "dark:bg-white dark:text-gray-800 dark:hover:text-green-700 dark:hover:border-gray-400",
                className
            )}>
            {icon}
            {children}
        </button>
    )
}