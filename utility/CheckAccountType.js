import { FaDesktop, FaXbox, FaPlaystation, FaGamepad } from "react-icons/fa";

export const checkAccountType = (platforms) => {
    if (!Array.isArray(platforms)) {
        throw new Error("Expected an array of platforms");
    }

    const platformCount = {
        pc: 0,
        xbox: 0,
        playstation: 0,
        other: 0,
    };

    // Count each platform category
    platforms.forEach((platform) => {
        switch (platform.toLowerCase()) {
            case "pc":
                platformCount.pc++;
                break;
            case "xbox one":
            case "xbox series s/x":
            case "xbox":
                platformCount.xbox++;
                break;
            case "playstation 5":
            case "ps4":
            case "ps5":
            case "playstation":
                platformCount.playstation++;
                break;
            default:
                platformCount.other++;
                break;
        }
    });

    // Adjust counts to a maximum of 1 for each category
    const keys = Object.keys(platformCount);
    let maxCount = Math.max(...Object.values(platformCount));

    while (maxCount > 1) {
        keys.forEach((key) => {
            if (platformCount[key] > 1) {
                platformCount[key] = 1; // Reduce to 1
            }
        });
        maxCount = Math.max(...Object.values(platformCount)); // Recalculate the max
    }

    // Prepare the icons to display based on detected platforms
    const icons = [];
    if (platformCount.pc > 0) icons.push(<FaDesktop key="pc" style={{ marginRight: "5px" }} />);
    if (platformCount.xbox > 0) icons.push(<FaXbox key="xbox" style={{ marginRight: "5px" }} />);
    if (platformCount.playstation > 0) icons.push(<FaPlaystation key="playstation" style={{ marginRight: "5px" }} />);
    if (icons.length === 0) icons.push(<FaGamepad key="other" style={{ marginRight: "5px" }} />);

    return <>{icons}</>;
};
