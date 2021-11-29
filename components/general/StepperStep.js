import clsx from "clsx";

export default function StepperStep({active, mobileVisible, title, description}) {
    const stepClasses = [
        "border-t-4 pt-4 sm:transition",
        {'border-green-600': active},
        {'border-gray-300': !active},
        {'visible': mobileVisible},
        {'hidden sm:block': !mobileVisible},
    ];
    const titleClasses = [
        "uppercase font-medium",
        {'text-green-600': active},
        {'text-gray-400': !active},
    ]
    return (
        <div className={clsx(stepClasses)}>
            <p className={clsx(titleClasses)}>{title}</p>
            <p className="font-medium">{description}</p>
        </div>
    )
}

