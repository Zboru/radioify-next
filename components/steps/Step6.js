import Card from "../general/Card";
import Btn from "../general/Btn";
import Link from "next/link";
import {HomeIcon} from "../icons/HomeIcon";

export default function Step6({active}) {
    return (
        <Card active={active}>
            <p>Gratulacje! Dodano utwory z radia do Twojej playlisty! <br/> Przejdź do platformy Spotify i ciesz się
                muzyką wolną od reklam radiowych.</p>
            <Link href="/">
                <a>
                    <Btn className="mt-2 flex">
                        <HomeIcon className="mr-2 text-xl"/>
                        <span>Powrót do strony głównej</span>
                    </Btn>
                </a>
            </Link>
        </Card>
    )
}
