import {useState} from "react";
import Step1 from "../components/steps/Step1";
import Step2 from "../components/steps/Step2";
import subDays from "date-fns/subDays";
import Step3 from "../components/steps/Step3";

export default function App() {
    const [selectedRadio, selectRadio] = useState(null);
    const [currentStep, setStep] = useState(0);
    const [songs, setSongs] = useState([]);
    const [timeRange, setTimeRange] = useState({
        startDate: subDays(new Date(), 7),
        startHour: 7,
        endDate: new Date(),
        endHour: 15,
    });

    function moveForward() {
        if (currentStep < 5) {
            setStep(currentStep + 1);
        }
    }

    function moveBackward() {
        if (currentStep > 0) {
            setStep(currentStep - 1);
        }
    }

    function setStartDate(...args) {
        setTimeRange({...timeRange, startDate: args[0]})
    }

    function setEndDate(...args) {
        setTimeRange({...timeRange, endDate: args[0]})
    }

    function setHours(hours) {
        setTimeRange({...timeRange, startHour: hours[0], endHour: hours[1]})
    }

    return (
        <>
            <Step1 selectedRadio={selectedRadio}
                   selectRadio={selectRadio}
                   onForward={moveForward}
                   active={currentStep === 0}
            />
            <Step2 onForward={moveForward}
                   onBackward={moveBackward}
                   active={currentStep === 1}
                   startDate={timeRange.startDate}
                   endDate={timeRange.endDate}
                   startHour={timeRange.startHour}
                   endHour={timeRange.endHour}
                   onHourChange={setHours}
                   onStartDateChange={setStartDate}
                   onEndDateChange={setEndDate}
            />
            <Step3
                active={currentStep === 2}
                onForward={moveForward}
                onBackward={moveBackward}
                timeRange={timeRange}
                songs={songs}
                setSongs={setSongs}
            />
        </>
    )
}
