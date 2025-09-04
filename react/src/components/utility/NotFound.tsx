
export default function NotFound() {
    throw new Response("Not Found", { status: 404 }) // immediately trigger error element
    return (<></>)
}
