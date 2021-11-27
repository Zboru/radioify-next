async function getRadiostationList() {
    const RADIOLIST_URL = "https://ods.lynx.re/radiolst.php";
    const response = await fetch(RADIOLIST_URL)
        .then(response => response.json())
    return response.summary.flatMap(group => group.stations);
}

export default async function handler(req, res) {
    const radiolist = await getRadiostationList(req.query.token);
    res.status(200).json({data: radiolist})
}