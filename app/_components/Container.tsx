import CesiumWrapper from "@/app/_components/CesiumWrapper"

async function getPosition() {
    return {
        position: {
            lat: 23.0207,
            lng: 113.7518
        }
    }
}

export default async function MainPage() {
    const fetchedPosition = await getPosition();
    return (
        <CesiumWrapper positions={[fetchedPosition.position]}/>
    )
}