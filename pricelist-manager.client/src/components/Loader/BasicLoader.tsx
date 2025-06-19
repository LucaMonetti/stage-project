type Props = {
    color?: "blue" | "purple" | "yellow" | "green";
}

const colorVariant = {
    blue: "border-blue-500",
    purple: "border-purple-600",
    yellow: "border-yellow-600",
    green: "border-green-500"
}

function BasicLoader({color = "blue"} : Props) {
    return (
        <div className={`w-6 h-6 rounded-full animate-spin
                    border-4 border-solid ${colorVariant[color]} border-t-transparent`}></div>
    );
}

export default BasicLoader;