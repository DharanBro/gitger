import axios from 'axios';
class Github {
    static authenticate(code: string, cookies: any, callback: (token: string) => void) {
        axios.get(`https://gitger-gatekeeper.herokuapp.com/authenticate/${code}`)
            .then((response) => {
                callback(response.data.token);
            })
            .catch((error) => {
                callback(error);
            });
    }

}

export default Github;