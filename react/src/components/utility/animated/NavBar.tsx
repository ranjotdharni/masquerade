import { ICON_LOGO } from "../../../lib/constants"

export default function NavBar() {

    return (
        <>
            <button style={{transition: "box-shadow 0.25s linear"}} className="absolute mt-[1vh] ml-[1vh] h-[5vh] w-[5vh] md:w-auto md:h-[5vh] aspect-square rounded bg-primary p-2 hover:cursor-pointer hover:shadow-md">
                <img src={ICON_LOGO} className="w-full h-full" />
            </button>
        </>
    )
}
