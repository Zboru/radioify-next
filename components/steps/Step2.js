import clsx from "clsx";
import Btn from "../general/Btn";
import 'react-day-picker/lib/style.css';
import DayPickerInput from "react-day-picker/DayPickerInput";
import {MONTHS, WEEKDAYS_SHORT} from "../../utils/day-picker";
import formatDate from 'date-fns/format'
import subDays from 'date-fns/subDays'
import HourSlider from "../general/HourSlider";

export default function Step2({active, onBackward, onForward, startDate, endDate, startHour, endHour, onStartDateChange, onEndDateChange, onHourChange}) {
    return (
        <div
            className={clsx(active ? 'visible' : 'hidden', 'font-regular shadow p-4 bg-white dark:bg-gray-800 rounded')}>
            <p>Ustal przedział czasowy, z którego aplikacja ma wyszukać piosenki. Godziny określają porę dnia, w której
                pobierane są piosenki, czyli aplikacja wyszuka piosenki z każdego
                dnia przedziału pomiędzy tymi godzinami.
            </p>
            <div className="mt-1 w-fit-content">
                <label className="flex flex-col select-none text-gray-600 dark:text-gray-200" htmlFor="startDate">
                    <span className="text-sm">Data początkowa</span>
                    <DayPickerInput
                        onDayChange={onStartDateChange}
                        dayPickerProps={{weekdaysShort: WEEKDAYS_SHORT, months: MONTHS}}
                        value={startDate}
                        formatDate={formatDate}
                        format="dd.MM.yyyy"
                        inputProps={{readOnly: true, id: 'startDate', className: 'border h-10 p-2 rounded'}}
                        placeholder={formatDate(subDays(new Date(), 7), 'dd.MM.yyyy')}
                    />
                </label>

            </div>
            <div className="mt-2 w-fit-content">
                <label className="flex flex-col select-none text-gray-600 dark:text-gray-200" htmlFor="endDate">
                    <span className="text-sm">Data końcowa</span>
                    <DayPickerInput
                        onDayChange={onEndDateChange}
                        dayPickerProps={{weekdaysShort: WEEKDAYS_SHORT, months: MONTHS}}
                        value={endDate}
                        formatDate={formatDate}
                        format="dd.MM.yyyy"
                        inputProps={{readOnly: true, id: 'endDate', className: 'border p-2 h-10 rounded leading-normal'}}
                        placeholder={formatDate(new Date(), 'dd.MM.yyyy')}
                    />
                </label>
            </div>
            <div className="mt-2 w-48">
                <label className="flex flex-col select-none text-gray-600 dark:text-gray-200">
                    <span className="text-sm mb-8">Przedział czasowy dnia</span>
                    <HourSlider onChangeHandler={onHourChange} startHour={startHour} endHour={endHour}/>
                </label>
            </div>
            <div className="flex">
                <div className="flex-grow"/>
                <Btn className="mr-2" onClick={onBackward}>Wstecz</Btn>
                <Btn onClick={onForward}>Dalej</Btn>
            </div>
        </div>
    )
}
