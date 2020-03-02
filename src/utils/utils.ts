export const isAuthenticated = (cookies: any) => {
    let cookeieToken = cookies.get("token");
    return (cookeieToken === "undefined" || cookeieToken === undefined) ? false : true;
}