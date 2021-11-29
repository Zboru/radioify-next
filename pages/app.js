import {useState} from "react";
import Step1 from "../components/steps/Step1";
import Step2 from "../components/steps/Step2";
import subDays from "date-fns/subDays";
import Step3 from "../components/steps/Step3";
import Step4 from "../components/steps/Step4";
import Stepper from "../components/general/Stepper";
import StepperStep from "../components/general/StepperStep";
import Step5 from "../components/steps/Step5";
import Step6 from "../components/steps/Step6";

export default function App() {
    const [selectedRadio, selectRadio] = useState(null);
    const [currentStep, setStep] = useState(0);
    const [songs, setSongs] = useState([]);
    const [spotifySongs, setSpotifySongs] = useState(null);
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

    function StepMobileVisible(index) {
        return Math.abs(currentStep - index) < 2 || index === 2;
    }

    return (
        <div className="flex flex-col h-full">
            <Stepper className={'my-4 px-4 sm:p-0'}>
                <StepperStep title={"Krok 1"} mobileVisible={StepMobileVisible(0)} active={currentStep === 0}
                      description={"Wybierz radio"}/>
                <StepperStep title={"Krok 2"} mobileVisible={StepMobileVisible(1)} active={currentStep === 1}
                      description={"Określ czas"}/>
                <StepperStep title={"Krok 3"} mobileVisible={StepMobileVisible(2)} active={currentStep === 2}
                      description={"Pobierz piosenki"}/>
                <StepperStep title={"Krok 4"} mobileVisible={StepMobileVisible(3)} active={currentStep === 3}
                      description={"Znajdź w Spotify"}/>
                <StepperStep title={"Krok 5"} mobileVisible={StepMobileVisible(4)} active={currentStep === 4}
                      description={"Stwórz playlistę"}/>
            </Stepper>
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
                radio={selectedRadio}
            />
            <Step4
                active={currentStep === 3}
                onForward={moveForward}
                onBackward={moveBackward}
                radioSongs={songs}
                spotifySongs={spotifySongs}
                setSpotifySongs={setSpotifySongs}
                setRadioSongs={setSongs}
            />
            <Step5
                active={currentStep === 4}
                onForward={moveForward}
                onBackward={moveBackward}
                spotifySongs={spotifySongs}
                songList={songs}
            />
            <Step6
                active={currentStep === 5}
            />
        </div>
    )
}
