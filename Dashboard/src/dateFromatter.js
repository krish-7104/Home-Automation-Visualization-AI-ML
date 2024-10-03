export const formateDate = (tempDate, type = "half") => {
    const date = new Date(tempDate);
    date.setHours(date.getHours() - 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    if (type === "half")
        return `${hours}:${minutes}:${seconds}`;
    else return `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
}