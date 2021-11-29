import Card from "../general/Card";
import Select from "react-select";
import {useSessionStorage} from "../../hooks/useSessionStorage";
import {useEffect} from "react";
import Btn from "../general/Btn";

export default function Step1({onForward, active, selectRadio, selectedRadio}) {
    const [radioList, setRadiolist] = useSessionStorage('radioList', [])

    useEffect(() => {
        if (!radioList?.length) {
            fetch('/api/odslynx/radiolist').then(response => response.json()).then(response => {
                const radioMap = response.data.map(station => {
                    return {label: station.name, value: station.id}
                })
                setRadiolist(radioMap);
            })
        }
    })

    return (
        <Card active={active}>
            <p>Skorzystaj z wyszukiwarki, aby wybrać radio, z którego mają być pobrane piosenki. Lista stacji radiowych
                jest dostarczana przez
                serwis&nbsp;<a className="underline" href="https://odsluchane.eu" rel="noreferrer"
                               target="_blank">odSluchane.eu</a></p>
            <label htmlFor="radioSelect">
                <span className="text-sm select-none text-gray-600 dark:text-gray-200">Wyszukaj radio</span>
                <Select options={radioList} onChange={selectRadio} inputId='radioSelect' instanceId='radioSelect' placeholder={"Eska"}/>
            </label>
            <div className="flex">
                <div className="flex-grow"/>
                <Btn disabled={!selectedRadio} className="mt-2" onClick={onForward}>Dalej</Btn>
            </div>
        </Card>
    )
}
