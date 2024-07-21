export const getToken = () => {
    const localItems = localStorage.getItem("user-accessToken")

    return JSON.parse(localItems) ?? {};
}