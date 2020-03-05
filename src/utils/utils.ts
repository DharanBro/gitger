import Github from "../services/Github";

export const isAuthenticated = (service: Github, cookies: any) => {
    let cookeieToken = cookies.get("token");
    if (cookeieToken === "undefined" || cookeieToken === undefined) {
        return false;
    }
    service.initiate(cookeieToken);
    return true;
}